export type Lang = 'ar' | 'en';

export type LocalizedText = {
  en: string;
  ar: string;
};

export type ImageSpec = {
  base: string;
  widths: readonly number[];
};

export type CategoryId = 'pouches' | 'totes' | 'laptop' | 'makeup' | 'custom';

export type TechniqueId = 'applique' | 'embroidery' | 'paint' | 'upcycled';

export interface Category {
  id: CategoryId;
  name: LocalizedText;
  blurb: LocalizedText;
}

export interface Product {
  slug: string;
  category: CategoryId;
  featured: boolean;
  name: LocalizedText;
  summary: LocalizedText;
  details: LocalizedText;
  techniques: TechniqueId[];
  images: ImageSpec[];
  madeIn?: string;
  imageNote?: string;
  todo?: string[];
}

export interface ProcessStep {
  photo: ImageSpec;
  title: LocalizedText;
  text: LocalizedText;
}

export interface Milestone {
  figure: string;
  confirm?: boolean;
  label: LocalizedText;
  text: LocalizedText;
}

export interface NextPhase {
  confirm?: boolean;
  title: LocalizedText;
  text: LocalizedText;
}

export interface PartnersInfo extends LocalizedText {
  confirm?: boolean;
}

export interface GalleryItem {
  photo: ImageSpec;
  alt: LocalizedText;
  wide?: boolean;
}

export interface NabtaData {
  categories: Category[];
  products: Product[];
  techniques: Record<TechniqueId, LocalizedText>;
  process: ProcessStep[];
  milestones: Milestone[];
  next: NextPhase;
  partners: PartnersInfo;
  storyPhoto: {
    photo: ImageSpec;
    alt: LocalizedText;
  };
  gallery: GalleryItem[];
}

export interface NabtaConfig {
  defaultLanguage: 'ar' | 'en' | 'auto';
  contact: {
    whatsapp: string;
    phoneDisplay: string;
    email: string;
    instagram: string;
    facebook: string;
  };
  orders: {
    mode: 'none' | 'endpoint';
    endpoint: string;
    maxUploadMB: number;
  };
}
