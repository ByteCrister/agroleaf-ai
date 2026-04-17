export function getEnv() {
    const {
        GROQ_API_KEY,
        GROQ_MODEL,
        GEMINI_API_KEY,
        GEMINI_MODEL,
    } = process.env;

    const missing: string[] = [];

    if (!GROQ_API_KEY?.trim()) missing.push("GROQ_API_KEY");
    if (!GROQ_MODEL?.trim()) missing.push("GROQ_MODEL");
    if (!GEMINI_API_KEY?.trim()) missing.push("GEMINI_API_KEY");
    if (!GEMINI_MODEL?.trim()) missing.push("GEMINI_MODEL");

    if (missing.length > 0) {
        throw new Error(
            `Missing env variables: ${missing.join(", ")}`
        );
    }

    return {
        GROQ_API_KEY,
        GROQ_MODEL,
        GEMINI_API_KEY,
        GEMINI_MODEL,
    };
}