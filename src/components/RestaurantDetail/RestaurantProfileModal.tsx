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
  Instagram, 
  Share2, 
  ExternalLink 
} from 'lucide-react';

export const RestaurantProfileModal: React.FC = () => {
  const {
    selectedRestaurantForView,
    setSelectedRestaurantForView,
    dishes,
    setSelectedDishForModal,
    openWhatsAppOrder,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-none sm:rounded-3xl h-full sm:h-auto sm:max-h-[92dvh] flex flex-col overflow-hidden shadow-2xl"
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedRestaurantForView(null)}
          className="absolute top-4 right-4 z-30 w-8 h-8 rounded-full bg-black/70 border border-white/20 flex items-center justify-center text-white hover:bg-black transition-colors"
          aria-label="Cerrar perfil"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Scrollable Container */}
        <div className="overflow-y-auto">
          {/* Cover Header */}
          <div className="relative h-44 sm:h-52 w-full bg-stone-950">
            <img
              src={rest.coverImage}
              alt={rest.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent" />
          </div>

          {/* Restaurant Identity Header */}
          <div className="px-6 -mt-12 relative z-10 space-y-3">
            <div className="flex items-end justify-between">
              <img
                src={rest.logo}
                alt={rest.name}
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-400 shadow-xl bg-stone-900"
              />

              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="p-2.5 rounded-xl bg-stone-800 border border-stone-700 text-stone-300 hover:text-white transition-colors"
                  title="Compartir"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleOpenDirectWhatsApp}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-950/40 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 fill-white/20" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-extrabold text-xl sm:text-2xl text-white">
                  {rest.name}
                </h2>
                {rest.isVerified && (
                  <CheckCircle2 className="w-5 h-5 text-amber-400 fill-amber-400/20" />
                )}
              </div>
              <p className="text-xs text-amber-400/90 font-medium mt-0.5">
                {rest.tagline}
              </p>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">
              {rest.description}
            </p>

            {/* Unboxed Metadata (Zero-Pill) */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-stone-400 pt-1">
              <span className="flex items-center gap-1 text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span className="font-mono font-bold">{rest.rating}</span>
              </span>
              <span>·</span>
              <span className="font-mono text-stone-300 font-semibold">{rest.priceTier}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-stone-500" />
                <span>{rest.city} ({rest.address})</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-stone-500" />
                <span>{rest.openingHours}</span>
              </span>
            </div>
          </div>

          {/* Dishes Grid */}
          <div className="px-6 py-6 border-t border-stone-800 mt-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-white">
                Menú en Video ({restDishes.length} platos)
              </h3>
              <span className="text-xs text-stone-400">Toca para ver el plato</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {restDishes.map((dish) => (
                <div
                  key={dish.id}
                  onClick={() => setSelectedDishForModal(dish)}
                  className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-stone-950 border border-stone-800 hover:border-amber-400 cursor-pointer transition-all shadow-md"
                >
                  <img
                    src={dish.posterUrl}
                    alt={dish.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-2.5">
                    <div className="flex items-center justify-between text-xs text-amber-400 font-mono font-bold mb-1">
                      <span>${dish.price.toFixed(2)}</span>
                      <div className="w-6 h-6 rounded-full bg-black/60 flex items-center justify-center">
                        <Play className="w-3 h-3 fill-amber-400" />
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
