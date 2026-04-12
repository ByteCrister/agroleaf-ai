'use client';

/**
 * AgroLeaf AI — Custom Toast System
 *
 * Usage:
 *   import { toast } from 'sonner';
 *   import { agToast } from '@/components/ui/ag-toast';
 *
 *   agToast.success('Disease identified', 'Bacterial Leaf Blight detected with 94% confidence.');
 *   agToast.error('Upload failed', 'Image too large. Max 10 MB.');
 *   agToast.info('Tip', 'Try a closer shot for better accuracy.');
 *   agToast.warning('Low confidence', 'Score below 60%. Please retake the photo.');
 *   agToast.loading('Analyzing…');
 *   agToast.promise(myAsyncFn(), { loading: 'Uploading…', success: 'Done!', error: 'Failed.' });
 *
 * Add <AgroToaster /> once in your root layout.
 */

import { Toaster, toast } from 'sonner';
import {
    CheckCircle2,
    XCircle,
    Info,
    AlertTriangle,
    Leaf,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ── Toaster component ──────────────────────────────────────────────────────────
export function AgroToaster() {
    return (
        <Toaster
            position="bottom-right"
            expand={false}
            richColors={false}
            closeButton
            toastOptions={{
                duration: 4500,
                classNames: {
                    toast: cn(
                        'group flex items-start gap-3 rounded-2xl px-4 py-3.5 min-w-[320px] max-w-[420px]',
                        'border bg-white/90 dark:bg-[#0d1a0e]/90 backdrop-blur-xl',
                        'border-[rgba(10,123,74,0.22)] dark:border-[rgba(10,123,74,0.3)]',
                        'shadow-[0_8px_32px_rgba(10,123,74,0.12)]',
                        'data-[type=error]:border-red-200/70 dark:data-[type=error]:border-red-800/40',
                        'data-[type=warning]:border-amber-200/70 dark:data-[type=warning]:border-amber-700/40',
                        'data-[type=info]:border-teal-200/70 dark:data-[type=info]:border-teal-700/40',
                        'font-[\'Plus_Jakarta_Sans\',sans-serif]',
                    ),
                    title:
                        'text-sm font-semibold text-[#1A2E1A] dark:text-white leading-snug',
                    description:
                        'text-xs text-[#3A4D3A]/70 dark:text-white/50 mt-0.5 leading-relaxed',
                    closeButton: cn(
                        'absolute top-3 right-3 rounded-lg p-1 opacity-0 group-hover:opacity-60',
                        'hover:opacity-100 hover:bg-[rgba(10,123,74,0.08)] transition-all',
                        'text-[#3A4D3A]/50 dark:text-white/40',
                    ),
                    actionButton:
                        'mt-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#0A7B4A] text-white hover:bg-[#2C5F2D] transition-colors',
                    cancelButton:
                        'mt-2 px-3 py-1.5 text-xs font-medium rounded-lg border border-[rgba(10,123,74,0.25)] text-[#0A7B4A] hover:bg-[rgba(10,123,74,0.05)] transition-colors',
                    loader:
                        'text-[#0A7B4A]',
                },
                style: {
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                },
            }}
        />
    );
}

// ── Toast icon helpers ─────────────────────────────────────────────────────────
const iconClass = 'h-4 w-4 flex-shrink-0 mt-0.5';

const icons = {
    success: <CheckCircle2 className={cn(iconClass, 'text-[#0A7B4A]')} />,
    error: <XCircle className={cn(iconClass, 'text-red-500')} />,
    warning: <AlertTriangle className={cn(iconClass, 'text-amber-500')} />,
    info: <Info className={cn(iconClass, 'text-teal-500')} />,
    default: <Leaf className={cn(iconClass, 'text-[#0A7B4A]/70')} />,
};

// ── Branded toast API ──────────────────────────────────────────────────────────
export const agToast = {
    success(title: string, description?: string) {
        return toast(title, {
            description,
            icon: icons.success,
            // Sonner's richColors=false so we control the styling above
        });
    },

    error(title: string, description?: string) {
        return toast(title, {
            description,
            icon: icons.error,
        });
    },

    warning(title: string, description?: string) {
        return toast(title, {
            description,
            icon: icons.warning,
        });
    },

    info(title: string, description?: string) {
        return toast(title, {
            description,
            icon: icons.info,
        });
    },

    loading(title: string, description?: string) {
        return toast.loading(title, { description });
    },

    promise<T>(
        promise: Promise<T>,
        msgs: { loading: string; success: string; error: string },
    ) {
        return toast.promise(promise, {
            loading: msgs.loading,
            success: msgs.success,
            error: msgs.error,
        });
    },

    dismiss(id?: string | number) {
        toast.dismiss(id);
    },
};

// Re-export raw toast for advanced use
export { toast };