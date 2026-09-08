'use client';

import { motion, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';
import { Product } from '@/lib/types';
import { CategoryData } from '@/lib/types';
import { ProductCard } from './ProductCard';

interface ProductGroup {
  category: CategoryData;
  products: Product[];
}

interface HorizontalProductLaneProps {
  title?: string;
  subtitle?: string;
  productGroups: ProductGroup[];
  onOrderClick?: (product: Product) => void;
}

export function HorizontalProductLane({
  title,
  subtitle,
  productGroups,
  onOrderClick,
}: HorizontalProductLaneProps) {
  const reduceMotion = useReducedMotion();

  // Flatten groups (respects the category filter from the parent) into one loop
  const items = productGroups.flatMap((group) => group.products);
  // Even copy count keeps the -50% loop point seamless (always whole sets)
  const copies = items.length === 0 ? 0 : items.length >= 4 ? 2 : 4;

  // Scroll-velocity lean: smoothed, subtle, never touches loop speed
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(velocity, { damping: 50, stiffness: 400 });
  const skewX = useTransform(smoothVelocity, [-2500, 0, 2500], [5, 0, -5]);

  if (items.length === 0) return null;

  return (
    <section
      className="section overflow-hidden"
      aria-label={title || 'Produits'}
    >
      {(title || subtitle) && (
        <div className="container mb-10">
          {title && <h2 className="section-title">{title}</h2>}
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </div>
      )}

      <div className="relative">
        <motion.div
          style={reduceMotion ? undefined : { skewX }}
          className="will-change-transform"
        >
          {/* Slow infinite loop: track slides 0 -> -50% and wraps.
              Enters from the right, first product comes back around forever.
              Pauses on hover / keyboard focus so Commander stays clickable. */}
          <div className="flex w-max animate-marquee [animation-duration:60s] hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] motion-reduce:animate-none">
            {Array.from({ length: copies }).map((_, copy) => (
              <div key={copy} className="flex gap-6 pr-6">
                {items.map((product, productIndex) => (
                  <div key={`${product.id}-c${copy}`} className="w-72 flex-shrink-0 sm:w-80">
                    <ProductCard
                      product={product}
                      index={productIndex}
                      variant="compact"
                      onOrderClick={onOrderClick}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Edge melts (unskewed) */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent pointer-events-none sm:w-32" aria-hidden="true" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent pointer-events-none sm:w-32" aria-hidden="true" />
      </div>
    </section>
  );
}
