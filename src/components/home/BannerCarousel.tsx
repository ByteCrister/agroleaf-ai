"use client";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Camera, CheckCircle2, ChevronLeft, ChevronRight, Pause, Play, Shield, Sprout, Zap } from "lucide-react";
import { BANNER_SLIDES } from "@/data/home-data";
import { jetbrainsMono } from "@/fonts/google-fonts";
// ──────────────────────────────────────────────────────────────────
// Banner Carousel Component

import { useEffect, useRef, useState } from "react";
import { SiPython, SiTensorflow } from "react-icons/si";

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
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  const slide = BANNER_SLIDES[current];

  const imgVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      scale: 1.08,
      x: dir > 0 ? 60 : -60,
    }),
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
      {/* FIX: added background color to prevent white flash during crossfade */}
      <div className="relative h-[90vh] min-h-150 max-h-225 flex flex-col bg-[#0a120b]">
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

        {/* ── LAYER 1: Left-to-right gradient overlay ── */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, rgba(5,14,6,0.82) 0%, rgba(5,14,6,0.68) 30%, rgba(5,14,6,0.35) 55%, rgba(5,14,6,0.08) 75%, transparent 100%)",
          }}
        />

        {/* ── LAYER 2: Subtle bottom vignette ── */}
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

        {/* ── LAYER 4: Dot-grid accent ── */}
        <div
          className="absolute inset-y-0 left-0 z-10 opacity-[0.035] pointer-events-none"
          style={{
            width: "55%",
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* ── LAYER 5: Top progress bar ── */}
        <div className="absolute top-0 left-0 right-0 h-0.75 bg-white/10 z-30">
          {isPlaying && (
            <motion.div
              key={`bar-${current}`}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 5.8, ease: "linear" }}
              className="h-full bg-linear-to-r from-[#10B981] via-[#4ade80] to-[#86efac]"
            />
          )}
        </div>

        {/* ── LAYER 6: Slide index strip — left vertical ── */}
        <div className="absolute left-5 md:left-8 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-center gap-3">
          {BANNER_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                goTo(i, i > current ? 1 : -1);
                setIsPlaying(false);
              }}
              aria-label={`Slide ${i + 1}`}
              className={`transition-all duration-500 rounded-full ${i === current
                  ? "h-10 w-0.75 bg-[#10B981]"
                  : "h-4 w-0.75 bg-white/30 hover:bg-white/55"
                }`}
            />
          ))}
        </div>

        {/* ── LAYER 7: MAIN TEXT CONTENT ── */}
        <div className="relative z-20 flex flex-col justify-end h-full pb-24 md:pb-20 px-6 md:px-14 lg:px-20 max-w-7xl mx-auto w-full">
          <div
            className={`${jetbrainsMono.className} absolute top-7 right-7 text-[11px] font-bold text-white/30 tracking-[0.2em] hidden md:block`}
          >
            {String(current + 1).padStart(2, "0")}{" "}
            <span className="text-white/15">
              / {String(total).padStart(2, "0")}
            </span>
          </div>

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

          <AnimatePresence mode="wait">
            <motion.div
              key={`headline-${current}`}
              variants={textVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: 0.55,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.1,
              }}
            >
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.02] text-white max-w-3xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)]">
                {slide.headline}
                <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-[#10B981] via-[#4ade80] to-[#86efac]">
                  {slide.headlineAccent}
                </span>
              </h1>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={`divider-${current}`}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              exit={{ scaleX: 0, opacity: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="origin-left mt-6 mb-5 w-24 h-0.5 bg-linear-to-r from-[#10B981] to-transparent"
            />
          </AnimatePresence>

          <div className="flex flex-col md:flex-row md:items-end gap-8">
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
            <div className="flex items-center gap-2 md:hidden">
              {BANNER_SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    goTo(i, i > current ? 1 : -1);
                    setIsPlaying(false);
                  }}
                  className={`rounded-full transition-all duration-300 ${i === current
                      ? "w-6 h-2 bg-[#10B981]"
                      : "w-2 h-2 bg-white/30"
                    }`}
                />
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              {BANNER_SLIDES.map((s, i) => (
                <button
                  key={i}
                  onClick={() => {
                    goTo(i, i > current ? 1 : -1);
                    setIsPlaying(false);
                  }}
                  className={`relative overflow-hidden rounded-xl transition-all duration-400 ${i === current
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
                    loading="eager"
                  />
                  {i === current && (
                    <div className="absolute inset-0 bg-[#10B981]/20" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2.5 rounded-xl bg-white/10 border border-white/15 hover:bg-white/20 transition-colors"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="h-3.5 w-3.5 text-white" />
                ) : (
                  <Play className="h-3.5 w-3.5 text-white" />
                )}
              </button>
              <div className="w-px h-5 bg-white/15" />
              <button
                onClick={() => {
                  goTo(current - 1, -1);
                  setIsPlaying(false);
                }}
                className="p-2.5 rounded-xl bg-white/10 border border-white/15 hover:bg-white/20 transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft className="h-4 w-4 text-white" />
              </button>
              <button
                onClick={() => {
                  goTo(current + 1, 1);
                  setIsPlaying(false);
                }}
                className="p-2.5 rounded-xl bg-white/10 border border-white/15 hover:bg-white/20 transition-colors"
                aria-label="Next"
              >
                <ChevronRight className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[rgba(10,123,74,0.06)] dark:bg-[rgba(10,123,74,0.1)] border-b border-[rgba(10,123,74,0.12)] py-4">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-[#3A4D3A]/55 dark:text-white/35">
            {[
              {
                icon: <SiTensorflow className="text-orange-500 h-4 w-4" />,
                label: "TensorFlow",
              },
              {
                icon: <SiPython className="text-blue-500 h-4 w-4" />,
                label: "PyTorch",
              },
              {
                icon: <Shield className="text-[#0A7B4A] h-4 w-4" />,
                label: "98% Accuracy",
              },
              {
                icon: <Zap className="text-amber-500 h-4 w-4" />,
                label: "< 2s Response",
              },
              {
                icon: <CheckCircle2 className="text-[#10B981] h-4 w-4" />,
                label: "Free for Farmers",
              },
            ].map(({ icon, label }) => (
              <span
                key={label}
                className="flex items-center gap-2 font-semibold"
              >
                {icon} {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}