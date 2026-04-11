'use client';

import { useState } from 'react';

const FASTAPI_URL = 'http://localhost:8000/api/predict'; // adjust if different

export default function UploadPage() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSelectedFile(file);
        setPreview(URL.createObjectURL(file));
        setResult(null);
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile) {
            setError('Please select an image first');
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', selectedFile); // field name must be 'file'

        try {
            const response = await fetch(FASTAPI_URL, {
                method: 'POST',
                body: formData,
                // Do NOT set Content-Type header; browser will set it with boundary
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server error: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            console.log(data);
            setResult(data);
        } catch (err: any) {
            console.error('Upload error:', err);
            setError(err.message || 'Failed to get prediction');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
            <h1>AgroLeafAI – Disease Prediction</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="file"
                    accept="image/jpeg,image/png,image/bmp"
                    onChange={handleFileChange}
                />
                {preview && (
                    <div style={{ margin: '20px 0' }}>
                        <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: 300 }} />
                    </div>
                )}
                <button type="submit" disabled={loading || !selectedFile}>
                    {loading ? 'Analyzing...' : 'Predict Disease'}
                </button>
            </form>

            {error && <p style={{ color: 'red' }}>Error: {error}</p>}

            {result && (
                <div style={{ marginTop: 20, border: '1px solid #ccc', padding: 15, borderRadius: 8 }}>
                    <h2>Prediction Result</h2>
                    <p><strong>Predicted Disease:</strong> {result.prediction.predicted_class}</p>
                    <p><strong>Confidence:</strong> {(result.prediction.confidence * 100).toFixed(2)}%</p>
                    <h3>Top 3 possibilities:</h3>
                    <ul>
                        {result.prediction.top3_predictions.map((p: any, idx: number) => (
                            <li key={idx}>{p.class} – {(p.confidence * 100).toFixed(2)}%</li>
                        ))}
                    </ul>
                    <h3>🌱 AI Advice</h3>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{result.ai_feedback}</p>
                </div>
            )}
        </div>
    );
}