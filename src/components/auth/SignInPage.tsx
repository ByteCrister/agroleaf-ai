'use client';

import { useState, memo } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import * as yup from 'yup';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Mail,
    Lock,
    Leaf,
    ArrowLeft,
    Eye,
    EyeOff,
    ShieldCheck,
    KeyRound,
    Loader2,
    CheckCircle2,
    Sprout,
} from 'lucide-react';
import { agToast } from '../global/AgroToaster';
import AgroLeafLogo from '../global/AgroLeafLogo';

type Flow = 'signin' | 'forgot-email' | 'forgot-otp' | 'create-or-signin';

// ── Validation schemas (unchanged) ──────────────────────────────────────────────
const emailSchema = yup.string().email('Invalid email address').required('Email is required');
const passwordSchema = yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Must contain at least one number')
    .matches(/[\W_]/, 'Must contain at least one special character')
    .required('Password is required');

const signInSchema = yup.object({
    email: emailSchema,
    password: passwordSchema,
});

const resetPasswordSchema = yup.object({
    email: emailSchema,
    otp: yup.string().length(6, 'OTP must be 6 digits').required('OTP is required'),
    newPassword: passwordSchema,
});

// ── Slide variants ──────────────────────────────────────────────────────────────
const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
};

// ── Reusable sub-components ──────────────────────────────────────────────────────
function GreenButton({
    loading,
    label,
    loadingLabel,
}: {
    loading: boolean;
    label: string;
    loadingLabel: string;
}) {
    return (
        <motion.button
            type="submit"
            disabled={loading}
            whileHover={loading ? {} : { scale: 1.01 }}
            whileTap={loading ? {} : { scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 h-11 rounded-xl bg-[#0A7B4A] hover:bg-[#2C5F2D] text-white text-sm font-semibold shadow-[0_2px_16px_rgba(10,123,74,0.25)] hover:shadow-[0_4px_20px_rgba(10,123,74,0.35)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
            {loading ? (
                <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {loadingLabel}
                </>
            ) : label}
        </motion.button>
    );
}

function BackButton({ onClick }: { onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex items-center gap-1.5 mx-auto text-xs font-medium text-[#0A7B4A] dark:text-[#4ade80] hover:underline underline-offset-2"
        >
            <ArrowLeft className="h-3.5 w-3.5" />
            Go back
        </button>
    );
}

// ── Field wrapper (memoized to avoid unnecessary re-renders) ────────────────────
const Field = memo(({
    id,
    label,
    icon,
    children,
    error,
}: {
    id: string;
    label: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    error?: string;
}) => (
    <div className="space-y-1.5">
        <Label htmlFor={id} className="flex items-center gap-1.5 text-sm font-medium text-[#1A2E1A] dark:text-white/80">
            <span className="text-[#0A7B4A]/70">{icon}</span>
            {label}
        </Label>
        {children}
        {error && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{error}</p>}
    </div>
));
Field.displayName = 'Field';

// ── Input style (constant) ──────────────────────────────────────────────────────
const inputCls =
    'h-11 rounded-xl border border-[rgba(10,123,74,0.25)] bg-[rgba(245,250,240,0.5)] dark:bg-[rgba(10,123,74,0.08)] backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-[#0A7B4A] focus-visible:ring-offset-0 focus-visible:border-[#0A7B4A] placeholder:text-[#3A4D3A]/30 dark:placeholder:text-white/20 text-[#1A2E1A] dark:text-white/90 transition-all';

// ── Left panel decorative trust points (unchanged) ──────────────────────────────
const TRUST_POINTS = [
    { icon: Sprout, text: 'Diagnose 38+ crop diseases instantly' },
    { icon: ShieldCheck, text: '98% model accuracy you can rely on' },
    { icon: Leaf, text: 'Free for farmers & researchers' },
];

// ── Separate memoized form components ───────────────────────────────────────────
interface SignInFormProps {
    email: string;
    setEmail: (v: string) => void;
    password: string;
    setPassword: (v: string) => void;
    showPassword: boolean;
    setShowPassword: (v: boolean) => void;
    loading: boolean;
    fieldErrors: { email?: string; password?: string };
    onSubmit: (e: React.FormEvent) => void;
    onForgotClick: () => void;
    onCreateOrSignIn: () => void;
}

const SignInForm = memo(({
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    loading,
    fieldErrors,
    onSubmit,
    onForgotClick,
    onCreateOrSignIn,
}: SignInFormProps) => (
    <form onSubmit={onSubmit} className="space-y-4 mt-1">
        <Field id="email" label="Email address" icon={<Mail className="h-3.5 w-3.5" />} error={fieldErrors.email}>
            <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className={inputCls}
                autoComplete="email"
            />
        </Field>

        <Field id="password" label="Password" icon={<Lock className="h-3.5 w-3.5" />} error={fieldErrors.password}>
            <div className="relative">
                <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className={`${inputCls} pr-10`}
                    autoComplete="current-password"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3A4D3A]/40 hover:text-[#0A7B4A] transition-colors"
                    tabIndex={-1}
                >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
            </div>
            <div className="text-right -mt-0.5">
                <button type="button" onClick={onForgotClick} className="text-xs text-[#0A7B4A] hover:underline underline-offset-2 font-medium">
                    Forgot password?
                </button>
            </div>
        </Field>

        <GreenButton loading={loading} label="Sign In" loadingLabel="Signing in…" />

        <div className="relative my-1">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[rgba(10,123,74,0.15)]" />
            </div>
            <div className="relative flex justify-center">
                <span className="px-3 text-xs uppercase tracking-wider text-[#3A4D3A]/40 dark:text-white/30 bg-white dark:bg-[#0d1a0e]">
                    or
                </span>
            </div>
        </div>

        <button
            type="button"
            onClick={onCreateOrSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 h-11 rounded-xl border border-[rgba(10,123,74,0.3)] bg-transparent hover:bg-[rgba(10,123,74,0.05)] dark:hover:bg-[rgba(10,123,74,0.12)] text-sm font-medium text-[#0A7B4A] dark:text-[#4ade80] transition-all disabled:opacity-50"
        >
            <Mail className="h-4 w-4" />
            Create or sign in with email
        </button>
    </form>
));
SignInForm.displayName = 'SignInForm';

interface ForgotEmailFormProps {
    email: string;
    setEmail: (v: string) => void;
    loading: boolean;
    fieldErrors: { email?: string };
    onSubmit: (e: React.FormEvent) => void;
    onBack: () => void;
}

const ForgotEmailForm = memo(({ email, setEmail, loading, fieldErrors, onSubmit, onBack }: ForgotEmailFormProps) => (
    <form onSubmit={onSubmit} className="space-y-4 mt-1">
        <Field id="reset-email" label="Email address" icon={<Mail className="h-3.5 w-3.5" />} error={fieldErrors.email}>
            <Input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className={inputCls}
            />
        </Field>
        <GreenButton loading={loading} label="Send Reset Code" loadingLabel="Sending…" />
        <BackButton onClick={onBack} />
    </form>
));
ForgotEmailForm.displayName = 'ForgotEmailForm';

interface ForgotOtpFormProps {
    otp: string;
    setOtp: (v: string) => void;
    newPassword: string;
    setNewPassword: (v: string) => void;
    loading: boolean;
    fieldErrors: { otp?: string; newPassword?: string };
    onSubmit: (e: React.FormEvent) => void;
    onBack: () => void;
}

const ForgotOtpForm = memo(({
    otp,
    setOtp,
    newPassword,
    setNewPassword,
    loading,
    fieldErrors,
    onSubmit,
    onBack,
}: ForgotOtpFormProps) => (
    <form onSubmit={onSubmit} className="space-y-4 mt-1">
        <Field id="otp" label="Verification code" icon={<ShieldCheck className="h-3.5 w-3.5" />} error={fieldErrors.otp}>
            <Input
                id="otp"
                type="text"
                inputMode="numeric"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                placeholder="6-digit code"
                className={`${inputCls} tracking-widest text-center text-lg font-mono`}
                maxLength={6}
            />
        </Field>
        <Field id="new-password" label="New password" icon={<Lock className="h-3.5 w-3.5" />} error={fieldErrors.newPassword}>
            <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Minimum 6 characters, 1 uppercase, 1 number, 1 special"
                className={inputCls}
            />
        </Field>
        <GreenButton loading={loading} label="Reset Password" loadingLabel="Updating…" />
        <BackButton onClick={onBack} />
    </form>
));
ForgotOtpForm.displayName = 'ForgotOtpForm';

// ── Main page component ──────────────────────────────────────────────────────────
export default function SignInPage() {
    const router = useRouter();

    const [flow, setFlow] = useState<Flow>('signin');
    const [dir, setDir] = useState(1);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [fieldErrors, setFieldErrors] = useState<{
        email?: string;
        password?: string;
        otp?: string;
        newPassword?: string;
    }>({});

    const navigate = (next: Flow, direction = 1, preserveSuccess = false) => {
        setDir(direction);
        setError('');
        setFieldErrors({});
        if (!preserveSuccess) setSuccessMsg('');
        setFlow(next);
    };

    // ── Handlers (unchanged) ──────────────────────────────────────────────────────
    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await signInSchema.validate({ email, password }, { abortEarly: false });
        } catch (err) {
            if (err instanceof yup.ValidationError) {
                const errors: typeof fieldErrors = {};
                err.inner.forEach((e) => {
                    if (e.path === 'email') errors.email = e.message;
                    if (e.path === 'password') errors.password = e.message;
                });
                setFieldErrors(errors);
            }
            return;
        }
        setFieldErrors({});
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/auth/create-or-signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            if (!data.valid) throw new Error('Invalid credentials');

            const result = await signIn('credentials', { email, password, redirect: false });
            if (result?.error) throw new Error(result.error);

            router.push('/');
        } catch (err: unknown) {
            let message = 'Something went wrong';
            let title = 'Sign in failed';
            if (err instanceof TypeError && err.message === 'Failed to fetch') {
                title = 'Network error';
                message = 'Please check your internet connection.';
            } else if (err instanceof Error) {
                message = err.message;
            }
            agToast.error(title, message);
        } finally {
            setLoading(false);
        }
    };

    const handleForgotSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await emailSchema.validate(email);
        } catch (err) {
            if (err instanceof yup.ValidationError) {
                setFieldErrors({ email: err.message });
            }
            return;
        }
        setFieldErrors({});
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/auth/forgot-password/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            navigate('forgot-otp', 1);
        } catch (err: unknown) {
            let message = 'Something went wrong';
            if (err instanceof Error) message = err.message;
            agToast.error('Failed to send code', message);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await resetPasswordSchema.validate({ email, otp, newPassword }, { abortEarly: false });
        } catch (err) {
            if (err instanceof yup.ValidationError) {
                const errors: typeof fieldErrors = {};
                err.inner.forEach((e) => {
                    if (e.path === 'email') errors.email = e.message;
                    if (e.path === 'otp') errors.otp = e.message;
                    if (e.path === 'newPassword') errors.newPassword = e.message;
                });
                setFieldErrors(errors);
            }
            return;
        }
        setFieldErrors({});
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp, newPassword }),
            });
            const text = await res.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch {
                throw new Error(`Invalid response: ${text}`);
            }
            if (!res.ok) throw new Error(data.error);
            setSuccessMsg('Password updated! You can now sign in.');
            setTimeout(() => navigate('signin', -1, true), 2000);
        } catch (err: unknown) {
            let message = 'Something went wrong';
            if (err instanceof Error) message = err.message;
            agToast.error('Reset failed', message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateOrSignIn = async () => {
        try {
            await emailSchema.validate(email);
        } catch (err) {
            if (err instanceof yup.ValidationError) {
                setFieldErrors({ email: err.message });
            }
            return;
        }
        setFieldErrors({});
        setLoading(true);
        setError('');
        try {
            const result = await signIn('email-signin', { email, redirect: false });
            if (result?.error) throw new Error(result.error);
            router.push('/');
        } catch (err: unknown) {
            let message = 'Something went wrong';
            if (err instanceof Error) message = err.message;
            agToast.error('Failed to send link', message);
        } finally {
            setLoading(false);
        }
    };

    // ── Flow metadata ─────────────────────────────────────────────────────────────
    const flowMeta: Record<Flow, { title: string; subtitle: string; icon: React.ReactNode }> = {
        signin: {
            title: 'Welcome back',
            subtitle: 'Sign in to your AgroLeaf account',
            icon: <Leaf className="h-5 w-5 text-[#0A7B4A]" />,
        },
        'forgot-email': {
            title: 'Reset password',
            subtitle: "We'll send a verification code to your email",
            icon: <Mail className="h-5 w-5 text-[#0A7B4A]" />,
        },
        'forgot-otp': {
            title: 'Verify & reset',
            subtitle: `Enter the code sent to ${email}`,
            icon: <KeyRound className="h-5 w-5 text-[#0A7B4A]" />,
        },
        'create-or-signin': {
            title: 'Quick access',
            subtitle: 'Sign in or create an account with email',
            icon: <ShieldCheck className="h-5 w-5 text-[#0A7B4A]" />,
        },
    };

    const meta = flowMeta[flow] || flowMeta.signin;

    // ── Render current form based on flow ────────────────────────────────────────
    const renderForm = () => {
        switch (flow) {
            case 'signin':
                return (
                    <SignInForm
                        email={email}
                        setEmail={setEmail}
                        password={password}
                        setPassword={setPassword}
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                        loading={loading}
                        fieldErrors={fieldErrors}
                        onSubmit={handleSignIn}
                        onForgotClick={() => navigate('forgot-email', 1)}
                        onCreateOrSignIn={handleCreateOrSignIn}
                    />
                );
            case 'forgot-email':
                return (
                    <ForgotEmailForm
                        email={email}
                        setEmail={setEmail}
                        loading={loading}
                        fieldErrors={fieldErrors}
                        onSubmit={handleForgotSendOTP}
                        onBack={() => navigate('signin', -1)}
                    />
                );
            case 'forgot-otp':
                return (
                    <ForgotOtpForm
                        otp={otp}
                        setOtp={setOtp}
                        newPassword={newPassword}
                        setNewPassword={setNewPassword}
                        loading={loading}
                        fieldErrors={fieldErrors}
                        onSubmit={handleResetPassword}
                        onBack={() => navigate('forgot-email', -1)}
                    />
                );
            default:
                return null;
        }
    };

    // ── JSX (unchanged except the form rendering uses the new memoized components) ─
    return (
        <div className="min-h-screen flex bg-linear-to-b from-[#f0f7f2] via-[#f8fdf9] to-white dark:from-[#060e07] dark:via-[#0a120b] dark:to-[#0d1a0e]">
            {/* Left panel (unchanged) */}
            <div className="hidden lg:flex lg:w-[52%] xl:w-[55%] relative flex-col overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src="/images/crop-fruits/rice-2.jpeg"
                        alt="Lush crop field"
                        fill
                        sizes="55vw"
                        className="object-cover object-center"
                        priority
                        loading="eager"
                    />
                    <div
                        className="absolute inset-0"
                        style={{
                            background:
                                'linear-gradient(to right, rgba(5,14,6,0.18) 0%, rgba(5,14,6,0.55) 55%, rgba(5,14,6,0.88) 100%)',
                        }}
                    />
                    <div
                        className="absolute inset-x-0 bottom-0"
                        style={{
                            height: '260px',
                            background: 'linear-gradient(to top, rgba(5,14,6,0.75) 0%, transparent 100%)',
                        }}
                    />
                </div>
                <div className="relative z-10 flex flex-col h-full px-12 py-10">
                    <div className="flex-1 flex items-center justify-end">
                        <div className="max-w-md text-right">
                            <motion.h2
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                                className="text-4xl xl:text-5xl font-extrabold text-white leading-[1.1] tracking-tight"
                            >
                                Protect your harvest with{' '}
                                <span className="text-transparent bg-clip-text bg-linear-to-r from-[#10B981] to-[#4ade80]">
                                    AI precision
                                </span>
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                                className="mt-4 text-white/55 text-base leading-relaxed"
                            >
                                Instant crop disease diagnosis from a single photo — so you can act before it spreads.
                            </motion.p>
                            <div className="mt-8 space-y-3">
                                {TRUST_POINTS.map(({ icon: Icon, text }, i) => (
                                    <motion.div
                                        key={text}
                                        initial={{ opacity: 0, x: 16 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
                                        className="flex items-center gap-3 justify-end"
                                    >
                                        <span className="text-sm text-white/70 font-medium">{text}</span>
                                        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-[rgba(10,123,74,0.35)] border border-[rgba(16,185,129,0.3)] shrink-0">
                                            <Icon className="h-4 w-4 text-[#10B981]" />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-sm text-white/45 hover:text-white/75 transition-colors w-fit"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Back to home
                    </Link>
                </div>
            </div>

            {/* Right panel: form */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 sm:px-10">
                <div className="lg:hidden w-full max-w-sm mb-8 flex items-center justify-between">
                    <AgroLeafLogo />
                    <Link
                        href="/"
                        className="flex items-center gap-1.5 text-xs text-[#3A4D3A]/60 dark:text-white/40 hover:text-[#0A7B4A] dark:hover:text-[#4ade80] transition-colors"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Home
                    </Link>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-sm"
                >
                    <div className="h-0.5 w-full rounded-t-2xl bg-linear-to-r from-transparent via-[#0A7B4A] to-transparent opacity-60" />
                    <div
                        className="rounded-b-2xl rounded-tr-2xl p-7 shadow-[0_24px_64px_rgba(10,123,74,0.1)] signin-card"
                        style={{
                            background: 'rgba(255,255,255,0.82)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(10,123,74,0.18)',
                            borderTop: 'none',
                        }}
                    >
                        <style>{`
                            @media (prefers-color-scheme: dark) {
                                .signin-card { background: rgba(13,26,14,0.88) !important; border-color: rgba(10,123,74,0.28) !important; }
                            }
                            .dark .signin-card { background: rgba(13,26,14,0.88) !important; border-color: rgba(10,123,74,0.28) !important; }
                        `}</style>

                        <AnimatePresence mode="wait" custom={dir}>
                            <motion.div
                                key={flow + '-header'}
                                custom={dir}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                                className="mb-6"
                            >
                                <div className="flex items-center gap-3 mb-1">
                                    <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-[rgba(10,123,74,0.1)] dark:bg-[rgba(10,123,74,0.2)] border border-[rgba(10,123,74,0.2)]">
                                        {meta.icon}
                                    </div>
                                    <div>
                                        <h1 className="text-xl font-bold text-[#1A2E1A] dark:text-white leading-tight">
                                            {meta.title}
                                        </h1>
                                        <p className="text-xs text-[#3A4D3A]/60 dark:text-white/40 mt-0.5">
                                            {meta.subtitle}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    key="error"
                                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                                    className="mb-4 flex items-start gap-2.5 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 text-red-600 dark:text-red-400 text-sm"
                                >
                                    <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-red-500/20 flex items-center justify-center text-[10px] font-bold">!</span>
                                    {error}
                                </motion.div>
                            )}
                            {successMsg && (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="mb-4 flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-[rgba(10,123,74,0.3)] text-[#0A7B4A] dark:text-emerald-400 text-sm font-medium"
                                >
                                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                                    {successMsg}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <AnimatePresence mode="wait" custom={dir}>
                            <motion.div
                                key={flow}
                                custom={dir}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                            >
                                {renderForm()}
                            </motion.div>
                        </AnimatePresence>

                        <p className="text-center text-xs text-[#3A4D3A]/40 dark:text-white/25 mt-6">
                            By signing in, you agree to our{' '}
                            <a href="/terms" className="text-[#0A7B4A] hover:underline">Terms</a>{' '}
                            &{' '}
                            <a href="/privacy" className="text-[#0A7B4A] hover:underline">Privacy Policy</a>.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}