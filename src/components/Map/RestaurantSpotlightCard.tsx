import React from 'react';
import { Restaurant, Dish } from '../../types';
import { useMenu } from '../../context/MenuContext';
import { 
  Star, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Play, 
  ChevronRight, 
  Compass, 
  CheckCircle2, 
  Flame,
  X
} from 'lucide-react';

interface RestaurantSpotlightCardProps {
  restaurant: Restaurant;
  dishes: Dish[];
  onClose?: () => void;
}

export const RestaurantSpotlightCard: React.FC<RestaurantSpotlightCardProps> = ({
  restaurant,
  dishes,
  onClose,
}) => {
  const {
    openWhatsAppOrder,
    setSelectedDishForModal,
    setActiveTab,
    setFilters,
    setSelectedRestaurantForView,
  } = useMenu();

  // Primary dish to feature or order
  const heroDish = dishes[0];

  // Navigate smoothly from Map to Feed filtered by this restaurant
  const handleExploreInFeed = () => {
    setFilters((prev) => ({
      ...prev,
      searchQuery: restaurant.name,
      city: restaurant.city,
    }));
    setActiveTab('feed');
  };

  return (
    <div className="w-full glass-dock rounded-3xl p-4 sm:p-5 border border-white/[0.09] shadow-[0_20px_50px_rgba(0,0,0,0.85)] transition-all duration-300">
      {/* Header Row: Logo, Name, Rating, Price & Close */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={restaurant.logo}
              alt={restaurant.name}
              referrerPolicy="no-referrer"
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover border border-amber-400/40 shadow-md ring-1 ring-white/10"
            />
            {restaurant.isVerified && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center text-stone-950 shadow">
                <CheckCircle2 className="w-3 h-3 stroke-[3]" />
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-display font-extrabold text-base sm:text-lg text-stone-50 leading-tight">
                {restaurant.name}
              </h3>
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-[11px] font-bold">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span className="font-mono">{restaurant.rating.toFixed(1)}</span>
              </div>
            </div>

            {/* Unboxed Metadata (Zero-Pill discipline) */}
            <div className="flex items-center gap-2 text-[11px] text-stone-400 mt-1 flex-wrap font-medium">
              <span className="font-mono text-amber-300 font-bold">{restaurant.priceTier}</span>
              <span aria-hidden="true" className="text-stone-600">·</span>
              <div className="flex items-center gap-1 text-stone-300">
                <MapPin className="w-3 h-3 text-amber-400/90 shrink-0" />
                <span>{restaurant.city}</span>
              </div>
              <span aria-hidden="true" className="text-stone-600">·</span>
              <div className="flex items-center gap-1 text-stone-400">
                <Clock className="w-3 h-3 text-stone-500 shrink-0" />
                <span className="truncate max-w-[150px]">{restaurant.openingHours}</span>
              </div>
            </div>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full glass-action-btn flex items-center justify-center text-stone-400 hover:text-white transition-colors shrink-0"
            aria-label="Cerrar tarjeta"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Tagline / Specialties Statement */}
      <p className="text-xs text-stone-300/90 leading-relaxed line-clamp-1 mb-3">
        {restaurant.tagline}
      </p>

      {/* Dishes Video Carousel */}
      <div className="mb-3.5">
        <div className="flex items-center justify-between text-[11px] text-stone-400 mb-2 font-medium">
          <span className="text-stone-300 font-semibold flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
            <span>Platos disponibles en video ({dishes.length})</span>
          </span>
          <button
            onClick={handleExploreInFeed}
            className="text-amber-400 hover:text-amber-300 inline-flex items-center gap-0.5 font-semibold transition-colors"
          >
            <span>Ver todo en Feed</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
          {dishes.map((dish) => (
            <button
              key={dish.id}
              onClick={() => setSelectedDishForModal(dish)}
              className="group relative w-28 sm:w-32 h-32 sm:h-36 rounded-2xl overflow-hidden bg-stone-900 border border-white/[0.08] shrink-0 text-left transition-all duration-300 hover:border-amber-400/50 hover:scale-[1.03] shadow-md"
            >
              <img
                src={dish.posterUrl}
                alt={dish.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Dark subtle vignette over thumbnail */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09] via-black/30 to-transparent flex flex-col justify-between p-2">
                <div className="self-end">
                  <div className="w-6 h-6 rounded-full glass-action-btn flex items-center justify-center text-amber-300">
                    <Play className="w-3 h-3 fill-amber-300/80 ml-0.5" />
                  </div>
                </div>

                <div>
                  <div className="font-display font-black text-xs text-amber-400 tabular-nums">
                    ${dish.price.toFixed(2)}
                  </div>
                  <div className="text-[10px] font-semibold text-stone-100 truncate mt-0.5">
                    {dish.name}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons: WhatsApp Direct Order + Ver en Feed + Perfil */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-white/[0.07]">
        {/* Primary CTA: WhatsApp */}
        <button
          onClick={() => {
            if (heroDish) {
              openWhatsAppOrder(heroDish);
            }
          }}
          className="col-span-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white text-xs font-bold shadow-[0_4px_16px_rgba(16,185,129,0.3)] hover:scale-[1.02] active:scale-95 transition-all"
        >
          <MessageCircle className="w-4 h-4 fill-white/20" />
          <span>Pedir WhatsApp</span>
        </button>

        {/* Secondary: Explorar en Feed TikTok */}
        <button
          onClick={handleExploreInFeed}
          className="col-span-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 text-xs font-bold shadow-[0_4px_16px_rgba(245,158,11,0.25)] hover:scale-[1.02] active:scale-95 transition-all"
        >
          <Compass className="w-4 h-4" />
          <span>Ver en Feed</span>
        </button>

        {/* Tertiary: Perfil Completo */}
        <button
          onClick={() => setSelectedRestaurantForView(restaurant)}
          className="col-span-2 sm:col-span-1 flex items-center justify-center px-3 py-2.5 rounded-xl glass-action-btn text-stone-200 hover:text-white text-xs font-semibold hover:border-white/20 transition-all"
        >
          <span>Perfil & Menú</span>
        </button>
      </div>
    </div>
  );
};
