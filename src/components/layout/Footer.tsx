import Link from 'next/link';
import { Mail, Heart, ExternalLink } from 'lucide-react';
import { FaGithub, FaLinkedin, FaInstagram, FaFacebook } from 'react-icons/fa6';
import AgroLeafLogo from '../global/AgroLeafLogo';
import { SOCIAL_LINKS } from '@/const/social-links';

const footerLinks = {
    product: [
        { name: 'Diagnose', href: '/diagnose' },
        { name: 'How It Works', href: '/how-it-works' },
        { name: 'Supported Crops', href: '/crops' },
        { name: 'API Access', href: '/api-docs-client' },
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
        { name: 'Privacy Policy', href: '/privacy-policy' },
        { name: 'Terms of Service', href: '/terms' },
    ],
};

const socialLinks = [
    { href: SOCIAL_LINKS.GITHUB, icon: FaGithub, label: 'GitHub' },
    { href: SOCIAL_LINKS.FACEBOOK, icon: FaFacebook, label: 'Facebook' },   
    { href: SOCIAL_LINKS.LINKEDIN, icon: FaLinkedin, label: 'LinkedIn' },
    { href: SOCIAL_LINKS.INSTAGRAM, icon: FaInstagram, label: 'Instagram' }, 
    { href: SOCIAL_LINKS.EMAIL, icon: Mail, label: 'Email' },
];

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative mt-auto overflow-hidden">
            {/* Subtle gradient top border */}
            <div className="h-px w-full bg-linear-to-r from-transparent via-[rgba(10,123,74,0.4)] to-transparent" />

            {/* Background layer */}
            <div className="relative bg-[rgba(245,250,240,0.7)] dark:bg-[rgba(13,26,14,0.9)] backdrop-blur-xl">

                {/* Decorative blobs (static, no motion) */}
                <div className="pointer-events-none absolute -top-24 -left-20 h-64 w-64 rounded-full bg-[rgba(10,123,74,0.05)] blur-3xl" />
                <div className="pointer-events-none absolute -bottom-16 right-10 h-48 w-48 rounded-full bg-[rgba(44,95,45,0.06)] blur-3xl" />

                <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">

                    {/* ── Main grid ─────────────────────────────────────────────── */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 mb-12">

                        {/* Brand column */}
                        <div className="lg:col-span-2 space-y-5">
                            <AgroLeafLogo size="md" />

                            <p
                                className="text-sm text-[#3A4D3A]/70 dark:text-white/50 leading-relaxed max-w-xs"
                                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                            >
                                AI-powered multi-crop disease diagnosis for rice, potato, corn, and more.
                                Protecting Bangladesh&apos;s harvests with cutting-edge vision intelligence.
                            </p>

                            {/* Social icons */}
                            <div className="flex items-center gap-2 pt-1">
                                {socialLinks.map(({ href, icon: Icon, label }) => (
                                    <Link
                                        key={label}
                                        href={href}
                                        target={href.startsWith('mailto') ? undefined : '_blank'}
                                        rel="noopener noreferrer"
                                        aria-label={label}
                                        className="group flex items-center justify-center h-9 w-9 rounded-xl border border-[rgba(10,123,74,0.2)] bg-white/60 dark:bg-white/5 hover:border-[#0A7B4A] hover:bg-[rgba(10,123,74,0.08)] dark:hover:bg-[rgba(10,123,74,0.2)] text-[#3A4D3A]/60 dark:text-white/40 hover:text-[#0A7B4A] dark:hover:text-[#4ade80] transition-all duration-200"
                                    >
                                        <Icon className="h-4 w-4" />
                                    </Link>
                                ))}
                            </div>

                            {/* Badge */}
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[rgba(10,123,74,0.2)] bg-[rgba(10,123,74,0.06)] dark:bg-[rgba(10,123,74,0.15)]">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" />
                                <span className="text-xs font-medium text-[#0A7B4A] dark:text-[#4ade80]">
                                    All systems operational
                                </span>
                            </div>
                        </div>

                        {/* Link columns */}
                        {[
                            { title: 'Product', links: footerLinks.product },
                            { title: 'Company', links: footerLinks.company },
                            { title: 'Support', links: footerLinks.support },
                        ].map(({ title, links }) => (
                            <div key={title}>
                                <h3
                                    className="text-xs font-bold uppercase tracking-[0.12em] text-[#0A7B4A] dark:text-[#4ade80] mb-4"
                                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                >
                                    {title}
                                </h3>
                                <ul className="space-y-2.5">
                                    {links.map((link) => (
                                        <li key={link.name}>
                                            <Link
                                                href={link.href}
                                                className="group inline-flex items-center gap-1 text-sm text-[#3A4D3A]/70 dark:text-white/50 hover:text-[#0A7B4A] dark:hover:text-white transition-colors duration-150"
                                                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                            >
                                                <span className="relative">
                                                    {link.name}
                                                    <span className="absolute -bottom-px left-0 w-0 h-px bg-[#0A7B4A] group-hover:w-full transition-all duration-300" />
                                                </span>
                                                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-60 transition-opacity -translate-y-px" />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* ── Bottom bar ────────────────────────────────────────────── */}
                    <div className="pt-6 border-t border-[rgba(10,123,74,0.12)] flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p
                            className="text-xs text-[#3A4D3A]/50 dark:text-white/30 flex items-center gap-1.5"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                            © {currentYear} AgroLeaf AI. Made with{' '}
                            <Heart className="h-3 w-3 text-red-400 fill-red-400 shrink-0" />{' '}
                            by Sadiqul Islam Shakib for sustainable agriculture in Bangladesh.
                        </p>
                        <div className="flex items-center gap-4">
                            <span
                                className="text-xs text-[#3A4D3A]/40 dark:text-white/20"
                                style={{ fontFamily: "'JetBrains Mono', monospace" }}
                            >
                                v2.0 · Vision Transformer
                            </span>
                            <span className="h-3 w-px bg-[rgba(10,123,74,0.2)]" />
                            <span
                                className="text-xs text-[#3A4D3A]/40 dark:text-white/20"
                                style={{ fontFamily: "'JetBrains Mono', monospace" }}
                            >
                                BD 🌿
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}