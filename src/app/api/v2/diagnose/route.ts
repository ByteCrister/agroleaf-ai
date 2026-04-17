// app/api/v2/diagnose/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import Groq from "groq-sdk";
import { GoogleGenAI } from "@google/genai";
import { Client } from "@gradio/client";
import { checkRateLimit } from "@/lib/checkRateLimit";
import { getEnv } from "@/lib/env";
const env = getEnv();


// ──────────────────────────────────────────────────────────────────
// Hugging Face Space API Call
// ──────────────────────────────────────────────────────────────────
interface PredictionResponse {
    predicted_class: string;
    confidence: number;
    top3_predictions: Array<{ class: string; confidence: number }>;
}


// ──────────────────────────────────────────────────────────────────
// Hugging Face Space API Call (using @gradio/client)
// ──────────────────────────────────────────────────────────────────
async function callHuggingFaceSpace(file: File) {
    const spaceId = process.env.HF_SPACE_ID;
    if (!spaceId) {
        throw new Error("HF_SPACE_ID environment variable is not set");
    }

    const app = await Client.connect(spaceId, {
        headers: process.env.HF_API_TOKEN
            ? { Authorization: `Bearer ${process.env.HF_API_TOKEN}` }
            : undefined,
    });

    const blob = new Blob([await file.arrayBuffer()], { type: file.type });
    const result = await app.predict("/predict", [blob]);

    const data = result.data as unknown;
    if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Invalid response from prediction API: expected array");
    }

    // The prediction is nested inside a `prediction` property
    const rawResponse = data[0] as { prediction: PredictionResponse };
    const predictionData = rawResponse.prediction;

    // Validate the nested structure
    if (!predictionData.predicted_class || typeof predictionData.confidence !== 'number') {
        throw new Error("Invalid prediction data structure");
    }

    return {
        predictions: predictionData.top3_predictions,
        predicted_class: predictionData.predicted_class,
        confidence: predictionData.confidence,
    };
}

// ──────────────────────────────────────────────────────────────────
// AI Feedback Generation (Groq or Gemini)
// ──────────────────────────────────────────────────────────────────
async function generateAIFeedback(
    predictedClass: string,
    confidence: number,
    top3: Array<{ class: string; confidence: number }>
): Promise<string> {
    const provider = process.env.FEEDBACK_PROVIDER || "groq";

    const prompt = `You are an agricultural expert AI assistant specializing in plant disease diagnosis and treatment.

A crop leaf has been analyzed with the following results:
- Primary diagnosis: ${predictedClass} (confidence: ${(confidence * 100).toFixed(1)}%)
- Top 3 possibilities:
${top3.map((p, i) => `  ${i + 1}. ${p.class} (${(p.confidence * 100).toFixed(1)}%)`).join("\n")}

Please provide a concise, practical response with:
1. A brief description of the identified disease/condition
2. Recommended treatment or management steps
3. Preventive measures for future crops

Keep the response under 200 words and focus on actionable advice for farmers.`;

    if (provider === "gemini") {
        return await generateGeminiFeedback(prompt);
    } else {
        return await generateGroqFeedback(prompt);
    }
}

async function generateGroqFeedback(prompt: string): Promise<string> {

    const groq = new Groq({ apiKey: env.GROQ_API_KEY });

    try {
        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: env.GROQ_MODEL as string,
            temperature: 0.7,
            max_tokens: 300,
        });

        return completion.choices[0]?.message?.content || "Unable to generate feedback.";
    } catch (error) {
        console.error("Groq API error:", error);
        throw new Error("Failed to generate AI feedback with Groq");
    }
}

async function generateGeminiFeedback(prompt: string): Promise<string> {

    const genAI = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

    try {
        const response = await genAI.models.generateContent({
            model: env.GEMINI_MODEL as string,
            contents: prompt,
        });

        return response.text || "Unable to generate feedback.";
    } catch (error) {
        console.error("Gemini API error:", error);
        throw new Error("Failed to generate AI feedback with Gemini");
    }
}

async function generateAIFeedbackWithRetry(
    predictedClass: string,
    confidence: number,
    top3: Array<{ class: string; confidence: number }>,
    maxRetries = 2
): Promise<string> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await generateAIFeedback(predictedClass, confidence, top3);
        } catch (error) {
            if (attempt === maxRetries) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    return "Unable to generate AI advice at the moment.";
}

// ──────────────────────────────────────────────────────────────────
// Main POST Handler
// ──────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
    // 1. Authenticate user
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = token.email;

    // 2. Rate limiting
    const canProceedMinute = await checkRateLimit(userId, "minute");
    const canProceedHour = await checkRateLimit(userId, "hour");

    if (!canProceedMinute) {
        return NextResponse.json(
            { error: "Too many requests. Please wait a minute before trying again." },
            { status: 429 }
        );
    }
    if (!canProceedHour) {
        return NextResponse.json(
            { error: "Hourly limit reached (5 requests). Please try again later." },
            { status: 429 }
        );
    }

    // 3. Parse multipart form data
    let formData: FormData;
    try {
        formData = await req.formData();
    } catch {
        return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }

    const file = formData.get("file") as File | null;
    if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/bmp"];
    if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
            { error: "Invalid file type. Please upload JPG, PNG, or BMP images." },
            { status: 400 }
        );
    }

    // 4. Call Hugging Face Space
    let hfResult;
    try {
        hfResult = await callHuggingFaceSpace(file);
    } catch (error) {
        console.error("HF Space prediction error:", error);
        return NextResponse.json(
            { error: "Failed to get prediction from AI model" },
            { status: 502 }
        );
    }

    // 5. Generate AI feedback
    let aiFeedback: string;
    try {
        aiFeedback = await generateAIFeedbackWithRetry(
            hfResult.predicted_class,
            hfResult.confidence,
            hfResult.predictions.slice(0, 3)
        );
    } catch (error) {
        console.error("Feedback generation error:", error);
        aiFeedback = "Unable to generate AI advice at the moment. Please consult with a local agronomist.";
    }

    // 6. Return response in same format as v1 for frontend compatibility
    return NextResponse.json({
        prediction: {
            predicted_class: hfResult.predicted_class,
            confidence: hfResult.confidence,
            top3_predictions: hfResult.predictions.slice(0, 3).map(p => ({
                class: p.class,
                confidence: p.confidence,
            })),
        },
        ai_feedback: aiFeedback,
    });
}