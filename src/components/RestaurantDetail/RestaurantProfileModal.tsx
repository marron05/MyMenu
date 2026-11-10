import React from 'react';
import { useMenu } from '../../context/MenuContext';
import { 
  X, 
  MapPin, 
  Clock, 
  Star, 
  MessageCircle, 
  CheckCircle2, 
  Play, 
  Share2 
} from 'lucide-react';

export const RestaurantProfileModal: React.FC = () => {
  const {
    selectedRestaurantForView,
    setSelectedRestaurantForView,
    dishes,
    setSelectedDishForModal,
    showToast,
  } = useMenu();

  if (!selectedRestaurantForView) return null;
  const rest = selectedRestaurantForView;
  const restDishes = dishes.filter((d) => d.restaurantId === rest.id);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast(`¡Perfil de ${rest.name} copiado al portapapeles! 📋`);
  };

  const handleOpenDirectWhatsApp = () => {
    const text = encodeURIComponent(
      `¡Hola *${rest.name}*! 👋 Vi su restaurante en la app *MyMenu* y me gustaría consultar sobre su menú de hoy.`
    );
    window.open(`https://wa.me/${rest.whatsapp}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      onClick={() => setSelectedRestaurantForView(null)}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl glass-dock border border-white/[0.09] rounded-t-[32px] sm:rounded-3xl max-h-[92dvh] flex flex-col overflow-hidden shadow-2xl animate-bottom-sheet"
      >
        {/* Mobile Tactile Drag Handle */}
        <div className="w-12 h-1.5 rounded-full bg-white/20 mx-auto mt-3 mb-1 shrink-0" />

        {/* Close Button */}
        <button
          onClick={() => setSelectedRestaurantForView(null)}
          className="absolute top-4 right-4 z-30 w-8 h-8 rounded-full glass-action-btn flex items-center justify-center text-white hover:border-white/30 transition-colors"
          aria-label="Cerrar perfil"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Scrollable Container */}
        <div className="overflow-y-auto no-scrollbar pb-safe">
          {/* Cover Header */}
          <div className="relative h-44 sm:h-52 w-full bg-stone-950">
            <img
              src={rest.coverImage}
              alt={rest.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09] via-stone-950/40 to-transparent" />
          </div>

          {/* Restaurant Identity Header */}
          <div className="px-5 sm:px-6 -mt-12 relative z-10 space-y-3">
            <div className="flex items-end justify-between gap-3">
              <img
                src={rest.logo}
                alt={rest.name}
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-400 shadow-2xl bg-stone-900 ring-2 ring-white/10"
              />

              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="p-2.5 rounded-xl glass-action-btn text-stone-300 hover:text-white transition-colors"
                  title="Compartir"
                  aria-label="Compartir perfil"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleOpenDirectWhatsApp}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white text-xs font-bold shadow-[0_4px_16px_rgba(16,185,129,0.35)] hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-white/20" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-extrabold text-xl sm:text-2xl text-stone-50">
                  {rest.name}
                </h2>
                {rest.isVerified && (
                  <CheckCircle2 className="w-5 h-5 text-amber-400 fill-amber-400/20" />
                )}
              </div>
              <p className="text-xs text-amber-300 font-semibold mt-0.5">
                {rest.tagline}
              </p>
            </div>

            <p className="text-xs text-stone-300/95 leading-relaxed">
              {rest.description}
            </p>

            {/* Unboxed Metadata (Zero-Pill) */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-stone-400 font-medium pt-1">
              <span className="flex items-center gap-1 text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span className="font-mono font-bold">{rest.rating}</span>
              </span>
              <span aria-hidden="true" className="text-stone-600">·</span>
              <span className="font-mono text-amber-300 font-bold">{rest.priceTier}</span>
              <span aria-hidden="true" className="text-stone-600">·</span>
              <div className="flex items-center gap-1 text-stone-300">
                <MapPin className="w-3.5 h-3.5 text-amber-400/90" />
                <span>{rest.city} ({rest.address})</span>
              </div>
              <span aria-hidden="true" className="text-stone-600">·</span>
              <div className="flex items-center gap-1 text-stone-400">
                <Clock className="w-3.5 h-3.5 text-stone-500" />
                <span>{rest.openingHours}</span>
              </div>
            </div>
          </div>

          {/* Dishes Grid */}
          <div className="px-5 sm:px-6 py-6 border-t border-white/[0.08] mt-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-stone-100">
                Menú en Video ({restDishes.length} platos)
              </h3>
              <span className="text-[11px] text-stone-400 font-medium">Toca para reproducir</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {restDishes.map((dish) => (
                <div
                  key={dish.id}
                  onClick={() => setSelectedDishForModal(dish)}
                  className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-stone-950 border border-white/[0.08] hover:border-amber-400/50 cursor-pointer transition-all shadow-md"
                >
                  <img
                    src={dish.posterUrl}
                    alt={dish.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09] via-black/25 to-transparent flex flex-col justify-end p-2.5">
                    <div className="flex items-center justify-between text-xs text-amber-400 font-mono font-bold mb-1">
                      <span>${dish.price.toFixed(2)}</span>
                      <div className="w-6 h-6 rounded-full glass-action-btn flex items-center justify-center text-amber-300">
                        <Play className="w-3 h-3 fill-amber-300 ml-0.5" />
                      </div>
                    </div>
                    <span className="text-xs font-bold text-white line-clamp-1">
                      {dish.name}
                    </span>
                    <span className="text-[10px] text-stone-400 line-clamp-1">
                      {dish.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
