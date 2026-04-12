"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, useInView } from "framer-motion";
import {
    Camera,
    Image as ImageIcon,
    Brain,
    Leaf,
    Database,
    Code,
    Server,
    Shield,
    ExternalLink,
    Zap,
    BarChart,
    Sparkles,
} from "lucide-react";
import { SiGithub } from "react-icons/si";
import { useRef } from "react";
import Link from "next/link";

const REPOSITORY_URL = "https://github.com/ByteCrister/agroleaf-ai";

export default function HowItWorksPage() {
    const heroRef = useRef(null);
    const stepsRef = useRef(null);
    const techRef = useRef(null);
    const accuracyRef = useRef(null);
    const communityRef = useRef(null);
    const ctaRef = useRef(null);

    const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 });
    const isStepsInView = useInView(stepsRef, { once: true, amount: 0.2 });
    const isTechInView = useInView(techRef, { once: true, amount: 0.2 });
    const isAccuracyInView = useInView(accuracyRef, { once: true, amount: 0.2 });
    const isCommunityInView = useInView(communityRef, { once: true, amount: 0.2 });
    const isCtaInView = useInView(ctaRef, { once: true, amount: 0.3 });

    const steps = [
        {
            icon: Camera,
            title: "Capture or Upload",
            description:
                "Take a photo of the affected leaf using your phone camera or upload an existing image (JPEG/PNG). The platform accepts images from any angle but recommends a clear, close-up shot of the leaf surface for best results.",
        },
        {
            icon: ImageIcon,
            title: "Image Preprocessing",
            description:
                "The system automatically resizes, normalizes, and augments the image to match the model's input requirements (224×224 pixels, RGB normalization). This happens transparently in milliseconds, preparing the image for analysis.",
        },
        {
            icon: Brain,
            title: "CNN Inference",
            description:
                "The preprocessed image is fed into a fine-tuned EfficientNet-B0 deep CNN. The model outputs probability scores across all 38 disease classes, identifying the most likely condition affecting the crop leaf.",
        },
        {
            icon: Leaf,
            title: "Results & Recommendations",
            description:
                "You receive: the top predicted disease with confidence percentage, a detailed description of the disease, visual symptom markers, recommended treatment/management actions (organic and chemical), and a 'Healthy' confirmation if no disease is detected.",
        },
    ];

    const techStack = [
        {
            icon: Database,
            title: "Dataset",
            description:
                "High Quality Crop Disease Image Dataset (Kaggle) — 14 crop species, 38 disease classes including healthy baselines. Expert-labeled, high-resolution images augmented for robustness.",
        },
        {
            icon: Brain,
            title: "Model Architecture",
            description:
                "EfficientNet-B0 CNN trained via transfer learning on ImageNet weights, fine-tuned on 87,000+ labeled crop disease images. Data augmentation includes rotation, flip, zoom, and brightness adjustments.",
        },
        {
            icon: Server,
            title: "Backend",
            description:
                "FastAPI + TensorFlow Serving for real-time inference. RESTful API architecture with average latency under 1 second. Stratified train/val/test split, categorical cross-entropy loss, Adam optimizer.",
        },
        {
            icon: Code,
            title: "Frontend",
            description:
                "Next.js 16+ with TypeScript, shadcn/ui components, and glassmorphism design system. Real-time prediction via REST API with confidence scoring and uncertainty handling.",
        },
    ];

    const accuracyMetrics = [
        { label: "Validation Accuracy", value: "95-97%", icon: BarChart },
        { label: "Inference Latency", value: "< 1 second", icon: Zap },
        { label: "Confidence Threshold", value: "70%", icon: Shield },
        { label: "Healthy Class Detection", value: "Supported", icon: Sparkles },
    ];

    return (
        <div className="min-h-screen bg-linear-to-br from-[#f0f7f0] via-white to-[#e8f3e8]">
            {/* Hero Section */}
            <section ref={heroRef} className="relative overflow-hidden px-4 py-24 md:py-32">
                <div className="container mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="text-center"
                    >
                        <h1 className="mb-6 text-4xl font-bold tracking-tight text-[#1A2E1A] md:text-5xl lg:text-6xl">
                            From Leaf Photo to Disease Diagnosis
                            <span className="block text-[#0A7B4A]">in Under 2 Seconds</span>
                        </h1>
                        <p className="mx-auto mb-8 max-w-2xl text-lg text-[#3A4D3A] md:text-xl">
                            Free, open-source, AI-powered crop disease detection — no expertise needed. Upload a photo,
                            get instant diagnosis and treatment plans.
                        </p>
                        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Button
                                size="lg"
                                className="bg-[#0A7B4A] text-white transition-all hover:bg-[#0A7B4A]/90 hover:shadow-lg"
                                asChild
                            >
                                <Link href="/diagnose">Try It Now — Upload Your First Leaf Image</Link>
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-[#0A7B4A] text-[#0A7B4A] transition-all hover:bg-[#0A7B4A]/10"
                                asChild
                            >
                                <Link href={REPOSITORY_URL} target="_blank">
                                    <SiGithub className="mr-2 h-4 w-4" />
                                    View on GitHub
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Step-by-Step Process */}
            <section ref={stepsRef} className="px-4 py-20">
                <div className="container mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isStepsInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5 }}
                        className="mb-12 text-center"
                    >
                        <h2 className="mb-4 text-3xl font-bold text-[#1A2E1A] md:text-4xl">
                            How It Works: Four Simple Steps
                        </h2>
                        <p className="mx-auto max-w-2xl text-[#3A4D3A]">
                            From image capture to actionable insights — transparent, fast, and accurate.
                        </p>
                    </motion.div>

                    <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <motion.div
                                    key={step.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={isStepsInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <Card className="h-full overflow-hidden border border-[rgba(10,123,74,0.2)] bg-[rgba(245,250,240,0.6)] backdrop-blur-md transition-all duration-300 hover:border-[#0A7B4A] hover:shadow-xl">
                                        <CardHeader className="pb-3">
                                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#0A7B4A]/10 text-[#0A7B4A]">
                                                <Icon className="h-6 w-6" />
                                            </div>
                                            <CardTitle className="text-xl font-semibold text-[#1A2E1A]">
                                                Step {index + 1}: {step.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <CardDescription className="text-base text-[#3A4D3A]">
                                                {step.description}
                                            </CardDescription>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Under the Hood — Technology Stack */}
            <section ref={techRef} className="px-4 py-20">
                <div className="container mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isTechInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5 }}
                        className="mb-12 text-center"
                    >
                        <h2 className="mb-4 text-3xl font-bold text-[#1A2E1A] md:text-4xl">
                            Under the Hood: Technology Stack
                        </h2>
                        <p className="mx-auto max-w-2xl text-[#3A4D3A]">
                            Built for performance, accuracy, and scalability — open source from day one.
                        </p>
                    </motion.div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {techStack.map((tech, index) => {
                            const Icon = tech.icon;
                            return (
                                <motion.div
                                    key={tech.title}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={isTechInView ? { opacity: 1, scale: 1 } : {}}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                >
                                    <Card className="h-full border border-[rgba(10,123,74,0.15)] bg-white/70 backdrop-blur-sm">
                                        <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                                            <div className="rounded-lg bg-[#0A7B4A]/10 p-2 text-[#0A7B4A]">
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <CardTitle className="text-lg text-[#1A2E1A]">{tech.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <CardDescription className="text-[#3A4D3A]">{tech.description}</CardDescription>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Accuracy & Trust */}
            <section ref={accuracyRef} className="px-4 py-20">
                <div className="container mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isAccuracyInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5 }}
                        className="mb-12 text-center"
                    >
                        <h2 className="mb-4 text-3xl font-bold text-[#1A2E1A] md:text-4xl">
                            Accuracy & Trust
                        </h2>
                        <p className="mx-auto max-w-2xl text-[#3A4D3A]">
                            Rigorous validation, transparent confidence scoring, and professional-grade reliability.
                        </p>
                    </motion.div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {accuracyMetrics.map((metric, index) => {
                            const Icon = metric.icon;
                            return (
                                <motion.div
                                    key={metric.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={isAccuracyInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                >
                                    <Card className="text-center backdrop-blur-sm bg-[rgba(245,250,240,0.5)] border border-[rgba(10,123,74,0.2)]">
                                        <CardContent className="pt-6">
                                            <div className="mb-4 flex justify-center">
                                                <div className="rounded-full bg-[#0A7B4A]/10 p-3 text-[#0A7B4A]">
                                                    <Icon className="h-6 w-6" />
                                                </div>
                                            </div>
                                            <div className="text-2xl font-bold text-[#0A7B4A]">{metric.value}</div>
                                            <div className="text-sm text-[#3A4D3A]">{metric.label}</div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isAccuracyInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mt-8 rounded-2xl border border-[rgba(10,123,74,0.2)] bg-[rgba(245,250,240,0.6)] p-6 backdrop-blur-sm"
                    >
                        <p className="text-center text-[#1A2E1A]">
                            <span className="font-semibold">Confidence threshold:</span> Predictions below 70% confidence
                            are flagged as &quot;Uncertain — consider consulting an agronomist.&quot; The model accurately detects
                            the &quot;Healthy&quot; class for each crop, confirming disease-free leaves.
                        </p>
                        <p className="mt-4 text-center text-sm text-[#3A4D3A]">
                            AgroLeaf AI is a decision-support tool, not a replacement for professional agronomic advice.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Open Source & Community */}
            <section ref={communityRef} className="px-4 py-20">
                <div className="container mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isCommunityInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5 }}
                        className="rounded-3xl border border-[rgba(10,123,74,0.2)] bg-linear-to-br from-[rgba(10,123,74,0.05)] to-[rgba(44,95,45,0.02)] p-8 backdrop-blur-sm md:p-12"
                    >
                        <div className="text-center">
                            <h2 className="mb-4 text-3xl font-bold text-[#1A2E1A] md:text-4xl">
                                Open Source & Community Driven
                            </h2>
                            <p className="mx-auto mb-8 max-w-2xl text-[#3A4D3A]">
                                AgroLeaf AI is fully open-source on GitHub. Built by ByteCrister for farmers, developers,
                                and agronomists worldwide.
                            </p>
                            <div className="flex flex-wrap items-center justify-center gap-4">
                                <Button
                                    variant="default"
                                    className="bg-[#0A7B4A] text-white hover:bg-[#0A7B4A]/90"
                                    asChild
                                >
                                    <Link href={REPOSITORY_URL} target="_blank">
                                        <SiGithub className="mr-2 h-4 w-4" />
                                        Star on GitHub
                                    </Link>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="border-[#0A7B4A] text-[#0A7B4A] hover:bg-[#0A7B4A]/10"
                                    asChild
                                >
                                    <Link href={REPOSITORY_URL} target="_blank">
                                        <ExternalLink className="mr-2 h-4 w-4" />
                                        Contribute
                                    </Link>
                                </Button>
                            </div>
                            <p className="mt-6 text-sm text-[#3A4D3A]">
                                We welcome contributions: model improvements, new crop support, translations, bug fixes, and
                                documentation.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section ref={ctaRef} className="px-4 py-20">
                <div className="container mx-auto max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={isCtaInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.5 }}
                        className="rounded-3xl border border-[rgba(10,123,74,0.3)] bg-[rgba(10,123,74,0.04)] p-8 text-center backdrop-blur-md md:p-12"
                    >
                        <h2 className="mb-4 text-2xl font-bold text-[#1A2E1A] md:text-3xl">
                            Ready to Transform Your Crop Management?
                        </h2>
                        <p className="mb-8 text-[#3A4D3A]">
                            Join thousands of farmers using AI to detect diseases early and protect their harvest.
                        </p>
                        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Button
                                size="lg"
                                className="bg-[#0A7B4A] text-white transition-all hover:bg-[#0A7B4A]/90 hover:shadow-lg"
                                asChild
                            >
                                <Link href="/diagnose">Try It Now — Upload Your First Leaf Image</Link>
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-[#0A7B4A] text-[#0A7B4A] transition-all hover:bg-[#0A7B4A]/10"
                                asChild
                            >
                                <Link href={REPOSITORY_URL} target="_blank">
                                    <SiGithub className="mr-2 h-4 w-4" />
                                    View on GitHub
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}