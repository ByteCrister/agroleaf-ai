"use client";

import { motion } from "framer-motion";
import {
    Code,
    Key,
    Database,
    Upload,
    BarChart3,
    Activity,
    Zap,
    Copy,
    Check,
    ExternalLink,
} from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
};

const staggerContainer = {
    animate: { transition: { staggerChildren: 0.1 } },
};

const CodeBlock = ({ code, language }: { code: string; language: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group">
            <div className="absolute right-2 top-2 z-10">
                <button
                    onClick={handleCopy}
                    className="p-2 rounded-md bg-[#1A2E1A]/80 backdrop-blur-sm text-white/70 hover:text-white transition-colors"
                    aria-label="Copy code"
                >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
            </div>
            <pre className={cn(
                "overflow-x-auto rounded-xl p-4 text-sm font-mono",
                "bg-[#0B1E0B]/95 backdrop-blur-sm border border-[rgba(10,123,74,0.3)]",
                "text-gray-200 shadow-lg"
            )}>
                <code className={`language-${language}`}>{code}</code>
            </pre>
        </div>
    );
};

const EndpointCard = ({
    method,
    path,
    description,
    children,
}: {
    method: "POST" | "GET";
    path: string;
    description: string;
    children: React.ReactNode;
}) => {
    return (
        <motion.div variants={fadeInUp}>
            <Card className="bg-[rgba(245,250,240,0.6)] backdrop-blur-md border border-[rgba(10,123,74,0.25)] shadow-xl rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-[rgba(10,123,74,0.15)] pb-4">
                    <div className="flex items-center gap-3 flex-wrap">
                        <Badge
                            className={cn(
                                "px-3 py-1 text-sm font-bold",
                                method === "POST"
                                    ? "bg-[#0A7B4A] text-white hover:bg-[#0A7B4A]/90"
                                    : "bg-[#2C5F2D] text-white hover:bg-[#2C5F2D]/90"
                            )}
                        >
                            {method}
                        </Badge>
                        <code className="text-[#1A2E1A] font-mono text-lg font-semibold bg-white/40 px-3 py-1 rounded-lg">
                            {path}
                        </code>
                        <span className="text-[#3A4D3A] text-sm">{description}</span>
                    </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">{children}</CardContent>
            </Card>
        </motion.div>
    );
};

export function ApiDocsClient() {
    const curlExample = `curl -X POST https://api.agroleaf.ai/v1/predict \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "image=@/path/to/leaf.jpg" \\
  -F "top_k=3"`;

    const pythonExample = `import requests

url = "https://api.agroleaf.ai/v1/predict"
headers = {"Authorization": "Bearer YOUR_API_KEY"}
files = {"image": open("leaf.jpg", "rb")}
params = {"top_k": 3, "include_treatment": True}

response = requests.post(url, headers=headers, files=files, data=params)
print(response.json())`;

    const jsExample = `const formData = new FormData();
formData.append('image', fileInput.files[0]);
formData.append('top_k', 3);

const response = await fetch('https://api.agroleaf.ai/v1/predict', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer YOUR_API_KEY' },
  body: formData
});
const data = await response.json();`;

    const successResponse = `{
  "success": true,
  "prediction": {
    "crop": "Tomato",
    "disease": "Late Blight",
    "confidence": 0.9743,
    "is_healthy": false
  },
  "top_predictions": [
    {"class": "Tomato___Late_blight", "crop": "Tomato", "disease": "Late Blight", "confidence": 0.9743},
    {"class": "Tomato___Early_blight", "crop": "Tomato", "disease": "Early Blight", "confidence": 0.0182}
  ],
  "treatment": {
    "description": "Late blight is caused by Phytophthora infestans...",
    "recommendations": [
      "Apply copper-based fungicide immediately",
      "Remove and destroy infected plant material"
    ],
    "severity": "High"
  },
  "metadata": {
    "model_version": "1.0.0",
    "inference_time_ms": 342,
    "image_size": "256x256"
  }
}`;

    const errorResponse = `{
  "success": false,
  "error": {
    "code": "INVALID_IMAGE",
    "message": "The uploaded file is not a valid image. Supported formats: JPEG, PNG, WebP."
  }
}`;

    return (
        <div className="min-h-screen bg-linear-to-br from-[#e8f5e9] to-[#c8e6c9]">
            {/* Header with glassmorphism */}
            <div className="sticky top-0 z-50 bg-[rgba(245,250,240,0.72)] backdrop-blur-md border-b border-[rgba(10,123,74,0.2)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-[#0A7B4A]/10">
                            <Code className="h-8 w-8 text-[#0A7B4A]" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-[#1A2E1A] tracking-tight">
                                API Reference
                            </h1>
                            <p className="text-[#3A4D3A] text-sm mt-1">
                                Programmatic crop disease detection — RESTful endpoints, authentication, and integration guides
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <motion.div
                    className="space-y-12"
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                >
                    {/* Overview Section */}
                    <motion.section variants={fadeInUp} className="space-y-4">
                        <Card className="bg-[rgba(245,250,240,0.6)] backdrop-blur-md border border-[rgba(10,123,74,0.25)] shadow-xl rounded-2xl">
                            <CardHeader>
                                <CardTitle className="text-2xl text-[#1A2E1A] flex items-center gap-2">
                                    <Activity className="text-[#0A7B4A]" />
                                    Overview
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-[#3A4D3A]">
                                <p>
                                    AgroLeaf AI exposes a RESTful API for programmatic crop disease detection.
                                    The API accepts crop leaf images and returns disease predictions with confidence scores,
                                    treatment plans, and metadata.
                                </p>
                                <div className="bg-white/40 rounded-xl p-4 font-mono text-sm">
                                    Base URL: <span className="text-[#0A7B4A] font-semibold">https://api.agroleaf.ai/v1</span>
                                    <br />
                                    Local development: <span className="text-[#0A7B4A] font-semibold">http://localhost:5000/api/v1</span>
                                </div>
                                <p className="text-sm">All responses are JSON encoded. The API supports JPEG, PNG, and WebP images up to 10MB.</p>
                            </CardContent>
                        </Card>
                    </motion.section>

                    {/* Authentication Section */}
                    <motion.section variants={fadeInUp}>
                        <Card className="bg-[rgba(245,250,240,0.6)] backdrop-blur-md border border-[rgba(10,123,74,0.25)] shadow-xl rounded-2xl">
                            <CardHeader>
                                <CardTitle className="text-2xl text-[#1A2E1A] flex items-center gap-2">
                                    <Key className="text-[#0A7B4A]" />
                                    Authentication
                                </CardTitle>
                                <CardDescription className="text-[#3A4D3A]">
                                    Secure your API requests with API keys
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p>
                                    For the hosted API, include your API key in the <code className="bg-white/60 px-1.5 py-0.5 rounded font-mono text-sm">Authorization</code> header:
                                </p>
                                <CodeBlock code="Authorization: Bearer YOUR_API_KEY" language="http" />
                                <div className="bg-[#0A7B4A]/5 border-l-4 border-[#0A7B4A] p-4 rounded-r-xl">
                                    <p className="text-sm text-[#1A2E1A]">
                                        <strong>Local deployments:</strong> No authentication is required. For the hosted API,
                                        obtain an API key from your dashboard after signing up.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.section>

                    {/* Endpoints Section */}
                    <motion.section variants={fadeInUp} className="space-y-6">
                        <h2 className="text-2xl font-bold text-[#1A2E1A] flex items-center gap-2">
                            <Database className="text-[#0A7B4A]" />
                            Endpoints
                        </h2>

                        {/* POST /predict */}
                        <EndpointCard method="POST" path="/api/v1/predict" description="Upload a crop leaf image and receive disease prediction results">
                            <div className="space-y-5">
                                <div>
                                    <h4 className="font-semibold text-[#1A2E1A] mb-2">Request Parameters</h4>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead className="bg-white/40 border-b border-[rgba(10,123,74,0.15)]">
                                                <tr>
                                                    <th className="text-left p-2 font-semibold">Parameter</th>
                                                    <th className="text-left p-2 font-semibold">Type</th>
                                                    <th className="text-left p-2 font-semibold">Required</th>
                                                    <th className="text-left p-2 font-semibold">Description</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="border-b border-[rgba(10,123,74,0.1)]">
                                                    <td className="p-2 font-mono">image</td>
                                                    <td className="p-2">file</td>
                                                    <td className="p-2">Yes</td>
                                                    <td className="p-2">Crop leaf image (JPEG, PNG, WebP). Max 10MB.</td>
                                                </tr>
                                                <tr className="border-b border-[rgba(10,123,74,0.1)]">
                                                    <td className="p-2 font-mono">top_k</td>
                                                    <td className="p-2">integer</td>
                                                    <td className="p-2">No</td>
                                                    <td className="p-2">Number of top predictions to return (default: 3, max: 38)</td>
                                                </tr>
                                                <tr>
                                                    <td className="p-2 font-mono">include_treatment</td>
                                                    <td className="p-2">boolean</td>
                                                    <td className="p-2">No</td>
                                                    <td className="p-2">Include treatment recommendations (default: true)</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-[#1A2E1A] mb-2">Examples</h4>
                                    <Tabs defaultValue="curl" className="w-full">
                                        <TabsList className="bg-white/50 backdrop-blur-sm border border-[rgba(10,123,74,0.2)]">
                                            <TabsTrigger value="curl">cURL</TabsTrigger>
                                            <TabsTrigger value="python">Python</TabsTrigger>
                                            <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="curl" className="mt-3">
                                            <CodeBlock code={curlExample} language="bash" />
                                        </TabsContent>
                                        <TabsContent value="python" className="mt-3">
                                            <CodeBlock code={pythonExample} language="python" />
                                        </TabsContent>
                                        <TabsContent value="javascript" className="mt-3">
                                            <CodeBlock code={jsExample} language="javascript" />
                                        </TabsContent>
                                    </Tabs>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-[#1A2E1A] mb-2">Success Response (200)</h4>
                                    <CodeBlock code={successResponse} language="json" />
                                </div>

                                <div>
                                    <h4 className="font-semibold text-[#1A2E1A] mb-2">Error Response</h4>
                                    <CodeBlock code={errorResponse} language="json" />
                                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                        <div className="bg-white/40 p-2 rounded"><span className="font-mono font-bold">400</span> INVALID_IMAGE / IMAGE_TOO_LARGE</div>
                                        <div className="bg-white/40 p-2 rounded"><span className="font-mono font-bold">401</span> UNAUTHORIZED</div>
                                        <div className="bg-white/40 p-2 rounded"><span className="font-mono font-bold">413</span> PAYLOAD_TOO_LARGE</div>
                                        <div className="bg-white/40 p-2 rounded"><span className="font-mono font-bold">429</span> RATE_LIMITED</div>
                                        <div className="bg-white/40 p-2 rounded"><span className="font-mono font-bold">500</span> INTERNAL_ERROR</div>
                                    </div>
                                </div>
                            </div>
                        </EndpointCard>

                        {/* GET /crops */}
                        <EndpointCard method="GET" path="/api/v1/crops" description="Returns the list of all supported crops and their detectable diseases">
                            <div>
                                <h4 className="font-semibold text-[#1A2E1A] mb-2">Response Example</h4>
                                <CodeBlock code={`{
  "success": true,
  "total_crops": 14,
  "total_classes": 38,
  "crops": [
    {
      "name": "Tomato",
      "scientific_name": "Solanum lycopersicum",
      "diseases": ["Bacterial Spot", "Early Blight", "Late Blight", "Leaf Mold", "Septoria Leaf Spot", "Spider Mites", "Target Spot", "Yellow Leaf Curl Virus", "Mosaic Virus"],
      "has_healthy_class": true
    }
  ]
}`} language="json" />
                            </div>
                        </EndpointCard>

                        {/* GET /health */}
                        <EndpointCard method="GET" path="/api/v1/health" description="Health check endpoint">
                            <CodeBlock code={`{ "status": "ok", "model_loaded": true, "version": "1.0.0" }`} language="json" />
                        </EndpointCard>
                    </motion.section>

                    {/* Rate Limits */}
                    <motion.section variants={fadeInUp}>
                        <Card className="bg-[rgba(245,250,240,0.6)] backdrop-blur-md border border-[rgba(10,123,74,0.25)] shadow-xl rounded-2xl">
                            <CardHeader>
                                <CardTitle className="text-2xl text-[#1A2E1A] flex items-center gap-2">
                                    <Zap className="text-[#0A7B4A]" />
                                    Rate Limits
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-white/40 border-b border-[rgba(10,123,74,0.15)]">
                                            <tr>
                                                <th className="text-left p-3 font-semibold">Tier</th>
                                                <th className="text-left p-3 font-semibold">Requests/Minute</th>
                                                <th className="text-left p-3 font-semibold">Requests/Month</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-b border-[rgba(10,123,74,0.1)]">
                                                <td className="p-3 font-medium">Local (self-hosted)</td>
                                                <td className="p-3">Unlimited</td>
                                                <td className="p-3">Unlimited</td>
                                            </tr>
                                            <tr className="border-b border-[rgba(10,123,74,0.1)]">
                                                <td className="p-3 font-medium">Free (hosted)</td>
                                                <td className="p-3">20</td>
                                                <td className="p-3">500</td>
                                            </tr>
                                            <tr>
                                                <td className="p-3 font-medium">Pro (hosted)</td>
                                                <td className="p-3">200</td>
                                                <td className="p-3">50,000</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="mt-4 text-sm bg-white/40 p-3 rounded-lg">
                                    <p>Rate limit headers returned: <code className="font-mono">X-RateLimit-Limit</code>, <code className="font-mono">X-RateLimit-Remaining</code>, <code className="font-mono">X-RateLimit-Reset</code></p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.section>

                    {/* Image Requirements */}
                    <motion.section variants={fadeInUp}>
                        <Card className="bg-[rgba(245,250,240,0.6)] backdrop-blur-md border border-[rgba(10,123,74,0.25)] shadow-xl rounded-2xl">
                            <CardHeader>
                                <CardTitle className="text-2xl text-[#1A2E1A] flex items-center gap-2">
                                    <Upload className="text-[#0A7B4A]" />
                                    Image Requirements
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-[#3A4D3A]">
                                <p><strong>Formats:</strong> JPEG, PNG, WebP</p>
                                <p><strong>Max file size:</strong> 10MB</p>
                                <p><strong>Recommended resolution:</strong> 256×256px or higher</p>
                                <p className="text-sm">The API auto-resizes images internally; however, very low-resolution images (&lt;50×50) may produce unreliable results.</p>
                            </CardContent>
                        </Card>
                    </motion.section>

                    {/* Response Codes Summary */}
                    <motion.section variants={fadeInUp}>
                        <Card className="bg-[rgba(245,250,240,0.6)] backdrop-blur-md border border-[rgba(10,123,74,0.25)] shadow-xl rounded-2xl">
                            <CardHeader>
                                <CardTitle className="text-2xl text-[#1A2E1A] flex items-center gap-2">
                                    <BarChart3 className="text-[#0A7B4A]" />
                                    Response Codes Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                    <div className="bg-white/40 p-3 rounded-lg"><span className="font-mono font-bold text-green-700">200</span> – Success</div>
                                    <div className="bg-white/40 p-3 rounded-lg"><span className="font-mono font-bold text-yellow-700">400</span> – Bad Request (invalid image, too large)</div>
                                    <div className="bg-white/40 p-3 rounded-lg"><span className="font-mono font-bold text-red-700">401</span> – Unauthorized</div>
                                    <div className="bg-white/40 p-3 rounded-lg"><span className="font-mono font-bold text-orange-700">413</span> – Payload Too Large</div>
                                    <div className="bg-white/40 p-3 rounded-lg"><span className="font-mono font-bold text-purple-700">429</span> – Rate Limited</div>
                                    <div className="bg-white/40 p-3 rounded-lg"><span className="font-mono font-bold text-red-700">500</span> – Internal Server Error</div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.section>

                    {/* Local Development Setup */}
                    <motion.section variants={fadeInUp}>
                        <Card className="bg-[rgba(245,250,240,0.6)] backdrop-blur-md border border-[rgba(10,123,74,0.25)] shadow-xl rounded-2xl">
                            <CardHeader>
                                <CardTitle className="text-2xl text-[#1A2E1A]">Local Development Setup</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CodeBlock code={`git clone https://github.com/ByteCrister/agroleaf-ai.git
cd agroleaf-ai
pip install -r requirements.txt
python app.py
# API available at http://localhost:5000/api/v1/predict`} language="bash" />
                                <p className="mt-4 text-sm text-[#3A4D3A]">For full documentation, visit the <a href="https://github.com/ByteCrister/agroleaf-ai" target="_blank" rel="noopener noreferrer" className="text-[#0A7B4A] hover:underline inline-flex items-center gap-1">GitHub repository <ExternalLink size={12} /></a></p>
                            </CardContent>
                        </Card>
                    </motion.section>
                </motion.div>
            </main>
        </div>
    );
}