export interface Collection {
  id: string;
  slug?: string;
  name: string;
  tagline?: string;
  description: string;
  image: string;
  featured?: boolean;
  itemCount?: number;
}

export interface Product {
  id: string;
  slug?: string;
  name: string;
  collection: string;
  category: 'rings' | 'necklaces' | 'bracelets' | 'earrings' | 'sets';
  metal: 'gold' | 'rose-gold' | 'platinum' | 'diamond';
  karat?: string;
  price: string;
  formattedPrice?: string;
  image?: string;
  images?: string[];
  description: string;
  isNew?: boolean;
  isBestseller?: boolean;
  inStock?: boolean;
  gemstone?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  initials?: string;
  color?: string;
  location: string;
  quote: string;
  rating: number;
  avatar: string;
  product?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  link?: string;
}

export interface CraftStage {
  id: number;
  title: string;
  description: string;
  image: string;
}

export interface BrandStat {
  label: string;
  value: number;
  suffix: string;
}

export interface NavLink {
  label: string;
  href: string;
}
