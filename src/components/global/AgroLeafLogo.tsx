import { plusJakarta } from '@/fonts/google-fonts';
import { Leaf } from 'lucide-react';
import Link from 'next/link';

export default function AgroLeafLogo() {
    return (
        <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
                <Leaf className="h-7 w-7 text-primary transition-transform group-hover:scale-105 duration-200" />
                <div className="absolute inset-0 bg-primary/20 blur-md rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className={`${plusJakarta.className} text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent`}>
                AgroLeaf AI
            </span>
        </Link>
    );
}