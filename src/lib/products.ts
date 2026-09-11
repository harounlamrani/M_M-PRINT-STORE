import type { Product, ProductCategory, ProductOption, ProductVariant, ProductImage } from './types';

const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

const teeColors = ['Black', 'White', 'Gray', 'Navy'];
const bottomColors = ['Black', 'Gray', 'Navy'];
const bagColors = ['Black', 'Gray', 'Olive', 'Navy'];

const createSizeOption = (required = true): ProductOption => ({
  name: 'size',
  label: 'Taille',
  type: 'size',
  values: sizes,
  required,
});

const createColorOption = (colors: string[], required = true): ProductOption => ({
  name: 'color',
  label: 'Couleur',
  type: 'color',
  values: colors,
  required,
});

const createCutOption = (required = true): ProductOption => ({
  name: 'cut',
  label: 'Coupe',
  type: 'variant',
  values: ['Regular', 'Oversized'],
  required,
});

const placeholderImage = (name: string, w = 1200, h = 1500): ProductImage => ({
  src: `/images/products/${name.toLowerCase().replace(/\s+/g, '-')}.webp`,
  alt: name,
  width: w,
  height: h,
});

// Helper to create tee variants
function createTeeVariants(baseId: string, baseName: string, basePrice: number, colors: string[], hasCut: boolean = false) {
  const variants: ProductVariant[] = [];

  colors.forEach(color => {
    if (hasCut) {
      ['Regular', 'Oversized'].forEach(cut => {
        const price = cut === 'Oversized' ? basePrice + 500 : basePrice;
        variants.push({
          id: `${baseId}-${color.toLowerCase()}-${cut.toLowerCase()}`,
          name: `${color} • ${cut}`,
          sku: `${baseId.toUpperCase()}-${color.toUpperCase()}-${cut.toUpperCase().slice(0,3)}`,
          price,
          attributes: { size: 'S', color, cut },
          image: placeholderImage(`${baseName} ${color} ${cut}`, 1200, 1500).src,
          stock: 20,
        });
      });
    } else {
      variants.push({
        id: `${baseId}-${color.toLowerCase()}`,
        name: color,
        sku: `${baseId.toUpperCase()}-${color.toUpperCase()}`,
        price: basePrice,
        attributes: { size: 'S', color },
        image: placeholderImage(`${baseName} ${color}`, 1200, 1500).src,
        stock: 20,
      });
    }
  });

  return variants;
}

// Helper to create ensemble variants with fixed color combos
function createEnsembleVariants(baseId: string, baseName: string, combos: Array<{top: string, bottom: string}>) {
  return combos.map((combo, index) => ({
    id: `${baseId}-combo-${index}`,
    name: `${combo.top} / ${combo.bottom}`,
    sku: `${baseId.toUpperCase()}-${combo.top.toUpperCase()}-${combo.bottom.toUpperCase()}`,
    price: 4500,
    attributes: { topColor: combo.top, bottomColor: combo.bottom },
    image: placeholderImage(`${baseName} ${combo.top} ${combo.bottom}`, 1200, 1500).src,
    stock: 15,
  }));
}

// Helper to create bottom variants (shorts, baggy, joggers)
function createBottomVariants(baseId: string, baseName: string, basePrice: number, colors: string[]) {
  return colors.map(color => ({
    id: `${baseId}-${color.toLowerCase()}`,
    name: color,
    sku: `${baseId.toUpperCase()}-${color.toUpperCase()}`,
    price: basePrice,
    attributes: { size: 'S', color },
    image: placeholderImage(`${baseName} ${color}`, 1200, 1500).src,
    stock: 25,
  }));
}

// Helper to create bag variants
function createBagVariants(baseId: string, baseName: string, basePrice: number, colors: string[]) {
  return colors.map(color => ({
    id: `${baseId}-${color.toLowerCase()}`,
    name: color,
    sku: `${baseId.toUpperCase()}-${color.toUpperCase()}`,
    price: basePrice,
    attributes: { color },
    image: placeholderImage(`${baseName} ${color}`, 1200, 1500).src,
    stock: 20,
  }));
}

export const products: Product[] = [
  // T-SHIRTS CATEGORY
  {
    id: 'tee-regular',
    slug: 'tee-regular',
    name: 'T-Shirt Regular',
    description: '280 GSM coton peigné, coupe Regular droite, teinture vêtement pour un aspect usé unique. Double aiguille au col, épaules tombantes, pas de couture latérale (tricot tubulaire). Pré-rétréci. Fabriqué en Algérie.',
    shortDescription: '280 GSM coton peigné, coupe Regular, teinture vêtement',
    category: 'tshirts',
    basePrice: 2000,
    images: [
      placeholderImage('T-Shirt Regular Black', 1200, 1500),
      placeholderImage('T-Shirt Regular White', 1200, 1500),
      placeholderImage('T-Shirt Regular Gray', 1200, 1500),
      placeholderImage('T-Shirt Regular Navy', 1200, 1500),
    ],
    options: [createSizeOption(), createColorOption(teeColors)],
    variants: createTeeVariants('tee-reg', 'T-Shirt Regular', 2000, teeColors),
    featured: true,
    newArrival: true,
    tags: ['tshirts', 'regular', 'cotton', 'garment-dyed', 'made-in-algeria'],
    seo: {
      title: 'T-Shirt Regular — M_M PRINT STORE',
      description: '280 GSM coton peigné, coupe Regular, teinture vêtement. Fabriqué en Algérie.',
    },
  },
  {
    id: 'tee-oversized',
    slug: 'tee-oversized',
    name: 'T-Shirt Oversized',
    description: '280 GSM coton peigné, coupe Oversized ample, épaules très tombantes, manches longues. Même base que le Regular mais volume max. Teinture vêtement pour un aspect vintage. Édition Charcoal : imprimé script rose au dos. Édition White : imprimé poitrine rouge « Born From Pain », dos uni. Fabriqué en Algérie.',
    shortDescription: '280 GSM coton peigné, coupe Oversized, teinture vêtement',
    category: 'tshirts',
    basePrice: 2500,
    images: [
      {
        src: '/images/products/t-shirt-oversized-charcoal.webp',
        alt: 'T-Shirt Oversized Charcoal — imprimé script rose au dos',
        width: 1200,
        height: 1500,
      },
      placeholderImage('T-Shirt Oversized Black', 1200, 1500),
      {
        src: '/images/products/t-shirt-oversized-white.png',
        alt: 'T-Shirt Oversized White — imprimé poitrine rouge « Born From Pain », dos uni',
        width: 1200,
        height: 1500,
      },
      placeholderImage('T-Shirt Oversized Gray', 1200, 1500),
      placeholderImage('T-Shirt Oversized Navy', 1200, 1500),
    ],
    options: [createSizeOption(), createColorOption([...teeColors, 'Charcoal'])],
    variants: createTeeVariants('tee-ovs', 'T-Shirt Oversized', 2500, [...teeColors, 'Charcoal']).map((v) => {
      if (v.id === 'tee-ovs-charcoal') return { ...v, image: '/images/products/t-shirt-oversized-charcoal.webp' };
      if (v.id === 'tee-ovs-white') return { ...v, image: '/images/products/t-shirt-oversized-white.png' };
      return v;
    }),
    featured: true,
    newArrival: true,
    tags: ['tshirts', 'oversized', 'cotton', 'garment-dyed', 'made-in-algeria'],
    seo: {
      title: 'T-Shirt Oversized — M_M PRINT STORE',
      description: '280 GSM coton peigné, coupe Oversized ample, teinture vêtement. Fabriqué en Algérie.',
    },
  },

  // ENSEMBLES CATEGORY - 3 separate products, each at 4500 DA fixed
  {
    id: 'ens-tee-short',
    slug: 'ensemble-tee-short',
    name: 'Ensemble T-Shirt + Short',
    description: 'T-Shirt 280 GSM (coupe Regular) + Short 320 GSM French Terry. Couleurs coordonnées, même teinture. Taille élastique avec cordon, poches latérales, poche arrière zippée. Inseam 7". Ensemble vendu complet.',
    shortDescription: 'Tee 280 GSM Regular + Short 320 GSM French Terry, teinture coordonnée',
    category: 'ensembles',
    basePrice: 4500,
    images: [
      placeholderImage('Ensemble Tee Short Black Black', 1200, 1500),
      placeholderImage('Ensemble Tee Short Black Gray', 1200, 1500),
      placeholderImage('Ensemble Tee Short White Navy', 1200, 1500),
    ],
    options: [
      createSizeOption(),
      { name: 'combo', label: 'Combinaison', type: 'variant', values: ['Black/Black', 'Black/Gray', 'White/Navy'], required: true },
    ],
    variants: createEnsembleVariants('ens-ts', 'Ensemble Tee Short', [
      { top: 'Black', bottom: 'Black' },
      { top: 'Black', bottom: 'Gray' },
      { top: 'White', bottom: 'Navy' },
    ]),
    featured: true,
    newArrival: true,
    tags: ['ensembles', 'set', 'tee', 'short', 'french-terry', 'matched'],
    seo: {
      title: 'Ensemble T-Shirt + Short — M_M PRINT STORE',
      description: 'Ensemble coordonné Tee 280 GSM + Short 320 GSM French Terry. Teinture coordonnée.',
    },
  },
  {
    id: 'ens-tee-baggy',
    slug: 'ensemble-tee-baggy',
    name: 'Ensemble T-Shirt + Baggy',
    description: 'T-Shirt 280 GSM (coupe Regular) + Baggy 320 GSM French Terry. Coupe ample, taille élastique avec cordon, poches latérales cargo, poche arrière zippée. Coupe baggy authentique. Ensemble vendu complet.',
    shortDescription: 'Tee 280 GSM Regular + Baggy 320 GSM French Terry, coupe ample',
    category: 'ensembles',
    basePrice: 4500,
    images: [
      placeholderImage('Ensemble Tee Baggy Black Black', 1200, 1500),
      placeholderImage('Ensemble Tee Baggy Gray Gray', 1200, 1500),
      placeholderImage('Ensemble Tee Baggy Navy Navy', 1200, 1500),
    ],
    options: [
      createSizeOption(),
      { name: 'combo', label: 'Combinaison', type: 'variant', values: ['Black/Black', 'Gray/Gray', 'Navy/Navy'], required: true },
    ],
    variants: createEnsembleVariants('ens-tb', 'Ensemble Tee Baggy', [
      { top: 'Black', bottom: 'Black' },
      { top: 'Gray', bottom: 'Gray' },
      { top: 'Navy', bottom: 'Navy' },
    ]),
    featured: true,
    newArrival: true,
    tags: ['ensembles', 'set', 'tee', 'baggy', 'french-terry', 'matched'],
    seo: {
      title: 'Ensemble T-Shirt + Baggy — M_M PRINT STORE',
      description: 'Ensemble coordonné Tee 280 GSM + Baggy 320 GSM French Terry. Coupe ample, teinture coordonnée.',
    },
  },
  {
    id: 'ens-tee-jogger',
    slug: 'ensemble-tee-jogger',
    name: 'Ensemble T-Shirt + Jogging Oversized',
    description: 'T-Shirt 280 GSM (coupe Regular) + Jogging Oversized 320 GSM French Terry. Coupe très ample, taille élastique avec cordon, chevilles élastiquées, poches latérales, poche arrière zippée. Ensemble vendu complet.',
    shortDescription: 'Tee 280 GSM Regular + Jogging Oversized 320 GSM French Terry',
    category: 'ensembles',
    basePrice: 4500,
    images: [
      placeholderImage('Ensemble Tee Jogger Black Black', 1200, 1500),
      placeholderImage('Ensemble Tee Jogger Gray Gray', 1200, 1500),
      placeholderImage('Ensemble Tee Jogger Navy Navy', 1200, 1500),
    ],
    options: [
      createSizeOption(),
      { name: 'combo', label: 'Combinaison', type: 'variant', values: ['Black/Black', 'Gray/Gray', 'Navy/Navy'], required: true },
    ],
    variants: createEnsembleVariants('ens-tj', 'Ensemble Tee Jogger', [
      { top: 'Black', bottom: 'Black' },
      { top: 'Gray', bottom: 'Gray' },
      { top: 'Navy', bottom: 'Navy' },
    ]),
    featured: true,
    newArrival: true,
    tags: ['ensembles', 'set', 'tee', 'jogger', 'oversized', 'french-terry', 'matched'],
    seo: {
      title: 'Ensemble T-Shirt + Jogging Oversized — M_M PRINT STORE',
      description: 'Ensemble coordonné Tee 280 GSM + Jogging Oversized 320 GSM French Terry. Coupe très ample.',
    },
  },

  // ENSEMBLES CATEGORY - Script edition (own product card)
  {
    id: 'ens-tee-short-script',
    slug: 'ensemble-tee-short-script',
    name: 'Ensemble T-Shirt + Short Script',
    description: 'T-Shirt 280 GSM (coupe Regular) + Short 320 GSM French Terry. Grand imprimé script poitrine et jambe — noir sur le set blanc, blanc contour sur le set noir. Taille élastique avec cordon, poches latérales, poche arrière zippée. Inseam 7". Ensemble vendu complet.',
    shortDescription: 'Tee 280 GSM + Short 320 GSM, grand imprimé script',
    category: 'ensembles',
    basePrice: 4500,
    images: [
      {
        src: '/images/products/ensemble-tee-short-script-white.png',
        alt: 'Ensemble T-Shirt + Short Script blanc — imprimé script noir',
        width: 1200,
        height: 1500,
      },
      {
        src: '/images/products/ensemble-tee-short-script-black.png',
        alt: 'Ensemble T-Shirt + Short Script noir — imprimé script blanc contour',
        width: 1200,
        height: 1500,
      },
    ],
    options: [
      createSizeOption(),
      { name: 'combo', label: 'Combinaison', type: 'variant', values: ['White/White', 'Black/Black'], required: true },
    ],
    variants: createEnsembleVariants('ens-ss', 'Ensemble Tee Short Script', [
      { top: 'White', bottom: 'White' },
      { top: 'Black', bottom: 'Black' },
    ]).map((v) => ({
      ...v,
      image:
        v.id === 'ens-ss-combo-0'
          ? '/images/products/ensemble-tee-short-script-white.png'
          : '/images/products/ensemble-tee-short-script-black.png',
    })),
    featured: true,
    newArrival: true,
    tags: ['ensembles', 'set', 'tee', 'short', 'script-print', 'matched'],
    seo: {
      title: 'Ensemble T-Shirt + Short Script — M_M PRINT STORE',
      description: 'Ensemble coordonné Tee 280 GSM + Short 320 GSM, grand imprimé script poitrine et jambe.',
    },
  },
  // HOODIES CATEGORY
  {
    id: 'hoodie-cropped',
    slug: 'hoodie-cropped',
    name: 'Hoodie Cropped',
    description: 'Hoodie 420 GSM coton mélangé, coupe cropped, capuche doublée, cordon de serrage, poche kangourou. Teinture vêtement. Édition Black : grand imprimé dos rose et blanc. Fabriqué en Algérie.',
    shortDescription: '420 GSM coton mélangé, coupe cropped, teinture vêtement',
    category: 'hoodies',
    basePrice: 5500,
    images: [
      {
        src: '/images/products/hoodie-cropped-black.webp',
        alt: 'Hoodie Cropped Black — grand imprimé dos rose et blanc',
        width: 1200,
        height: 1500,
      },
      placeholderImage('Hoodie Cropped Black', 1200, 1500),
      placeholderImage('Hoodie Cropped Gray', 1200, 1500),
      placeholderImage('Hoodie Cropped Navy', 1200, 1500),
    ],
    options: [createSizeOption(), createColorOption(['Black', 'Gray', 'Navy'])],
    variants: createTeeVariants('hoodie-crop', 'Hoodie Cropped', 5500, ['Black', 'Gray', 'Navy']).map((v) =>
      v.id === 'hoodie-crop-black'
        ? { ...v, image: '/images/products/hoodie-cropped-black.webp' }
        : v
    ),
    featured: false,
    newArrival: false,
    tags: ['hoodies', 'cropped', 'heavyweight', 'garment-dyed'],
    seo: {
      title: 'Hoodie Cropped — M_M PRINT STORE',
      description: 'Hoodie 420 GSM coupe cropped, teinture vêtement. Fabriqué en Algérie.',
    },
  },

  // JOGGERS CATEGORY (placeholder - no products yet)
  {
    id: 'jogger-baggy',
    slug: 'jogger-baggy',
    name: 'Jogger Baggy',
    description: 'Jogger 320 GSM French Terry, coupe baggy ample, taille élastique avec cordon, chevilles élastiquées, poches latérales cargo, poche arrière zippée. Teinture coordonnée avec les hoodies. Fabriqué en Algérie.',
    shortDescription: '320 GSM French Terry, coupe baggy, teinture coordonnée',
    category: 'joggers',
    basePrice: 4500,
    images: [
      placeholderImage('Jogger Baggy Black', 1200, 1500),
      placeholderImage('Jogger Baggy Gray', 1200, 1500),
      placeholderImage('Jogger Baggy Navy', 1200, 1500),
    ],
    options: [createSizeOption(), createColorOption(bottomColors)],
    variants: createBottomVariants('jogger-baggy', 'Jogger Baggy', 4500, bottomColors),
    featured: false,
    newArrival: false,
    tags: ['joggers', 'baggy', 'french-terry', 'garment-dyed'],
    seo: {
      title: 'Jogger Baggy — M_M PRINT STORE',
      description: 'Jogger 320 GSM French Terry coupe baggy, teinture coordonnée. Fabriqué en Algérie.',
    },
  },

  // SAC À DOS CATEGORY
  {
    id: 'backpack',
    slug: 'backpack',
    name: 'Sac à dos',
    description: 'Sac à dos polyvalent 25L, polyester 600D enduit PU, compartiment ordinateur 15", poche avant zippée, poches latérales filet, dos et bretelles rembourrés respirants, sangle de poitrine ajustable. Tissu déperlant. Fabriqué en Algérie.',
    shortDescription: '25L polyester 600D enduit PU, compartiment 15", déperlant',
    category: 'bags',
    basePrice: 2200,
    images: [
      placeholderImage('Sac à dos Black', 1200, 1500),
      placeholderImage('Sac à dos Gray', 1200, 1500),
      placeholderImage('Sac à dos Olive', 1200, 1500),
      placeholderImage('Sac à dos Navy', 1200, 1500),
    ],
    options: [createColorOption(bagColors, false)], // No size for bags
    variants: createBagVariants('backpack', 'Sac à dos', 2200, bagColors),
    featured: true,
    newArrival: true,
    tags: ['bags', 'backpack', '25l', 'water-resistant', 'laptop-compartment'],
    seo: {
      title: 'Sac à dos — M_M PRINT STORE',
      description: 'Sac à dos 25L polyester 600D enduit PU, compartiment 15", déperlant. Fabriqué en Algérie.',
    },
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return products.filter((p) => p.category === category);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getNewArrivals(): Product[] {
  return products.filter((p) => p.newArrival);
}

export function getVariantById(productId: string, variantId: string): ProductVariant | undefined {
  const product = getProductById(productId);
  return product?.variants.find((v) => v.id === variantId);
}

export function getVariantByAttributes(productId: string, attributes: Record<string, string>): ProductVariant | undefined {
  const product = getProductById(productId);
  if (!product) return undefined;
  return product.variants.find((v) =>
    Object.entries(attributes).every(([key, value]) => v.attributes[key] === value)
  );
}