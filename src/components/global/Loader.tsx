"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_MESSAGES = [
  "Initializing AI engine...",
  "Loading CNN model...",
  "Calibrating disease detection...",
  "Connecting to crop database...",
  "Preparing LLM insights...",
  "Almost ready...",
];

// ── Leaf icon with animated scan-dot ────────────────────────────────────────
function LeafIcon() {
  return (
    <svg
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-8 h-8"
    >
      <path
        d="M15 4C15 4 6 9 6 17C6 22 10 26 15 26C20 26 24 22 24 17C24 9 15 4 15 4Z"
        fill="rgba(10,123,74,0.35)"
        stroke="#10B981"
        strokeWidth="1.2"
      />
      <path
        d="M15 8V24"
        stroke="rgba(16,185,129,0.6)"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
      <path
        d="M15 13 L10 17M15 17 L10 20M15 16 L20 20M15 13 L20 16"
        stroke="rgba(16,185,129,0.4)"
        strokeWidth="0.7"
        strokeLinecap="round"
      />
      <motion.circle
        cx="15"
        cy="15"
        r="2"
        fill="#10B981"
        animate={{ r: [2, 3, 2], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

// ── Orbiting dot ─────────────────────────────────────────────────────────────
interface OrbitingDotProps {
  lightClass: string;  // Tailwind bg class for light mode
  darkClass: string;   // Tailwind dark: bg class for dark mode
  sizeClass: string;
  duration: number;
  delay: number;
  radius: number;
  clockwise: boolean;
}

function OrbitingDot({
  lightClass,
  darkClass,
  sizeClass,
  duration,
  delay,
  radius,
  clockwise,
}: OrbitingDotProps) {
  const positiveDelay = delay < 0 ? 0 : delay;
  const adjustedDelay = (delay % duration + duration) % duration;
  const initialRotate =
    delay < 0
      ? (adjustedDelay / duration) * (clockwise ? 360 : -360)
      : 0;

  return (
    <motion.div
      className="absolute left-1/2 top-1/2"
      initial={{ rotate: initialRotate }}
      animate={{ rotate: clockwise ? 360 : -360 }}
      transition={{ duration, repeat: Infinity, ease: "linear", delay: positiveDelay }}
    >
      <div
        className={`absolute rounded-full ${lightClass} ${darkClass} ${sizeClass}`}
        style={{ transform: `translate(-50%, -50%) translate(${radius}px, 0)` }}
      />
    </motion.div>
  );
}

// ── Floating particle ─────────────────────────────────────────────────────────
interface Particle {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  repeatDelay: number;
}

function FloatingParticle({ left, size, duration, delay, repeatDelay }: Omit<Particle, "id">) {
  return (
    <motion.span
      className="absolute bottom-0 rounded-full pointer-events-none bg-emerald-400/50 dark:bg-emerald-400"
      style={{ left: `${left}%`, width: size, height: size }}
      initial={{ y: 0, opacity: 0.6, scale: 1 }}
      animate={{ y: -280, opacity: 0, scale: 0.2 }}
      transition={{ duration, delay, ease: "linear", repeat: Infinity, repeatDelay }}
    />
  );
}

// ── Main loading page ─────────────────────────────────────────────────────────
export default function Loader() {
  const [statusIndex, setStatusIndex] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    const id = setInterval(
      () => setStatusIndex((p) => (p + 1) % STATUS_MESSAGES.length),
      2000
    );
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const spawn = () => {
      setParticles((prev) => [
        ...prev.slice(-14),
        {
          id: idRef.current++,
          left: Math.random() * 100,
          size: Math.random() * 4 + 2,
          duration: Math.random() * 4 + 4,
          delay: Math.random() * 2,
          repeatDelay: Math.random() * 2,
        },
      ]);
    };
    for (let i = 0; i < 10; i++) spawn();
    const id = setInterval(spawn, 700);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className={[
        "relative flex items-center justify-center min-h-screen overflow-hidden",
        // LIGHT: airy white-green canvas
        "bg-[#f0faf4]",
        // DARK:  deep forest canvas (original)
        "dark:bg-emerald-950",
      ].join(" ")}
    >
      {/* ── Background grid ─────────────────────────────────────────────────── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(10,123,74,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(10,123,74,0.07) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
        animate={{ backgroundPosition: ["0px 0px", "40px 40px"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {/* ── Ambient glow orbs ───────────────────────────────────────────────── */}
      <div className="absolute rounded-full blur-3xl pointer-events-none -top-14 -left-10 w-56 h-56 animate-pulse bg-emerald-300/40 dark:bg-emerald-700/30" />
      <div className="absolute rounded-full blur-3xl pointer-events-none -bottom-10 -right-5 w-40 h-40 animate-pulse [animation-delay:2s] bg-emerald-200/50 dark:bg-emerald-600/30" />
      <div className="absolute rounded-full blur-3xl pointer-events-none top-2/5 left-3/5 w-24 h-24 animate-pulse [animation-delay:1s] bg-teal-100/60 dark:bg-emerald-800/30" />

      {/* ── Scan line ───────────────────────────────────────────────────────── */}
      <motion.div
        className="absolute inset-x-0 h-px w-full pointer-events-none z-10 bg-linear-to-r from-transparent via-emerald-500/20 dark:via-emerald-500/35 to-transparent"
        animate={{ top: ["20%", "80%"], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ── Floating particles ──────────────────────────────────────────────── */}
      {particles.map((p) => (
        <FloatingParticle key={p.id} {...p} />
      ))}

      {/* ══════════════════════════════════════════════════════════════════════
          Glass card
          LIGHT: crisp white frosted glass, soft green border & shadow
          DARK:  near-transparent dark glass (original scheme)
      ══════════════════════════════════════════════════════════════════════ */}
      <div
        className={[
          "relative z-20 flex flex-col items-center gap-8 px-12 py-12 rounded-[28px] min-w-75",
          "backdrop-blur-xl",
          // backgrounds
          "bg-white/75 dark:bg-[rgba(245,250,240,0.04)]",
          // borders
          "border border-emerald-500/20 dark:border-emerald-700/25",
          // shadows
          "shadow-[0_8px_40px_rgba(10,123,74,0.10),inset_0_0_0_1px_rgba(255,255,255,0.75)]",
          "dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04),0_24px_64px_rgba(0,0,0,0.4)]",
        ].join(" ")}
      >
        {/* ── Icon cluster ──────────────────────────────────────────────────── */}
        <div className="relative w-24 h-24 flex items-center justify-center">

          {/* Outer spinning ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-emerald-600 border-r-emerald-600/40 dark:border-t-emerald-700 dark:border-r-emerald-700/40"
            animate={{ rotate: 360 }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
          />

          {/* Inner spinning ring (reverse) */}
          <motion.div
            className="absolute inset-2.5 rounded-full border border-transparent border-b-emerald-500 border-l-emerald-500/30 dark:border-b-emerald-600 dark:border-l-emerald-600/30"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
          />

          {/* Orbiting dots */}
          <OrbitingDot
            lightClass="bg-emerald-500"
            darkClass="dark:bg-emerald-500"
            sizeClass="w-1.5 h-1.5"
            duration={2.2}
            delay={0}
            radius={44}
            clockwise={true}
          />
          <OrbitingDot
            lightClass="bg-emerald-700"
            darkClass="dark:bg-emerald-700"
            sizeClass="w-[5px] h-[5px]"
            duration={2.2}
            delay={-1.1}
            radius={44}
            clockwise={false}
          />
          <OrbitingDot
            lightClass="bg-emerald-300/70"
            darkClass="dark:bg-emerald-700/50"
            sizeClass="w-1 h-1"
            duration={3}
            delay={-0.7}
            radius={44}
            clockwise={true}
          />

          {/* Center leaf circle */}
          <motion.div
            className={[
              "absolute inset-4.5 flex items-center justify-center rounded-full",
              // LIGHT: soft white-green tinted well
              "bg-emerald-50/90 border border-emerald-400/40",
              // DARK: original dark translucent circle
              "dark:bg-emerald-900/20 dark:border-emerald-700/30",
            ].join(" ")}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <LeafIcon />
          </motion.div>
        </div>

        {/* ── Brand text ────────────────────────────────────────────────────── */}
        <div className="flex flex-col items-center gap-2">
          {/* LIGHT: deep forest green · DARK: white (original) */}
          <h1 className="text-emerald-900 dark:text-white text-xl font-bold tracking-tight">
            AgroLeaf{" "}
            {/* LIGHT: vivid mid-green accent · DARK: emerald-400 (original) */}
            <span className="text-emerald-600 dark:text-emerald-400">AI</span>
          </h1>

          {/* LIGHT: muted green-gray · DARK: white/40 (original) */}
          <p className="text-[13px] text-emerald-700/55 dark:text-white/40 tracking-wide font-normal">
            Agricultural Intelligence Platform
          </p>

          {/* Cycling status text */}
          <div className="h-5 mt-1">
            <AnimatePresence mode="wait">
              <motion.p
                key={statusIndex}
                // LIGHT: rich emerald · DARK: emerald-400 (original)
                className="text-[13px] font-medium text-emerald-700 dark:text-emerald-400 tracking-wide"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
              >
                {STATUS_MESSAGES[statusIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* ── Progress bar ──────────────────────────────────────────────────── */}
        <div className="w-full">
          {/* LIGHT: pale green track · DARK: dark emerald track (original) */}
          <div className="w-full h-0.75 rounded-full overflow-hidden bg-emerald-200/70 dark:bg-emerald-900/20">
            {/* LIGHT: deep-to-mid green · DARK: original dark-to-mid green */}
            <motion.div
              className="h-full rounded-full bg-linear-to-r from-emerald-600 to-emerald-400 dark:from-emerald-700 dark:to-emerald-500"
              animate={{
                width: ["0%", "80%", "95%", "100%", "100%"],
                opacity: [1, 1, 1, 1, 0],
              }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.6, 0.8, 0.95, 1],
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}