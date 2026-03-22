'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User } from 'lucide-react';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Events', href: '/events' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hide navbar on dashboard/admin routes
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin') || pathname === '/login') {
    return null;
  }

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
      scrolled ? 'py-4 bg-background/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800' : 'py-8 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="text-2xl font-black uppercase tracking-tighter">
          AFRO <span className="text-primary italic">DANZ</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className={`text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors ${
                pathname === link.href ? 'text-primary' : scrolled ? 'text-foreground' : 'text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link 
            href="/login"
            className="px-6 py-3 bg-primary text-white font-black rounded-full shadow-xl shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2"
          >
            <User className="w-4 h-4" /> Portal
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`md:hidden p-2 rounded-xl ${scrolled ? 'text-foreground' : 'text-white'}`}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-background border-b border-slate-200 dark:border-slate-800 p-6 md:hidden flex flex-col gap-6 shadow-2xl"
          >
            {NAV_LINKS.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-2xl font-black uppercase tracking-tight hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <Link 
              href="/login"
              onClick={() => setIsOpen(false)}
              className="w-full py-4 bg-primary text-white font-black rounded-2xl text-center shadow-xl"
            >
              Member Portal
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
