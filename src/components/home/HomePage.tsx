"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useAnimation,
  useInView,
  AnimatePresence,
  Variants,
  type Easing,
} from "framer-motion";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Leaf,
  Apple,
  Wheat,
  Grape,
  Camera,
  Search,
  Shield,
  AlertTriangle,
  Sprout,
  Droplets,
  Tractor,
  ArrowRight,
  Zap,
  CheckCircle2,
  FlaskConical,
  Microscope,
  ScanLine,
  BrainCircuit,
  ChevronRight,
  Star,
  ChevronLeft,
  Play,
  Pause,
} from "lucide-react";
import { SiPython, SiTensorflow } from "react-icons/si";
import { plusJakarta, jetbrainsMono } from "@/fonts/google-fonts";

// ──────────────────────────────────────────────────────────────────
// Data
// ──────────────────────────────────────────────────────────────────

const BANNER_SLIDES = [
  {
    id: 1,
    headline: "Detect Disease Before",
    headlineAccent: "It Spreads",
    sub: "Upload a single leaf photo and our Vision Transformer AI pinpoints the disease, severity, and treatment — in under 2 seconds.",
    badge: "98% Model Accuracy",
    cta: { label: "Start Free Diagnosis", href: "/diagnose" },
    secondaryCta: { label: "Watch Demo", href: "#demo" },
    bg: "from-[#0A7B4A] via-[#2C5F2D] to-[#0d3b1a]",
    image: "/images/crop-fruits/rice-2.jpeg",
    imageAlt: "Rice crop field",
    tag: "Rice · 6 Diseases",
  },
  {
    id: 2,
    headline: "Seven Crops,",
    headlineAccent: "One Platform",
    sub: "From paddy fields to apple orchards — AgroLeaf covers rice, tomato, grape, wheat, corn, potato, and apple with expert-level precision.",
    badge: "7 Crops Supported",
    cta: { label: "Explore Crops", href: "/crops" },
    secondaryCta: { label: "See Disease Library", href: "#diseases" },
    bg: "from-[#2C5F2D] via-[#0D9488] to-[#0a3d2a]",
    image: "/images/crop-fruits/tomato-1.jpeg",
    imageAlt: "Tomato crop",
    tag: "Tomato · 10 Diseases",
  },
  {
    id: 3,
    headline: "Instant Diagnosis,",
    headlineAccent: "Organic Solutions",
    sub: "Every diagnosis comes with targeted organic and chemical treatment options, prevention tips, and actionable follow-up advice.",
    badge: "< 2s Response Time",
    cta: { label: "Try It Now", href: "/diagnose" },
    secondaryCta: { label: "How It Works", href: "#how-it-works" },
    bg: "from-[#1a4d1b] via-[#0A7B4A] to-[#10B981]/80",
    image: "/images/crop-fruits/wheat-1.jpeg",
    imageAlt: "Wheat field",
    tag: "Wheat · 5 Diseases",
  },
];

const CROPS_FRUITS = [
  { name: "Rice", scientific: "Oryza sativa", image: "/images/crop-fruits/rice-2.jpeg", diseasesCount: 6, description: "Blast, brown spot, sheath blight, tungro, bacterial leaf streak" },
  { name: "Apple", scientific: "Malus domestica", image: "/images/crop-fruits/apple-1.jpeg", diseasesCount: 4, description: "Scab, black rot, cedar rust, powdery mildew" },
  { name: "Tomato", scientific: "Solanum lycopersicum", image: "/images/crop-fruits/tomato-1.jpeg", diseasesCount: 10, description: "Early blight, late blight, leaf mold, septoria, etc." },
  { name: "Grape", scientific: "Vitis vinifera", image: "/images/crop-fruits/grape-1.jpeg", diseasesCount: 4, description: "Black rot, leaf blight, powdery mildew, downy mildew" },
  { name: "Wheat", scientific: "Triticum aestivum", image: "/images/crop-fruits/wheat-1.jpeg", diseasesCount: 5, description: "Septoria, stripe rust, leaf rust, stem rust, powdery mildew" },
  { name: "Corn (Maize)", scientific: "Zea mays", image: "/images/crop-fruits/corn-1.jpeg", diseasesCount: 4, description: "Cercospora, common rust, northern leaf blight, smut" },
  { name: "Potato", scientific: "Solanum tuberosum", image: "/images/crop-fruits/potato-1.jpeg", diseasesCount: 3, description: "Early blight, late blight, healthy" },
];

const DISEASE_TREE = [
  {
    crop: "Apple", icon: Apple,
    accentLight: "bg-rose-500", accentDark: "from-rose-500 to-red-500",
    tagColor: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/40",
    diseases: [
      { name: "Apple Scab", severity: "High", treatment: "Fungicide + pruning", symptoms: "Olive-green spots on leaves and fruit", prevention: "Plant resistant varieties, remove fallen leaves" },
      { name: "Black Rot", severity: "Medium", treatment: "Remove infected branches", symptoms: "Purple spots on leaves, fruit rot", prevention: "Prune for air circulation, sanitize tools" },
      { name: "Cedar Rust", severity: "Medium", treatment: "Fungicide spray", symptoms: "Bright orange spots on leaves", prevention: "Remove nearby cedar trees" },
      { name: "Powdery Mildew", severity: "Low", treatment: "Sulfur spray", symptoms: "White powdery coating on leaves", prevention: "Avoid overhead watering" },
    ],
  },
  {
    crop: "Tomato", icon: Leaf,
    accentLight: "bg-[#0A7B4A]", accentDark: "from-[#0A7B4A] to-[#2C5F2D]",
    tagColor: "bg-[rgba(10,123,74,0.08)] text-[#0A7B4A] border-[rgba(10,123,74,0.2)] dark:bg-[rgba(10,123,74,0.2)] dark:text-[#4ade80] dark:border-[rgba(10,123,74,0.3)]",
    diseases: [
      { name: "Early Blight", severity: "High", treatment: "Copper fungicide", symptoms: "Dark concentric rings on lower leaves", prevention: "Mulch, crop rotation" },
      { name: "Late Blight", severity: "Critical", treatment: "Remove & destroy plants", symptoms: "Water-soaked lesions with white fuzz", prevention: "Use resistant varieties" },
      { name: "Leaf Mold", severity: "Low", treatment: "Improve air circulation", symptoms: "Pale green or yellow spots on leaves", prevention: "Space plants properly" },
      { name: "Septoria Leaf Spot", severity: "Medium", treatment: "Neem oil", symptoms: "Small circular spots with dark borders", prevention: "Water at base, remove infected leaves" },
      { name: "Tomato Mosaic Virus", severity: "High", treatment: "No cure, remove plants", symptoms: "Mottled green/yellow leaves, stunted growth", prevention: "Clean tools, use virus-free seeds" },
    ],
  },
  {
    crop: "Grape", icon: Grape,
    accentLight: "bg-violet-600", accentDark: "from-violet-600 to-indigo-500",
    tagColor: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-800/40",
    diseases: [
      { name: "Black Rot", severity: "High", treatment: "Fungicide + sanitation", symptoms: "Brown spots on leaves, mummified berries", prevention: "Prune for air flow, remove mummies" },
      { name: "Powdery Mildew", severity: "Medium", treatment: "Sulfur spray", symptoms: "White powdery growth on all green parts", prevention: "Avoid dense foliage" },
      { name: "Downy Mildew", severity: "High", treatment: "Copper-based fungicide", symptoms: "Yellow oil spots on leaves, white mold underside", prevention: "Improve air circulation" },
      { name: "Anthracnose", severity: "Medium", treatment: "Fungicide", symptoms: "Dark sunken lesions on berries", prevention: "Remove infected canes" },
    ],
  },
  {
    crop: "Wheat", icon: Wheat,
    accentLight: "bg-amber-500", accentDark: "from-amber-500 to-yellow-500",
    tagColor: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40",
    diseases: [
      { name: "Stripe Rust", severity: "High", treatment: "Resistant varieties", symptoms: "Yellow-orange stripes on leaves", prevention: "Plant resistant cultivars" },
      { name: "Septoria", severity: "Medium", treatment: "Fungicide at flag leaf", symptoms: "Brown spots with dark centers", prevention: "Crop rotation, residue management" },
      { name: "Powdery Mildew", severity: "Low", treatment: "Sulfur application", symptoms: "White powdery patches", prevention: "Avoid excess nitrogen" },
      { name: "Leaf Rust", severity: "High", treatment: "Fungicide", symptoms: "Orange-brown pustules on leaves", prevention: "Early planting, resistant varieties" },
      { name: "Fusarium Head Blight", severity: "Critical", treatment: "No effective cure", symptoms: "Bleached spikelets, pink mold", prevention: "Rotate crops, use clean seed" },
    ],
  },
  {
    crop: "Rice", icon: Sprout,
    accentLight: "bg-teal-500", accentDark: "from-teal-500 to-[#0D9488]",
    tagColor: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800/40",
    diseases: [
      { name: "Rice Blast", severity: "High", treatment: "Fungicide + resistant varieties", symptoms: "Diamond-shaped lesions with grey centers", prevention: "Balance nitrogen application" },
      { name: "Brown Spot", severity: "Medium", treatment: "Seed treatment", symptoms: "Small brown circular spots", prevention: "Use certified seeds" },
      { name: "Sheath Blight", severity: "High", treatment: "Fungicide", symptoms: "Greenish-grey lesions on leaf sheaths", prevention: "Avoid dense planting" },
      { name: "Bacterial Leaf Streak", severity: "Medium", treatment: "Copper compounds", symptoms: "Yellowish streaks between veins", prevention: "Drain fields periodically" },
      { name: "Tungro Virus", severity: "High", treatment: "Vector control", symptoms: "Yellow-orange discoloration, stunting", prevention: "Control leafhoppers" },
    ],
  },
  {
    crop: "Corn (Maize)", icon: Leaf,
    accentLight: "bg-yellow-500", accentDark: "from-yellow-500 to-amber-500",
    tagColor: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/40 dark:text-yellow-300 dark:border-yellow-800/40",
    diseases: [
      { name: "Common Rust", severity: "Medium", treatment: "Fungicide", symptoms: "Brick-red pustules on leaves", prevention: "Plant resistant hybrids" },
      { name: "Northern Leaf Blight", severity: "High", treatment: "Fungicide", symptoms: "Long cigar-shaped gray-green lesions", prevention: "Crop rotation, tillage" },
      { name: "Southern Corn Rust", severity: "High", treatment: "Fungicide", symptoms: "Small circular orange pustules", prevention: "Early planting" },
      { name: "Gray Leaf Spot", severity: "Medium", treatment: "Fungicide", symptoms: "Rectangular gray lesions", prevention: "Residue management" },
      { name: "Maize Dwarf Mosaic", severity: "Medium", treatment: "No cure", symptoms: "Mosaic pattern on leaves, stunting", prevention: "Control aphid vectors" },
    ],
  },
  {
    crop: "Potato", icon: Sprout,
    accentLight: "bg-stone-500", accentDark: "from-stone-500 to-stone-600",
    tagColor: "bg-stone-50 text-stone-700 border-stone-200 dark:bg-stone-900/40 dark:text-stone-300 dark:border-stone-700/40",
    diseases: [
      { name: "Early Blight", severity: "High", treatment: "Chlorothalonil", symptoms: "Dark concentric spots on older leaves", prevention: "Crop rotation, avoid overhead irrigation" },
      { name: "Late Blight", severity: "Critical", treatment: "Destroy infected plants", symptoms: "Water-soaked lesions, white mold on undersides", prevention: "Use certified seed potatoes" },
      { name: "Potato Virus Y", severity: "High", treatment: "No cure", symptoms: "Mosaic, leaf drop, stunting", prevention: "Control aphids, use resistant varieties" },
      { name: "Blackleg", severity: "Medium", treatment: "Destroy infected plants", symptoms: "Black rotting stems, wilting", prevention: "Use disease-free seed" },
    ],
  },
];

const HOW_IT_WORKS = [
  { step: "01", icon: Camera, title: "Upload a Photo", desc: "Take a clear photo of the affected leaf, fruit, or stem and upload it to our platform." },
  { step: "02", icon: ScanLine, title: "AI Scans the Image", desc: "Our Vision Transformer model analyzes 50+ visual markers across 38 disease classes." },
  { step: "03", icon: BrainCircuit, title: "Disease Identified", desc: "Get an instant diagnosis with confidence score, severity level, and full breakdown." },
  { step: "04", icon: FlaskConical, title: "Treatment Plan", desc: "Receive organic and chemical treatment options, prevention tips, and follow-up advice." },
];

// Stats with numeric values for counter animation
const STATS = [
  { numericValue: 38, suffix: "+", label: "Disease Classes", icon: Microscope },
  { numericValue: 7, suffix: "", label: "Crops Supported", icon: Sprout },
  { numericValue: 98, suffix: "%", label: "Model Accuracy", icon: Star },
  { numericValue: 2, prefix: "< ", suffix: "s", label: "Diagnosis Time", icon: Zap },
];

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
  show: { opacity: 1, transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};
const staggerItem: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

const severityStyle = (s: string) => {
  switch (s) {
    case "Critical": return "bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800/40";
    case "High": return "bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800/40";
    case "Medium": return "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800/40";
    default: return "bg-[rgba(10,123,74,0.07)] text-[#0A7B4A] border border-[rgba(10,123,74,0.2)] dark:bg-[rgba(10,123,74,0.2)] dark:text-[#4ade80] dark:border-[rgba(10,123,74,0.3)]";
  }
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
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);

  return count;
}

// ──────────────────────────────────────────────────────────────────
// Stat Card with animated counter
// ──────────────────────────────────────────────────────────────────
function StatCard({ numericValue, suffix, prefix, label, icon: Icon, delay }: {
  numericValue: number; suffix: string; prefix?: string; label: string; icon: React.ElementType; delay: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const count = useCounter(numericValue, 1600, inView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.55 }}
      className="glass-card rounded-2xl px-5 py-6 flex flex-col items-center text-center gap-3 group hover:border-[rgba(10,123,74,0.5)] transition-all duration-300 cursor-default"
    >
      <div className="flex items-center justify-center h-12 w-12 rounded-2xl bg-[rgba(10,123,74,0.1)] dark:bg-[rgba(10,123,74,0.2)] group-hover:bg-[#0A7B4A] transition-colors duration-300">
        <Icon className="h-5 w-5 text-[#0A7B4A] dark:text-[#4ade80] group-hover:text-white transition-colors" />
      </div>
      <p className={`${jetbrainsMono.className} text-3xl font-bold text-[#1A2E1A] dark:text-white tabular-nums`}>
        {prefix ?? ""}{count}{suffix}
      </p>
      <p className="text-xs font-semibold text-[#3A4D3A]/60 dark:text-white/45 tracking-wide">{label}</p>
    </motion.div>
  );
}

// ──────────────────────────────────────────────────────────────────
// Banner Carousel Component
// ──────────────────────────────────────────────────────────────────
export function BannerCarousel() {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [direction, setDirection] = useState(1);
  const total = BANNER_SLIDES.length;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
 
  const goTo = (idx: number, dir = 1) => {
    setDirection(dir);
    setCurrent((idx + total) % total);
  };
 
  const startAuto = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setDirection(1);
      setCurrent((c) => (c + 1) % total);
    }, 5800);
  };
 
  useEffect(() => {
    if (isPlaying) startAuto();
    else if (intervalRef.current) clearInterval(intervalRef.current);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);
 
  const slide = BANNER_SLIDES[current];
 
  const imgVariants = {
    enter: (dir: number) => ({ opacity: 0, scale: 1.08, x: dir > 0 ? 60 : -60 }),
    center: { opacity: 1, scale: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, scale: 0.95, x: dir > 0 ? -40 : 40 }),
  };
 
  const textVariants = {
    enter: { opacity: 0, y: 36 },
    center: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };
 
  return (
    <section className="relative w-full overflow-hidden">
      {/* ── MAIN SLIDE AREA ── */}
      <div className="relative h-[90vh] min-h-[600px] max-h-[900px] flex flex-col">
 
        {/* ── LAYER 0: Full-bleed crop image ── */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <AnimatePresence custom={direction} mode="sync">
            <motion.div
              key={`img-${current}`}
              custom={direction}
              variants={imgVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 1.05, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="absolute inset-0"
            >
              <Image
                src={slide.image}
                alt={slide.imageAlt}
                fill
                sizes="100vw"
                priority={current === 0}
                className="object-cover object-center"
              />
            </motion.div>
          </AnimatePresence>
        </div>
 
        {/* ── LAYER 1: Left-to-right gradient overlay ──
            Strong dark on the left where text lives → fully transparent on the right
            so the crop image is fully visible on the right side.
            Light mode: slightly less opaque. Dark mode: slightly more opaque. ── */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, rgba(5,14,6,0.82) 0%, rgba(5,14,6,0.68) 30%, rgba(5,14,6,0.35) 55%, rgba(5,14,6,0.08) 75%, transparent 100%)",
          }}
        />
 
        {/* ── LAYER 2: Subtle bottom vignette — keeps nav bar readable ── */}
        <div
          className="absolute inset-x-0 bottom-0 z-10 pointer-events-none"
          style={{
            height: "220px",
            background:
              "linear-gradient(to top, rgba(5,14,6,0.65) 0%, rgba(5,14,6,0.3) 50%, transparent 100%)",
          }}
        />
 
        {/* ── LAYER 3: Noise / grain texture ── */}
        <div
          className="absolute inset-0 z-10 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
          }}
        />
 
        {/* ── LAYER 4: Dot-grid accent (very subtle, only on the left text area) ── */}
        <div
          className="absolute inset-y-0 left-0 z-10 opacity-[0.035] pointer-events-none"
          style={{
            width: "55%",
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
 
        {/* ── LAYER 5: Top progress bar ── */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-white/10 z-30">
          {isPlaying && (
            <motion.div
              key={`bar-${current}`}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 5.8, ease: "linear" }}
              className="h-full bg-gradient-to-r from-[#10B981] via-[#4ade80] to-[#86efac]"
            />
          )}
        </div>
 
        {/* ── LAYER 6: Slide index strip — left vertical ── */}
        <div className="absolute left-5 md:left-8 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-center gap-3">
          {BANNER_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => { goTo(i, i > current ? 1 : -1); setIsPlaying(false); }}
              aria-label={`Slide ${i + 1}`}
              className={`transition-all duration-500 rounded-full ${
                i === current
                  ? "h-10 w-[3px] bg-[#10B981]"
                  : "h-4 w-[3px] bg-white/30 hover:bg-white/55"
              }`}
            />
          ))}
        </div>
 
        {/* ── LAYER 7: MAIN TEXT CONTENT ── */}
        <div className="relative z-20 flex flex-col justify-end h-full pb-24 md:pb-20 px-6 md:px-14 lg:px-20 max-w-7xl mx-auto w-full">
 
          {/* Slide number watermark — top right */}
          <div
            className={`${jetbrainsMono.className} absolute top-7 right-7 text-[11px] font-bold text-white/30 tracking-[0.2em] hidden md:block`}
          >
            {String(current + 1).padStart(2, "0")}{" "}
            <span className="text-white/15">/ {String(total).padStart(2, "0")}</span>
          </div>
 
          {/* Tag pill */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`tag-${current}`}
              variants={textVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, delay: 0.05 }}
              className="flex items-center gap-3 mb-5"
            >
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/30 border border-white/20 text-white/90 text-[11px] font-bold tracking-widest uppercase backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" />
                {slide.badge}
              </span>
              <span className="h-px w-12 bg-white/25" />
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-white/50 tracking-wide">
                <Sprout className="h-3 w-3 text-[#10B981]" />
                {slide.tag}
              </span>
            </motion.div>
          </AnimatePresence>
 
          {/* Headline */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`headline-${current}`}
              variants={textVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.02] text-white max-w-3xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)]">
                {slide.headline}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] via-[#4ade80] to-[#86efac]">
                  {slide.headlineAccent}
                </span>
              </h1>
            </motion.div>
          </AnimatePresence>
 
          {/* Divider line */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`divider-${current}`}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              exit={{ scaleX: 0, opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="origin-left mt-6 mb-5 w-24 h-[2px] bg-gradient-to-r from-[#10B981] to-transparent"
            />
          </AnimatePresence>
 
          {/* Sub + CTAs row */}
          <div className="flex flex-col md:flex-row md:items-end gap-8">
            {/* Sub */}
            <AnimatePresence mode="wait">
              <motion.p
                key={`sub-${current}`}
                variants={textVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, delay: 0.18 }}
                className="text-base md:text-lg text-white/65 leading-relaxed max-w-sm font-normal drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]"
              >
                {slide.sub}
              </motion.p>
            </AnimatePresence>
 
            {/* CTAs */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`ctas-${current}`}
                variants={textVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, delay: 0.26 }}
                className="flex flex-wrap gap-3 md:ml-auto shrink-0"
              >
                <Link href={slide.cta.href}>
                  <motion.button
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    className="inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl text-[#0A7B4A] font-extrabold text-sm bg-white shadow-[0_8px_32px_rgba(0,0,0,0.35)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.45)] transition-all"
                  >
                    <Camera className="h-4 w-4" />
                    {slide.cta.label}
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>
                </Link>
                <Link href={slide.secondaryCta.href}>
                  <motion.button
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl font-semibold text-sm text-white border border-white/25 bg-white/10 hover:bg-white/18 transition-all backdrop-blur-md"
                  >
                    {slide.secondaryCta.label}
                    <ChevronRight className="h-4 w-4 opacity-60" />
                  </motion.button>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
 
        {/* ── LAYER 8: Bottom nav controls bar ── */}
        <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/10 backdrop-blur-md bg-black/25">
          <div className="max-w-7xl mx-auto px-6 md:px-14 lg:px-20 py-4 flex items-center justify-between gap-4">
 
            {/* Mobile dots */}
            <div className="flex items-center gap-2 md:hidden">
              {BANNER_SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { goTo(i, i > current ? 1 : -1); setIsPlaying(false); }}
                  className={`rounded-full transition-all duration-300 ${
                    i === current ? "w-6 h-2 bg-[#10B981]" : "w-2 h-2 bg-white/30"
                  }`}
                />
              ))}
            </div>
 
            {/* Slide thumbnails — desktop */}
            <div className="hidden md:flex items-center gap-3">
              {BANNER_SLIDES.map((s, i) => (
                <button
                  key={i}
                  onClick={() => { goTo(i, i > current ? 1 : -1); setIsPlaying(false); }}
                  className={`relative overflow-hidden rounded-xl transition-all duration-400 ${
                    i === current
                      ? "ring-2 ring-[#10B981] ring-offset-1 ring-offset-transparent scale-105"
                      : "opacity-50 hover:opacity-75 scale-100"
                  }`}
                  style={{ width: 64, height: 40 }}
                  aria-label={`Slide ${i + 1}: ${s.headlineAccent}`}
                >
                  <Image
                    src={s.image}
                    alt={s.imageAlt}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                  {i === current && (
                    <div className="absolute inset-0 bg-[#10B981]/20" />
                  )}
                </button>
              ))}
            </div>
 
            {/* Right controls */}
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2.5 rounded-xl bg-white/10 border border-white/15 hover:bg-white/20 transition-colors"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying
                  ? <Pause className="h-3.5 w-3.5 text-white" />
                  : <Play className="h-3.5 w-3.5 text-white" />}
              </button>
              <div className="w-px h-5 bg-white/15" />
              <button
                onClick={() => { goTo(current - 1, -1); setIsPlaying(false); }}
                className="p-2.5 rounded-xl bg-white/10 border border-white/15 hover:bg-white/20 transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft className="h-4 w-4 text-white" />
              </button>
              <button
                onClick={() => { goTo(current + 1, 1); setIsPlaying(false); }}
                className="p-2.5 rounded-xl bg-white/10 border border-white/15 hover:bg-white/20 transition-colors"
                aria-label="Next"
              >
                <ChevronRight className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
 
      {/* ── Trust bar ── */}
      <div className="bg-[rgba(10,123,74,0.06)] dark:bg-[rgba(10,123,74,0.1)] border-b border-[rgba(10,123,74,0.12)] py-4">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-[#3A4D3A]/55 dark:text-white/35">
            {[
              { icon: <SiTensorflow className="text-orange-500 h-4 w-4" />, label: "TensorFlow" },
              { icon: <SiPython className="text-blue-500 h-4 w-4" />, label: "PyTorch" },
              { icon: <Shield className="text-[#0A7B4A] h-4 w-4" />, label: "98% Accuracy" },
              { icon: <Zap className="text-amber-500 h-4 w-4" />, label: "< 2s Response" },
              { icon: <CheckCircle2 className="text-[#10B981] h-4 w-4" />, label: "Free for Farmers" },
            ].map(({ icon, label }) => (
              <span key={label} className="flex items-center gap-2 font-semibold">
                {icon} {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [cropApi, setCropApi] = useState<CarouselApi | null>(null);
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  useEffect(() => {
    if (inView) controls.start("show");
  }, [controls, inView]);

  useEffect(() => {
    if (!cropApi) return;
    const interval = setInterval(() => cropApi.scrollNext(), 4200);
    return () => clearInterval(interval);
  }, [cropApi]);

  return (
    <main
      className={`${plusJakarta.className} min-h-screen overflow-x-hidden bg-gradient-to-b from-[#f0f7f2] via-[#f8fdf9] to-white dark:from-[#060e07] dark:via-[#0a120b] dark:to-[#0d1a0e]`}
    >
      {/* Global glass card styles — only what Tailwind can't express */}
      <style>{`
        .glass-card {
          background: rgba(255,255,255,0.78);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(10,123,74,0.18);
        }
        .dark .glass-card {
          background: rgba(13,26,14,0.75);
          border: 1px solid rgba(10,123,74,0.28);
        }
        .crop-card:hover {
          border-color: rgba(10,123,74,0.45);
          box-shadow: 0 12px 40px rgba(10,123,74,0.13);
        }
        .dark .crop-card:hover {
          box-shadow: 0 12px 40px rgba(10,123,74,0.22);
        }
      `}</style>

      {/* ── BANNER CAROUSEL ───────────────────────────────────────────── */}
      <BannerCarousel />

      {/* ── STATS BAR ─────────────────────────────────────────────────── */}
      <section className="container mx-auto max-w-5xl px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map(({ numericValue, suffix, prefix, label, icon }, i) => (
            <StatCard
              key={label}
              numericValue={numericValue}
              suffix={suffix}
              prefix={prefix}
              label={label}
              icon={icon}
              delay={i * 0.08}
            />
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────── */}
      <section id="how-it-works" className="container mx-auto max-w-5xl px-4 py-16">
        <motion.div {...fadeUp(0)} className="text-center mb-14">
          <span className="text-xs font-bold tracking-[0.14em] uppercase text-[#0A7B4A] dark:text-[#4ade80]">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold mt-3 text-[#1A2E1A] dark:text-white tracking-tight">
            Diagnosis in four steps
          </h2>
          <p className="text-[#3A4D3A]/60 dark:text-white/45 mt-3 max-w-xl mx-auto leading-relaxed">
            From photo to treatment plan — the entire workflow takes under two seconds.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-5">
          {HOW_IT_WORKS.map(({ step, icon: Icon, title, desc }, i) => (
            <motion.div key={step} {...fadeUp(i * 0.1)} className="relative group">
              {i < HOW_IT_WORKS.length - 1 && (
                <div className="hidden md:block absolute top-9 left-[calc(50%+28px)] -right-7 h-px bg-gradient-to-r from-[rgba(10,123,74,0.3)] to-transparent z-0" />
              )}
              <div className="glass-card crop-card relative rounded-2xl p-5 text-center transition-all duration-300 z-10">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgba(10,123,74,0.1)] dark:bg-[rgba(10,123,74,0.2)] group-hover:bg-[#0A7B4A] transition-colors duration-300">
                  <Icon className="h-6 w-6 text-[#0A7B4A] dark:text-[#4ade80] group-hover:text-white transition-colors" />
                </div>
                <span className={`${jetbrainsMono.className} text-[10px] font-bold text-[#0A7B4A]/50 dark:text-[#4ade80]/40 tracking-widest`}>
                  {step}
                </span>
                <h3 className="mt-1 font-bold text-sm text-[#1A2E1A] dark:text-white">{title}</h3>
                <p className="mt-2 text-xs text-[#3A4D3A]/60 dark:text-white/40 leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CROPS CAROUSEL ───────────────────────────────────────────── */}
      <section className="container mx-auto max-w-6xl px-4 py-16">
        <motion.div {...fadeUp(0)} className="text-center mb-12">
          <span className="text-xs font-bold tracking-[0.14em] uppercase text-[#0A7B4A] dark:text-[#4ade80]">
            Our Dataset
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold mt-3 text-[#1A2E1A] dark:text-white tracking-tight">
            Crops & Fruits We Diagnose
          </h2>
          <p className="text-[#3A4D3A]/60 dark:text-white/45 mt-3 max-w-xl mx-auto leading-relaxed">
            Trained on diverse, high-quality images covering multiple disease classes per plant.
          </p>
        </motion.div>

        <Carousel setApi={setCropApi} opts={{ loop: true }} className="w-full">
          <CarouselContent className="-ml-4">
            {CROPS_FRUITS.map((item, idx) => (
              <CarouselItem key={idx} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.07 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -6 }}
                  className="h-full"
                >
                  <div className="glass-card crop-card rounded-2xl overflow-hidden h-full transition-all duration-300 group">
                    <div className="relative h-44 w-full overflow-hidden">
                      <Image
                        src={item.image}
                        alt={`${item.name} crop`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <span className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#0A7B4A]/90 text-white backdrop-blur-sm">
                        {item.diseasesCount} diseases
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-[#1A2E1A] dark:text-white text-base">{item.name}</h3>
                      <p className="text-xs italic text-[#3A4D3A]/55 dark:text-white/35 mt-0.5">
                        {item.scientific}
                      </p>
                      <p className="mt-2.5 text-xs text-[#3A4D3A]/65 dark:text-white/45 leading-relaxed">
                        {item.description}
                      </p>
                      <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-[#0A7B4A] dark:text-[#4ade80]">
                        <ChevronRight className="h-3.5 w-3.5" />
                        View diseases
                      </div>
                    </div>
                  </div>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex border-[rgba(10,123,74,0.3)] text-[#0A7B4A] hover:bg-[rgba(10,123,74,0.08)] hover:text-[#0A7B4A] dark:border-[rgba(10,123,74,0.4)] dark:text-[#4ade80] dark:hover:bg-[rgba(10,123,74,0.2)]" />
          <CarouselNext className="hidden md:flex border-[rgba(10,123,74,0.3)] text-[#0A7B4A] hover:bg-[rgba(10,123,74,0.08)] hover:text-[#0A7B4A] dark:border-[rgba(10,123,74,0.4)] dark:text-[#4ade80] dark:hover:bg-[rgba(10,123,74,0.2)]" />
        </Carousel>
      </section>

      {/* ── DISEASE TREE ──────────────────────────────────────────────── */}
      <section id="diseases" className="container mx-auto max-w-6xl px-4 py-16">
        <motion.div {...fadeUp(0)} className="text-center mb-14">
          <span className="text-xs font-bold tracking-[0.14em] uppercase text-[#0A7B4A] dark:text-[#4ade80]">
            Disease Library
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold mt-3 text-[#1A2E1A] dark:text-white tracking-tight">
            Common Diseases by Crop
          </h2>
          <p className="text-[#3A4D3A]/60 dark:text-white/45 mt-3 max-w-2xl mx-auto leading-relaxed">
            Explore the most prevalent diseases, severity levels, symptoms, and recommended treatments.
            Tap any disease for detailed prevention guidance.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={controls}
          className="grid gap-5 md:grid-cols-2"
        >
          {DISEASE_TREE.map((category) => (
            <motion.div
              key={category.crop}
              variants={staggerItem}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
            >
              <div className="glass-card crop-card rounded-2xl overflow-hidden h-full transition-all duration-300">
                <div className={`h-1.5 bg-gradient-to-r ${category.accentDark}`} />
                <div className="px-6 pt-5 pb-3 flex items-center gap-3">
                  <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-[rgba(10,123,74,0.1)] dark:bg-[rgba(10,123,74,0.18)] shrink-0">
                    <category.icon className="h-5 w-5 text-[#0A7B4A] dark:text-[#4ade80]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1A2E1A] dark:text-white leading-tight">
                      {category.crop}
                    </h3>
                    <p className="text-xs text-[#3A4D3A]/50 dark:text-white/35">
                      {category.diseases.length} documented diseases
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-3 space-y-2">
                  {category.diseases.map((disease) => (
                    <Accordion key={disease.name} type="single" collapsible className="w-full">
                      <AccordionItem
                        value={disease.name}
                        className="border-0 rounded-xl overflow-hidden bg-[rgba(245,250,240,0.5)] border border-[rgba(10,123,74,0.12)]"
                      >
                        <div className="px-3.5 pt-3 pb-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-semibold text-sm text-[#1A2E1A] dark:text-white">
                                  {disease.name}
                                </h4>
                                {disease.severity === "Critical" && (
                                  <AlertTriangle className="h-3.5 w-3.5 text-red-500 shrink-0" />
                                )}
                              </div>
                              <span className={`mt-1 inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full ${severityStyle(disease.severity)}`}>
                                {disease.severity}
                              </span>
                            </div>
                            <span className="text-[10px] font-medium text-[#3A4D3A]/60 dark:text-white/40 bg-white/80 dark:bg-white/5 border border-[rgba(10,123,74,0.12)] px-2.5 py-1 rounded-lg shrink-0 max-w-30 text-right leading-tight">
                              {disease.treatment}
                            </span>
                          </div>

                          <AccordionTrigger className="text-[11px] font-semibold text-[#0A7B4A] dark:text-[#4ade80] hover:text-[#2C5F2D] py-1.5 hover:no-underline [&>svg]:h-3 [&>svg]:w-3">
                            View details & prevention
                          </AccordionTrigger>
                        </div>

                        <AccordionContent className="px-3.5 pb-3 pt-0">
                          <div className="border-t border-[rgba(10,123,74,0.1)] pt-2.5 space-y-2">
                            {[
                              { icon: Droplets, label: "Symptoms", text: disease.symptoms },
                              { icon: Shield, label: "Prevention", text: disease.prevention },
                              { icon: Tractor, label: "Treatment", text: disease.treatment },
                            ].map(({ icon: Icon, label, text }) => (
                              <div key={label} className="flex items-start gap-2.5 text-xs">
                                <Icon className="h-3.5 w-3.5 text-[#0A7B4A] dark:text-[#4ade80] mt-0.5 shrink-0" />
                                <span className="text-[#3A4D3A]/75 dark:text-white/55">
                                  <strong className="text-[#1A2E1A] dark:text-white/80">{label}:</strong>{" "}
                                  {text}
                                </span>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ))}
                </div>

                <div className="px-5 pb-5">
                  <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-[#0A7B4A] dark:text-[#4ade80] border border-[rgba(10,123,74,0.2)] hover:bg-[rgba(10,123,74,0.06)] dark:hover:bg-[rgba(10,123,74,0.14)] transition-colors">
                    <Search className="h-3.5 w-3.5" />
                    View all {category.diseases.length}+ diseases
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="relative px-4 mt-8 mb-24">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-3xl p-10 md:p-14 text-center bg-gradient-to-br from-[#0A7B4A] via-[#2C5F2D] to-[#1a4d1b] shadow-[0_24px_80px_rgba(10,123,74,0.35)]"
          >
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.8) 1.5px,transparent 1.5px)",
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
                Free for farmers & researchers
              </motion.div>

              <h3 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Ready to protect your harvest?
              </h3>
              <p className="mt-3 max-w-lg mx-auto text-white/65 leading-relaxed">
                Upload any affected leaf or fruit image — get instant AI diagnosis
                and organic treatment plans delivered in seconds.
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
                <Link href="/how-it-works">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-white border border-white/30 bg-white/10 hover:bg-white/20 transition-all backdrop-blur-sm"
                  >
                    Learn How It Works
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