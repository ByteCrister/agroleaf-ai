"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Upload,
    Leaf,
    Loader2,
    Image as ImageIcon,
    CheckCircle2,
    Info,
    FileUp,
    Trash2,
    Zap,
    AlertTriangle,
    Microscope,
    FlaskConical,
    ShieldCheck,
    Sprout,
    BarChart3,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { plusJakarta, jetbrainsMono } from "@/fonts/google-fonts";
import { agToast } from "@/components/global/AgroToaster";

// ──────────────────────────────────────────────────────────────────
// Config
// ──────────────────────────────────────────────────────────────────
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/bmp", "image/webp"];
const DIAGNOSE_API_URL = `/api/v2/diagnose`

// ──────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────
interface TopPrediction {
    class: string;
    confidence: number;
}

interface Prediction {
    predicted_class: string;
    confidence: number;
    top3_predictions: TopPrediction[];
}

interface PredictionResponse {
    prediction: Prediction;
    ai_feedback: string;
}

interface ApiError {
    message: string;
    status?: number;
}

// ──────────────────────────────────────────────────────────────────
// Helper: confidence colour ramp
// ──────────────────────────────────────────────────────────────────
function confidenceColor(pct: number): string {
    if (pct >= 85) return "text-[#10B981]";
    if (pct >= 60) return "text-[#F59E0B]";
    return "text-[#EF4444]";
}

function confidenceBarColor(pct: number): string {
    if (pct >= 85) return "bg-[#10B981]";
    if (pct >= 60) return "bg-[#F59E0B]";
    return "bg-[#EF4444]";
}

function confidenceBadge(pct: number): { label: string; classes: string } {
    if (pct >= 85)
        return {
            label: "High Confidence",
            classes:
                "bg-[rgba(16,185,129,0.12)] border-[rgba(16,185,129,0.3)] text-[#065f46] dark:text-[#4ade80]",
        };
    if (pct >= 60)
        return {
            label: "Moderate Confidence",
            classes:
                "bg-[rgba(245,158,11,0.1)] border-[rgba(245,158,11,0.3)] text-[#92400e] dark:text-[#fcd34d]",
        };
    return {
        label: "Low Confidence",
        classes:
            "bg-[rgba(239,68,68,0.1)] border-[rgba(239,68,68,0.25)] text-[#991b1b] dark:text-[#fca5a5]",
    };
}

// ──────────────────────────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────────────────────────
export default function DiagnosePage() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [result, setResult] = useState<PredictionResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [apiError, setApiError] = useState<ApiError | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // ── file handling ──────────────────────────────────────────────
    const resetUpload = useCallback(() => {
        setSelectedFile(null);
        setPreview(null);
        setResult(null);
        setApiError(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }, []);

    const validateFile = (file: File): boolean => {
        if (!ACCEPTED_TYPES.includes(file.type)) {
            agToast.error("Invalid file type", "Please upload JPG, PNG, or BMP images only.");
            return false;
        }
        if (file.size > MAX_FILE_SIZE) {
            agToast.error("File too large", "Maximum file size is 10 MB.");
            return false;
        }
        return true;
    };

    const handleFile = (file: File) => {
        if (!validateFile(file)) return;
        setSelectedFile(file);
        setPreview(URL.createObjectURL(file));
        setResult(null);
        setApiError(null);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(e.type === "dragenter" || e.type === "dragover");
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
    };

    // ── submit ─────────────────────────────────────────────────────
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedFile) {
            agToast.warning("No image selected", "Please upload a leaf image first.");
            return;
        }

        setLoading(true);
        setApiError(null);
        const loadingToast = agToast.loading("Analyzing leaf image…", "AI model is processing your crop photo.");
        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const response = await fetch(DIAGNOSE_API_URL, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                let errorMessage = `Server returned status ${response.status}`;
                try {
                    const errorBody = await response.json() as { error?: string; detail?: string; message?: string };
                    errorMessage = errorBody.error ?? errorBody.detail ?? errorBody.message ?? errorMessage;
                } catch {
                    errorMessage = response.statusText || errorMessage;
                }
                const err: ApiError = { message: errorMessage, status: response.status };
                setApiError(err);
                agToast.error("Prediction failed", err.message);
                return;
            }

            const data = await response.json() as PredictionResponse;
            setResult(data);

            const pct = (data.prediction.confidence * 100).toFixed(1);
            agToast.success("Diagnosis complete!", `Identified: ${data.prediction.predicted_class} with ${pct}% confidence.`);

            if (data.prediction.confidence < 0.6) {
                agToast.warning("Low confidence prediction", "Consider uploading a clearer image for better accuracy.");
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Network error — please check your connection.";
            const apiErr: ApiError = { message };
            setApiError(apiErr);
            agToast.error("Prediction failed", message);
            setResult(null);
        } finally {
            setLoading(false);
            agToast.dismiss(loadingToast);
        }
    };

    const pct = result ? +(result.prediction.confidence * 100).toFixed(1) : 0;
    const badge = confidenceBadge(pct);

    // ──────────────────────────────────────────────────────────────────
    // Render
    // ──────────────────────────────────────────────────────────────────
    return (
        <div
            className={cn(
                plusJakarta.className,
                "min-h-screen py-12 px-4",
                // Light: very pale green wash; Dark: deep forest
                "bg-linear-to-br from-[#f0f7f2] via-[#f8fdf9] to-[#edf5ee]",
                "dark:bg-linear-to-br dark:from-[#060e07] dark:via-[#0a120b] dark:to-[#0d1a0e]",
            )}
        >
            {/* ── Page header ── */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="text-center mb-10 max-w-2xl mx-auto"
            >
                {/* Icon badge */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 14 }}
                    className={cn(
                        "mx-auto mb-5 w-20 h-20 rounded-3xl flex items-center justify-center",
                        "bg-white/80 dark:bg-[rgba(13,26,14,0.8)]",
                        "border border-[rgba(10,123,74,0.2)] dark:border-[rgba(10,123,74,0.3)]",
                        "shadow-[0_8px_32px_rgba(10,123,74,0.15)] dark:shadow-[0_8px_32px_rgba(10,123,74,0.2)]",
                        "backdrop-blur-xl",
                    )}
                >
                    <Leaf className="h-9 w-9 text-[#0A7B4A]" />
                </motion.div>

                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#1A2E1A] dark:text-white">
                    Crop Disease{" "}
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-[#0A7B4A] to-[#10B981]">
                        Diagnosis
                    </span>
                </h1>
                <p className="mt-3 text-[#3A4D3A]/65 dark:text-white/45 text-base leading-relaxed">
                    Upload a clear leaf photo — our Vision Transformer AI identifies the disease,
                    severity, and treatment in under 2 seconds.
                </p>

                {/* Stats strip */}
                <div className="mt-6 inline-flex items-center gap-5 px-5 py-2.5 rounded-2xl bg-white/60 dark:bg-[rgba(13,26,14,0.6)] border border-[rgba(10,123,74,0.15)] dark:border-[rgba(10,123,74,0.25)] backdrop-blur-md text-xs font-semibold text-[#3A4D3A]/60 dark:text-white/40">
                    {[
                        { icon: <Microscope className="h-3.5 w-3.5 text-[#0A7B4A]" />, label: "38 Disease Classes" },
                        { icon: <Sprout className="h-3.5 w-3.5 text-[#10B981]" />, label: "7 Crops" },
                        { icon: <Zap className="h-3.5 w-3.5 text-[#F59E0B]" />, label: "< 2s" },
                    ].map(({ icon, label }) => (
                        <span key={label} className="flex items-center gap-1.5">{icon}{label}</span>
                    ))}
                </div>
            </motion.div>

            {/* ── Main card ── */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-5xl mx-auto"
            >
                <div
                    className={cn(
                        "rounded-3xl overflow-hidden",
                        // Light glass
                        "bg-white/72 backdrop-blur-xl",
                        "border border-[rgba(10,123,74,0.2)]",
                        "shadow-[0_20px_60px_rgba(10,123,74,0.1)]",
                        // Dark glass
                        "dark:bg-[rgba(13,26,14,0.78)] dark:border-[rgba(10,123,74,0.28)]",
                        "dark:shadow-[0_20px_60px_rgba(10,123,74,0.18)]",
                    )}
                >
                    {/* Top accent bar */}
                    <div className="h-1 bg-linear-to-r from-[#0A7B4A] via-[#10B981] to-[#2C5F2D]" />

                    <div className="p-6 md:p-10">
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* ── Drop zone ── */}
                            <div
                                role="button"
                                tabIndex={0}
                                aria-label="Upload crop image"
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                onClick={() => !loading && fileInputRef.current?.click()}
                                onKeyDown={(e) => e.key === "Enter" && !loading && fileInputRef.current?.click()}
                                className={cn(
                                    "relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer outline-none",
                                    "focus-visible:ring-2 focus-visible:ring-[#0A7B4A] focus-visible:ring-offset-2",
                                    dragActive
                                        ? [
                                            "border-[#0A7B4A] scale-[0.995]",
                                            "bg-[rgba(10,123,74,0.06)] dark:bg-[rgba(10,123,74,0.12)]",
                                        ]
                                        : [
                                            "border-[rgba(10,123,74,0.25)] dark:border-[rgba(10,123,74,0.35)]",
                                            "hover:border-[rgba(10,123,74,0.5)] hover:bg-[rgba(10,123,74,0.03)] dark:hover:bg-[rgba(10,123,74,0.08)]",
                                        ],
                                )}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/bmp"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    disabled={loading}
                                />

                                <AnimatePresence mode="wait">
                                    {!preview ? (
                                        /* Empty state */
                                        <motion.div
                                            key="empty"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex flex-col items-center justify-center py-14 px-6 text-center"
                                        >
                                            {/* Animated upload icon ring */}
                                            <div className="relative mb-5">
                                                <div className={cn(
                                                    "w-20 h-20 rounded-2xl flex items-center justify-center",
                                                    "bg-[rgba(10,123,74,0.08)] dark:bg-[rgba(10,123,74,0.16)]",
                                                    "border border-[rgba(10,123,74,0.18)] dark:border-[rgba(10,123,74,0.28)]",
                                                )}>
                                                    <FileUp className="h-9 w-9 text-[#0A7B4A]" />
                                                </div>
                                                {/* Ping ring */}
                                                {dragActive && (
                                                    <span className="absolute inset-0 rounded-2xl border-2 border-[#10B981] animate-ping opacity-40" />
                                                )}
                                            </div>

                                            <p className="text-base font-bold text-[#1A2E1A] dark:text-white">
                                                {dragActive ? "Drop to upload" : "Drag & drop or click to upload"}
                                            </p>
                                            <p className="text-sm text-[#3A4D3A]/55 dark:text-white/35 mt-1.5">
                                                JPG, PNG, or BMP · Max 10 MB
                                            </p>

                                            <div className="mt-6 flex flex-wrap justify-center gap-3 text-xs text-[#3A4D3A]/50 dark:text-white/30">
                                                {["Rice", "Tomato", "Apple", "Wheat", "Corn", "Potato", "Grape"].map((crop) => (
                                                    <span
                                                        key={crop}
                                                        className="px-2.5 py-1 rounded-full bg-[rgba(10,123,74,0.07)] dark:bg-[rgba(10,123,74,0.14)] border border-[rgba(10,123,74,0.15)] dark:border-[rgba(10,123,74,0.22)] font-semibold"
                                                    >
                                                        {crop}
                                                    </span>
                                                ))}
                                            </div>

                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                                                className={cn(
                                                    "mt-7 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold",
                                                    "bg-[#0A7B4A] text-white",
                                                    "shadow-[0_4px_14px_rgba(10,123,74,0.35)] hover:shadow-[0_6px_20px_rgba(10,123,74,0.45)]",
                                                    "hover:bg-[#0d8f55] transition-all duration-200",
                                                )}
                                            >
                                                <Upload className="h-4 w-4" />
                                                Browse files
                                            </button>
                                        </motion.div>
                                    ) : (
                                        /* Preview state */
                                        <motion.div
                                            key="preview"
                                            initial={{ opacity: 0, scale: 0.97 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.97 }}
                                            transition={{ duration: 0.35 }}
                                            className="p-5"
                                        >
                                            {/* Image */}
                                            <div className="relative rounded-xl overflow-hidden bg-[rgba(10,123,74,0.04)] dark:bg-[rgba(10,123,74,0.08)] border border-[rgba(10,123,74,0.12)] dark:border-[rgba(10,123,74,0.2)] flex items-center justify-center min-h-55 max-h-80">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={preview}
                                                    alt="Preview"
                                                    className="object-contain max-h-75 w-auto rounded-lg"
                                                />
                                                {/* Remove button overlay */}
                                                <button
                                                    type="button"
                                                    onClick={(e) => { e.stopPropagation(); resetUpload(); }}
                                                    disabled={loading}
                                                    className={cn(
                                                        "absolute top-3 right-3 p-1.5 rounded-lg",
                                                        "bg-white/90 dark:bg-[rgba(13,26,14,0.9)]",
                                                        "border border-[rgba(239,68,68,0.2)]",
                                                        "text-[#EF4444] hover:bg-red-50 dark:hover:bg-red-950/30",
                                                        "transition-colors shadow-sm",
                                                        "disabled:opacity-40 disabled:cursor-not-allowed",
                                                    )}
                                                    aria-label="Remove image"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>

                                            {/* File meta */}
                                            <div className="flex items-center gap-3 mt-4 px-1">
                                                <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-[rgba(10,123,74,0.1)] dark:bg-[rgba(10,123,74,0.18)] shrink-0">
                                                    <ImageIcon className="h-4 w-4 text-[#0A7B4A]" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-[#1A2E1A] dark:text-white truncate">
                                                        {selectedFile?.name}
                                                    </p>
                                                    <p className={cn(jetbrainsMono.className, "text-xs text-[#3A4D3A]/50 dark:text-white/35 mt-0.5")}>
                                                        {((selectedFile?.size ?? 0) / 1024 / 1024).toFixed(2)} MB · {selectedFile?.type.split("/")[1].toUpperCase()}
                                                    </p>
                                                </div>
                                                <span className="shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full bg-[rgba(16,185,129,0.12)] border border-[rgba(16,185,129,0.25)] text-[#065f46] dark:text-[#4ade80]">
                                                    Ready
                                                </span>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* ── Submit button ── */}
                            <motion.button
                                type="submit"
                                disabled={loading || !selectedFile || result !== null}
                                whileHover={!loading && selectedFile ? { scale: 1.015, y: -1 } : {}}
                                whileTap={!loading && selectedFile ? { scale: 0.98 } : {}}
                                className={cn(
                                    "w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl",
                                    "text-white font-bold text-sm tracking-wide",
                                    "transition-all duration-300",
                                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100",
                                    loading || !selectedFile
                                        ? "bg-[#0A7B4A]/70 shadow-none"
                                        : [
                                            "bg-linear-to-r from-[#0A7B4A] to-[#2C5F2D]",
                                            "shadow-[0_6px_24px_rgba(10,123,74,0.4)]",
                                            "hover:shadow-[0_8px_32px_rgba(10,123,74,0.5)]",
                                        ],
                                )}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        <span>Analyzing leaf…</span>
                                        <span className="ml-1 text-white/60 text-xs font-normal">This may take a moment</span>
                                    </>
                                ) : (
                                    <>
                                        <Zap className="h-5 w-5" />
                                        Analyze Leaf
                                        <span className="ml-1 text-white/55 text-xs font-normal">{"· < 2s"}</span>
                                    </>
                                )}
                            </motion.button>
                        </form>

                        {/* ── API Error Banner ── */}
                        <AnimatePresence>
                            {apiError && (
                                <motion.div
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 8 }}
                                    transition={{ duration: 0.35 }}
                                    className={cn(
                                        "mt-6 flex items-start gap-3 p-4 rounded-2xl",
                                        "bg-[rgba(239,68,68,0.07)] dark:bg-[rgba(239,68,68,0.1)]",
                                        "border border-[rgba(239,68,68,0.2)] dark:border-[rgba(239,68,68,0.25)]",
                                    )}
                                >
                                    <AlertTriangle className="h-5 w-5 text-[#EF4444] shrink-0 mt-0.5" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-[#991b1b] dark:text-[#fca5a5]">
                                            Prediction failed
                                            {apiError.status ? (
                                                <span className={cn(jetbrainsMono.className, " ml-2 text-[10px] font-normal opacity-60")}>
                                                    HTTP {apiError.status}
                                                </span>
                                            ) : null}
                                        </p>
                                        <p className="text-xs text-[#991b1b]/75 dark:text-[#fca5a5]/70 mt-0.5 leading-relaxed">
                                            {apiError.message}
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* ── Results ── */}
                        <AnimatePresence>
                            {result && (
                                <motion.div
                                    initial={{ opacity: 0, y: 24 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -16 }}
                                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                    className="mt-8 space-y-5"
                                >
                                    {/* Divider */}
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 h-px bg-[rgba(10,123,74,0.12)] dark:bg-[rgba(10,123,74,0.2)]" />
                                        <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#0A7B4A]/60 dark:text-[#4ade80]/50">
                                            Diagnosis Results
                                        </span>
                                        <div className="flex-1 h-px bg-[rgba(10,123,74,0.12)] dark:bg-[rgba(10,123,74,0.2)]" />
                                    </div>

                                    {/* Top row: Primary diagnose + confidence badge */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.08 }}
                                        className={cn(
                                            "rounded-2xl p-6",
                                            "bg-[rgba(10,123,74,0.05)] dark:bg-[rgba(10,123,74,0.1)]",
                                            "border border-[rgba(10,123,74,0.18)] dark:border-[rgba(10,123,74,0.28)]",
                                        )}
                                    >
                                        <div className="flex flex-wrap items-start justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center justify-center h-11 w-11 rounded-xl bg-[rgba(10,123,74,0.12)] dark:bg-[rgba(10,123,74,0.22)] shrink-0">
                                                    <CheckCircle2 className="h-5 w-5 text-[#0A7B4A]" />
                                                </div>
                                                <div>
                                                    <p className="text-[11px] font-bold tracking-widest uppercase text-[#0A7B4A]/60 dark:text-[#4ade80]/50">
                                                        Primary Diagnosis
                                                    </p>
                                                    <h2 className="text-2xl md:text-3xl font-extrabold text-[#1A2E1A] dark:text-white tracking-tight mt-0.5">
                                                        {result.prediction.predicted_class}
                                                    </h2>
                                                </div>
                                            </div>

                                            {/* Confidence badge */}
                                            <span className={cn(
                                                "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border",
                                                badge.classes,
                                            )}>
                                                <ShieldCheck className="h-3.5 w-3.5" />
                                                {badge.label}
                                            </span>
                                        </div>

                                        {/* Confidence bar */}
                                        <div className="mt-5">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs font-semibold text-[#3A4D3A]/60 dark:text-white/40">
                                                    Confidence Score
                                                </span>
                                                <span className={cn(jetbrainsMono.className, "text-lg font-bold", confidenceColor(pct))}>
                                                    {pct}%
                                                </span>
                                            </div>
                                            <div className="relative h-2.5 rounded-full bg-[rgba(10,123,74,0.1)] dark:bg-[rgba(10,123,74,0.18)] overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${pct}%` }}
                                                    transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                                                    className={cn("h-full rounded-full", confidenceBarColor(pct))}
                                                />
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Bottom row: Top 3 + AI Advice */}
                                    <div className="grid md:grid-cols-2 gap-5">
                                        {/* Top 3 Predictions */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 16 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.14 }}
                                            className={cn(
                                                "rounded-2xl p-5",
                                                "bg-white/60 dark:bg-[rgba(13,26,14,0.6)]",
                                                "border border-[rgba(10,123,74,0.15)] dark:border-[rgba(10,123,74,0.25)]",
                                                "backdrop-blur-sm",
                                            )}
                                        >
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-[rgba(13,148,136,0.1)] dark:bg-[rgba(13,148,136,0.18)]">
                                                    <BarChart3 className="h-4 w-4 text-[#0D9488]" />
                                                </div>
                                                <h3 className="text-sm font-bold text-[#1A2E1A] dark:text-white">
                                                    Top Possibilities
                                                </h3>
                                            </div>

                                            <ul className="space-y-3.5">
                                                {result.prediction.top3_predictions.map((pred, idx) => {
                                                    const predPct = +(pred.confidence * 100).toFixed(1);
                                                    return (
                                                        <motion.li
                                                            key={pred.class}
                                                            initial={{ opacity: 0, x: -12 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: 0.18 + idx * 0.08 }}
                                                            className="space-y-1.5"
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-2">
                                                                    <span className={cn(
                                                                        jetbrainsMono.className,
                                                                        "text-[10px] font-bold w-5 text-center",
                                                                        idx === 0
                                                                            ? "text-[#0A7B4A] dark:text-[#4ade80]"
                                                                            : "text-[#3A4D3A]/40 dark:text-white/25",
                                                                    )}>
                                                                        #{idx + 1}
                                                                    </span>
                                                                    <span className={cn(
                                                                        "text-xs font-semibold truncate max-w-37.5",
                                                                        idx === 0
                                                                            ? "text-[#1A2E1A] dark:text-white"
                                                                            : "text-[#3A4D3A]/70 dark:text-white/55",
                                                                    )}>
                                                                        {pred.class}
                                                                    </span>
                                                                </div>
                                                                <span className={cn(
                                                                    jetbrainsMono.className,
                                                                    "text-xs font-bold shrink-0",
                                                                    confidenceColor(predPct),
                                                                )}>
                                                                    {predPct}%
                                                                </span>
                                                            </div>
                                                            <div className="relative h-1.5 rounded-full bg-[rgba(10,123,74,0.08)] dark:bg-[rgba(10,123,74,0.14)] overflow-hidden">
                                                                <motion.div
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: `${predPct}%` }}
                                                                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.22 + idx * 0.08 }}
                                                                    className={cn(
                                                                        "h-full rounded-full",
                                                                        idx === 0 ? "bg-[#0A7B4A]" : "bg-[rgba(10,123,74,0.4)]",
                                                                    )}
                                                                />
                                                            </div>
                                                        </motion.li>
                                                    );
                                                })}
                                            </ul>
                                        </motion.div>

                                        {/* AI Agronomic Advice */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 16 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                            className={cn(
                                                "rounded-2xl p-5",
                                                "bg-white/60 dark:bg-[rgba(13,26,14,0.6)]",
                                                "border border-[rgba(13,148,136,0.2)] dark:border-[rgba(13,148,136,0.25)]",
                                                "backdrop-blur-sm",
                                            )}
                                        >
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-[rgba(10,123,74,0.1)] dark:bg-[rgba(10,123,74,0.18)]">
                                                    <FlaskConical className="h-4 w-4 text-[#0A7B4A]" />
                                                </div>
                                                <h3 className="text-sm font-bold text-[#1A2E1A] dark:text-white">
                                                    AI Agronomic Advice
                                                </h3>
                                            </div>
                                            <div className="text-xs leading-relaxed text-[#3A4D3A]/75 dark:text-white/55 prose prose-sm dark:prose-invert max-w-none">
                                                <ReactMarkdown
                                                    components={{
                                                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                                        h3: ({ node: _node, ...props }) => (
                                                            <h3 className="text-sm font-bold mt-3 mb-1" {...props} />
                                                        ),

                                                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                                        strong: ({ node: _node, ...props }) => (
                                                            <strong className="font-extrabold text-[#1A2E1A] dark:text-white" {...props} />
                                                        ),

                                                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                                        ul: ({ node: _node, ...props }) => (
                                                            <ul className="list-disc pl-4 space-y-1" {...props} />
                                                        ),

                                                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                                        li: ({ node: _node, ...props }) => (
                                                            <li className="pl-1" {...props} />
                                                        ),
                                                    }}
                                                >
                                                    {result.ai_feedback}
                                                </ReactMarkdown>
                                            </div>
                                        </motion.div>
                                    </div>

                                    {/* Low-confidence warning */}
                                    {pct < 60 && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.3 }}
                                            className={cn(
                                                "flex items-start gap-3 p-4 rounded-2xl",
                                                "bg-[rgba(245,158,11,0.07)] dark:bg-[rgba(245,158,11,0.1)]",
                                                "border border-[rgba(245,158,11,0.2)] dark:border-[rgba(245,158,11,0.25)]",
                                            )}
                                        >
                                            <AlertTriangle className="h-4.5 w-4.5 text-[#F59E0B] shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-xs font-bold text-[#92400e] dark:text-[#fcd34d]">
                                                    Low confidence — consider a clearer photo
                                                </p>
                                                <p className="text-xs text-[#92400e]/70 dark:text-[#fcd34d]/60 mt-0.5">
                                                    Ensure the affected area is well-lit, in focus, and fills the frame.
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Reset CTA */}
                                    <div className="flex justify-center pt-2">
                                        <motion.button
                                            type="button"
                                            onClick={resetUpload}
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            className={cn(
                                                "inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold",
                                                "text-[#0A7B4A] dark:text-[#4ade80]",
                                                "border border-[rgba(10,123,74,0.25)] dark:border-[rgba(10,123,74,0.35)]",
                                                "bg-white/60 dark:bg-[rgba(13,26,14,0.6)]",
                                                "hover:bg-[rgba(10,123,74,0.06)] dark:hover:bg-[rgba(10,123,74,0.14)]",
                                                "backdrop-blur-sm transition-all duration-200",
                                            )}
                                        >
                                            <Upload className="h-4 w-4" />
                                            Analyze Another Leaf
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>

            {/* ── Footer note ── */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center mt-8 text-xs text-[#3A4D3A]/40 dark:text-white/25"
            >
                <Info className="inline h-3 w-3 mr-1 align-middle" />
                Supports Rice, Apple, Tomato, Grape, Wheat, Corn & Potato · Results are AI-generated and should be verified by an agronomist.
            </motion.p>
        </div>
    );
}