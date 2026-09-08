export type ProductCategory = 'tshirts' | 'ensembles' | 'hoodies' | 'joggers' | 'bags';

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  attributes: Record<string, string>;
  image?: string;
  stock?: number;
}

export interface ProductOption {
  name: string;
  label: string;
  type: 'size' | 'color' | 'variant' | 'custom';
  values: string[];
  required: boolean;
}

export interface ProductImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription?: string;
  category: ProductCategory;
  basePrice: number;
  images: ProductImage[];
  options: ProductOption[];
  variants: ProductVariant[];
  featured?: boolean;
  newArrival?: boolean;
  tags?: string[];
  seo?: {
    title?: string;
    description?: string;
  };
}

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  quantity: number;
  selectedOptions: Record<string, string>;
  snapshot: {
    name: string;
    image: string;
    price: number;
    variantName: string;
  };
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

export type DeliveryMethod = 'yalidine-bureau' | 'yalidine-domicile';

export interface Wilaya {
  id: number;
  name: string;
  nameAr: string;
  deliveryPrices: {
    bureau: number;
    domicile: number;
  };
  communes: Commune[];
  requiresCommune: boolean;
}

export interface Commune {
  id: number;
  name: string;
  nameAr: string;
  wilayaId: number;
}

export interface DeliveryOption {
  method: DeliveryMethod;
  wilayaId: number;
  communeId?: number;
  price: number;
  estimatedDays: string;
  label: string;
  description: string;
}

export interface CustomerInfo {
  fullName: string;
  phone: string;
  wilayaId: number;
  communeId?: number;
  deliveryMethod: DeliveryMethod;
  address?: string;
  notes?: string;
}

export interface OrderSummary {
  items: CartItem[];
  subtotal: number;
  deliveryPrice: number;
  total: number;
  deliveryOption: DeliveryOption;
  customerInfo: CustomerInfo;
}

export interface WhatsAppOrderMessage {
  message: string;
  url: string;
}

export interface NavigationItem {
  label: string;
  href: string;
  children?: NavigationItem[];
}

export interface CategoryData {
  id: ProductCategory;
  label: string;
  labelAr: string;
  description: string;
  image: string;
  productCount: number;
  href: string;
}