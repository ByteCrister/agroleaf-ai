import { redis } from "@/config/redis";

/**
 * Structure of OTP data stored in Redis
 */
type OTPRecord = {
    /** The generated one-time password (string of digits) */
    otp: string;
    /** Optional IP address of the requester for additional security */
    ip?: string;
    /** Number of failed verification attempts */
    attempts: number;
};

/** OTP validity duration in seconds (5 minutes) */
const OTP_EXPIRY = 60 * 5;

/** Maximum failed attempts before OTP is invalidated */
const MAX_ATTEMPTS = 5;

/** Rate limit window in seconds (1 minute) */
const RATE_LIMIT_WINDOW = 60;

/** Maximum OTP sends per email per window */
const MAX_SEND = 3;

/** Maximum OTP verifications per email per window */
const MAX_VERIFY = 5;

/**
 * Custom error class for rate limiting
 * Allows API layer to return 429 status code
 */
export class RateLimitError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "RateLimitError";
    }
}

/**
 * Custom error class for OTP validation failures
 */
export class OTPValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "OTPValidationError";
    }
}

export const OTPService = {
    /**
     * Generates a numeric OTP of specified length
     * @param length - Number of digits (default: 6)
     * @returns String of random digits (e.g., "123456")
     */
    generate(length: number = 6): string {
        const min = 10 ** (length - 1);
        const max = 9 * 10 ** (length - 1);
        return Math.floor(min + Math.random() * max).toString();
    },

    /**
     * Generic rate limiting using Redis atomic increment
     * @param key - Redis key for the rate limit counter
     * @param max - Maximum allowed operations within the window
     * @param window - Time window in seconds
     * @throws {RateLimitError} When limit is exceeded
     */
    async checkRateLimit(key: string, max: number, window: number): Promise<void> {
        const count = await redis.incr(key);

        if (count === 1) {
            // First request: set expiry on the counter
            await redis.expire(key, window);
        }

        if (count > max) {
            throw new RateLimitError("Too many requests. Please try again later.");
        }
    },

    /**
     * Generates and stores an OTP for the given email
     * @param email - Recipient's email address (used as storage key)
     * @param ip - Optional IP address for additional verification
     * @returns The generated OTP (should be sent via email/SMS)
     * @throws {RateLimitError} If send rate limit exceeded
     */
    async send(email: string, ip?: string): Promise<string> {
        // Rate limit: max 3 OTP requests per email per minute
        const rateKey = `otp:send:${email.toLowerCase()}`;
        await this.checkRateLimit(rateKey, MAX_SEND, RATE_LIMIT_WINDOW);

        const otp = this.generate();

        const data: OTPRecord = {
            otp,
            ip,
            attempts: 0,
        };

        // Store OTP with expiration
        await redis.set(`otp:${email.toLowerCase()}`, JSON.stringify(data), {
            ex: OTP_EXPIRY,
        });

        return otp;
    },

    /**
     * Verifies an OTP for the given email
     * @param email - Email address associated with the OTP
     * @param otp - The OTP provided by the user
     * @param ip - Current request IP (if IP checking is enabled)
     * @returns Promise<true> if verification succeeds
     * @throws {RateLimitError} If verify rate limit exceeded
     * @throws {OTPValidationError} For expired, invalid, or exceeded attempts
     */
    async verify(email: string, otp: string, ip?: string): Promise<true> {
        const normalizedEmail = email.toLowerCase();

        // Rate limit: max 5 verification attempts per email per minute
        const rateKey = `otp:verify:${normalizedEmail}`;
        await this.checkRateLimit(rateKey, MAX_VERIFY, RATE_LIMIT_WINDOW);

        const raw = await redis.get(`otp:${normalizedEmail}`);

        if (!raw) {
            throw new OTPValidationError("OTP expired or not found. Please request a new code.");
        }

        let data: OTPRecord;
        if (typeof raw === 'string') {
            data = JSON.parse(raw);
        } else if (typeof raw === 'object' && raw !== null) {
            // Already parsed by Redis client
            data = raw as OTPRecord;
        } else {
            throw new OTPValidationError("Invalid OTP data. Please request a new code.");
        }

        // Increment attempt counter
        data.attempts += 1;

        // Check if max attempts exceeded (security: invalidate OTP)
        if (data.attempts > MAX_ATTEMPTS) {
            await redis.del(`otp:${normalizedEmail}`);
            throw new OTPValidationError(
                `Too many failed attempts. Please request a new OTP.`
            );
        }

        // Update attempt count in Redis (preserve remaining expiry)
        await redis.set(`otp:${normalizedEmail}`, JSON.stringify(data), {
            ex: OTP_EXPIRY,
        });

        // Validate OTP value
        if (data.otp !== otp) {
            throw new OTPValidationError("Invalid OTP. Please try again.");
        }

        // Optional: IP mismatch check (prevents OTP theft across networks)
        if (data.ip && ip && data.ip !== ip) {
            throw new OTPValidationError("IP address mismatch. Please request a new OTP from the same device.");
        }

        // Success: delete used OTP
        await redis.del(`otp:${normalizedEmail}`);

        return true;
    },
};