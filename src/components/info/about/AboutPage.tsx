"use client";

import { cropsData } from "@/data/dataset-data";
import { SOCIAL_LINKS } from "@/const/social-links";
import { DatasetTree } from "@/components/info/about/DatasetTree";
import { DatasetBusNetwork } from "@/components/info/about/DatasetBusNetwork";
import { Button } from "@/components/ui/button";
import { Mail, Layers, Brain, Database } from "lucide-react";
import {
    FaGithub,
    FaLinkedin,
    FaFacebook,
    FaInstagram,
} from "react-icons/fa";
import Link from "next/link";
import { motion } from "framer-motion";
import { getDatasetStats } from "@/utils/datasetStats";


export default function AboutPage() {
   // Get dynamic dataset statistics
    const { totalImages, totalClasses } = getDatasetStats();

    const STATS = [
        { icon: Database, label: "Training Images", value: totalImages.toLocaleString() },
        { icon: Layers, label: "Disease Classes", value: totalClasses.toString() },
        { icon: Brain, label: "Crop Categories", value: cropsData.length.toString() },
    ];

    return (
        <main className="min-h-screen px-4 py-12 md:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-14">

                {/* ── Hero section ──────────────────────────────────── */}
                <section className="space-y-8">
                    {/* Label chip */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="inline-flex items-center gap-2 rounded-full border border-[rgba(10,123,74,0.3)] bg-[rgba(10,123,74,0.07)] px-3.5 py-1.5"
                    >
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#0A7B4A]" />
                        <span className="text-xs font-semibold uppercase tracking-widest text-[#0A7B4A]">
                            Deep Learning · Final Project
                        </span>
                    </motion.div>

                    {/* Headline */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: 0.05 }}
                        className="space-y-3"
                    >
                        <h1 className="text-4xl font-extrabold tracking-tight text-[#1A2E1A] md:text-5xl lg:text-6xl">
                            Crop Disease{" "}
                            <span className="relative inline-block">
                                <span className="relative z-10 text-[#0A7B4A]">Detection</span>
                                {/* underline accent */}
                                <span className="absolute -bottom-1 left-0 h-0.75 w-full rounded-full bg-linear-to-r from-[#0A7B4A] to-[#2C5F2D] opacity-60" />
                            </span>
                        </h1>
                        <p className="max-w-2xl text-base text-[#3A4D3A] md:text-lg">
                            A CNN-powered image classification system trained on 56 k+ plant images
                            to identify 134 disease classes across 30 crop types — serving predictions
                            in real-time via a FastAPI backend.
                        </p>
                    </motion.div>

                    {/* Stats row */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.12 }}
                        className="flex flex-wrap gap-3"
                    >
                        {STATS.map(({ icon: Icon, label, value }) => (
                            <div
                                key={label}
                                className="flex items-center gap-3 rounded-2xl border border-[rgba(10,123,74,0.2)] bg-[rgba(245,250,240,0.65)] px-4 py-3 backdrop-blur-md"
                            >
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0A7B4A] shadow-sm shadow-[rgba(10,123,74,0.35)]">
                                    <Icon className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-lg font-extrabold leading-none text-[#1A2E1A]">
                                        {value}
                                    </p>
                                    <p className="mt-0.5 text-xs text-[#3A4D3A]">{label}</p>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </section>

                {/* ── About card ────────────────────────────────────── */}
                <motion.section
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.18 }}
                    className="rounded-3xl border border-[rgba(10,123,74,0.22)] bg-[rgba(245,250,240,0.6)] p-6 shadow-sm backdrop-blur-xl md:p-8"
                >
                    {/* Top accent line */}
                    <div className="mb-6 h-px w-full bg-linear-to-r from-[#0A7B4A]/40 via-[#0A7B4A]/10 to-transparent" />

                    <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-10">
                        {/* Left: info */}
                        <div className="flex-1 space-y-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-widest text-[#0A7B4A]">
                                    Developer
                                </p>
                                <h2 className="mt-1 text-2xl font-bold text-[#1A2E1A]">
                                    Sadiqul Islam Shakib
                                </h2>
                                <p className="text-sm text-[#3A4D3A]">
                                    North East University Bangladesh · Deep Learning Course
                                </p>
                            </div>

                            <p className="text-sm leading-relaxed text-[#3A4D3A]">
                                The model is trained on the{" "}
                                <a
                                    href="https://www.kaggle.com/datasets/akarshangupta/high-quality-crop-disease-image-dataset-for-cnns"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-semibold text-[#0A7B4A] underline underline-offset-2 hover:text-[#2C5F2D] transition-colors"
                                >
                                    High-Quality Crop Disease Image Dataset
                                </a>{" "}
                                from Kaggle. A FastAPI backend serves the trained CNN for
                                real-time inference with per-class confidence scores.
                            </p>
                        </div>

                        {/* Right: social links */}
                        <div className="flex flex-col gap-2 md:w-48">
                            <p className="text-xs font-semibold uppercase tracking-widest text-[#3A4D3A]">
                                Connect
                            </p>
                            {[
                                { href: SOCIAL_LINKS.GITHUB, icon: FaGithub, label: "GitHub" },
                                { href: SOCIAL_LINKS.LINKEDIN, icon: FaLinkedin, label: "LinkedIn" },
                                { href: `mailto:${SOCIAL_LINKS.EMAIL}`, icon: Mail, label: "Email" },
                                { href: SOCIAL_LINKS.FACEBOOK, icon: FaFacebook, label: "Facebook" },
                                { href: SOCIAL_LINKS.INSTAGRAM, icon: FaInstagram, label: "Instagram" },
                            ].map(({ href, icon: Icon, label }) => (
                                <Button
                                    key={label}
                                    asChild
                                    variant="outline"
                                    size="sm"
                                    className="w-full justify-start border-[rgba(10,123,74,0.2)] bg-white/50 hover:bg-[rgba(10,123,74,0.07)] hover:border-[rgba(10,123,74,0.4)] transition-all"
                                >
                                    <Link href={href} target={href.startsWith("mailto") ? undefined : "_blank"}>
                                        <Icon className="mr-2 h-4 w-4 text-[#0A7B4A]" />
                                        <span className="text-[#1A2E1A]">{label}</span>
                                    </Link>
                                </Button>
                            ))}
                        </div>
                    </div>
                </motion.section>

                {/* ── Dataset Explorer ──────────────────────────────── */}
                <section className="space-y-5">
                    <div className="flex items-center gap-3">
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-[#1A2E1A]">
                                Dataset Explorer
                            </h2>
                            <p className="mt-0.5 text-sm text-[#3A4D3A]">
                                Browse all 30 crop categories and their labelled disease classes.
                            </p>
                        </div>
                    </div>

                    {/* Desktop: Tree View */}
                    <div className="hidden lg:block">
                        <DatasetTree crops={cropsData} />
                    </div>
                    {/* Mobile: Bus Network View */}
                    <div className="block lg:hidden">
                        <DatasetBusNetwork crops={cropsData} />
                    </div>
                </section>
            </div>
        </main>
    );
}