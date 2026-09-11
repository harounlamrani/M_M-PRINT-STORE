import type { CategoryData, ProductCategory } from '@/lib/types';

export const categories: CategoryData[] = [
  {
    id: 'tshirts',
    label: 'T-Shirts',
    labelAr: 'تيشيرتات',
    description: 'Coton lourd, coupes Regular & Oversized',
    image: '/images/categories/tshirts.jpg',
    productCount: 2,
    href: '#tshirts',
  },
  {
    id: 'ensembles',
    label: 'Ensembles',
    labelAr: 'أطقم',
    description: 'Sets coordonnés tee-shirt + bas',
    image: '/images/categories/ensembles.jpg',
    productCount: 4,
    href: '#ensembles',
  },
  {
    id: 'hoodies',
    label: 'Hoodies',
    labelAr: 'هوديس',
    description: 'Hoodies épais, coupe cropped',
    image: '/images/categories/hoodies.jpg',
    productCount: 0,
    href: '#hoodies',
  },
  {
    id: 'joggers',
    label: 'Joggers',
    labelAr: 'جوفرات',
    description: 'Joggers à coupe baggy',
    image: '/images/categories/joggers.jpg',
    productCount: 0,
    href: '#joggers',
  },
  {
    id: 'bags',
    label: 'Sac à dos',
    labelAr: 'حقيبة ظهر',
    description: 'Sac à dos polyvalent',
    image: '/images/categories/bags.jpg',
    productCount: 1,
    href: '#bags',
  },
];

export function getCategoryById(id: ProductCategory) {
  return categories.find((c) => c.id === id);
}