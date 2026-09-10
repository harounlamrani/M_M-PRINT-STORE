'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion, type Variants } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getProductById } from '@/lib/products';
import { getCategoryById } from '@/lib/categories';
import { cn, formatPrice } from '@/lib/utils';
import type { Product, ProductVariant } from '@/lib/types';

// Easing tuple typed for framer-motion v11 TS strictness.
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface GlowPreset {
  x: string;
  y: string;
  s: number;
  o: number;
}

interface ShowcaseEntry {
  id: string;
  product: Product;
  variant: ProductVariant;
  image: string;
  imageAlt: string;
  glow: GlowPreset;
}

interface EntryConfig {
  id: string;
  productId: string;
  preferVariantId?: string;
  preferColor?: string;
  image: string;
  imageAlt: string;
  glow: GlowPreset;
}

const ENTRY_CONFIGS: EntryConfig[] = [
  {
    id: 'tshirts',
    productId: 'tee-oversized',
    preferVariantId: 'tee-ovs-charcoal',
    preferColor: 'Charcoal',
    image: '/images/categories/tshirts.jpg',
    imageAlt: 'T-shirts blancs oversized portés',
    glow: { x: '-28%', y: '-18%', s: 1.0, o: 0.9 },
  },
  {
    id: 'ensembles',
    productId: 'ens-tee-short',
    preferVariantId: 'ens-ts-combo-0',
    image: '/images/categories/ensembles.jpg',
    imageAlt: 'Ensemble coordonné',
    glow: { x: '26%', y: '-24%', s: 1.15, o: 1 },
  },
  {
    id: 'hoodies',
    productId: 'hoodie-cropped',
    preferVariantId: 'hoodie-crop-black',
    preferColor: 'Black',
    image: '/images/products/hoodie-cropped-black.webp',
    imageAlt: 'Hoodie noir à imprimé dos',
    glow: { x: '0%', y: '8%', s: 1.05, o: 0.95 },
  },
  {
    id: 'joggers',
    productId: 'jogger-baggy',
    preferColor: 'Black',
    image: '/images/categories/joggers.jpg',
    imageAlt: 'Joggers',
    glow: { x: '-24%', y: '20%', s: 1.2, o: 1 },
  },
  {
    id: 'bags',
    productId: 'backpack',
    preferColor: 'Black',
    image: '/images/categories/bags.jpg',
    imageAlt: 'Sac à dos porté',
    glow: { x: '28%', y: '14%', s: 1.1, o: 0.9 },
  },
];

function resolveVariant(product: Product, cfg: EntryConfig): ProductVariant | undefined {
  if (cfg.preferVariantId) {
    const byId = product.variants.find((v) => v.id === cfg.preferVariantId);
    if (byId) return byId;
  }
  if (cfg.preferColor) {
    const byColor = product.variants.find((v) => v.attributes?.color === cfg.preferColor);
    if (byColor) return byColor;
  }
  return product.variants[0];
}

function buildEntries(): ShowcaseEntry[] {
  const out: ShowcaseEntry[] = [];
  for (const cfg of ENTRY_CONFIGS) {
    const product = getProductById(cfg.productId);
    if (!product) continue;
    const variant = resolveVariant(product, cfg);
    if (!variant) continue;
    out.push({
      id: cfg.id,
      product,
      variant,
      image: cfg.image,
      imageAlt: cfg.imageAlt,
      glow: cfg.glow,
    });
  }
  return out;
}

// Staggered info children: slide from left with blur.
const infoChild: Variants = {
  hidden: { opacity: 0, x: -28, filter: 'blur(6px)' },
  show: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.45, ease: EASE } },
  exit: { opacity: 0, x: 24, filter: 'blur(6px)', transition: { duration: 0.18, ease: EASE } },
};

interface HeroProps {
  onOrderClick: (p: Product) => void;
  orderOpen?: boolean;
}

export function Hero({ onOrderClick, orderOpen = false }: HeroProps) {
  const reduce = useReducedMotion() === true;
  const entries = useMemo(buildEntries, []);
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const safeIndex = entries.length === 0 ? 0 : Math.min(index, entries.length - 1);
  const active = entries[safeIndex];

  // Instant motion when reduced motion is preferred.
  const infoChildVariants: Variants = useMemo(() => {
    if (!reduce) return infoChild;
    return {
      hidden: { opacity: 0, x: -28, filter: 'blur(6px)' },
      show: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0 } },
      exit: { opacity: 0, x: 24, filter: 'blur(6px)', transition: { duration: 0 } },
    };
  }, [reduce]);

  const infoParentVariants: Variants = useMemo(
    () => ({
      hidden: {},
      show: { transition: { staggerChildren: reduce ? 0 : 0.09, duration: 0 } },
      exit: { transition: { staggerChildren: 0, duration: 0 } },
    }),
    [reduce],
  );

  // Keep the active thumb visible (centered) in the scroll row.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || !active) return;
    const el = track.querySelector('[data-active="true"]');
    if (el && typeof (el as HTMLElement).scrollIntoView === 'function') {
      (el as HTMLElement).scrollIntoView({
        inline: 'center',
        block: 'nearest',
        behavior: reduce ? 'auto' : 'smooth',
      });
    }
  }, [safeIndex, active, reduce]);

  if (!active) return null;

  const glow = active.glow;
  const categoryLabel = getCategoryById(active.product.category)?.label ?? active.product.category;
  const pad = (n: number) => String(n).padStart(2, '0');

  const scrollBy = (dx: number) => {
    trackRef.current?.scrollBy({ left: dx, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <section
      className="relative overflow-hidden bg-mm-black text-white min-h-svh"
      aria-label="Collection à la une"
    >
      {/* Glow layer — centered wrappers (static transforms) + motion inner boxes.
          No negative margins/positions; overflow stays clipped by the section. */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Intense core */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.div
            className="h-[300px] w-[300px] rounded-full blur-3xl sm:h-[520px] sm:w-[520px]"
            style={{
              background:
                'radial-gradient(circle, rgba(227,27,35,0.55) 0%, rgba(227,27,35,0.18) 45%, transparent 70%)',
            }}
            initial={false}
            animate={{ x: glow.x, y: glow.y, scale: glow.s, opacity: glow.o }}
            transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 48, damping: 20 }}
          />
        </div>
        {/* Wide ambient (parallax lag) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.div
            className="h-[300px] w-[300px] rounded-full blur-3xl sm:h-[520px] sm:w-[520px]"
            style={{
              background:
                'radial-gradient(circle, rgba(227,27,35,0.35) 0%, rgba(227,27,35,0.10) 50%, transparent 72%)',
            }}
            initial={false}
            animate={{ x: glow.x, y: glow.y, scale: glow.s * 1.6, opacity: glow.o * 0.35 }}
            transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 30, damping: 22 }}
          />
        </div>
        {/* Film grain */}
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.07,
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'160\' height=\'160\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'2\'/%3E%3C/filter%3E%3Crect width=\'160\' height=\'160\' filter=\'url(%23n)\' opacity=\'0.6\'/%3E%3C/svg%3E")',
          }}
        />
      </div>

      {/* Content (shifts when order panel opens) */}
      <motion.div
        className="relative flex min-h-svh flex-col justify-center"
        initial={false}
        animate={{
          scale: orderOpen ? 0.97 : 1,
          x: orderOpen ? -24 : 0,
          opacity: orderOpen ? 0.75 : 1,
        }}
        transition={{ duration: reduce ? 0 : 0.4 }}
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 lg:pt-28 pb-12">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            {/* INFO */}
            <div className="order-2 lg:order-1 min-w-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  variants={infoParentVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                >
                  <motion.p
                    variants={infoChildVariants}
                    className="text-caption font-mono uppercase tracking-[0.2em] text-mm-red"
                  >
                    {categoryLabel}
                  </motion.p>
                  <motion.h1
                    variants={infoChildVariants}
                    className="text-display-md font-chillax font-bold mt-3 break-words"
                  >
                    {active.product.name}
                  </motion.h1>
                  {active.product.shortDescription ? (
                    <motion.p variants={infoChildVariants} className="text-body-lg text-white/70 mt-4 break-words">
                      {active.product.shortDescription}
                    </motion.p>
                  ) : null}
                  <motion.p
                    variants={infoChildVariants}
                    className="text-heading-lg font-bold text-mm-red mt-5"
                  >
                    {formatPrice(active.variant.price)}
                  </motion.p>
                  <motion.div variants={infoChildVariants} className="mt-7">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto"
                      onClick={() => onOrderClick(active.product)}
                    >
                      <ShoppingBag className="h-5 w-5" aria-hidden="true" />
                      Commander
                    </Button>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* VISUAL — mobile: full-width capped at 340px, centered, padded */}
            <div className="order-1 lg:order-2 min-w-0 mx-auto w-full max-w-[340px] px-2 sm:px-0 lg:max-w-none lg:px-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, x: 90, scale: 0.85 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -90, scale: 0.94 }}
                  transition={{ duration: reduce ? 0 : 0.45, ease: reduce ? 'linear' : EASE }}
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-white/10 shadow-[0_30px_80px_-20px_rgba(227,27,35,0.45)]">
                      <Image
                        src={active.image}
                        alt={active.imageAlt}
                        fill
                        className="object-contain lg:object-cover"
                        sizes="(max-width:1024px) 340px, 50vw"
                        priority
                      />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* SLIDER */}
          <div className="mt-12">
            <div className="flex items-center justify-between gap-4">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">Collection</p>
              <p className="font-mono text-sm text-white/50" aria-live="polite">
                {pad(safeIndex + 1)} / {pad(entries.length)}
              </p>
              <div className="hidden sm:flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Produit précédent"
                  onClick={() => scrollBy(-320)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-mm-red hover:text-mm-red"
                >
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label="Produit suivant"
                  onClick={() => scrollBy(320)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-mm-red hover:text-mm-red"
                >
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div
              ref={trackRef}
              className="mt-4 flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide"
              role="listbox"
              aria-label="Choisir un produit à la une"
            >
              {entries.map((entry, i) => {
                const isActive = i === safeIndex;
                return (
                  <button
                    key={entry.id}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    aria-label={entry.product.name}
                    data-active={isActive ? 'true' : 'false'}
                    onClick={() => setIndex(i)}
                    className={cn(
                      'w-20 shrink-0 snap-start text-left transition',
                      isActive ? 'ring-2 ring-mm-red ring-offset-2 ring-offset-black' : 'opacity-60 hover:opacity-100',
                    )}
                  >
                    <span className="relative block h-24 w-full overflow-hidden rounded-lg border border-white/10">
                      <Image
                        src={entry.image}
                        alt={entry.imageAlt}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </span>
                    <span className="mt-1.5 block truncate text-[11px] text-white/60">
                      {entry.product.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
