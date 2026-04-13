"use client";

import { CropData } from "@/data/dataset-data";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Sprout, ChevronRight } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DatasetBusNetworkProps {
    crops: CropData[];
}

export function DatasetBusNetwork({ crops }: DatasetBusNetworkProps) {
    const [activeCrop, setActiveCrop] = useState<string | null>(null);
    const selected = crops.find((c) => c.name === activeCrop) ?? null;

    return (
        <div className="space-y-4">
            {/* ── Station rail ─────────────────────────────────────── */}
            <div className="relative rounded-2xl border border-[rgba(10,123,74,0.2)] bg-[rgba(245,250,240,0.55)] backdrop-blur-xl overflow-hidden">
                {/* Decorative top accent bar */}
                <div className="h-0.5 w-full bg-linear-to-r from-transparent via-[#0A7B4A] to-transparent opacity-40" />

                <ScrollArea className="w-full whitespace-nowrap p-5 pb-4">
                    <div className="flex w-max items-center gap-0">
                        {crops.map((crop, idx) => (
                            <div key={crop.name} className="flex items-center">
                                {/* Stop */}
                                <button
                                    onClick={() =>
                                        setActiveCrop(activeCrop === crop.name ? null : crop.name)
                                    }
                                    className="group relative flex flex-col items-center gap-2 px-1"
                                >
                                    {/* Node circle */}
                                    <motion.div
                                        whileTap={{ scale: 0.92 }}
                                        className={`relative flex h-14 w-14 items-center justify-center rounded-full border-2 transition-all duration-300 shadow-md
                                            ${activeCrop === crop.name
                                                ? "border-[#0A7B4A] bg-[#0A7B4A] shadow-[0_0_18px_rgba(10,123,74,0.45)]"
                                                : "border-[rgba(10,123,74,0.35)] bg-white/75 group-hover:border-[#0A7B4A] group-hover:shadow-[0_0_12px_rgba(10,123,74,0.25)]"
                                            }`}
                                    >
                                        <Sprout
                                            className={`h-5 w-5 transition-colors duration-300 ${activeCrop === crop.name ? "text-white" : "text-[#0A7B4A]"}`}
                                        />
                                        {/* Pulse ring when active */}
                                        {activeCrop === crop.name && (
                                            <span className="absolute inset-0 rounded-full animate-ping border-2 border-[#0A7B4A] opacity-30" />
                                        )}
                                    </motion.div>

                                    {/* Label */}
                                    <div className="flex flex-col items-center gap-0.5">
                                        <span
                                            className={`max-w-18 truncate text-center text-xs font-semibold leading-tight transition-colors duration-200 ${activeCrop === crop.name ? "text-[#0A7B4A]" : "text-[#1A2E1A]"}`}
                                        >
                                            {crop.name}
                                        </span>
                                        <span className="rounded-full bg-[rgba(10,123,74,0.08)] px-1.5 py-px text-[10px] font-medium text-[#3A4D3A]">
                                            {crop.totalFiles}
                                        </span>
                                    </div>
                                </button>

                                {/* Rail segment between stops */}
                                {idx < crops.length - 1 && (
                                    <div className="relative mx-1 flex items-center" style={{ marginTop: "-28px" }}>
                                        <div className="h-px w-8 bg-linear-to-r from-[rgba(10,123,74,0.5)] to-[rgba(10,123,74,0.2)]" />
                                        <ChevronRight className="h-3 w-3 -ml-1 text-[rgba(10,123,74,0.4)]" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>

                {/* Hint */}
                <p className="px-5 pb-4 text-xs text-[#3A4D3A]/60 font-medium tracking-wide">
                    Tap a crop to explore its disease classes →
                </p>
            </div>

            {/* ── Disease panel ─────────────────────────────────────── */}
            <AnimatePresence mode="wait">
                {selected && (
                    <motion.div
                        key={selected.name}
                        initial={{ opacity: 0, y: 12, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="rounded-2xl border border-[rgba(10,123,74,0.25)] bg-[rgba(245,250,240,0.65)] backdrop-blur-xl overflow-hidden"
                    >
                        {/* Panel header */}
                        <div className="flex items-center justify-between border-b border-[rgba(10,123,74,0.12)] px-5 py-3.5">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0A7B4A]">
                                    <Sprout className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-[#1A2E1A]">{selected.name}</p>
                                    <p className="text-xs text-[#3A4D3A]">
                                        {selected.diseases.length} disease classes · {selected.totalFiles} images
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setActiveCrop(null)}
                                className="rounded-lg px-2.5 py-1 text-xs font-medium text-[#0A7B4A] hover:bg-[rgba(10,123,74,0.1)] transition-colors"
                            >
                                Close
                            </button>
                        </div>

                        {/* Disease list grid */}
                        <div className="grid grid-cols-1 gap-px bg-[rgba(10,123,74,0.07)] sm:grid-cols-2">
                            {selected.diseases.map((d, i) => (
                                <motion.div
                                    key={d.name}
                                    initial={{ opacity: 0, x: -6 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.025, duration: 0.2 }}
                                    className="flex items-center justify-between bg-[rgba(245,250,240,0.7)] px-4 py-2.5 hover:bg-[rgba(10,123,74,0.06)] transition-colors"
                                >
                                    <div className="flex items-center gap-2 min-w-0">
                                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#0A7B4A]" />
                                        <span className="truncate text-sm text-[#1A2E1A]">{d.name}</span>
                                    </div>
                                    <span className="ml-3 shrink-0 rounded-full bg-[rgba(10,123,74,0.1)] px-2 py-0.5 text-xs font-semibold text-[#0A7B4A]">
                                        {d.count}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Summary grid (shown when nothing selected) ─────── */}
            <AnimatePresence>
                {!selected && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-2 gap-3 sm:grid-cols-3"
                    >
                        {crops.map((crop, i) => (
                            <motion.button
                                key={crop.name}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.03 }}
                                onClick={() => setActiveCrop(crop.name)}
                                className="group rounded-2xl border border-[rgba(10,123,74,0.18)] bg-[rgba(245,250,240,0.55)] p-4 text-left backdrop-blur-md transition-all duration-200 hover:border-[rgba(10,123,74,0.4)] hover:bg-[rgba(245,250,240,0.75)] hover:shadow-md"
                            >
                                <div className="mb-2.5 flex items-center gap-2">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[rgba(10,123,74,0.1)] group-hover:bg-[rgba(10,123,74,0.18)] transition-colors">
                                        <Sprout className="h-3.5 w-3.5 text-[#0A7B4A]" />
                                    </div>
                                    <span className="text-sm font-semibold text-[#1A2E1A] leading-tight">
                                        {crop.name}
                                    </span>
                                </div>
                                <div className="flex items-end justify-between">
                                    <p className="text-xs text-[#3A4D3A]">
                                        {crop.diseases.length} classes
                                    </p>
                                    <p className="text-xs font-medium text-[#0A7B4A]">
                                        {crop.totalFiles}
                                    </p>
                                </div>
                                {/* Mini bar */}
                                <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-[rgba(10,123,74,0.1)]">
                                    <div
                                        className="h-full rounded-full bg-linear-to-r from-[#0A7B4A] to-[#2C5F2D] transition-all"
                                        style={{
                                            width: `${Math.min(100, (crop.diseases.length / 15) * 100)}%`,
                                        }}
                                    />
                                </div>
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}