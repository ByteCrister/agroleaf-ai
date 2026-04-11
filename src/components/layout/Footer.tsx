import Link from 'next/link';
import { Mail, Heart } from 'lucide-react';
import { FaGithub, FaTwitter } from 'react-icons/fa';
import { inter, jetbrainsMono } from '@/fonts/google-fonts';
import AgroLeafLogo from '../global/AgroLeafLogo';

const footerLinks = {
    product: [
        { name: 'Diagnose', href: '/diagnose' },
        { name: 'How It Works', href: '/how-it-works' },
        { name: 'Supported Crops', href: '/crops' },
        { name: 'API Access', href: '/api' },
    ],
    company: [
        { name: 'About Us', href: '/about' },
        { name: 'Research', href: '/research' },
        { name: 'Blog', href: '/blog' },
        { name: 'Careers', href: '/careers' },
    ],
    support: [
        { name: 'Help Center', href: '/help' },
        { name: 'Contact', href: '/contact' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
    ],
};

export function Footer() {
    return (
        <footer className="border-t border-border/40 bg-background/95 backdrop-blur-sm mt-auto">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
                    {/* Brand Column */}
                    <div className="lg:col-span-2 space-y-4">
                        <AgroLeafLogo />
                        <p className={`${inter.className} text-sm text-muted-foreground leading-relaxed max-w-md`}>
                            AI-powered multi-crop disease diagnosis for rice, potato, corn, and more.
                            Helping farmers protect their harvest with cutting-edge vision transformers.
                        </p>
                        <div className="flex items-center gap-4 pt-2">
                            <Link href="https://github.com" target="_blank" rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-primary transition-colors">
                                <FaGithub className="h-5 w-5" />
                            </Link>
                            <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-primary transition-colors">
                                <FaTwitter className="h-5 w-5" />
                            </Link>
                            <Link href="mailto:hello@agroleaf.ai"
                                className="text-muted-foreground hover:text-primary transition-colors">
                                <Mail className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h3 className={`font-semibold text-foreground mb-4 text-sm uppercase tracking-wider`}>Product</h3>
                        <ul className="space-y-2">
                            {footerLinks.product.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className={`font-semibold text-foreground mb-4 text-sm uppercase tracking-wider`}>Company</h3>
                        <ul className="space-y-2">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className={`font-semibold text-foreground mb-4 text-sm uppercase tracking-wider`}>Support</h3>
                        <ul className="space-y-2">
                            {footerLinks.support.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-6 border-t border-border/40 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className={`${inter.className} text-xs text-muted-foreground flex items-center gap-1`}>
                        © 2025 AgroLeaf AI. Made with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> for sustainable agriculture.
                    </p>
                    <p className={`${jetbrainsMono.className} text-xs text-muted-foreground`}>
                        v2.0 — Multi-Crop Vision Transformer
                    </p>
                </div>
            </div>
        </footer>
    );
}