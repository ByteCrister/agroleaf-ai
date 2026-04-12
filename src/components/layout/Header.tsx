'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X, LogOut, User, Settings, ChevronDown, Sprout, BookOpen, Leaf } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import AgroLeafLogo from '../global/AgroLeafLogo';
import { useUserStore } from '@/stores/userStore';
import { signOut } from 'next-auth/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const navLinks = [
  {
    name: 'Diagnose',
    href: '/diagnose',
    description: 'AI-powered leaf analysis',
    icon: Sprout,
  },
  {
    name: 'About',
    href: '/about',
    description: 'Our mission & research',
    icon: BookOpen,
  },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated } = useUserStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const getInitials = () => {
    if (user?.name) {
      return user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  return (
    <>
      {/* ── Header bar ───────────────────────────────────────────────── */}
      <motion.header
        className={cn(
          'sticky top-0 z-50 w-full transition-all duration-300',
          scrolled
            ? 'border-b border-[rgba(10,123,74,0.15)] bg-white/80 dark:bg-[#0d1a0e]/80 backdrop-blur-xl shadow-[0_1px_24px_rgba(10,123,74,0.06)]'
            : 'border-b border-transparent bg-white/40 dark:bg-[#0d1a0e]/40 backdrop-blur-md',
        )}
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">

            {/* Logo */}
            <AgroLeafLogo />

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      'group relative flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                      'text-[#1A2E1A]/70 dark:text-white/60',
                      'hover:text-[#0A7B4A] dark:hover:text-[#22c55e]',
                      'hover:bg-[rgba(10,123,74,0.06)] dark:hover:bg-[rgba(10,123,74,0.15)]',
                    )}
                  >
                    <Icon className="h-3.5 w-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                    <span className="absolute bottom-1 left-4 right-4 h-px bg-[#0A7B4A] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
                  </Link>
                );
              })}
            </nav>

            {/* Desktop auth */}
            <div className="hidden md:flex items-center gap-3">
              {!isAuthenticated ? (
                // ── Replaced SignInDialog with a Link to /signin ──────────────
                <Link href="/signin">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A7B4A] hover:bg-[#2C5F2D] text-white text-sm font-semibold shadow-[0_2px_16px_rgba(10,123,74,0.3)] hover:shadow-[0_4px_24px_rgba(10,123,74,0.4)] transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#0A7B4A] focus-visible:ring-offset-2"
                  >
                    <Leaf className="h-4 w-4" />
                    Sign In
                  </motion.button>
                </Link>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.button
                      className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-[rgba(10,123,74,0.2)] bg-[rgba(245,250,240,0.6)] dark:bg-[rgba(10,123,74,0.1)] hover:border-[#0A7B4A]/40 transition-all outline-none focus-visible:ring-2 focus-visible:ring-[#0A7B4A]"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Avatar className="h-7 w-7 border border-[rgba(10,123,74,0.25)]">
                        <AvatarImage src={user?.image || ''} alt={user?.name || ''} />
                        <AvatarFallback className="bg-[#0A7B4A] text-white text-xs font-semibold">
                          {getInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-[#1A2E1A] dark:text-white/90 max-w-30 truncate">
                        {user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'Account'}
                      </span>
                      <ChevronDown className="h-3.5 w-3.5 text-[#3A4D3A]/60 dark:text-white/40" />
                    </motion.button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-56 border-[rgba(10,123,74,0.2)] bg-white/90 dark:bg-[#0d1a0e]/90 backdrop-blur-xl shadow-[0_8px_32px_rgba(10,123,74,0.12)] rounded-2xl p-1"
                    align="end"
                    sideOffset={8}
                  >
                    <DropdownMenuLabel className="px-3 py-2">
                      <p className="text-sm font-semibold text-[#1A2E1A] dark:text-white truncate">
                        {user?.name || 'User'}
                      </p>
                      <p className="text-xs text-[#3A4D3A]/60 dark:text-white/40 truncate">
                        {user?.email}
                      </p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-[rgba(10,123,74,0.1)]" />
                    <DropdownMenuItem
                      onClick={() => (window.location.href = '/profile')}
                      className="rounded-xl cursor-pointer text-[#1A2E1A] dark:text-white/80 hover:bg-[rgba(10,123,74,0.08)] hover:text-[#0A7B4A] transition-colors"
                    >
                      <User className="mr-2 h-4 w-4" /> Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => (window.location.href = '/settings')}
                      className="rounded-xl cursor-pointer text-[#1A2E1A] dark:text-white/80 hover:bg-[rgba(10,123,74,0.08)] hover:text-[#0A7B4A] transition-colors"
                    >
                      <Settings className="mr-2 h-4 w-4" /> Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-[rgba(10,123,74,0.1)]" />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="rounded-xl cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut className="mr-2 h-4 w-4" /> Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Mobile hamburger */}
            <motion.button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="md:hidden p-2 rounded-xl border border-[rgba(10,123,74,0.2)] bg-[rgba(245,250,240,0.5)] dark:bg-[rgba(10,123,74,0.1)] hover:border-[#0A7B4A]/50 transition-all outline-none focus-visible:ring-2 focus-visible:ring-[#0A7B4A]"
              aria-label="Toggle menu"
              whileTap={{ scale: 0.92 }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={mobileMenuOpen ? 'x' : 'menu'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {mobileMenuOpen
                    ? <X className="h-5 w-5 text-[#0A7B4A]" />
                    : <Menu className="h-5 w-5 text-[#1A2E1A] dark:text-white" />
                  }
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* ── Mobile nav drawer ──────────────────────────────────────── */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
              className="md:hidden border-t border-[rgba(10,123,74,0.12)] bg-white/90 dark:bg-[#0d1a0e]/90 backdrop-blur-xl overflow-hidden"
            >
              <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
                {navLinks.map((link, i) => {
                  const Icon = link.icon;
                  return (
                    <motion.div
                      key={link.name}
                      initial={{ x: -16, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.06, duration: 0.2 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[rgba(10,123,74,0.06)] dark:hover:bg-[rgba(10,123,74,0.15)] transition-colors group"
                      >
                        <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-[rgba(10,123,74,0.08)] dark:bg-[rgba(10,123,74,0.2)] group-hover:bg-[rgba(10,123,74,0.14)] transition-colors">
                          <Icon className="h-4 w-4 text-[#0A7B4A]" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#1A2E1A] dark:text-white">{link.name}</p>
                          <p className="text-xs text-[#3A4D3A]/60 dark:text-white/40">{link.description}</p>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}

                <motion.div
                  className="pt-2 border-t border-[rgba(10,123,74,0.1)]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.18 }}
                >
                  {!isAuthenticated ? (
                    // ── Replaced SignInDialog with a Link to /signin (mobile) ─
                    <Link
                      href="/signin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-[#0A7B4A] hover:bg-[#2C5F2D] text-white text-sm font-semibold transition-colors"
                    >
                      <Leaf className="h-4 w-4" />
                      Sign In
                    </Link>
                  ) : (
                    <div className="flex items-center justify-between px-4 py-2.5 rounded-xl border border-[rgba(10,123,74,0.15)] bg-[rgba(245,250,240,0.5)] dark:bg-[rgba(10,123,74,0.08)]">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border border-[rgba(10,123,74,0.25)]">
                          <AvatarImage src={user?.image || ''} />
                          <AvatarFallback className="bg-[#0A7B4A] text-white text-xs font-semibold">
                            {getInitials()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-[#1A2E1A] dark:text-white truncate max-w-35">
                            {user?.name || user?.email}
                          </p>
                          <p className="text-xs text-[#3A4D3A]/50 dark:text-white/30">Signed in</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSignOut}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      >
                        <LogOut className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}