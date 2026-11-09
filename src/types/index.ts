export type CityZone = 'Lechería' | 'Puerto La Cruz' | 'Barcelona' | 'Guanta';

export type DishCategory = 
  | 'Hamburguesas' 
  | 'Pizzas' 
  | 'Sushi & Asiática' 
  | 'Carnes & Grill' 
  | 'Mariscos & Pescados' 
  | 'Postres & Dulces' 
  | 'Brunch & Café' 
  | 'Tacos & Tex-Mex';

export interface Restaurant {
  id: string;
  name: string;
  tagline: string;
  description: string;
  logo: string;
  coverImage: string;
  address: string;
  city: CityZone;
  lat: number;
  lng: number;
  whatsapp: string; // international format without + or with e.g. 584120000000
  instagram?: string;
  rating: number;
  priceTier: '$' | '$$' | '$$$';
  openingHours: string;
  isVerified: boolean;
  totalDishesCount?: number;
}

export interface Dish {
  id: string;
  restaurantId: string;
  restaurantName: string;
  restaurantCity: CityZone;
  restaurantLogo: string;
  restaurantWhatsapp: string;
  name: string;
  description: string;
  price: number; // in USD
  category: DishCategory;
  prepTimeMinutes: number;
  tags: string[]; // e.g. ['Recomendado del Chef', 'Sin Gluten', 'Carne Angus']
  allergens: string[]; // e.g. ['Gluten', 'Lácteos', 'Mariscos']
  ingredients: string[];
  videoUrl: string;
  posterUrl: string;
  isAiEnhanced: boolean; // if video or presentation was enhanced with AI
  isFeatured: boolean;
  likesCount: number;
  sharesCount: number;
  viewsCount: number;
  isChefRecommended?: boolean;
  distanceKm?: number;
  createdAt: string;
}

export interface FilterState {
  category: string; // 'all' or specific DishCategory
  city: 'all' | CityZone;
  maxPrice: number;
  searchQuery: string;
  sortBy: 'trending' | 'distance' | 'price-asc' | 'popular';
  selectedTag?: string | null;
}

export type ActiveTab = 'feed' | 'map' | 'saved' | 'portal';
