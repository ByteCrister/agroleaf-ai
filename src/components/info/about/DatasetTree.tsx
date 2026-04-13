"use client";

import { useState } from "react";
import { CropData } from "@/data/dataset-data";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight, Sprout, Microscope } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DatasetTreeProps {
    crops: CropData[];
}

export function DatasetTree({ crops }: DatasetTreeProps) {
    const totalImages = crops.reduce((a, c) => a + c.totalFiles, 0);
    const totalDiseases = crops.reduce((a, c) => a + c.diseases.length, 0);

    return (
        <div className="rounded-2xl border border-[rgba(10,123,74,0.2)] bg-[rgba(245,250,240,0.55)] backdrop-blur-xl overflow-hidden">
            {/* Header bar */}
            <div className="flex items-center justify-between border-b border-[rgba(10,123,74,0.12)] px-5 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0A7B4A] shadow-md shadow-[rgba(10,123,74,0.3)]">
                        <Sprout className="h-4.5 w-4.5 text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-[#1A2E1A]">Dataset Structure</p>
                        <p className="text-xs text-[#3A4D3A]">Explore crops and disease classes</p>
                    </div>
                </div>
                {/* Stats pills */}
                <div className="flex items-center gap-2">
                    <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-[rgba(10,123,74,0.2)] bg-white/60 px-3 py-1 text-xs font-semibold text-[#1A2E1A]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#0A7B4A]" />
                        {crops.length} crops
                    </span>
                    <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-[rgba(10,123,74,0.2)] bg-white/60 px-3 py-1 text-xs font-semibold text-[#1A2E1A]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#2C5F2D]" />
                        {totalDiseases} classes
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0A7B4A] px-3 py-1 text-xs font-semibold text-white shadow-sm shadow-[rgba(10,123,74,0.3)]">
                        {totalImages.toLocaleString()} imgs
                    </span>
                </div>
            </div>

            {/* Tree */}
            <ScrollArea className="h-130 px-3 py-3">
                <div className="space-y-0.5">
                    {crops.map((crop, i) => (
                        <motion.div
                            key={crop.name}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.02, duration: 0.25 }}
                        >
                            <TreeCropNode crop={crop} />
                        </motion.div>
                    ))}
                </div>
            </ScrollArea>

            {/* Footer */}
            <div className="h-0.5 w-full bg-linear-to-r from-transparent via-[#0A7B4A] to-transparent opacity-20" />
        </div>
    );
}

function TreeCropNode({ crop }: { crop: CropData }) {
    const [isOpen, setIsOpen] = useState(false);

    const diseasePercent = Math.min(100, (crop.diseases.length / 15) * 100);

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger className="group flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left transition-all duration-150 hover:bg-[rgba(10,123,74,0.07)] data-[state=open]:bg-[rgba(10,123,74,0.1)]">
                {/* Chevron */}
                <motion.div
                    animate={{ rotate: isOpen ? 90 : 0 }}
                    transition={{ duration: 0.18 }}
                    className="shrink-0"
                >
                    <ChevronRight className="h-3.5 w-3.5 text-[#0A7B4A]" />
                </motion.div>

                {/* Folder icon */}
                <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors duration-150 ${isOpen ? "bg-[#0A7B4A]" : "bg-[rgba(10,123,74,0.1)] group-hover:bg-[rgba(10,123,74,0.18)]"}`}
                >
                    <Sprout
                        className={`h-3.5 w-3.5 transition-colors ${isOpen ? "text-white" : "text-[#0A7B4A]"}`}
                    />
                </div>

                {/* Name */}
                <span className="flex-1 text-sm font-semibold text-[#1A2E1A] truncate">
                    {crop.name}
                </span>

                {/* Mini progress + count */}
                <div className="ml-auto flex items-center gap-3">
                    <div className="hidden sm:flex w-20 flex-col gap-0.5">
                        <div className="h-1 w-full overflow-hidden rounded-full bg-[rgba(10,123,74,0.1)]">
                            <motion.div
                                className="h-full rounded-full bg-linear-to-r from-[#0A7B4A] to-[#2C5F2D]"
                                initial={{ width: 0 }}
                                animate={{ width: `${diseasePercent}%` }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                            />
                        </div>
                        <p className="text-[10px] text-right text-[#3A4D3A]/70">
                            {crop.diseases.length} classes
                        </p>
                    </div>
                    <span className="rounded-full bg-[rgba(10,123,74,0.1)] px-2.5 py-0.5 text-xs font-semibold text-[#0A7B4A] tabular-nums">
                        {crop.totalFiles.toLocaleString()}
                    </span>
                </div>
            </CollapsibleTrigger>

            <CollapsibleContent forceMount>
                <AnimatePresence initial={false}>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.22, ease: "easeInOut" }}
                            className="overflow-hidden"
                        >
                            <div className="ml-10 mt-0.5 mb-1 space-y-px rounded-xl border border-[rgba(10,123,74,0.1)] bg-white/30 p-1.5 backdrop-blur-sm">
                                {crop.diseases.map((disease, i) => (
                                    <motion.div
                                        key={disease.name}
                                        initial={{ opacity: 0, x: -4 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.015, duration: 0.15 }}
                                        className="flex items-center gap-2.5 rounded-lg px-3 py-1.5 transition-colors hover:bg-[rgba(10,123,74,0.06)]"
                                    >
                                        <Microscope className="h-3 w-3 shrink-0 text-[#0A7B4A]/60" />
                                        <span className="flex-1 truncate text-xs text-[#1A2E1A]">
                                            {disease.name}
                                        </span>
                                        <span className="ml-auto shrink-0 rounded-full bg-[rgba(10,123,74,0.08)] px-2 py-0.5 text-[10px] font-semibold text-[#3A4D3A] tabular-nums">
                                            {disease.count}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CollapsibleContent>
        </Collapsible>
    );
}