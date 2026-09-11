'use client';

import { useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion, type Variants } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { MoltenMetal } from '@/components/effects/molten-metal';
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
  productId: string;
  image: string;
  preferVariantId?: string;
  preferColor?: string;
}

// Depth filters — function ORDER identical (brightness first, then drop-shadow)
// so framer-motion can interpolate the lists. Far has brightness only per spec.
const FILTER_CENTER = 'brightness(1) drop-shadow(0 24px 48px rgba(227,27,35,0.35))';
const FILTER_SIDE = 'brightness(0.65) drop-shadow(0 16px 32px rgba(0,0,0,0.6))';
  const FILTER_FAR = 'brightness(0.5) drop-shadow(0 0px 0px rgba(0,0,0,0))'; // zero shadow = invisible, keeps list interpolable

// 5-preset glow mechanism (preserved); cycled by entry index since entries are products now.
const GLOW_PRESETS: GlowPreset[] = [
  { x: '14%', y: '-18%', s: 1.0, o: 0.9 },
  { x: '0%', y: '-24%', s: 1.15, o: 1 },
  { x: '-14%', y: '8%', s: 1.05, o: 0.95 },
  { x: '8%', y: '20%', s: 1.2, o: 1 },
  { x: '-8%', y: '14%', s: 1.1, o: 0.9 },
];

// One entry per REAL product with a real on-disk photo (products.ts order).
// Display image rule: (1) new transparent PNG matching the product,
// else (2) existing real on-disk image already referenced by that product.
const ENTRY_CONFIGS: EntryConfig[] = [
  {
    productId: 'tee-oversized',
    image: '/images/products/t-shirt-oversized-white.png',
    preferVariantId: 'tee-ovs-white',
    preferColor: 'White',
  },
  {
    productId: 'ens-tee-short-script',
    image: '/images/products/ensemble-tee-short-script-black.png',
    preferVariantId: 'ens-ss-combo-1',
  },
  {
    productId: 'hoodie-cropped',
    image: '/images/products/hoodie-cropped-black.webp',
    preferVariantId: 'hoodie-crop-black',
    preferColor: 'Black',
  },
];

function resolveVariant(product: Product, cfg: EntryConfig): ProductVariant | undefined {
  // (1) Variant whose image is the chosen display image.
  const byImage = product.variants.find((v) => v.image === cfg.image);
  if (byImage) return byImage;
  // Prefer explicit variant id (same as image match for these entries).
  if (cfg.preferVariantId) {
    const byId = product.variants.find((v) => v.id === cfg.preferVariantId);
    if (byId) return byId;
  }
  // (2) Variant whose color matches the photo.
  if (cfg.preferColor) {
    const byColor = product.variants.find((v) => v.attributes?.color === cfg.preferColor);
    if (byColor) return byColor;
  }
  // (3) Fallback.
  return product.variants[0];
}

function buildEntries(): ShowcaseEntry[] {
  const out: ShowcaseEntry[] = [];
  ENTRY_CONFIGS.forEach((cfg, i) => {
    const product = getProductById(cfg.productId);
    if (!product) return;
    const variant = resolveVariant(product, cfg);
    if (!variant) return;
    out.push({
      id: product.id,
      product,
      variant,
      image: cfg.image,
      imageAlt: `${product.name}`,
      glow: GLOW_PRESETS[i % GLOW_PRESETS.length] as GlowPreset,
    });
  });
  return out;
}

// Staggered info children: enter from right, exit to left, with blur.
const infoChild: Variants = {
  hidden: { opacity: 0, x: 32, filter: 'blur(6px)' },
  show: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease: EASE } },
  exit: { opacity: 0, x: -28, filter: 'blur(6px)', transition: { duration: 0.18, ease: EASE } },
};

interface HeroProps {
  onOrderClick: (p: Product) => void;
  orderOpen?: boolean;
}

export function Hero({ onOrderClick, orderOpen = false }: HeroProps) {
  const reduce = useReducedMotion() === true;
  const entries = useMemo(buildEntries, []);
  const [page, setPage] = useState(0);
  const suppressClickRef = useRef(false);

  const N = entries.length;
  const display = N === 0 ? 0 : ((page % N) + N) % N;
  const active = entries[display] ?? entries[0];

  const paginate = (dir: 1 | -1) => {
    setPage(page + dir);
  };

  const goTo = (i: number) => {
    if (N === 0) return;
    const d = (((i - display) % N) + N) % N;
    if (!d) return;
    const dir: 1 | -1 = d <= N / 2 ? 1 : -1;
    setPage(page + (dir === 1 ? d : -(N - d)));
  };

  // Instant motion when reduced motion is preferred.
  const infoChildVariants: Variants = useMemo(() => {
    if (!reduce) return infoChild;
    return {
      hidden: { opacity: 0, x: 32, filter: 'blur(6px)' },
      show: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0 } },
      exit: { opacity: 0, x: -28, filter: 'blur(6px)', transition: { duration: 0 } },
    };
  }, [reduce]);

  const infoParentVariants: Variants = useMemo(
    () => ({
      hidden: {},
      show: {
        transition: {
          staggerChildren: reduce ? 0 : 0.07,
          delayChildren: reduce ? 0 : 0.12,
          duration: 0,
        },
      },
      exit: { transition: { staggerChildren: 0, duration: 0 } },
    }),
    [reduce],
  );

  if (!active) return null;

  const glow = active.glow;
  const categoryLabel = getCategoryById(active.product.category)?.label ?? active.product.category;

  return (
    <section
      className="relative overflow-hidden bg-mm-black text-white min-h-svh"
      aria-label="Collection à la une"
    >
      {/* Glow layer — centered wrappers (static transforms) + motion inner boxes.
          No negative margins/positions; overflow stays clipped by the section. */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <MoltenMetal
          color1="#E31B23"
          color2="#E31B23"
          color3="#FFFFFF"
          speed={0.35}
          scale={4}
          detail={3}
          glow={1.6}
          coreSize={0.1}
          swirl={1}
          fold={-0.2}
          blackPoint={0.05}
          brightness={1.3}
          colorMode="molten"
          grain
          grainIntensity={0.05}
          mouseInteraction
          mouseStrength={0.3}
          opacity={0.9}
          className="absolute inset-0"
        />
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
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 sm:pt-20 lg:pt-24 pb-8 lg:pb-12">
          {/* STAGE */}
          <div className="relative">
              <motion.div
                className="relative h-[300px] [@media(max-height:700px)]:h-[280px] sm:h-[520px] lg:h-[560px] cursor-grab active:cursor-grabbing"
              aria-roledescription="carousel"
              aria-label="Produits à la une"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.12}
              dragMomentum={false}
              onDragStart={() => {
                suppressClickRef.current = true;
              }}
              onDragEnd={(_event, info) => {
                const offsetX = info.offset.x;
                const velocityX = info.velocity.x;
                if (offsetX < -70 || velocityX < -600) {
                  paginate(1);
                } else if (offsetX > 70 || velocityX > 600) {
                  paginate(-1);
                } else {
                  suppressClickRef.current = false;
                }
              }}
            >
              {entries.map((entry, i) => {
                let r = N === 0 ? 0 : (((i - page) % N) + N) % N;
                if (r > N / 2) r -= N;
                const abs = Math.abs(r);
                const isCenter = r === 0;
                const isSide = abs === 1;
                const x = isCenter
                  ? '0%'
                  : isSide
                    ? `${r > 0 ? '' : '-'}44%`
                    : `${r >= 0 ? '' : '-'}95%`;
                return (
                  <div
                    key={entry.id}
                      className="absolute left-1/2 top-1/2 w-[68%] [@media(max-height:700px)]:w-[64%] sm:w-[46%] lg:w-[38%] aspect-[4/5] -translate-x-1/2 -translate-y-1/2"
                    style={{ zIndex: isCenter ? 10 : isSide ? 5 : 0 }}
                  >
                    <motion.button
                      type="button"
                      aria-label={`Voir ${entry.product.name}`}
                      initial={false}
                      animate={{
                        x,
                        scale: isCenter ? 1 : isSide ? 0.72 : 0.8,
                        opacity: isCenter ? 1 : isSide ? 0.5 : 0,
                        filter: isCenter ? FILTER_CENTER : isSide ? FILTER_SIDE : FILTER_FAR,
                      }}
                      transition={{ type: 'tween', duration: reduce ? 0 : 0.8, ease: EASE }}
                      style={abs >= 2 ? { pointerEvents: 'none' } : undefined}
                      onClick={() => {
                        if (suppressClickRef.current) {
                          suppressClickRef.current = false;
                          return;
                        }
                        if (isCenter) return;
                        if (isSide) goTo(i);
                      }}
                      className={cn(
                        'h-full w-full text-left',
                        isSide ? 'cursor-pointer' : 'cursor-default',
                      )}
                    >
                      <span className="relative block h-full w-full">
                        <Image
                          src={entry.image}
                          alt={entry.product.name}
                          fill
                          className="object-contain"
                          sizes="(max-width:640px) 68vw, (max-width:1024px) 46vw, 38vw"
                          priority={i === 0}
                        />
                      </span>
                    </motion.button>
                  </div>
                );
              })}
            </motion.div>

            {/* Overlaid prev/next */}
            <button
              type="button"
              aria-label="Produit précédent"
              onClick={() => paginate(-1)}
              className="absolute top-1/2 -translate-y-1/2 left-3 sm:left-6 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur transition hover:border-mm-red hover:text-mm-red"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Produit suivant"
              onClick={() => paginate(1)}
              className="absolute top-1/2 -translate-y-1/2 right-3 sm:right-6 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur transition hover:border-mm-red hover:text-mm-red"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          {/* Indicators */}
          <div className="mt-4 sm:mt-5 flex justify-center gap-2">
            {entries.map((entry, i) => {
              const isActive = i === display;
              return (
                <button
                  key={entry.id}
                  type="button"
                  aria-label={`Aller au produit ${entry.product.name}`}
                  onClick={() => goTo(i)}
                  className={cn(
                    'h-1 rounded-full transition-all',
                    isActive ? 'w-8 bg-mm-red' : 'w-4 bg-white/20 hover:bg-white/40',
                  )}
                />
              );
            })}
          </div>

          {/* INFO — centered single column, stable reserved space */}
          <div className="mx-auto mt-5 sm:mt-8 max-w-2xl text-center min-h-[240px] sm:min-h-[260px]">
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
                  className="text-[clamp(1.6rem,7vw,3rem)] font-chillax font-bold mt-2 sm:mt-3 break-words"
                >
                  {active.product.name}
                </motion.h1>
                {active.product.shortDescription ? (
                  <motion.p
                    variants={infoChildVariants}
                    className="text-body-lg text-white/70 mt-4 break-words max-w-md mx-auto"
                  >
                    {active.product.shortDescription}
                  </motion.p>
                ) : null}
                <motion.p
                  variants={infoChildVariants}
                  className="text-heading-lg font-bold text-mm-red mt-4 sm:mt-5"
                >
                  {formatPrice(active.variant.price)}
                </motion.p>
                <motion.div variants={infoChildVariants} className="mt-5 sm:mt-7 flex justify-center">
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
        </div>
      </motion.div>
    </section>
  );
}
