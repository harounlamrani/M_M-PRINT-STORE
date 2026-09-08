'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ShoppingBag } from 'lucide-react';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  index?: number;
  variant?: 'default' | 'featured' | 'compact';
  onOrderClick?: (product: Product) => void;
}

export function ProductCard({ product, index = 0, variant = 'default', onOrderClick }: ProductCardProps) {
  const primaryImage = product.images[0];
  const isNew = product.newArrival;
  const isFeatured = product.featured;

  const variants = {
    default: 'group relative card-hover',
    featured: 'group relative card-hover',
    compact: 'group relative card',
  };

  // Get unique colors for color swatches
  const uniqueColors = Array.from(new Set(product.variants.map(v => v.attributes.color))).filter(Boolean);
  // Get unique cuts (Regular/Oversized) if applicable
  const uniqueCuts = Array.from(new Set(product.variants.map(v => v.attributes.cut))).filter(Boolean);

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
      className={cn(variants[variant], 'overflow-hidden')}
    >
      <button
        type="button"
        onClick={() => onOrderClick?.(product)}
        aria-label={`Commander ${product.name}`}
        className="relative block w-full aspect-[4/5] overflow-hidden bg-gray-50 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-mm-red"
      >
        <Image
          src={primaryImage.src}
          alt={primaryImage.alt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
        />

        <span className="absolute top-3 left-3 flex flex-col gap-1">
          {(isNew || isFeatured) && (
            <>
              {isNew && (
                <span className="badge-red text-caption">Nouveau</span>
              )}
              {isFeatured && (
                <span className="badge-gray text-caption">Vedette</span>
              )}
            </>
          )}
        </span>
      </button>

      <div className="p-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-caption text-gray-500 uppercase tracking-wider">
            {product.category}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onOrderClick?.(product)}
          className="block w-full text-left rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mm-red focus-visible:ring-offset-2"
        >
          <h3 className="text-heading-sm font-chillax font-bold text-gray-900 mb-1 line-clamp-2 hover:text-mm-red transition-colors">
            {product.name}
          </h3>
        </button>

        {product.shortDescription && (
          <p className="text-body-sm text-gray-500 mb-3 line-clamp-2">
            {product.shortDescription}
          </p>
        )}

        {/* Color swatches */}
        {uniqueColors.length > 0 && uniqueColors.length <= 6 && (
          <div className="flex items-center gap-1.5 mb-3" aria-label="Couleurs disponibles">
            {uniqueColors.slice(0, 6).map((color) => (
              <span
                key={color}
                className="w-5 h-5 rounded-full border border-gray-300 flex-shrink-0"
                style={{ backgroundColor: color.toLowerCase() }}
                title={color}
              />
            ))}
            {uniqueColors.length > 6 && (
              <span className="w-5 h-5 rounded-full border border-gray-300 flex-shrink-0 flex items-center justify-center text-caption text-gray-400 bg-gray-100">
                +{uniqueColors.length - 6}
              </span>
            )}
          </div>
        )}

        {/* Cut badges (Regular/Oversized) */}
        {uniqueCuts.length > 0 && (
          <div className="flex items-center gap-1.5 mb-3" aria-label="Coupes disponibles">
            {uniqueCuts.map((cut) => (
              <span
                key={cut}
                className="px-2 py-0.5 rounded text-caption font-medium bg-gray-100 text-gray-500"
              >
                {cut}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <span className="text-heading-sm font-bold text-mm-red">
            {formatPrice(product.basePrice)} DA
          </span>
          {product.variants.length > 1 && (
            <span className="text-caption text-gray-500">
              {product.variants.length} variantes
            </span>
          )}
        </div>
        <Button
          variant="primary"
          size="md"
          className="w-full"
          onClick={() => onOrderClick?.(product)}
        >
          <ShoppingBag className="h-4 w-4" aria-hidden="true" />
          Commander
        </Button>
      </div>
    </motion.article>
  );
}

export function ProductCardSkeleton({ index = 0 }: { index?: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
      className="card overflow-hidden animate-pulse"
    >
      <div className="aspect-[4/5] bg-gray-100" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-1/4 bg-gray-200 rounded" />
        <div className="h-5 w-3/4 bg-gray-200 rounded" />
        <div className="h-4 w-1/2 bg-gray-200 rounded" />
        <div className="flex justify-between">
          <div className="h-6 w-20 bg-gray-200 rounded" />
          <div className="h-6 w-16 bg-gray-200 rounded" />
        </div>
      </div>
    </motion.article>
  );
}