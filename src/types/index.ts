export type AvailabilityStatus = 
  | 'available_to_view' 
  | 'made_to_order' 
  | 'confirm_availability';

export type FurnitureCategory = 
  | 'Sofas & Seating'
  | 'Beds & Bedroom Furniture'
  | 'Dining Tables & Chairs'
  | 'Wardrobes & Storage'
  | 'TV Units & Entertainment'
  | 'Office Furniture'
  | 'Coffee & Accent Tables';

export type RoomCollection = 
  | 'living' 
  | 'bedroom' 
  | 'dining' 
  | 'office' 
  | 'storage';

export interface ProductDimensions {
  width: number;    // in inches
  depth: number;    // in inches
  height: number;   // in inches
  unit: 'inches' | 'cm';
  seatingCapacity?: number;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  priceDelta?: number;
  specNotes?: string;
}

export interface Product {
  id: string;
  sku: string;
  slug: string;
  name: string;
  tagline: string;
  category: FurnitureCategory;
  room: RoomCollection;
  price: number;
  isPriceIndicative: boolean;
  availability: AvailabilityStatus;
  featured: boolean;
  badge?: string;
  description: string;
  craftsmanshipNotes?: string;
  dimensions: ProductDimensions;
  materials: string[];
  finishes: string[];
  colors: ProductColor[];
  variants: ProductVariant[];
  warranty: string;
  delivery: string;
  customizationNotes?: string;
  primaryImage: string;
  images: string[];
  tags: string[];
  style: 'Modern Minimalist' | 'Contemporary Warm' | 'Mid-Century Nordic' | 'Classic Architectural';
  rating?: number;
  reviewsCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface ShowroomOpeningHour {
  days: string;
  hours: string;
}

export interface ShowroomSettings {
  name: string;
  tagline: string;
  initials: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  landmark: string;
  mapDirectionsUrl: string;
  openingHours: ShowroomOpeningHour[];
  announcementText?: string;
  currencySymbol: string;
  indicativePriceDisclaimer: string;
  updatedAt: string;
}

export type AnalyticsEventType = 
  | 'product_view'
  | 'search'
  | 'category_filter'
  | 'finder_use'
  | 'favourite_toggle'
  | 'compare_action'
  | 'whatsapp_click'
  | 'share_action';

export interface AnalyticsEvent {
  id: string;
  type: AnalyticsEventType;
  timestamp: string;
  productId?: string;
  productName?: string;
  category?: string;
  metadata?: Record<string, any>;
  sessionId: string;
}

export interface SmartFinderCriteria {
  room?: RoomCollection | 'any';
  category?: FurnitureCategory | 'any';
  budgetMax?: number;
  style?: string | 'any';
  material?: string | 'any';
  maxWidth?: number;
}
