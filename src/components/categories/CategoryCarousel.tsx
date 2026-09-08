'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Check } from 'lucide-react';
import { CategoryData, ProductCategory } from '@/lib/types';
import { cn } from '@/lib/utils';
import { StaggerContainer, StaggerItem } from '@/components/animations/FadeIn';
import { categories } from '@/lib/categories';

interface CategoryCardProps {
  category: CategoryData;
  index?: number;
  selected?: boolean;
  onSelect?: (id: ProductCategory) => void;
}

function CategoryCard({ category, index = 0, selected = false, onSelect }: CategoryCardProps) {
  return (
    <StaggerItem>
      <motion.article
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
        whileHover={{ y: -4 }}
        className={cn(
          'relative group overflow-hidden rounded-2xl cursor-pointer border-2 transition-colors duration-200',
          selected ? 'border-mm-red shadow-red' : 'border-transparent hover:border-mm-red/30'
        )}
        role="listitem"
      >
        <button
          type="button"
          onClick={() => onSelect?.(category.id)}
          aria-pressed={selected}
          aria-label={`Filtrer par ${category.label}`}
          className="block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mm-red focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-2xl"
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
            <Image
              src={category.image}
              alt=""
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
            />
            {selected && (
              <span className="absolute top-3 right-3 z-30 inline-flex h-7 w-7 items-center justify-center rounded-full bg-mm-red text-white" aria-hidden="true">
                <Check className="h-4 w-4" />
              </span>
            )}
            <div className="absolute inset-0 z-20 flex flex-col items-start justify-end p-5">
              <div className="w-full">
                <span className={cn('badge-red text-caption mb-2', selected && 'bg-mm-red text-white border-mm-red')}>
                  {category.productCount} produit{category.productCount > 1 ? 's' : ''}
                </span>
                <h3 className="text-heading-sm font-chillax font-bold text-white mb-1">
                  {category.label}
                </h3>
                <p className="text-body-sm text-zinc-300 max-w-xs">
                  {category.description}
                </p>
              </div>
            </div>
          </div>
        </button>
      </motion.article>
    </StaggerItem>
  );
}

export function CategorySection({
  title = 'Nos catégories',
  subtitle,
  selectedId = null,
  onSelect,
}: {
  title?: string;
  subtitle?: string;
  selectedId?: ProductCategory | null;
  onSelect?: (id: ProductCategory | null) => void;
}) {
  return (
    <section className="section" aria-label={title}>
      <div className="container">
        {(title || subtitle) && (
          <div className="mb-8">
            {title && <h2 className="section-title">{title}</h2>}
            {subtitle && <p className="section-subtitle">{subtitle}</p>}
            <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filtrer les produits">
              <button
                type="button"
                onClick={() => onSelect?.(null)}
                aria-pressed={selectedId === null}
                className={cn(
                  'rounded-full border px-4 py-2 text-body-sm font-medium transition-colors',
                  selectedId === null
                    ? 'border-mm-red bg-mm-red/10 text-mm-red'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-mm-red/50 hover:text-mm-red'
                )}
              >
                Voir tout
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onSelect?.(c.id)}
                  aria-pressed={selectedId === c.id}
                  className={cn(
                    'rounded-full border px-4 py-2 text-body-sm font-medium transition-colors',
                    selectedId === c.id
                      ? 'border-mm-red bg-mm-red/10 text-mm-red'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-mm-red/50 hover:text-mm-red'
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <StaggerContainer staggerDelay={0.1}>
          <div
            className="grid gap-5 sm:gap-6
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-5"
            role="list"
          >
            {categories.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                index={index}
                selected={selectedId === category.id}
                onSelect={(id) => onSelect?.(selectedId === id ? null : id)}
              />
            ))}
          </div>
        </StaggerContainer>
      </div>
    </section>
  );
}