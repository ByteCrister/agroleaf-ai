"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useAnimation,
  useInView,
  Variants,
  type Easing,
} from "framer-motion";
import {
  Camera,
  ArrowRight,
  CheckCircle2,
  Database,
  Layers,
  Cpu,
  BarChart3,
  FlaskConical,
  Zap,
  ShieldCheck,
  TrendingUp,
  ImageIcon,
  Filter,
  Shuffle,
  Brain,
  Target,
  Award,
  ChevronDown,
  Hash,
  Activity,
  Package,
  Microscope,
  GitBranch,
  Clock,
  Gauge,
} from "lucide-react";
import { plusJakarta, jetbrainsMono } from "@/fonts/google-fonts";
import { BannerCarousel } from "./BannerCarousel";
import TrainingPipelineSection from "./TrainingPipelineSection";

// ──────────────────────────────────────────────────────────────────
// Animation helpers
// ──────────────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as Easing, delay },
});

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.09, delayChildren: 0.15 },
  },
};
const staggerItem: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

// ──────────────────────────────────────────────────────────────────
// Animated Counter Hook
// ──────────────────────────────────────────────────────────────────
function useCounter(target: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

// ──────────────────────────────────────────────────────────────────
// Model Stats Data (from training script)
// ──────────────────────────────────────────────────────────────────
const MODEL_STATS = [
  { value: 120, suffix: "", label: "Plant Disease Classes", icon: Hash, color: "#0A7B4A" },
  { value: 61, suffix: "K+", label: "Training Images", icon: ImageIcon, color: "#2C5F2D" },
  { value: 40, suffix: "", label: "Training Epochs", icon: Activity, color: "#10B981" },
  { value: 224, suffix: "px", label: "Input Resolution", icon: Gauge, color: "#0D9488" },
];

const ACCURACY_METRICS = [
  { label: "Val Accuracy", value: "95.4%", sub: "Weighted F1: 0.954", color: "#0A7B4A" },
  { label: "Test Accuracy", value: "93.8%", sub: "Macro F1: 0.934", color: "#2C5F2D" },
  { label: "Hold-out Test", value: "6,100+", sub: "Never seen by model", color: "#10B981" },
  { label: "Model Size", value: "~360MB", sub: "ConvNext-Base 224", color: "#0D9488" },
];

// Pipeline steps derived from training script
const PIPELINE_STEPS = [
  {
    phase: "01",
    icon: Database,
    title: "Dataset Collection",
    subtitle: "AgroLeafAI v3",
    color: "#0A7B4A",
    bg: "rgba(10,123,74,0.08)",
    border: "rgba(10,123,74,0.2)",
    details: [
      { label: "Raw Classes", value: "120+" },
      { label: "Total Images", value: "~61,000" },
      { label: "File Formats", value: "JPG, PNG, WebP" },
      { label: "Source", value: "Kaggle Curated" },
    ],
    description:
      "A diverse, real-world dataset collected across 24 crop types, covering both leaf conditions and fruit quality — including healthy, diseased, and rotten samples.",
  },
  {
    phase: "02",
    icon: Filter,
    title: "Data Cleaning",
    subtitle: "Deduplication & Merge",
    color: "#2C5F2D",
    bg: "rgba(44,95,45,0.08)",
    border: "rgba(44,95,45,0.2)",
    details: [
      { label: "Dedup Strategy", value: "SHA-1 hash (65KB)" },
      { label: "Name Normalise", value: "Regex lowercase" },
      { label: "Min Samples", value: "5 per class" },
      { label: "Invalid Images", value: "Auto-skipped" },
    ],
    description:
      "Exact duplicate images are removed via SHA-1 hashing. Class names are normalised and merged. Classes with fewer than 5 samples are forced to train-only.",
  },
  {
    phase: "03",
    icon: GitBranch,
    title: "Three-Way Split",
    subtitle: "Stratified Sampling",
    color: "#0D9488",
    bg: "rgba(13,148,136,0.08)",
    border: "rgba(13,148,136,0.2)",
    details: [
      { label: "Hold-out Test", value: "10%" },
      { label: "Validation", value: "20% of 90%" },
      { label: "Train Set", value: "~72%" },
      { label: "Stratified", value: "Yes (per class)" },
    ],
    description:
      "A hard hold-out test set (10%) is carved out before any training. The remaining 90% is split into train/val. The model never touches the test set during training.",
  },
  {
    phase: "04",
    icon: Shuffle,
    title: "Augmentation",
    subtitle: "RandAugment + CutMix",
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.2)",
    details: [
      { label: "RandAugment", value: "9 magnitude, 2 ops" },
      { label: "CutMix", value: "α=0.8, p=0.2" },
      { label: "MixUp", value: "α=0.6, p=0.2" },
      { label: "Random Erase", value: "p=0.2, scale 2–10%" },
    ],
    description:
      "Strong pre-resize augmentation (flip, rotation ±30°, colour jitter) is applied to all training images. CutMix and MixUp begin at epoch 5 to prevent over-regularisation.",
  },
  {
    phase: "05",
    icon: Brain,
    title: "Model Architecture",
    subtitle: "ConvNext-Base 224",
    color: "#0A7B4A",
    bg: "rgba(10,123,74,0.08)",
    border: "rgba(10,123,74,0.2)",
    details: [
      { label: "Backbone", value: "facebook/convnext-base-224" },
      { label: "Custom Head", value: "LayerNorm → Dropout → Linear(512) → GELU → Linear(120)" },
      { label: "Dropout", value: "0.4 backbone / 0.2 head" },
      { label: "Parameters", value: "~89M total" },
    ],
    description:
      "Pretrained ConvNext-Base with a two-layer MLP classification head. The entire backbone is fine-tuned with a differential learning rate: 1e-5 for backbone, 1e-3 for the head.",
  },
  {
    phase: "06",
    icon: Zap,
    title: "Training Strategy",
    subtitle: "Focal Loss + AdamW",
    color: "#2C5F2D",
    bg: "rgba(44,95,45,0.08)",
    border: "rgba(44,95,45,0.2)",
    details: [
      { label: "Loss", value: "Focal (γ=2.0) + Label Smoothing 0.1" },
      { label: "Optimiser", value: "AdamW, WD=0.02" },
      { label: "Scheduler", value: "Warmup (2 ep) → Cosine" },
      { label: "Grad Accum", value: "2 steps, clip=1.0" },
    ],
    description:
      "Focal Loss down-weights easy examples; class weights are √(N/nₖ) to handle imbalance. A 2-epoch linear warmup is followed by cosine annealing to η_min=1e-7.",
  },
  {
    phase: "07",
    icon: Target,
    title: "Evaluation",
    subtitle: "Weighted & Macro F1",
    color: "#0D9488",
    bg: "rgba(13,148,136,0.08)",
    border: "rgba(13,148,136,0.2)",
    details: [
      { label: "Primary Metric", value: "Val Macro-F1" },
      { label: "Early Stop", value: "Patience = 7 epochs" },
      { label: "Best Checkpoint", value: "Macro-F1 peak" },
      { label: "Reports", value: "Val + Test classification" },
    ],
    description:
      "Model is checkpointed whenever val macro-F1 improves. Early stopping triggers after 7 epochs without improvement. Final evaluation runs on the held-out test set.",
  },
  {
    phase: "08",
    icon: Microscope,
    title: "Temperature Calibration",
    subtitle: "LBFGS Optimisation",
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.2)",
    details: [
      { label: "Method", value: "Temperature Scaling" },
      { label: "Optimiser", value: "LBFGS (50 iter)" },
      { label: "Data", value: "Validation logits" },
      { label: "Output", value: "temperature.json" },
    ],
    description:
      "Post-training temperature scaling calibrates model confidence on real-world inputs. The optimal temperature T* is learned on validation logits using LBFGS.",
  },
  {
    phase: "09",
    icon: Package,
    title: "ONNX Export",
    subtitle: "Simplified & Runtime-ready",
    color: "#0A7B4A",
    bg: "rgba(10,123,74,0.08)",
    border: "rgba(10,123,74,0.2)",
    details: [
      { label: "Opset", value: "18" },
      { label: "Simplification", value: "onnxsim" },
      { label: "Input", value: "pixel_values [B,3,224,224]" },
      { label: "Smoke Test", value: "ONNX Runtime CPU" },
    ],
    description:
      "The final model is exported to ONNX (opset 18) with dynamic batch size, simplified via onnxsim, and smoke-tested with ONNX Runtime before Kaggle upload.",
  },
];

// Data cleaning insight cards
const DATASET_INSIGHTS = [
  {
    icon: ImageIcon,
    label: "Image Sources",
    value: "24 crop types",
    sub: "Leaves, fruits, vegetables",
    color: "#0A7B4A",
  },
  {
    icon: Hash,
    label: "Disease Classes",
    value: "120 total",
    sub: "After normalisation & merge",
    color: "#2C5F2D",
  },
  {
    icon: ShieldCheck,
    label: "Data Integrity",
    value: "SHA-1 dedup",
    sub: "Exact duplicates removed",
    color: "#10B981",
  },
  {
    icon: TrendingUp,
    label: "Class Balance",
    value: "√(N/nₖ) weights",
    sub: "Imbalance handled via sampling",
    color: "#0D9488",
  },
  {
    icon: Clock,
    label: "Augmentation",
    value: "6 strategies",
    sub: "Flip, rotate, jitter, erase, mix",
    color: "#F59E0B",
  },
  {
    icon: FlaskConical,
    label: "Test Isolation",
    value: "10% held-out",
    sub: "Never seen during training",
    color: "#0A7B4A",
  },
];

// Class distribution by crop group
const CROP_GROUPS = [
  { crop: "Tomato", classes: 12, healthy: 2, diseased: 10, bar: 100 },
  { crop: "Soybean", classes: 9, healthy: 1, diseased: 8, bar: 75 },
  { crop: "Rice", classes: 5, healthy: 1, diseased: 4, bar: 42 },
  { crop: "Cucumber", classes: 8, healthy: 2, diseased: 6, bar: 67 },
  { crop: "Sugarcane", classes: 5, healthy: 1, diseased: 4, bar: 42 },
  { crop: "Cassava", classes: 5, healthy: 1, diseased: 4, bar: 42 },
  { crop: "Chili", classes: 5, healthy: 1, diseased: 4, bar: 42 },
  { crop: "Coffee", classes: 4, healthy: 1, diseased: 3, bar: 33 },
  { crop: "Wheat", classes: 4, healthy: 1, diseased: 3, bar: 33 },
  { crop: "Grape", classes: 6, healthy: 2, diseased: 4, bar: 50 },
  { crop: "Corn", classes: 4, healthy: 1, diseased: 3, bar: 33 },
  { crop: "Tea", classes: 6, healthy: 1, diseased: 5, bar: 50 },
];

// ──────────────────────────────────────────────────────────────────
// StatCounter component
// ──────────────────────────────────────────────────────────────────
function StatCounter({
  value,
  suffix,
  label,
  icon: Icon,
  color,
  delay,
}: {
  value: number;
  suffix: string;
  label: string;
  icon: React.ElementType;
  color: string;
  delay: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const count = useCounter(value, 1600, inView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.55 }}
      className="glass-card rounded-2xl px-5 py-6 flex flex-col items-center text-center gap-3 group hover:shadow-[0_12px_32px_rgba(10,123,74,0.12)] transition-all duration-300"
    >
      <div
        className="flex items-center justify-center h-12 w-12 rounded-2xl transition-colors duration-300 group-hover:scale-110"
        style={{ background: `${color}18` }}
      >
        <Icon className="h-5 w-5" style={{ color }} />
      </div>
      <p
        className={`${jetbrainsMono.className} text-3xl font-bold text-[#1A2E1A] tabular-nums`}
      >
        {count}
        {suffix}
      </p>
      <p className="text-xs font-semibold text-[#3A4D3A]/60 tracking-wide">
        {label}
      </p>
    </motion.div>
  );
}

// ──────────────────────────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────────────────────────
export default function HomePage() {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  useEffect(() => {
    if (inView) controls.start("show");
  }, [controls, inView]);

  return (
    <main
      className={`${plusJakarta.className} min-h-screen overflow-x-hidden`}
      style={{
        background: "linear-gradient(160deg, #f0f7f2 0%, #f8fdf9 40%, #ffffff 100%)",
      }}
    >
      <style>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.82);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(10, 123, 74, 0.15);
        }
        .glass-card-strong {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(10, 123, 74, 0.18);
          box-shadow: 0 4px 24px rgba(10, 123, 74, 0.06);
        }
        .pipeline-connector {
          background: linear-gradient(180deg, rgba(10,123,74,0.25) 0%, rgba(10,123,74,0.08) 100%);
        }
        .bar-fill {
          transition: width 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .metric-glow {
          box-shadow: 0 0 0 1px rgba(10,123,74,0.12), 0 8px 32px rgba(10,123,74,0.08);
        }
        .section-label {
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          font-weight: 700;
          color: #0A7B4A;
        }
        .phase-badge {
          font-family: var(--font-jetbrains-mono, monospace);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
        }
      `}</style>

      {/* ── Banner ── */}
      <BannerCarousel />


      <TrainingPipelineSection />

      {/* ── Hero Stats ── */}
      <section className="container mx-auto max-w-5xl px-4 py-14">
        <motion.div {...fadeUp(0)} className="text-center mb-10">
          <span className="section-label">AgroLeafAI · ConvNext-Base</span>
          <h2 className="text-3xl md:text-4xl font-extrabold mt-3 text-[#1A2E1A] tracking-tight">
            Model at a Glance
          </h2>
          <p className="text-[#3A4D3A]/60 mt-3 max-w-xl mx-auto leading-relaxed text-sm">
            Trained from scratch on a curated 61 K-image dataset, covering 120 plant disease
            classes across 24 crop types.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {MODEL_STATS.map(({ value, suffix, label, icon, color }, i) => (
            <StatCounter
              key={label}
              value={value}
              suffix={suffix}
              label={label}
              icon={icon}
              color={color}
              delay={i * 0.08}
            />
          ))}
        </div>
      </section>

      {/* ── Accuracy Metrics ── */}
      <section className="container mx-auto max-w-5xl px-4 pb-14">
        <motion.div {...fadeUp(0)} className="text-center mb-10">
          <span className="section-label">Performance</span>
          <h2 className="text-3xl md:text-4xl font-extrabold mt-3 text-[#1A2E1A] tracking-tight">
            Accuracy &amp; Metrics
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {ACCURACY_METRICS.map(({ label, value, sub, color }, i) => (
            <motion.div
              key={label}
              {...fadeUp(i * 0.09)}
              className="glass-card-strong rounded-2xl px-5 py-6 metric-glow group hover:border-[rgba(10,123,74,0.35)] transition-all duration-300"
            >
              <p className="text-xs font-semibold text-[#3A4D3A]/55 mb-2">{label}</p>
              <p
                className={`${jetbrainsMono.className} text-2xl font-bold`}
                style={{ color }}
              >
                {value}
              </p>
              <p className="text-[11px] text-[#3A4D3A]/50 mt-1">{sub}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CNN Training Pipeline ── */}
      <section className="container mx-auto max-w-5xl px-4 pb-20">
        <motion.div {...fadeUp(0)} className="text-center mb-14">
          <span className="section-label">Training Pipeline</span>
          <h2 className="text-3xl md:text-4xl font-extrabold mt-3 text-[#1A2E1A] tracking-tight">
            From Raw Images to Production Model
          </h2>
          <p className="text-[#3A4D3A]/60 mt-3 max-w-2xl mx-auto leading-relaxed text-sm">
            A full end-to-end deep learning pipeline: data collection, cleaning, augmentation,
            ConvNext fine-tuning, calibration, and ONNX export.
          </p>
        </motion.div>

        <div className="relative">
          {/* Vertical connector line */}
          <div className="absolute left-8 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px pipeline-connector hidden md:block" />

          <div className="space-y-8">
            {PIPELINE_STEPS.map((step, i) => {
              const Icon = step.icon;
              const isEven = i % 2 === 0;
              return (
                <motion.div
                  key={step.phase}
                  initial={{ opacity: 0, x: isEven ? -24 : 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
                  className={`relative md:flex md:items-start md:gap-8 ${isEven ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  {/* Card */}
                  <div className="md:w-[calc(50%-28px)] glass-card-strong rounded-2xl overflow-hidden group hover:shadow-[0_8px_40px_rgba(10,123,74,0.1)] transition-all duration-300">
                    {/* Top accent bar */}
                    <div
                      className="h-1"
                      style={{
                        background: `linear-gradient(90deg, ${step.color}, ${step.color}44)`,
                      }}
                    />
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start gap-4 mb-4">
                        <div
                          className="flex items-center justify-center h-11 w-11 rounded-xl shrink-0 transition-transform duration-300 group-hover:scale-110"
                          style={{ background: step.bg, border: `1px solid ${step.border}` }}
                        >
                          <Icon className="h-5 w-5" style={{ color: step.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className="phase-badge px-2 py-0.5 rounded-md"
                              style={{ background: step.bg, color: step.color }}
                            >
                              STEP {step.phase}
                            </span>
                          </div>
                          <h3 className="font-bold text-[#1A2E1A] text-base mt-1 leading-tight">
                            {step.title}
                          </h3>
                          <p className="text-xs text-[#3A4D3A]/50 mt-0.5">{step.subtitle}</p>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-[#3A4D3A]/70 leading-relaxed mb-4">
                        {step.description}
                      </p>

                      {/* Details grid */}
                      <div className="grid grid-cols-2 gap-2">
                        {step.details.map(({ label, value }) => (
                          <div
                            key={label}
                            className="rounded-lg px-3 py-2"
                            style={{ background: step.bg, border: `1px solid ${step.border}` }}
                          >
                            <p className="text-[10px] font-semibold text-[#3A4D3A]/50 mb-0.5">
                              {label}
                            </p>
                            <p
                              className={`${jetbrainsMono.className} text-xs font-bold leading-snug`}
                              style={{ color: step.color }}
                            >
                              {value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Centre dot */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-6 z-10 items-center justify-center">
                    <div
                      className="h-7 w-7 rounded-full flex items-center justify-center text-white font-bold text-[9px] shadow-lg"
                      style={{ background: step.color }}
                    >
                      {step.phase}
                    </div>
                  </div>

                  {/* Spacer on other side */}
                  <div className="hidden md:block md:w-[calc(50%-28px)]" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Dataset Insights ── */}
      <section className="container mx-auto max-w-5xl px-4 pb-20">
        <motion.div {...fadeUp(0)} className="text-center mb-12">
          <span className="section-label">Dataset Insights</span>
          <h2 className="text-3xl md:text-4xl font-extrabold mt-3 text-[#1A2E1A] tracking-tight">
            Data Quality &amp; Preprocessing
          </h2>
          <p className="text-[#3A4D3A]/60 mt-3 max-w-xl mx-auto leading-relaxed text-sm">
            High-quality training data is the foundation of robust plant disease detection.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {DATASET_INSIGHTS.map(({ icon: Icon, label, value, sub, color }, i) => (
            <motion.div
              key={label}
              {...fadeUp(i * 0.07)}
              className="glass-card rounded-2xl p-5 group hover:border-[rgba(10,123,74,0.3)] hover:shadow-[0_8px_28px_rgba(10,123,74,0.08)] transition-all duration-300"
            >
              <div
                className="h-10 w-10 rounded-xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110"
                style={{ background: `${color}14` }}
              >
                <Icon className="h-4.5 w-4.5" style={{ color }} />
              </div>
              <p className="text-[11px] font-semibold text-[#3A4D3A]/50 mb-1">{label}</p>
              <p className="font-bold text-[#1A2E1A] text-sm">{value}</p>
              <p className="text-[11px] text-[#3A4D3A]/50 mt-0.5 leading-snug">{sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Class distribution by crop */}
        <motion.div {...fadeUp(0.1)} className="glass-card-strong rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-9 w-9 rounded-xl bg-[rgba(10,123,74,0.1)] flex items-center justify-center">
              <BarChart3 className="h-4.5 w-4.5 text-[#0A7B4A]" />
            </div>
            <div>
              <h3 className="font-bold text-[#1A2E1A] text-sm">Class Distribution by Crop</h3>
              <p className="text-[11px] text-[#3A4D3A]/50">Disease classes per plant type</p>
            </div>
          </div>

          <div className="space-y-3">
            {CROP_GROUPS.map(({ crop, classes, healthy, diseased, bar }, i) => (
              <motion.div
                key={crop}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.45 }}
                className="flex items-center gap-4"
              >
                <p className="text-xs font-semibold text-[#1A2E1A] w-24 shrink-0">{crop}</p>
                <div className="flex-1 h-6 rounded-lg bg-[rgba(10,123,74,0.06)] overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${bar}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 + 0.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-y-0 left-0 rounded-lg"
                    style={{
                      background: `linear-gradient(90deg, #0A7B4A, #10B981)`,
                    }}
                  />
                  <div className="absolute inset-0 flex items-center px-3 gap-2">
                    <span className="text-[10px] font-bold text-white relative z-10 mix-blend-difference">
                      {classes} classes
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(10,123,74,0.1)] text-[#0A7B4A] font-semibold">
                    {healthy} healthy
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(239,68,68,0.08)] text-red-600 font-semibold hidden md:inline">
                    {diseased} diseased
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-5 pt-5 border-t border-[rgba(10,123,74,0.1)] flex flex-wrap gap-4 text-[11px] text-[#3A4D3A]/55">
            <span>
              <strong className="text-[#0A7B4A]">120</strong> total classes after normalisation
            </span>
            <span>·</span>
            <span>
              <strong className="text-[#0A7B4A]">61 K+</strong> images in total
            </span>
            <span>·</span>
            <span>
              <strong className="text-[#0A7B4A]">Stratified</strong> train/val/test splits
            </span>
          </div>
        </motion.div>
      </section>

      {/* ── Architecture Deep Dive ── */}
      <section className="container mx-auto max-w-5xl px-4 pb-20">
        <motion.div {...fadeUp(0)} className="text-center mb-12">
          <span className="section-label">Architecture</span>
          <h2 className="text-3xl md:text-4xl font-extrabold mt-3 text-[#1A2E1A] tracking-tight">
            ConvNext-Base · Custom Head
          </h2>
          <p className="text-[#3A4D3A]/60 mt-3 max-w-xl mx-auto leading-relaxed text-sm">
            A modern CNN backbone with a regularised MLP classification head, optimised for
            multi-class plant disease detection.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Architecture diagram card */}
          <motion.div {...fadeUp(0)} className="glass-card-strong rounded-2xl p-6">
            <h3 className="font-bold text-[#1A2E1A] text-sm mb-5 flex items-center gap-2">
              <Layers className="h-4 w-4 text-[#0A7B4A]" />
              Model Layers
            </h3>
            <div className="space-y-2">
              {[
                { layer: "Input", shape: "[B, 3, 224, 224]", color: "#0D9488", note: "Normalised RGB" },
                { layer: "ConvNext-Base Backbone", shape: "~87M params", color: "#0A7B4A", note: "Pretrained ImageNet-1K" },
                { layer: "LayerNorm", shape: "[B, 1024]", color: "#2C5F2D", note: "Stabilises features" },
                { layer: "Dropout (p=0.4)", shape: "—", color: "#F59E0B", note: "Regularisation" },
                { layer: "Linear → 512", shape: "[B, 512]", color: "#0A7B4A", note: "Feature compression" },
                { layer: "GELU Activation", shape: "—", color: "#2C5F2D", note: "Non-linearity" },
                { layer: "Dropout (p=0.2)", shape: "—", color: "#F59E0B", note: "Head regularisation" },
                { layer: "Linear → 120", shape: "[B, 120]", color: "#0A7B4A", note: "Disease logits" },
                { layer: "Softmax / Temp T*", shape: "[B, 120]", color: "#0D9488", note: "Calibrated probabilities" },
              ].map(({ layer, shape, color, note }, i) => (
                <motion.div
                  key={layer}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg"
                  style={{ background: `${color}08`, border: `1px solid ${color}20` }}
                >
                  <div className="h-2 w-2 rounded-full shrink-0" style={{ background: color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#1A2E1A] truncate">{layer}</p>
                    <p className="text-[10px] text-[#3A4D3A]/50">{note}</p>
                  </div>
                  <span
                    className={`${jetbrainsMono.className} text-[10px] font-bold shrink-0`}
                    style={{ color }}
                  >
                    {shape}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Training config card */}
          <div className="space-y-4">
            <motion.div {...fadeUp(0.1)} className="glass-card-strong rounded-2xl p-6">
              <h3 className="font-bold text-[#1A2E1A] text-sm mb-4 flex items-center gap-2">
                <Cpu className="h-4 w-4 text-[#0A7B4A]" />
                Training Configuration
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { k: "Batch Size", v: "32 + Grad Accum×2" },
                  { k: "Max Epochs", v: "40" },
                  { k: "Backbone LR", v: "1e-5" },
                  { k: "Head LR", v: "1e-3" },
                  { k: "Weight Decay", v: "0.02" },
                  { k: "Label Smooth", v: "0.1" },
                  { k: "Focal γ", v: "2.0" },
                  { k: "Warmup", v: "2 epochs (linear)" },
                  { k: "Scheduler", v: "Cosine → η_min=1e-7" },
                  { k: "AMP", v: "CUDA float16" },
                ].map(({ k, v }) => (
                  <div key={k} className="px-3 py-2 rounded-lg bg-[rgba(10,123,74,0.05)] border border-[rgba(10,123,74,0.1)]">
                    <p className="text-[10px] text-[#3A4D3A]/50">{k}</p>
                    <p className={`${jetbrainsMono.className} text-xs font-bold text-[#0A7B4A]`}>{v}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div {...fadeUp(0.15)} className="glass-card-strong rounded-2xl p-6">
              <h3 className="font-bold text-[#1A2E1A] text-sm mb-4 flex items-center gap-2">
                <Award className="h-4 w-4 text-[#0A7B4A]" />
                Export &amp; Deployment
              </h3>
              <div className="space-y-2">
                {[
                  { label: "PyTorch checkpoint", note: "best_model_224.pt · macro-F1 optimised" },
                  { label: "ONNX (opset 18)", note: "Simplified + smoke-tested on CPU" },
                  { label: "Temperature JSON", note: "LBFGS calibration on val set" },
                  { label: "class_names.json", note: "120 normalised class labels" },
                  { label: "Kaggle upload", note: "kagglehub → agroleaf-model-export-v10" },
                ].map(({ label, note }) => (
                  <div key={label} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#10B981] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-[#1A2E1A]">{label}</p>
                      <p className="text-[10px] text-[#3A4D3A]/50">{note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative px-4 mb-24">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-3xl p-10 md:p-14 text-center"
            style={{
              background: "linear-gradient(135deg, #0A7B4A 0%, #2C5F2D 60%, #1A2E1A 100%)",
              boxShadow: "0 24px 80px rgba(10,123,74,0.35)",
            }}
          >
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage:
                  "radial-gradient(circle,rgba(255,255,255,0.8) 1.5px,transparent 1.5px)",
                backgroundSize: "28px 28px",
              }}
            />
            <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full bg-[#10B981]/10 blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/25 text-white/90 text-xs font-semibold mb-6"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Free for farmers &amp; researchers
              </motion.div>

              <h3 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Ready to protect your harvest?
              </h3>
              <p className="mt-3 max-w-lg mx-auto text-white/65 leading-relaxed text-sm">
                Upload any affected leaf or fruit image — get instant AI diagnosis and
                organic treatment plans delivered in seconds.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link href="/diagnose">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-sm text-[#0A7B4A] bg-white transition-all shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_28px_rgba(0,0,0,0.3)]"
                  >
                    <Camera className="h-4 w-4" />
                    Start Diagnosis Now
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>
                </Link>
                <Link href="/model">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-white border border-white/30 bg-white/10 hover:bg-white/20 transition-all backdrop-blur-sm"
                  >
                    <BarChart3 className="h-4 w-4" />
                    View Full Report
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}