import type { CategoryData, ProductCategory } from '@/lib/types';

export const categories: CategoryData[] = [
  {
    id: 'tshirts',
    label: 'T-Shirts',
    labelAr: 'تيشيرتات',
    description: 'Coton lourd, coupes Regular & Oversized',
    image: '/images/categories/tshirts.webp',
    productCount: 2,
    href: '#tshirts',
  },
  {
    id: 'ensembles',
    label: 'Ensembles',
    labelAr: 'أطقم',
    description: 'Sets coordonnés tee-shirt + bas',
    image: '/images/categories/ensembles.webp',
    productCount: 3,
    href: '#ensembles',
  },
  {
    id: 'hoodies',
    label: 'Hoodies',
    labelAr: 'هوديس',
    description: 'Hoodies épais, coupe cropped',
    image: '/images/categories/hoodies.webp',
    productCount: 0,
    href: '#hoodies',
  },
  {
    id: 'joggers',
    label: 'Joggers',
    labelAr: 'جوفرات',
    description: 'Joggers à coupe baggy',
    image: '/images/categories/joggers.webp',
    productCount: 0,
    href: '#joggers',
  },
  {
    id: 'bags',
    label: 'Sac à dos',
    labelAr: 'حقيبة ظهر',
    description: 'Sac à dos polyvalent',
    image: '/images/categories/bags.webp',
    productCount: 1,
    href: '#bags',
  },
];

export function getCategoryById(id: ProductCategory) {
  return categories.find((c) => c.id === id);
}