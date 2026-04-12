"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, AlertCircle, Camera, Upload, Cpu, HelpCircle, Mail, Users, ArrowRight, CheckCircle2, Clock } from "lucide-react";
import { SiGithub } from "react-icons/si";

// ----------------------------------------------------------------------
// FAQ Data Structure
// ----------------------------------------------------------------------
interface FaqItem {
    id: string;
    category: string;
    question: string;
    answerPlain: string; // for search indexing
    answerElement: React.ReactNode;
}

const faqData: FaqItem[] = [
    // ----- Getting Started -----
    {
        id: "what-is",
        category: "Getting Started",
        question: "What is AgroLeaf AI?",
        answerPlain: "AgroLeaf AI is a free, open-source crop disease detection tool using a Convolutional Neural Network (CNN). It supports 14 crops and 38 disease classes. Upload an image of a leaf to get an instant diagnosis.",
        answerElement: (
            <div className="space-y-2">
                <p>
                    AgroLeaf AI is a free, open-source crop disease detection tool powered by a custom-trained
                    Convolutional Neural Network (CNN). It supports <strong>14 different crops</strong> and
                    <strong> 38 disease classes</strong> (including healthy leaves). Simply upload a photo of a crop leaf,
                    and the system provides a diagnosis, confidence score, and actionable treatment plans in under 2 seconds.
                </p>
                <p>
                    The platform combines deep learning with LLM insights to offer both organic and chemical treatment
                    recommendations.
                </p>
            </div>
        ),
    },
    {
        id: "how-start",
        category: "Getting Started",
        question: "How do I get started?",
        answerPlain: "Visit the app, click the upload button, take or select a photo of a crop leaf, and view the results. No account is required for basic use.",
        answerElement: (
            <div className="space-y-2">
                <p>Getting started with AgroLeaf AI is simple:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Visit the AgroLeaf AI web app</li>
                    <li>Click the &quot;Upload Image&quot; button</li>
                    <li>Take a photo with your camera or select an existing image of a crop leaf</li>
                    <li>Wait 1-2 seconds for the AI analysis</li>
                    <li>View the diagnosis, confidence score, and treatment recommendations</li>
                </ol>
                <p className="text-muted-foreground text-sm">No account registration is required for the basic detection feature.</p>
            </div>
        ),
    },
    {
        id: "is-free",
        category: "Getting Started",
        question: "Is AgroLeaf AI free?",
        answerPlain: "Yes, AgroLeaf AI is fully open-source under the MIT License. You can self-host for unlimited use, or use the hosted free tier.",
        answerElement: (
            <div className="space-y-2">
                <p>
                    Yes! AgroLeaf AI is completely free and open-source under the <strong>MIT License</strong>.
                    You have two options:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                    <li><strong>Hosted version:</strong> Free tier with reasonable usage limits (no credit card required).</li>
                    <li><strong>Self-hosted:</strong> Clone the repository from GitHub and run your own instance for unlimited use, perfect for farms or research.</li>
                </ul>
                <p>We believe in democratizing AI for agriculture — no hidden fees or paywalls.</p>
            </div>
        ),
    },
    {
        id: "devices",
        category: "Getting Started",
        question: "What devices can I use?",
        answerPlain: "AgroLeaf AI works on any device with a modern web browser — desktop, tablet, or smartphone. The responsive design includes camera access for mobile users.",
        answerElement: (
            <div className="space-y-2">
                <p>
                    AgroLeaf AI is a responsive web application that works on any device with a modern browser:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                    <li><strong>Desktop:</strong> Windows, macOS, Linux (Chrome, Firefox, Edge, Safari)</li>
                    <li><strong>Tablet:</strong> iPad, Android tablets</li>
                    <li><strong>Smartphone:</strong> iOS and Android devices (camera access supported for instant photo capture)</li>
                </ul>
                <p>No native app installation is required — just visit the website.</p>
            </div>
        ),
    },

    // ----- Using the Disease Detector -----
    {
        id: "supported-crops",
        category: "Using the Disease Detector",
        question: "What crops are supported?",
        answerPlain: "Apple, Blueberry, Cherry, Corn, Grape, Orange, Peach, Pepper, Potato, Raspberry, Soybean, Squash, Strawberry, Tomato. Full details on the /crops page.",
        answerElement: (
            <div className="space-y-2">
                <p>AgroLeaf AI currently supports <strong>14 crops</strong> with 38 disease classes:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-1 bg-muted/30 p-3 rounded-lg">
                    {["Apple", "Blueberry", "Cherry", "Corn", "Grape", "Orange", "Peach", "Pepper", "Potato", "Raspberry", "Soybean", "Squash", "Strawberry", "Tomato"].map((crop) => (
                        <span key={crop} className="text-sm">• {crop}</span>
                    ))}
                </div>
                <p>
                    For detailed information about each crop and the diseases detected, visit our{" "}
                    <Link href="/crops" className="text-primary underline underline-offset-2 hover:text-primary/80">
                        crops reference page
                    </Link>.
                </p>
            </div>
        ),
    },
    {
        id: "best-image",
        category: "Using the Disease Detector",
        question: "What image should I upload for best results?",
        answerPlain: "Upload a clear, well-lit, close-up photo of a single leaf. Use natural daylight, avoid shadows, and ensure the affected area is visible. JPEG or PNG, at least 256x256 pixels.",
        answerElement: (
            <div className="space-y-2">
                <p>For the most accurate diagnosis, follow these image guidelines:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                    <li><strong>Single leaf:</strong> Focus on one leaf at a time, preferably showing symptoms clearly.</li>
                    <li><strong>Good lighting:</strong> Natural daylight works best — avoid harsh shadows or backlight.</li>
                    <li><strong>Close-up:</strong> Fill at least 50% of the frame with the leaf.</li>
                    <li><strong>Resolution:</strong> Minimum 256×256 pixels (JPEG or PNG format).</li>
                    <li><strong>File size:</strong> Less than 10MB for fast upload.</li>
                </ul>
                <p className="text-muted-foreground text-sm">Blurry, dark, or multi-leaf images may reduce accuracy.</p>
            </div>
        ),
    },
    {
        id: "accuracy",
        category: "Using the Disease Detector",
        question: "How accurate is the detection?",
        answerPlain: "The model achieves ~95-97% accuracy on the test dataset, but accuracy varies by crop and disease. Use confidence scores to gauge reliability. Always treat as a decision-support tool, not a replacement for professional diagnosis.",
        answerElement: (
            <div className="space-y-2">
                <p>
                    Our CNN model achieves <strong>~95-97% accuracy</strong> on the held-out test dataset (trained on the
                    High-Quality Crop Disease Image Dataset from Kaggle). However, real-world performance may vary based on:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Image quality and lighting conditions</li>
                    <li>Specific crop variety or disease stage</li>
                    <li>Similar-looking diseases across different crops</li>
                </ul>
                <p>
                    Always check the <strong>confidence score</strong> provided with each prediction. Treat predictions below
                    70% confidence with extra caution. AgroLeaf AI is a <strong>decision-support tool</strong> and not a
                    replacement for professional agronomic diagnosis.
                </p>
            </div>
        ),
    },
    {
        id: "confidence-score",
        category: "Using the Disease Detector",
        question: "What does the confidence score mean?",
        answerPlain: "The confidence score (0-100%) indicates model certainty. Above 90% = high confidence, 70-90% = moderate, below 70% = low confidence — consider retaking the photo or consulting an expert.",
        answerElement: (
            <div className="space-y-2">
                <p>The confidence score reflects how certain the AI model is about its prediction:</p>
                <div className="space-y-2 mt-2">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div><span><strong>&gt;90% (High):</strong> Very reliable prediction. The model is highly certain.</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-500"></div><span><strong>70-90% (Moderate):</strong> Likely correct, but consider image quality and retake if unsure.</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div><span><strong>&lt;70% (Low):</strong> Low confidence — the model is uncertain. Retake the photo or consult a local expert.</span></div>
                </div>
                <p className="text-muted-foreground text-sm mt-2">Always use confidence scores as a guide, not absolute truth.</p>
            </div>
        ),
    },
    {
        id: "healthy-but-sick",
        category: "Using the Disease Detector",
        question: "The model said 'Healthy' but my plant looks sick — what should I do?",
        answerPlain: "Possible reasons: disease not in our 26 supported diseases, poor image quality, or early-stage symptoms. Try retaking with better lighting, a different leaf, or consult a local agronomist. Report via the contact page.",
        answerElement: (
            <div className="space-y-2">
                <p>If the model predicts &quot;Healthy&quot; but you observe visible symptoms, consider these possibilities:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                    <li><strong>Unsupported disease:</strong> The disease may not be among our 26 trained disease classes.</li>
                    <li><strong>Image quality issues:</strong> Blurry, dark, or poorly framed photos can confuse the model.</li>
                    <li><strong>Early-stage symptoms:</strong> Very subtle early signs may not be visually distinct yet.</li>
                    <li><strong>Non-leaf issue:</strong> The problem might be in roots, stems, or fruits (the model is leaf-only).</li>
                </ul>
                <p>
                    <strong>Recommended actions:</strong> Retake the photo in natural light, try a different symptomatic leaf,
                    or consult a local agronomist. You can also report the case via our{" "}
                    <Link href="/contact" className="text-primary underline">contact page</Link> to help us improve.
                </p>
            </div>
        ),
    },
    {
        id: "fruits-stems",
        category: "Using the Disease Detector",
        question: "Can I detect diseases on fruits/stems, not just leaves?",
        answerPlain: "Currently, AgroLeaf AI is trained exclusively on leaf images. Uploading fruit, stem, or root images will produce unreliable results. Leaf-only detection.",
        answerElement: (
            <div className="space-y-2">
                <p>
                    <strong>No</strong> — AgroLeaf AI is specifically trained on <strong>leaf images only</strong>.
                    The model has never seen fruit, stem, or root images during training.
                </p>
                <p>Uploading non-leaf photos will likely produce random or incorrect predictions. For best results:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Always photograph a <strong>single leaf</strong> showing symptoms.</li>
                    <li>If the disease primarily affects fruits (e.g., blossom end rot on tomatoes), the model may not detect it.</li>
                </ul>
                <p>We are exploring fruit/stem detection in future model versions.</p>
            </div>
        ),
    },

    // ----- API & Developer Questions -----
    {
        id: "use-api",
        category: "API & Developer Questions",
        question: "How do I use the API?",
        answerPlain: "Send a POST request to /api/v1/predict with an image file. Returns JSON with disease class, confidence score, and treatment plans. Full documentation on the /api page.",
        answerElement: (
            <div className="space-y-2">
                <p>The AgroLeaf AI REST API allows programmatic disease detection. Quick start:</p>
                <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
                    {`POST /api/v1/predict
Content-Type: multipart/form-data

{
  "image": <file>
}

Response:
{
  "prediction": "Apple Scab",
  "confidence": 0.96,
  "treatment": {
    "organic": "...",
    "chemical": "..."
  }
}`}
                </pre>
                <p>
                    For full documentation including authentication (if applicable), rate limits, and code examples in
                    Python/JavaScript, visit our{" "}
                    <Link href="/api" className="text-primary underline">API reference page</Link>.
                </p>
            </div>
        ),
    },
    {
        id: "run-locally",
        category: "API & Developer Questions",
        question: "How do I run AgroLeaf AI locally?",
        answerPlain: "Clone the GitHub repository, install dependencies with npm or pip, and run the development server. Full setup instructions in the README.",
        answerElement: (
            <div className="space-y-2">
                <p>Running AgroLeaf AI locally is straightforward:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Clone the repository: <code className="bg-muted px-1 rounded">git clone https://github.com/ByteCrister/agroleaf-ai.git</code></li>
                    <li>Install backend dependencies: <code className="bg-muted px-1 rounded">pip install -r requirements.txt</code></li>
                    <li>Install frontend dependencies: <code className="bg-muted px-1 rounded">npm install</code></li>
                    <li>Run the development server: <code className="bg-muted px-1 rounded">npm run dev</code></li>
                    <li>Open <code className="bg-muted px-1 rounded">http://localhost:3000</code></li>
                </ol>
                <p>
                    Detailed instructions, environment variables, and model download links are available in the{" "}
                    <Link href="https://github.com/ByteCrister/agroleaf-ai/blob/main/README.md" target="_blank" className="text-primary underline">
                        GitHub README
                    </Link>.
                </p>
            </div>
        ),
    },
    {
        id: "contribute",
        category: "API & Developer Questions",
        question: "Can I contribute to the project?",
        answerPlain: "Yes! Fork the repository, make changes, and submit a pull request. Areas for contribution: model improvements, new crop support, UI/UX, documentation, translations.",
        answerElement: (
            <div className="space-y-2">
                <p>Absolutely! AgroLeaf AI is an open-source community project. We welcome contributions of all kinds:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                    <li><strong>Model improvements:</strong> Better accuracy, new crop classes, or faster inference.</li>
                    <li><strong>UI/UX enhancements:</strong> Improve the user interface or accessibility.</li>
                    <li><strong>Documentation:</strong> Fix typos, add tutorials, or translate to other languages.</li>
                    <li><strong>Bug fixes & features:</strong> Any issue labeled &quot;good first issue&quot; on GitHub.</li>
                </ul>
                <p>
                    Check our <Link href="https://github.com/ByteCrister/agroleaf-ai/blob/main/CONTRIBUTING.md" target="_blank" className="text-primary underline">CONTRIBUTING.md</Link> for guidelines.
                    Submit a pull request — we review contributions regularly.
                </p>
            </div>
        ),
    },

    // ----- Troubleshooting -----
    {
        id: "upload-failing",
        category: "Troubleshooting",
        question: "My image upload is failing.",
        answerPlain: "Check file format (JPEG/PNG/WebP), file size (<10MB), internet connection, or try a different browser. If persistent, report via the contact page.",
        answerElement: (
            <div className="space-y-2">
                <p>Upload failures are usually easy to fix. Try these steps:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                    <li><strong>File format:</strong> Use JPEG, PNG, or WebP (other formats may be rejected).</li>
                    <li><strong>File size:</strong> Ensure your image is under 10MB.</li>
                    <li><strong>Internet connection:</strong> Check that you have a stable connection.</li>
                    <li><strong>Browser:</strong> Try a different browser (Chrome, Firefox, Safari).</li>
                    <li><strong>Clear cache:</strong> Sometimes browser cache causes issues.</li>
                </ul>
                <p>
                    If the problem persists, please{" "}
                    <Link href="/contact" className="text-primary underline">contact support</Link> with the error message
                    and screenshot.
                </p>
            </div>
        ),
    },
    {
        id: "wrong-prediction",
        category: "Troubleshooting",
        question: "The prediction seems wrong.",
        answerPlain: "Check image quality, ensure the crop is supported, review the confidence score. The model may confuse visually similar diseases. Report incorrect predictions via the contact page.",
        answerElement: (
            <div className="space-y-2">
                <p>Incorrect predictions can happen. Here&apos;s what to check:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                    <li><strong>Image quality:</strong> Is the leaf clearly visible? Good lighting and focus?</li>
                    <li><strong>Supported crop:</strong> Is your crop in the list of 14 supported crops?</li>
                    <li><strong>Confidence score:</strong> Low confidence (&lt;70%) predictions are less reliable.</li>
                    <li><strong>Disease similarity:</strong> Some diseases look very similar even to experts.</li>
                </ul>
                <p>
                    If you believe the model is consistently wrong for a specific disease, please report it via our{" "}
                    <Link href="/contact" className="text-primary underline">contact page</Link>. Include the original
                    image and what you expected. Your feedback helps us retrain the model.
                </p>
            </div>
        ),
    },
    {
        id: "slow-app",
        category: "Troubleshooting",
        question: "The app is loading slowly.",
        answerPlain: "Model inference normally takes <2 seconds. Slow loading may be due to large image files, slow internet, or server load. Try compressing the image or using a smaller file.",
        answerElement: (
            <div className="space-y-2">
                <p>AgroLeaf AI is designed for speed (under 2 seconds per prediction). If you experience slowness:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                    <li><strong>Image size:</strong> Large images ({">"}10MB or {">"}4000px) take longer to upload and process.</li>
                    <li><strong>Internet speed:</strong> Slow upload speeds affect total time.</li>
                    <li><strong>Server load:</strong> During peak hours, our free tier may have queues.</li>
                    <li><strong>Browser extensions:</strong> Some ad-blockers or privacy extensions can interfere.</li>
                </ul>
                <p>
                    <strong>Solutions:</strong> Compress your image to under 2MB, use a smaller resolution (e.g., 1024×1024),
                    or try again later. For consistently slow performance, consider self-hosting.
                </p>
            </div>
        ),
    },
];

// ----------------------------------------------------------------------
// Group FAQ by Category (preserve order)
// ----------------------------------------------------------------------
const categoryOrder = ["Getting Started", "Using the Disease Detector", "API & Developer Questions", "Troubleshooting"];

// ----------------------------------------------------------------------
// Main Help Page Component
// ----------------------------------------------------------------------
export default function HelpPage() {
    const [searchQuery, setSearchQuery] = useState("");

    // Filter FAQ items based on search query (case-insensitive)
    const filteredFaqs = useMemo(() => {
        if (!searchQuery.trim()) return faqData;
        const query = searchQuery.toLowerCase();
        return faqData.filter(
            (item) =>
                item.question.toLowerCase().includes(query) ||
                item.answerPlain.toLowerCase().includes(query) ||
                item.category.toLowerCase().includes(query)
        );
    }, [searchQuery]);

    // Group filtered FAQs by category, preserving order
    const groupedFaqs = useMemo(() => {
        const groups: Record<string, FaqItem[]> = {};
        categoryOrder.forEach((cat) => (groups[cat] = []));
        filteredFaqs.forEach((item) => {
            if (groups[item.category]) {
                groups[item.category].push(item);
            } else {
                groups[item.category] = [item];
            }
        });
        return groups;
    }, [filteredFaqs]);

    const hasSearchResults = Object.values(groupedFaqs).some((arr) => arr.length > 0);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    };

    return (
        <main className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-linear-to-br from-primary/5 via-background to-secondary/5 py-16 md:py-24">
                <div className="container mx-auto px-4 md:px-6">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
                            Help Center
                        </h1>
                        <p className="text-xl text-muted-foreground mb-8">
                            Find answers to common questions about using AgroLeaf AI.
                        </p>
                        <div className="relative max-w-xl mx-auto">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search help articles..."
                                className="pl-10 py-6 text-base shadow-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* FAQ Sections */}
            <section className="container mx-auto px-4 md:px-6 py-12 md:py-16">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="space-y-12"
                >
                    {categoryOrder.map((category) => {
                        const items = groupedFaqs[category];
                        if (!items || items.length === 0) return null;

                        return (
                            <motion.div key={category} variants={itemVariants} className="space-y-4">
                                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight border-l-4 border-primary pl-4">
                                    {category}
                                </h2>
                                <Accordion type="multiple" className="w-full space-y-3">
                                    {items.map((faq) => (
                                        <AccordionItem
                                            key={faq.id}
                                            value={faq.id}
                                            className="border rounded-lg px-4 bg-card shadow-sm"
                                        >
                                            <AccordionTrigger className="text-left hover:no-underline py-4 text-base md:text-lg font-medium">
                                                {faq.question}
                                            </AccordionTrigger>
                                            <AccordionContent className="text-muted-foreground pb-4">
                                                {faq.answerElement}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </motion.div>
                        );
                    })}

                    {!hasSearchResults && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12"
                        >
                            <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                            <p className="text-lg text-muted-foreground">
                                No results found for &quot;{searchQuery}&quot;. Try different keywords.
                            </p>
                            <Button
                                variant="link"
                                onClick={() => setSearchQuery("")}
                                className="mt-2"
                            >
                                Clear search
                            </Button>
                        </motion.div>
                    )}
                </motion.div>
            </section>

            {/* Troubleshooting Flowchart Section */}
            <section className="bg-muted/30 py-12 md:py-16">
                <div className="container mx-auto px-4 md:px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="text-center mb-10"
                    >
                        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Troubleshooting Flowchart</h2>
                        <p className="text-muted-foreground mt-2">Quick decision tree for common issues</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                        {/* Flow 1: Upload failing */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Card className="h-full border-l-4 border-l-red-500 shadow-md">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                        <AlertCircle className="h-5 w-5" />
                                        Upload failing?
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-start gap-2">
                                        <div className="bg-muted rounded-full p-1 mt-0.5">
                                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Step 1:</p>
                                            <p className="text-sm text-muted-foreground">Check format (JPEG/PNG/WebP) & size (&lt;10MB)</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-center">
                                        <ArrowRight className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="bg-muted rounded-full p-1 mt-0.5">
                                            <Camera className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Step 2:</p>
                                            <p className="text-sm text-muted-foreground">Try different browser or clear cache</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-center">
                                        <ArrowRight className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="bg-muted rounded-full p-1 mt-0.5">
                                            <Mail className="h-4 w-4 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Step 3:</p>
                                            <p className="text-sm text-muted-foreground">
                                                <Link href="/contact" className="text-primary underline">Contact support</Link>
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Flow 2: Wrong prediction */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            <Card className="h-full border-l-4 border-l-yellow-500 shadow-md">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                                        <HelpCircle className="h-5 w-5" />
                                        Wrong prediction?
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-start gap-2">
                                        <div className="bg-muted rounded-full p-1 mt-0.5">
                                            <Camera className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Step 1:</p>
                                            <p className="text-sm text-muted-foreground">Check image quality & lighting</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-center">
                                        <ArrowRight className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="bg-muted rounded-full p-1 mt-0.5">
                                            <Cpu className="h-4 w-4 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Step 2:</p>
                                            <p className="text-sm text-muted-foreground">Verify crop is supported (14 crops)</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-center">
                                        <ArrowRight className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="bg-muted rounded-full p-1 mt-0.5">
                                            <SiGithub className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Step 3:</p>
                                            <p className="text-sm text-muted-foreground">
                                                <Link href="/contact" className="text-primary underline">Report via /contact</Link>
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Flow 3: App slow */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                            viewport={{ once: true }}
                        >
                            <Card className="h-full border-l-4 border-l-blue-500 shadow-md">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                                        <Clock className="h-5 w-5" />
                                        App slow?
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-start gap-2">
                                        <div className="bg-muted rounded-full p-1 mt-0.5">
                                            <Upload className="h-4 w-4 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Step 1:</p>
                                            <p className="text-sm text-muted-foreground">Check internet connection speed</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-center">
                                        <ArrowRight className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="bg-muted rounded-full p-1 mt-0.5">
                                            <Camera className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Step 2:</p>
                                            <p className="text-sm text-muted-foreground">Compress image to &lt;2MB / smaller resolution</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-center">
                                        <ArrowRight className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="bg-muted rounded-full p-1 mt-0.5">
                                            <Clock className="h-4 w-4 text-orange-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Step 3:</p>
                                            <p className="text-sm text-muted-foreground">Try again later or self-host</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Still Need Help? Section */}
            <section className="container mx-auto px-4 md:px-6 py-12 md:py-16">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="bg-card border rounded-2xl p-8 md:p-10 text-center shadow-sm"
                >
                    <h2 className="text-2xl md:text-3xl font-semibold mb-6">Still Need Help?</h2>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 flex-wrap">
                        <Button variant="outline" asChild className="gap-2">
                            <Link href="/contact">
                                <Mail className="h-4 w-4" />
                                Contact Us
                            </Link>
                        </Button>
                        <Button variant="outline" asChild className="gap-2">
                            <Link href="https://github.com/ByteCrister/agroleaf-ai/issues" target="_blank">
                                <SiGithub className="h-4 w-4" />
                                Report a Bug
                            </Link>
                        </Button>
                        <Button variant="outline" asChild className="gap-2">
                            <Link href="https://github.com/ByteCrister/agroleaf-ai" target="_blank">
                                <Users className="h-4 w-4" />
                                Contribute on GitHub
                            </Link>
                        </Button>
                    </div>
                    <p className="text-muted-foreground text-sm mt-6">
                        Can&apos;t find your answer? Reach out via our contact page. We usually respond within 24-48 hours.
                    </p>
                </motion.div>
            </section>
        </main>
    );
}