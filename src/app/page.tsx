'use client';

import { useState } from 'react';
import { Hero } from '@/components/home/Hero';
import { Header } from '@/components/layout/Header';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { CategorySection } from '@/components/categories/CategoryCarousel';
import { HorizontalProductLane } from '@/components/products/HorizontalProductLane';
import { ProductOrderTransition } from '@/components/products/ProductOrderTransition';
import { DeliverySection } from '@/components/home/DeliverySection';
import { ContactSection } from '@/components/home/ContactSection';
import { Footer } from '@/components/layout/Footer';
import { getProductsByCategory } from '@/lib/products';
import { categories } from '@/lib/categories';
import type { Product, ProductCategory } from '@/lib/types';

export default function HomePage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);

  // Group products by category — filtered immediately on category select, no scroll
  const productsByCategory = categories
    .filter((cat) => !selectedCategory || cat.id === selectedCategory)
    .map(cat => ({
      category: cat,
      products: getProductsByCategory(cat.id),
    }))
    .filter(group => group.products.length > 0);

  const handleOrderClick = (product: Product) => {
    setSelectedProduct(product);
  };

  return (
    <div className="flex flex-col gap-0">
      <Header />
      {/* Hero - white background */}
      <Hero />

      {/* Categories Section - white background */}
      <CategorySection
        title="Nos catégories"
        subtitle="T-Shirts, Ensembles, Hoodies, Joggers, Sac à dos — des pièces conçues pour durer."
        selectedId={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {/* Single Horizontal Product Lane - white background */}
      <HorizontalProductLane
        title={selectedCategory ? categories.find((c) => c.id === selectedCategory)?.label ?? 'Notre collection' : 'Notre collection'}
        subtitle={selectedCategory ? 'Filtré par catégorie — Voir tout pour tout afficher' : 'Faites défiler pour découvrir tous nos produits'}
        productGroups={productsByCategory}
        onOrderClick={handleOrderClick}
      />

      {/* Delivery Section - RED background */}
      <DeliverySection />

      {/* Contact Section - white background */}
      <ContactSection />

      {/* Footer - RED background */}
      <Footer />

      <CartDrawer />

      {/* Product Order Transition Modal */}
      {selectedProduct && (
        <ProductOrderTransition
          product={selectedProduct}
          isOpen={true}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}