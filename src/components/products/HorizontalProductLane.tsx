'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useReducedMotion, useSpring, useTransform } from 'framer-motion';
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
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Flatten groups (respects the category filter from the parent) into one loop
  const items = productGroups.flatMap((group) => group.products);
  const copies = items.length === 0 ? 0 : items.length >= 4 ? 2 : 4;

  // Slide state
  const [slideIndex, setSlideIndex] = useState(0);
  const n = items.length;
  const display = n === 0 ? 0 : ((slideIndex % n) + n) % n;
  const isFirst = display === 0;
  const isLast = display >= n - 1;

  // Drag state
  const dragStartRef = useRef<number>(0);
  const isDraggingRef = useRef(false);

  // On drag end, determine direction and move slide
  const onDragEnd = (offsetX: number, velocityX: number) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    const threshold = 70;
    const minVelocity = 300;

    if (Math.abs(offsetX) > threshold || Math.abs(velocityX) > minVelocity) {
      setSlideIndex(prev => {
        const dir = offsetX > 0 ? -1 : 1;
        const step = Math.abs(offsetX) > 150 ? (offsetX > 0 ? -2 : 2) : dir;
        const newIdx = prev + step;
        // Bound: don't go beyond first/last product sets
        const maxIdx = Math.max(0, n - Math.ceil(copies / 2)) || 0;
        return Math.max(0, Math.min(maxIdx, newIdx));
      });
    } else {
      // Snap back to nearest valid index if swipe was short
      setSlideIndex(prev => {
        const nearest = Math.round(prev / copies) * copies;
        const maxIdx = Math.max(0, n - Math.ceil(copies / 2)) || 0;
        return Math.max(0, Math.min(maxIdx, nearest));
      });
    }
  };

  if (items.length === 0) return null;

  const totalItemsToShow = Math.max(1, Math.ceil(n / copies) * copies);

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
        {/* Slide container */}
<motion.div
          className="relative overflow-hidden w-full"
          style={{
            transform: `translateX(${-slideIndex * 100 / copies}%)`,
          }}
          transition={{ type: 'spring', stiffness: 120, damping: 30 }}
        >
          {/* Products loop with copies for seamless scrolling */}
          <div className="flex w-full">
            {Array.from({ length: copies }).map((_, copy) => (
              <div
                key={copy}
                className="flex w-full gap-6 pr-6 flex-shrink-0"
              >
                {items.map((product, productIndex) => (
                  <div
                    key={`${product.id}-c${copy}`}
                    className="w-72 flex-shrink-0 sm:w-80"
                  >
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

        {/* Navigation arrows */}
        <button
          type="button"
          aria-label="Produit précédent"
          onClick={() => setSlideIndex(prev => {
            const n = items.length;
            const maxIdx = Math.max(0, n - Math.ceil(copies / 2)) || 0;
            return prev <= 0 ? 0 : prev - copies;
          })}
          className="absolute left-4 top-1/2 -translate-y-4 z-20 rounded-full bg-black/50 p-2 hover:bg-mm-red transition text-mm-red"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path className="stroke-2" d="M15 18l-6-6l6-6" />
          </svg>
          <span className="sr-only">Précédent</span>
        </button>

        <button
          type="button"
          aria-label="Produit suivant"
          onClick={() => setSlideIndex(prev => {
            const n = items.length;
            const maxIdx = Math.max(0, n - Math.ceil(copies / 2)) || 0;
            return Math.min(maxIdx, prev + copies);
          })}
          className="absolute right-4 top-1/2 -translate-y-4 z-20 rounded-full bg-black/50 p-2 hover:bg-mm-red transition text-mm-red"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path className="stroke-2" d="M9 18l6-6l-6-6" />
          </svg>
          <span className="sr-only">Suivant</span>
        </button>

        {/* Edge melts */}
        <div
          className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent pointer-events-none sm:w-32"
          aria-hidden="true"
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent pointer-events-none sm:w-32"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}