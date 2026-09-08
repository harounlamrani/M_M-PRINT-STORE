'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { cn } from '@/lib/utils';

const navigation = [
  { label: 'Accueil', href: '/' },
  { label: 'T-Shirts', href: '#tshirts' },
  { label: 'Ensembles', href: '#ensembles' },
  { label: 'Hoodies', href: '#hoodies' },
  { label: 'Joggers', href: '#joggers' },
  { label: 'Sac à dos', href: '#sac-a-dos' },
  { label: 'Livraison', href: '#delivery' },
  { label: 'Contact', href: '#contact' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { openCart, getItemCount } = useCartStore();
  const cartCount = getItemCount();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 bg-mm-red border-b border-mm-red/30 transition-shadow duration-200',
        scrolled && 'shadow-lg'
      )}
      role="banner"
    >
      <nav className="container" aria-label="Navigation principale">
        <div className={cn('flex items-center justify-between transition-all duration-200', scrolled ? 'h-10 lg:h-12' : 'h-12 lg:h-14')}>
          <Link
            href="/"
            className="flex items-center gap-2 text-display-sm font-chillax font-bold tracking-tight text-mm-white hover:opacity-80 transition-opacity"
            aria-label="M_M PRINT STORE - Accueil"
          >
            <span className="text-mm-white">M_</span>
            <span>M</span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-body-md font-medium text-mm-white/90 hover:text-mm-red transition-colors duration-fast relative after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-0 after:bg-mm-red hover:after:w-full after:transition-all after:duration-300"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={openCart}
              className="relative p-2 text-mm-white hover:text-mm-white/80 transition-colors"
              aria-label={`Panier (${cartCount} articles)`}
            >
              <ShoppingBag className="h-6 w-6" aria-hidden="true" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-caption font-bold text-mm-red">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMenuOpen(true)}
              className="lg:hidden p-2 text-mm-white hover:text-mm-white/80 transition-colors"
              aria-label="Ouvrir le menu"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </nav>

      {/* Navbar fade: red melts into page content below */}
      <div className="pointer-events-none absolute inset-x-0 top-full h-4 bg-gradient-to-b from-mm-red to-transparent sm:h-6" aria-hidden="true" />

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 z-50 bg-mm-black/98 backdrop-blur-xl flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Menu mobile"
          >
            <div className="flex items-center justify-between p-6 border-b border-mm-white/10">
              <span className="text-display-sm font-chillax font-bold tracking-tight">
                <span className="text-mm-red">M_</span>
                <span>M</span>
              </span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 text-mm-white hover:text-mm-red transition-colors"
                aria-label="Fermer le menu"
              >
                <X className="h-7 w-7" aria-hidden="true" />
              </button>
            </div>

            <nav className="flex-1 py-8 px-6 overflow-y-auto" aria-label="Navigation mobile">
              <ul className="space-y-6" role="list">
                {navigation.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-display-sm font-chillax font-medium text-mm-white hover:text-mm-red transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-12 pt-8 border-t border-mm-white/10 space-y-4">
                <button
                  onClick={() => { openCart(); setIsMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 text-body-lg font-medium text-mm-white bg-mm-red hover:bg-mm-red-dark rounded-md transition-colors"
                >
                  <ShoppingBag className="h-6 w-6" aria-hidden="true" />
                  <span>Panier</span>
                  {cartCount > 0 && (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-mm-red-light text-caption font-bold text-mm-white">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </button>
              </div>
            </nav>

            <div className="p-6 border-t border-mm-white/10">
              <p className="text-body-sm text-mm-white/70 text-center">
                M_M PRINT STORE — Alger, Algérie
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </header>
  );
}