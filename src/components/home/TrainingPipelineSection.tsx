"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
    Database,
    ImageOff,
    Shuffle,
    Cpu,
    FlaskConical,
    Upload,
    BarChart3,
    Layers,
    TrendingUp,
    Shield,
    CheckCircle2,
    ChevronRight,
    Leaf,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS  (Bangladesh Green Glassmorphism — CLAUDE.md)
// ─────────────────────────────────────────────────────────────────────────────
const T = {
    primary: "#0A7B4A",
    primaryDark: "#2C5F2D",
    primaryLight: "#E1F5EE",
    glassBg: "rgba(245, 250, 240, 0.62)",
    glassBgHover: "rgba(245, 250, 240, 0.84)",
    glassBorder: "rgba(10, 123, 74, 0.20)",
    glassBorderAct: "rgba(10, 123, 74, 0.52)",
    glassHighlight: "rgba(255, 255, 255, 0.55)",
    textPrimary: "#1A2E1A",
    textSecondary: "#3A4D3A",
    textMuted: "#5A6E5A",
    textOnGreen: "#FFFFFF",
    success: "#10B981",
    info: "#0D9488",
    pageBg: "#EEF7EE",
    shadowSm: "0 4px 12px rgba(10,123,74,0.07)",
    shadowMd: "0 8px 24px rgba(10,123,74,0.10)",
    shadowLg: "0 16px 40px rgba(10,123,74,0.14)",
} as const;

const glassCard: React.CSSProperties = {
    background: T.glassBg,
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: `1px solid ${T.glassBorder}`,
    borderRadius: 24,
    boxShadow: T.shadowMd,
};

// ─────────────────────────────────────────────────────────────────────────────
// DATA — each step maps to the actual AgroLeafAI v10 training script
// ─────────────────────────────────────────────────────────────────────────────
const STEPS = [
    {
        id: 1,
        icon: Database,
        label: "Data Collection",
        shortLabel: "Collect",
        accentColor: "#0A7B4A",
        bgTint: "#E1F5EE",
        badge: "63,935 images",
        stats: [
            { label: "Total Images", value: "63,935" },
            { label: "Classes", value: "120" },
            { label: "Crops", value: "30" },
        ],
        detail:
            "Multi-source image dataset aggregated from Bangladeshi and South-Asian agriculture, covering 30 crops with diverse lighting, angles, and disease progression stages.",
        bullets: [
            "120 disease + healthy categories across leaves, fruits, and vegetables",
            "Class sizes range from 22 images (Soybean mosaic virus) to 1,395 (Wheat Yellow Rust)",
            "Stratified labeling: healthy, diseased, rotten, and leaf-specific variants",
            "Crops include Rice, Wheat, Tomato, Corn, Cucumber, Potato, Cassava and more",
        ],
    },
    {
        id: 2,
        icon: ImageOff,
        label: "Preprocessing & Cleaning",
        shortLabel: "Clean",
        accentColor: "#0D9488",
        bgTint: "#CCFBF1",
        badge: "Zero duplicates",
        stats: [
            { label: "Hash Method", value: "SHA-1" },
            { label: "Target Size", value: "224×224" },
            { label: "Corrupt Files", value: "Auto-skip" },
        ],
        detail:
            "SHA-1 fingerprinting on the first 64 KB of every image eliminates exact duplicates. Corrupt or truncated files are silently dropped. Class names are normalised to merge spelling variants.",
        bullets: [
            "SHA-1 deduplication (first 64 KB) ensures no pixel-identical images cross the train/val/test boundary",
            "PIL UnidentifiedImageError and truncated-image warnings handled automatically",
            "Class name normalisation: lowercase, strip special chars, merge e.g. 'Healthy' ↔ 'healthy_Leaf'",
            "All images resized to 224×224 px matching ConvNeXt-Base pretraining resolution",
        ],
    },
    {
        id: 3,
        icon: Shuffle,
        label: "Splitting & Augmentation",
        shortLabel: "Augment",
        accentColor: "#7C3AED",
        bgTint: "#EDE9FE",
        badge: "Stratified split",
        stats: [
            { label: "Train", value: "72 %" },
            { label: "Val", value: "18 %" },
            { label: "Test", value: "10 %" },
        ],
        detail:
            "Stratified 10 % hold-out test set is frozen first. The remaining 90 % is split 80/20 for training and validation, then heavy per-class augmentation is applied to minority classes.",
        bullets: [
            "10 % stratified hold-out test — never used for training or model selection",
            "WeightedRandomSampler balances over-represented vs rare classes per batch",
            "RandAugment (magnitude 9, 2 ops) global; heavy aug only for classes < 200 samples",
            "CutMix (α=0.8, p=0.2) + MixUp (α=0.6, p=0.2) activated from epoch 5 onward",
            "Random Erasing (p=0.2, 2–10% area) adds occlusion robustness",
        ],
    },
    {
        id: 4,
        icon: Cpu,
        label: "Model Training",
        shortLabel: "Train",
        accentColor: "#D97706",
        bgTint: "#FEF3C7",
        badge: "ConvNeXt-Base",
        stats: [
            { label: "Architecture", value: "ConvNeXt-B" },
            { label: "Max Epochs", value: "50" },
            { label: "Batch × GA", value: "32 × 2" },
        ],
        detail:
            "ConvNeXt-Base fine-tuned with split learning rates — backbone at 1e-5, classification head at 1e-3. Focal loss combats class imbalance; mixed-precision AMP speeds up GPU training.",
        bullets: [
            "Backbone LR 1e-5 · Head LR 1e-3 · Weight decay 0.02 (AdamW)",
            "Focal loss (γ=2.0) + CrossEntropy with label smoothing ε=0.1",
            "2-epoch linear warmup → CosineAnnealingLR for stable convergence",
            "AMP + GradScaler for mixed-precision; gradient clip at norm 1.0",
            "Dropout 0.4 on classification head; early stopping patience = 10 epochs on val macro-F1",
        ],
        extras: [
            { label: "Backbone convergence (val macro-F1)", value: 89, color: "#D97706" },
            { label: "Classification head accuracy", value: 93, color: "#0A7B4A" },
            { label: "Minority class F1 coverage", value: 76, color: "#0D9488" },
            { label: "Augmentation effectiveness", value: 84, color: "#7C3AED" },
        ],
    },
    {
        id: 5,
        icon: FlaskConical,
        label: "Validation & Testing",
        shortLabel: "Validate",
        accentColor: "#DC2626",
        bgTint: "#FEE2E2",
        badge: "Hold-out test",
        stats: [
            { label: "Primary Metric", value: "Macro-F1" },
            { label: "Test Images", value: "~6,394" },
            { label: "Report Format", value: "4-digit" },
        ],
        detail:
            "Val macro-F1 is the sole checkpoint metric — rewards balanced performance across all 120 classes. The held-out test set is evaluated once, after training completes.",
        bullets: [
            "Val macro-F1 saves best checkpoint — class-balanced scoring prevents majority-class gaming",
            "Hold-out test set evaluated exactly once after best model is reloaded",
            "sklearn classification_report (precision/recall/F1) exported to .txt for all classes",
            "Per-class F1 + sample count saved to test_per_class_f1.json for fine-grained analysis",
            "Temperature scaling (optimal_temp) calibrates real-world confidence — stored in temperature.json",
        ],
    },
    {
        id: 6,
        icon: Upload,
        label: "Export & Deployment",
        shortLabel: "Deploy",
        accentColor: "#0A7B4A",
        bgTint: "#E1F5EE",
        badge: "ONNX ready",
        stats: [
            { label: "Formats", value: "PT + ONNX" },
            { label: "Platform", value: "Kaggle" },
            { label: "Upload", value: "Automated" },
        ],
        detail:
            "Best model weights and all evaluation artifacts are bundled and uploaded to Kaggle automatically via kagglehub. ONNX export with onnxsim simplification enables cross-platform inference.",
        bullets: [
            "best_model_224.pt saved as raw PyTorch state dict (no EMA, raw model for transparency)",
            "ONNX export + onnxsim simplification for deployment on CPU/edge inference runtimes",
            "Test dataset zipped as test_dataset.zip and bundled for reproducibility",
            "Automated Kaggle upload with accuracy + F1 embedded in version notes",
            "Artifacts: weights, class_names.json, training_log.json, calibration temp, reports",
        ],
    },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATED PROGRESS BAR (for step 4 training metrics)
// ─────────────────────────────────────────────────────────────────────────────
function AnimatedBar({
    label,
    value,
    color,
    delay,
}: {
    label: string;
    value: number;
    color: string;
    delay: number;
}) {
    const [width, setWidth] = useState(0);
    useEffect(() => {
        const t = setTimeout(() => setWidth(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);

    return (
        <div className="space-y-1.5">
            <div
                className="flex justify-between items-center text-xs"
                style={{ fontFamily: "var(--font-plus-jakarta)" }}
            >
                <span style={{ color: T.textMuted }}>{label}</span>
                <span
                    style={{
                        color,
                        fontFamily: "var(--font-jetbrains-mono)",
                        fontWeight: 600,
                    }}
                >
                    {width}%
                </span>
            </div>
            <div
                className="h-1.5 rounded-full overflow-hidden"
                style={{ background: `${color}20` }}
            >
                <motion.div
                    className="h-full rounded-full"
                    style={{ background: color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${width}%` }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: delay / 1000 }}
                />
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP NAVIGATOR
// ─────────────────────────────────────────────────────────────────────────────
function StepNav({
    steps,
    active,
    onSelect,
}: {
    steps: typeof STEPS;
    active: number;
    onSelect: (i: number) => void;
}) {
    return (
        <div className="flex items-center justify-center gap-0 w-full mb-10">
            {steps.map((step, idx) => {
                const Icon = step.icon;
                const isActive = idx === active;
                const isDone = idx < active;

                return (
                    <div key={step.id} className="flex items-center">
                        <button
                            onClick={() => onSelect(idx)}
                            className="flex flex-col items-center gap-1.5 focus:outline-none"
                            aria-label={step.label}
                        >
                            <motion.div
                                animate={{
                                    backgroundColor: isActive
                                        ? step.accentColor
                                        : isDone
                                            ? T.primary
                                            : "rgba(255,255,255,0.85)",
                                    borderColor: isActive
                                        ? step.accentColor
                                        : isDone
                                            ? T.primary
                                            : T.glassBorder,
                                    scale: isActive ? 1.18 : 1,
                                    boxShadow: isActive
                                        ? `0 0 0 4px ${step.accentColor}25, 0 6px 18px ${step.accentColor}35`
                                        : "none",
                                }}
                                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                                className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center"
                                style={{
                                    border: "2px solid",
                                    backdropFilter: "blur(8px)",
                                    WebkitBackdropFilter: "blur(8px)",
                                }}
                            >
                                {isDone ? (
                                    <CheckCircle2 size={18} style={{ color: "#fff" }} />
                                ) : (
                                    <Icon
                                        size={18}
                                        style={{
                                            color: isActive ? "#fff" : T.textMuted,
                                        }}
                                    />
                                )}
                            </motion.div>
                            <span
                                className="hidden sm:block text-[10px] font-bold"
                                style={{
                                    color: isActive ? step.accentColor : isDone ? T.primary : T.textMuted,
                                    fontFamily: "var(--font-plus-jakarta)",
                                    letterSpacing: "0.03em",
                                }}
                            >
                                {step.shortLabel}
                            </span>
                        </button>

                        {/* Connector */}
                        {idx < steps.length - 1 && (
                            <div className="relative w-6 md:w-10 lg:w-14 h-0.5 mx-1 md:mx-2">
                                <div
                                    className="absolute inset-0 rounded-full"
                                    style={{ background: T.glassBorder }}
                                />
                                <motion.div
                                    className="absolute inset-0 rounded-full origin-left"
                                    animate={{ scaleX: idx < active ? 1 : 0 }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                    style={{ background: T.primary }}
                                />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export default function TrainingPipelineSection() {
    const [activeStep, setActiveStep] = useState(0);
    const sectionRef = useRef<HTMLDivElement>(null);
    const inView = useInView(sectionRef, { once: true, margin: "-100px" });

    const step = STEPS[activeStep];
    const Icon = step.icon;

    // Auto-advance through steps once section enters view
    useEffect(() => {
        if (!inView) return;
        let idx = 0;
        const iv = setInterval(() => {
            idx++;
            if (idx >= STEPS.length) return clearInterval(iv);
            setActiveStep(idx);
        }, 1700);
        return () => clearInterval(iv);
    }, [inView]);

    const goTo = (i: number) => setActiveStep(i);

    return (
        <section
            ref={sectionRef}
            className="relative w-full py-24 px-4 md:px-8 overflow-hidden"
            style={{ background: T.pageBg, fontFamily: "var(--font-plus-jakarta)" }}
        >
            {/* ── Decorative background ── */}
            <div
                className="pointer-events-none absolute inset-0 overflow-hidden"
                aria-hidden="true"
            >
                {/* top-left glow */}
                <div
                    className="absolute -top-40 -left-40 w-[560px] h-[560px] rounded-full"
                    style={{
                        background: `radial-gradient(circle, ${T.primary}30 0%, transparent 65%)`,
                    }}
                />
                {/* bottom-right glow */}
                <div
                    className="absolute -bottom-48 -right-32 w-[500px] h-[500px] rounded-full"
                    style={{
                        background: `radial-gradient(circle, ${T.info}22 0%, transparent 65%)`,
                    }}
                />
                {/* subtle dot grid */}
                <svg
                    className="absolute inset-0 w-full h-full opacity-[0.045]"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                >
                    <defs>
                        <pattern id="dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
                            <circle cx="1.5" cy="1.5" r="1.5" fill={T.primary} />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#dots)" />
                </svg>
            </div>

            <div className="relative max-w-5xl mx-auto">

                {/* ── Section header ── */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="text-center mb-14"
                >
                    {/* pill badge */}
                    <div
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-6"
                        style={{
                            background: T.primaryLight,
                            color: T.primary,
                            border: `1px solid ${T.glassBorder}`,
                        }}
                    >
                        <Leaf size={14} />
                        AgroLeafAI v10 · ConvNeXt-Base · 120 Classes
                    </div>

                    <h2
                        className="text-3xl md:text-[2.9rem] font-extrabold tracking-tight leading-tight mb-4"
                        style={{ color: T.textPrimary }}
                    >
                        How AgroLeafAI{" "}
                        <span
                            style={{
                                background: `linear-gradient(120deg, ${T.primary} 10%, ${T.info} 90%)`,
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            Learns to See Disease
                        </span>
                    </h2>

                    <p
                        className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
                        style={{ color: T.textSecondary }}
                    >
                        From 63,935 raw field photographs to a production-ready ONNX model —
                        every stage of the training pipeline, built to identify 120 crop disease
                        classes across 30 crops.
                    </p>
                </motion.div>

                {/* ── Step navigator ── */}
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.65, delay: 0.2 }}
                >
                    <StepNav steps={STEPS} active={activeStep} onSelect={goTo} />
                </motion.div>

                {/* ── Main animated card ── */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step.id}
                        initial={{ opacity: 0, y: 22, scale: 0.975 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -18, scale: 0.975 }}
                        transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
                        style={glassCard}
                        className="p-6 md:p-10"
                    >
                        {/* Card header row */}
                        <div className="flex flex-col sm:flex-row sm:items-start gap-5 mb-8">
                            {/* Step icon */}
                            <div
                                className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                                style={{
                                    background: step.bgTint,
                                    border: `1.5px solid ${step.accentColor}30`,
                                }}
                            >
                                <Icon size={26} style={{ color: step.accentColor }} />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <span
                                        className="text-[11px] font-bold uppercase tracking-widest"
                                        style={{ color: step.accentColor }}
                                    >
                                        Step {step.id} / {STEPS.length}
                                    </span>
                                    <span
                                        className="text-[11px] px-3 py-0.5 rounded-full font-semibold"
                                        style={{
                                            background: `${step.accentColor}15`,
                                            color: step.accentColor,
                                            border: `1px solid ${step.accentColor}28`,
                                        }}
                                    >
                                        {step.badge}
                                    </span>
                                </div>

                                <h3
                                    className="text-xl md:text-2xl font-bold mb-2"
                                    style={{ color: T.textPrimary }}
                                >
                                    {step.label}
                                </h3>

                                <p
                                    className="text-sm leading-relaxed"
                                    style={{ color: T.textMuted }}
                                >
                                    {step.detail}
                                </p>
                            </div>
                        </div>

                        {/* Stat pills */}
                        <div className="flex flex-wrap gap-3 mb-8">
                            {step.stats.map((s) => (
                                <div
                                    key={s.label}
                                    className="flex flex-col items-center px-4 py-2.5 rounded-2xl"
                                    style={{
                                        background: "rgba(255,255,255,0.75)",
                                        border: `1px solid ${T.glassBorder}`,
                                        backdropFilter: "blur(8px)",
                                        WebkitBackdropFilter: "blur(8px)",
                                        minWidth: 82,
                                    }}
                                >
                                    <span
                                        className="text-base md:text-lg font-bold"
                                        style={{ color: T.textPrimary, fontFamily: "var(--font-jetbrains-mono)" }}
                                    >
                                        {s.value}
                                    </span>
                                    <span className="text-[10px] mt-0.5 font-medium" style={{ color: T.textMuted }}>
                                        {s.label}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Training-step progress bars */}
                        {"extras" in step && step.extras && (
                            <div
                                className="mb-8 p-5 rounded-2xl space-y-3.5"
                                style={{
                                    background: "rgba(255,255,255,0.60)",
                                    border: `1px solid ${T.glassBorder}`,
                                    borderRadius: 16,
                                }}
                            >
                                <p
                                    className="text-[10px] font-bold uppercase tracking-widest mb-4"
                                    style={{ color: T.textMuted }}
                                >
                                    Training metrics (simulated)
                                </p>
                                {step.extras.map((e, i) => (
                                    <AnimatedBar
                                        key={e.label}
                                        label={e.label}
                                        value={e.value}
                                        color={e.color}
                                        delay={120 + i * 200}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Bullet list */}
                        <ul className="space-y-3">
                            {step.bullets.map((b, i) => (
                                <motion.li
                                    key={i}
                                    initial={{ opacity: 0, x: -12 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.07, duration: 0.32 }}
                                    className="flex items-start gap-3 text-sm leading-relaxed"
                                    style={{ color: T.textSecondary }}
                                >
                                    <div
                                        className="mt-[7px] shrink-0 w-[6px] h-[6px] rounded-full"
                                        style={{ background: step.accentColor }}
                                    />
                                    {b}
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                </AnimatePresence>

                {/* ── Navigation row ── */}
                <div className="flex items-center justify-between mt-6 gap-4">
                    <button
                        onClick={() => goTo(Math.max(0, activeStep - 1))}
                        disabled={activeStep === 0}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed select-none"
                        style={{
                            background: "rgba(255,255,255,0.82)",
                            border: `1px solid ${T.glassBorder}`,
                            color: T.textSecondary,
                            backdropFilter: "blur(8px)",
                            WebkitBackdropFilter: "blur(8px)",
                        }}
                    >
                        <ChevronRight size={16} style={{ transform: "rotate(180deg)" }} />
                        Previous
                    </button>

                    {/* Dot pills */}
                    <div className="flex gap-2">
                        {STEPS.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => goTo(i)}
                                aria-label={`Go to step ${i + 1}`}
                                className="rounded-full transition-all duration-300"
                                style={{
                                    height: 8,
                                    width: i === activeStep ? 22 : 8,
                                    background:
                                        i === activeStep
                                            ? step.accentColor
                                            : i < activeStep
                                                ? `${T.primary}55`
                                                : T.glassBorder,
                                }}
                            />
                        ))}
                    </div>

                    <button
                        onClick={() => goTo(Math.min(STEPS.length - 1, activeStep + 1))}
                        disabled={activeStep === STEPS.length - 1}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed select-none"
                        style={{
                            background: step.accentColor,
                            border: `1px solid ${step.accentColor}`,
                            color: "#fff",
                            boxShadow: `0 4px 16px ${step.accentColor}40`,
                        }}
                    >
                        Next
                        <ChevronRight size={16} />
                    </button>
                </div>

                {/* ── Summary metric grid ── */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.65, delay: 0.6 }}
                    className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                    {[
                        {
                            Icon: BarChart3,
                            label: "Dataset Size",
                            value: "63,935",
                            sub: "labeled images",
                            color: T.primary,
                        },
                        {
                            Icon: Layers,
                            label: "Disease Classes",
                            value: "120",
                            sub: "across 30 crops",
                            color: T.info,
                        },
                        {
                            Icon: TrendingUp,
                            label: "Architecture",
                            value: "ConvNeXt-B",
                            sub: "224 × 224 px",
                            color: "#7C3AED",
                        },
                        {
                            Icon: Shield,
                            label: "Hold-out Test",
                            value: "10 %",
                            sub: "never seen in training",
                            color: "#D97706",
                        },
                    ].map((m, i) => (
                        <motion.div
                            key={m.label}
                            initial={{ opacity: 0, y: 16 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.65 + i * 0.1, duration: 0.42 }}
                            style={{
                                ...glassCard,
                                borderRadius: 18,
                                padding: "22px 18px",
                            }}
                            className="flex flex-col gap-2"
                        >
                            <div
                                className="w-8 h-8 rounded-xl flex items-center justify-center mb-1"
                                style={{ background: `${m.color}18` }}
                            >
                                <m.Icon size={16} style={{ color: m.color }} />
                            </div>

                            <p
                                className="text-2xl font-extrabold"
                                style={{
                                    color: T.textPrimary,
                                    fontFamily: "var(--font-plus-jakarta)",
                                }}
                            >
                                {m.value}
                            </p>
                            <p
                                className="text-xs font-bold"
                                style={{ color: m.color }}
                            >
                                {m.label}
                            </p>
                            <p
                                className="text-xs leading-snug"
                                style={{ color: T.textMuted }}
                            >
                                {m.sub}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}