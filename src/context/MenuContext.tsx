import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Dish, Restaurant, FilterState, ActiveTab, CityZone, DishCategory, AuthUser } from '../types';
import { INITIAL_DISHES, SAMPLE_RESTAURANTS } from '../data/initialData';
import { useGeolocation, GeolocationStatus, UserCoordinates } from '../hooks/useGeolocation';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface MenuContextType {
  dishes: Dish[];
  filteredDishes: Dish[];
  restaurants: Restaurant[];
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  
  // Audio state
  isMuted: boolean;
  toggleMute: () => void;
  
  // Favorites / Saved
  savedDishIds: string[];
  toggleSaveDish: (dishId: string) => void;
  isDishSaved: (dishId: string) => boolean;
  
  // Likes
  likedDishIds: string[];
  toggleLikeDish: (dishId: string) => void;
  
  // WhatsApp order
  openWhatsAppOrder: (dish: Dish, customNotes?: string) => void;
  
  // Modals & Navigation
  selectedDishForModal: Dish | null;
  setSelectedDishForModal: (dish: Dish | null) => void;
  selectedRestaurantForView: Restaurant | null;
  setSelectedRestaurantForView: (restaurant: Restaurant | null) => void;
  filterDrawerOpen: boolean;
  setFilterDrawerOpen: (open: boolean) => void;
  
  // Geolocation
  userCoordinates: UserCoordinates;
  isUsingRealGps: boolean;
  geolocationStatus: GeolocationStatus;
  requestLocation: () => void;
  
  // Supabase Auth & Session
  currentUser: AuthUser | null;
  setCurrentUser: (user: AuthUser | null) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  signOut: () => Promise<void>;
  
  // Restaurant actions (Lado Restaurante)
  addDish: (newDish: Omit<Dish, 'id' | 'likesCount' | 'sharesCount' | 'viewsCount' | 'createdAt'>) => Dish;
  toggleDishFeatured: (dishId: string) => void;
  deleteDish: (dishId: string) => void;
  updateRestaurantProfile: (restaurantId: string, updates: Partial<Restaurant>) => void;
  activeRestaurantId: string;
  setActiveRestaurantId: (id: string) => void;
  
  // Toast notifications
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

const LOCAL_STORAGE_DISHES_KEY = 'mymenu_dishes_v2';
const LOCAL_STORAGE_SAVED_KEY = 'mymenu_saved_v2';
const LOCAL_STORAGE_LIKES_KEY = 'mymenu_likes_v2';
const LOCAL_STORAGE_RESTS_KEY = 'mymenu_restaurants_v2';
const LOCAL_STORAGE_USER_KEY = 'mymenu_user_v2';

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Geolocation integration
  const {
    coordinates: userCoordinates,
    status: geolocationStatus,
    isUsingRealGps,
    requestLocation,
    calculateDistanceFromUser,
  } = useGeolocation();

  // Supabase user state
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [restaurants, setRestaurants] = useState<Restaurant[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_RESTS_KEY);
      return saved ? JSON.parse(saved) : SAMPLE_RESTAURANTS;
    } catch {
      return SAMPLE_RESTAURANTS;
    }
  });

  const [dishes, setDishes] = useState<Dish[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_DISHES_KEY);
      return saved ? JSON.parse(saved) : INITIAL_DISHES;
    } catch {
      return INITIAL_DISHES;
    }
  });

  const [savedDishIds, setSavedDishIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_SAVED_KEY);
      return saved ? JSON.parse(saved) : ['dish-1', 'dish-6'];
    } catch {
      return ['dish-1', 'dish-6'];
    }
  });

  const [likedDishIds, setLikedDishIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_LIKES_KEY);
      return saved ? JSON.parse(saved) : ['dish-1'];
    } catch {
      return ['dish-1'];
    }
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('feed');
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [selectedDishForModal, setSelectedDishForModal] = useState<Dish | null>(null);
  const [selectedRestaurantForView, setSelectedRestaurantForView] = useState<Restaurant | null>(null);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState<boolean>(false);
  const [activeRestaurantId, setActiveRestaurantId] = useState<string>('rest-1');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const defaultFilters: FilterState = {
    category: 'Todo',
    city: 'all',
    maxPrice: 60,
    searchQuery: '',
    sortBy: 'trending',
    selectedTag: null,
  };

  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  // Sync Supabase Auth listener
  useEffect(() => {
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setCurrentUser({
            id: session.user.id,
            email: session.user.email || '',
            restaurantId: activeRestaurantId,
          });
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setCurrentUser({
            id: session.user.id,
            email: session.user.email || '',
            restaurantId: activeRestaurantId,
          });
        } else {
          setCurrentUser(null);
        }
      });

      return () => subscription.unsubscribe();
    }
  }, [activeRestaurantId]);

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_DISHES_KEY, JSON.stringify(dishes));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [dishes]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_SAVED_KEY, JSON.stringify(savedDishIds));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [savedDishIds]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_LIKES_KEY, JSON.stringify(likedDishIds));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [likedDishIds]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_RESTS_KEY, JSON.stringify(restaurants));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [restaurants]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [currentUser]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 2800);
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
    showToast(!isMuted ? 'Audio silenciado' : 'Audio activado 🔊');
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    showToast('Filtros restablecidos');
  };

  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setCurrentUser(null);
    showToast('Sesión de restaurante cerrada');
  };

  const toggleSaveDish = (dishId: string) => {
    setSavedDishIds((prev) => {
      const exists = prev.includes(dishId);
      if (exists) {
        showToast('Eliminado de tus platos guardados');
        return prev.filter((id) => id !== dishId);
      } else {
        showToast('¡Guardado en tus favoritos! ⭐');
        return [...prev, dishId];
      }
    });
  };

  const isDishSaved = (dishId: string) => savedDishIds.includes(dishId);

  const toggleLikeDish = (dishId: string) => {
    const isLiked = likedDishIds.includes(dishId);
    setLikedDishIds((prev) =>
      isLiked ? prev.filter((id) => id !== dishId) : [...prev, dishId]
    );

    setDishes((prev) =>
      prev.map((d) => {
        if (d.id === dishId) {
          return {
            ...d,
            likesCount: isLiked ? Math.max(0, d.likesCount - 1) : d.likesCount + 1,
          };
        }
        return d;
      })
    );
  };

  const openWhatsAppOrder = (dish: Dish, customNotes?: string) => {
    const targetWhatsapp = dish.restaurantWhatsapp || '584120000000';
    const notesLine = customNotes ? `\nNota especial: "${customNotes}"` : '';
    const textMessage = encodeURIComponent(
      `¡Hola *${dish.restaurantName}*! 👋\n` +
      `Vi su plato *${dish.name}* ($${dish.price.toFixed(2)}) en *MyMenu* y me gustaría hacer un pedido.\n` +
      `📍 Zona: ${dish.restaurantCity}${notesLine}\n\n` +
      `¿Tienen disponibilidad en este momento?`
    );

    const whatsappUrl = `https://wa.me/${targetWhatsapp}?text=${textMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    
    setDishes((prev) =>
      prev.map((d) => (d.id === dish.id ? { ...d, sharesCount: d.sharesCount + 1 } : d))
    );
    showToast(`Conectando con ${dish.restaurantName} vía WhatsApp...`);
  };

  const addDish = (
    newDishData: Omit<Dish, 'id' | 'likesCount' | 'sharesCount' | 'viewsCount' | 'createdAt'>
  ): Dish => {
    const rest = restaurants.find((r) => r.id === newDishData.restaurantId);
    const dynamicDistance = rest ? calculateDistanceFromUser(rest.lat, rest.lng) : 1.0;

    const newDish: Dish = {
      ...newDishData,
      id: `dish-${Date.now()}`,
      likesCount: 1,
      sharesCount: 0,
      viewsCount: 1,
      distanceKm: dynamicDistance,
      createdAt: new Date().toISOString(),
    };

    setDishes((prev) => [newDish, ...prev]);

    // Async push to Supabase if credentials are active
    if (isSupabaseConfigured) {
      supabase
        .from('dishes')
        .insert({
          name: newDish.name,
          description: newDish.description,
          price: newDish.price,
          category: newDish.category,
          prep_time_minutes: newDish.prepTimeMinutes,
          tags: newDish.tags,
          allergens: newDish.allergens,
          ingredients: newDish.ingredients,
          video_url: newDish.videoUrl,
          poster_url: newDish.posterUrl,
          is_ai_enhanced: newDish.isAiEnhanced,
          is_featured: newDish.isFeatured,
        })
        .then(({ error }) => {
          if (error) console.warn('Supabase sync notice:', error.message);
        });
    }

    showToast(`¡"${newDish.name}" publicado en MyMenu! 🎉`);
    return newDish;
  };

  const toggleDishFeatured = (dishId: string) => {
    setDishes((prev) =>
      prev.map((d) => {
        if (d.id === dishId) {
          const nextFeatured = !d.isFeatured;
          showToast(nextFeatured ? 'Plato destacado (Boost activo) ⭐' : 'Boost desactivado');
          return { ...d, isFeatured: nextFeatured };
        }
        return d;
      })
    );
  };

  const deleteDish = (dishId: string) => {
    setDishes((prev) => prev.filter((d) => d.id !== dishId));
    showToast('Plato eliminado del menú');
  };

  const updateRestaurantProfile = (restaurantId: string, updates: Partial<Restaurant>) => {
    setRestaurants((prev) =>
      prev.map((r) => (r.id === restaurantId ? { ...r, ...updates } : r))
    );
    if (updates.name || updates.city || updates.whatsapp || updates.logo) {
      setDishes((prev) =>
        prev.map((d) => {
          if (d.restaurantId === restaurantId) {
            return {
              ...d,
              restaurantName: updates.name || d.restaurantName,
              restaurantCity: (updates.city as CityZone) || d.restaurantCity,
              restaurantWhatsapp: updates.whatsapp || d.restaurantWhatsapp,
              restaurantLogo: updates.logo || d.restaurantLogo,
            };
          }
          return d;
        })
      );
    }
    showToast('Perfil del restaurante actualizado');
  };

  // Dynamically calculate Haversine distance for all dishes and filter/sort
  const dishesWithDistances = useMemo(() => {
    return dishes.map((dish) => {
      const rest = restaurants.find((r) => r.id === dish.restaurantId);
      const computedDistance = rest
        ? calculateDistanceFromUser(rest.lat, rest.lng)
        : (dish.distanceKm ?? 1.2);
      return {
        ...dish,
        distanceKm: computedDistance,
      };
    });
  }, [dishes, restaurants, calculateDistanceFromUser]);

  const filteredDishes = useMemo(() => {
    return dishesWithDistances
      .filter((dish) => {
        if (filters.city !== 'all' && dish.restaurantCity !== filters.city) {
          return false;
        }
        if (filters.category !== 'Todo' && dish.category !== filters.category) {
          return false;
        }
        if (dish.price > filters.maxPrice) {
          return false;
        }
        if (filters.selectedTag && !dish.tags.includes(filters.selectedTag)) {
          return false;
        }
        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase();
          const matchName = dish.name.toLowerCase().includes(q);
          const matchDesc = dish.description.toLowerCase().includes(q);
          const matchRest = dish.restaurantName.toLowerCase().includes(q);
          const matchIngr = dish.ingredients.some((ing) => ing.toLowerCase().includes(q));
          const matchTag = dish.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchName && !matchDesc && !matchRest && !matchIngr && !matchTag) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'trending') {
          if (a.isFeatured !== b.isFeatured) {
            return a.isFeatured ? -1 : 1;
          }
          return b.viewsCount + b.likesCount * 3 - (a.viewsCount + a.likesCount * 3);
        }
        if (filters.sortBy === 'distance') {
          return (a.distanceKm ?? 99) - (b.distanceKm ?? 99);
        }
        if (filters.sortBy === 'price-asc') {
          return a.price - b.price;
        }
        if (filters.sortBy === 'popular') {
          return b.likesCount - a.likesCount;
        }
        return 0;
      });
  }, [dishesWithDistances, filters]);

  return (
    <MenuContext.Provider
      value={{
        dishes: dishesWithDistances,
        filteredDishes,
        restaurants,
        activeTab,
        setActiveTab,
        filters,
        setFilters,
        resetFilters,
        isMuted,
        toggleMute,
        savedDishIds,
        toggleSaveDish,
        isDishSaved,
        likedDishIds,
        toggleLikeDish,
        openWhatsAppOrder,
        selectedDishForModal,
        setSelectedDishForModal,
        selectedRestaurantForView,
        setSelectedRestaurantForView,
        filterDrawerOpen,
        setFilterDrawerOpen,
        userCoordinates,
        isUsingRealGps,
        geolocationStatus,
        requestLocation,
        currentUser,
        setCurrentUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        signOut,
        addDish,
        toggleDishFeatured,
        deleteDish,
        updateRestaurantProfile,
        activeRestaurantId,
        setActiveRestaurantId,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = (): MenuContextType => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};
