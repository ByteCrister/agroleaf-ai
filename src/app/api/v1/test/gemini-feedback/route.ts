import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Gemini model configuration
const GEMINI_MODEL = 'gemini-3-flash-preview'; // or 'gemini-1.5-pro'

export async function POST(request: NextRequest) {
    try {
        // 1. Parse the request body (expects prediction data)
        const body = await request.json();
        const { predicted_class, confidence, top3_predictions } = body;

        // Validate required fields
        if (!predicted_class || confidence === undefined) {
            return NextResponse.json(
                { error: 'Missing required fields: predicted_class and confidence' },
                { status: 400 }
            );
        }

        // 2. Get Gemini API key from environment
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error('GEMINI_API_KEY not set');
            return NextResponse.json(
                { error: 'Server configuration error: missing API key' },
                { status: 500 }
            );
        }

        // 3. Initialize Gemini
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

        // 4. Build the prompt
        const confidencePercent = (confidence * 100).toFixed(1);
        let top3Text = '';
        if (top3_predictions && Array.isArray(top3_predictions)) {
            top3Text = top3_predictions
                .map(p => `${p.class} (${(p.confidence * 100).toFixed(1)}%)`)
                .join(', ');
        }

        const prompt = `
You are an expert agricultural AI assistant. A farmer has uploaded a photo of a crop leaf.
The AI model predicts the disease as: ${predicted_class} with ${confidencePercent}% confidence.
${top3Text ? `Other possibilities: ${top3Text}.` : ''}

Please provide a short, practical, and farmer-friendly response that includes:
- A brief description of the disease.
- Recommended organic or chemical treatment.
- Preventive measures to avoid future outbreaks.
- When to consult a local agricultural expert.

Keep the tone helpful, empathetic, and concise (maximum 150 words).
`;

        // 5. Call Gemini
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const feedback = response.text();

        // 6. Return the generated feedback
        return NextResponse.json({
            success: true,
            predicted_class,
            confidence,
            ai_feedback: feedback.trim()
        });

    } catch (error) {
        console.error('Gemini API error:', error);
        return NextResponse.json(
            {
                error: 'Failed to generate feedback',
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}