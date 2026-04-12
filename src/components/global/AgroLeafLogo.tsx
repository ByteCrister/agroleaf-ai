'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Leaf } from 'lucide-react';

interface AgroLeafLogoProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export default function AgroLeafLogo({ size = 'md', className = '' }: AgroLeafLogoProps) {
    const sizeMap = {
        sm: { icon: 'h-5 w-5', text: 'text-base', container: 'h-8 w-8' },
        md: { icon: 'h-6 w-6', text: 'text-xl', container: 'h-9 w-9' },
        lg: { icon: 'h-8 w-8', text: 'text-2xl', container: 'h-11 w-11' },
    };

    const s = sizeMap[size];

    return (
        <Link href="/" className={`flex items-center gap-2.5 group outline-none focus-visible:ring-2 focus-visible:ring-[#0A7B4A] focus-visible:ring-offset-2 rounded-lg ${className}`}>
            {/* Icon bubble */}
            <motion.div
                className={`relative flex items-center justify-center ${s.container} rounded-xl bg-linear-to-br from-[#0A7B4A] to-[#2C5F2D] shadow-[0_2px_12px_rgba(10,123,74,0.35)] shrink-0`}
                whileHover={{ scale: 1.06, rotate: -4 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
                <Leaf className={`${s.icon} text-white`} strokeWidth={2} />
                {/* Shimmer ring */}
                <motion.div
                    className="absolute inset-0 rounded-xl border border-white/30"
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                />
            </motion.div>

            {/* Wordmark */}
            <div className="flex flex-col leading-none">
                <motion.span
                    className={`font-extrabold tracking-tight ${s.text} text-[#1A2E1A] dark:text-white`}
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.02em' }}
                    whileHover={{ x: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                >
                    <span className="text-[#0A7B4A]">Agro</span>
                    <span>Leaf</span>
                    <span className="ml-1.5 text-xs font-semibold tracking-widest uppercase text-[#0A7B4A]/70 dark:text-[#0A7B4A]/80 align-middle">
                        AI
                    </span>
                </motion.span>
                <span className="text-[10px] font-medium tracking-wider uppercase text-[#3A4D3A]/60 dark:text-white/40 mt-0.5">
                    Crop Disease Diagnosis
                </span>
            </div>
        </Link>
    );
}