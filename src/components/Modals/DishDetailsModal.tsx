import React, { useState } from 'react';
import { useMenu } from '../../context/MenuContext';
import { 
  X, 
  Clock, 
  MapPin, 
  MessageCircle, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Bookmark, 
  ChevronRight
} from 'lucide-react';

export const DishDetailsModal: React.FC = () => {
  const {
    selectedDishForModal,
    setSelectedDishForModal,
    openWhatsAppOrder,
    isDishSaved,
    toggleSaveDish,
    restaurants,
    setSelectedRestaurantForView,
  } = useMenu();

  const [orderNote, setOrderNote] = useState('');

  if (!selectedDishForModal) return null;
  const dish = selectedDishForModal;
  const isSaved = isDishSaved(dish.id);
  const targetRest = restaurants.find((r) => r.id === dish.restaurantId);

  const handleOrder = () => {
    openWhatsAppOrder(dish, orderNote.trim() || undefined);
    setSelectedDishForModal(null);
  };

  const handleGoToRestaurant = () => {
    if (targetRest) {
      setSelectedRestaurantForView(targetRest);
      setSelectedDishForModal(null);
    }
  };

  return (
    <div 
      onClick={() => setSelectedDishForModal(null)}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md"
    >
      {/* Bottom Sheet Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg glass-dock border border-white/[0.09] rounded-t-[32px] sm:rounded-3xl max-h-[90dvh] flex flex-col overflow-hidden shadow-2xl animate-bottom-sheet"
      >
        {/* Mobile Tactile Drag Handle */}
        <div className="w-12 h-1.5 rounded-full bg-white/20 mx-auto mt-3 mb-1 shrink-0" />

        {/* Close Button */}
        <button
          onClick={() => setSelectedDishForModal(null)}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full glass-action-btn flex items-center justify-center text-stone-300 hover:text-white transition-colors"
          aria-label="Cerrar detalles"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Scrollable Sheet Content */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-5 no-scrollbar">
          {/* Top Dish Media Header */}
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-white/[0.08] shadow-lg">
            <img
              src={dish.posterUrl}
              alt={dish.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09] via-black/30 to-black/20" />
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
              <div>
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                  {dish.category}
                </span>
                <h2 className="font-display font-extrabold text-xl sm:text-2xl text-stone-50 leading-tight">
                  {dish.name}
                </h2>
              </div>
              <div className="text-right">
                <span className="text-2xl sm:text-3xl font-black font-display text-amber-400 font-mono drop-shadow">
                  ${dish.price.toFixed(2)}
                </span>
                <span className="block text-[10px] text-stone-400 font-mono font-semibold">USD</span>
              </div>
            </div>
          </div>

          {/* Restaurant Header Row */}
          <button
            onClick={handleGoToRestaurant}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl glass-warm border border-white/[0.08] hover:border-amber-400/40 transition-colors text-left group"
          >
            <div className="flex items-center gap-3">
              <img
                src={dish.restaurantLogo}
                alt={dish.restaurantName}
                referrerPolicy="no-referrer"
                className="w-11 h-11 rounded-full object-cover border border-amber-400/40 shadow"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-stone-100 group-hover:text-amber-300 transition-colors">
                    {dish.restaurantName}
                  </span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="flex items-center gap-1.5 text-xs text-stone-400 mt-0.5 font-medium">
                  <MapPin className="w-3 h-3 text-amber-400/90" />
                  <span>{dish.restaurantCity}</span>
                  {dish.distanceKm !== undefined && (
                    <>
                      <span aria-hidden="true" className="text-stone-600">·</span>
                      <span className="font-mono text-amber-200/90 font-medium">{dish.distanceKm} km</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <span className="text-xs text-amber-300 font-semibold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-0.5">
              <span>Ver local</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </button>

          {/* Description */}
          <div>
            <h4 className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1.5">
              Descripción del Plato
            </h4>
            <p className="text-sm text-stone-200/95 leading-relaxed">
              {dish.description}
            </p>
          </div>

          {/* Ingredients list */}
          {dish.ingredients && dish.ingredients.length > 0 && (
            <div>
              <h4 className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2">
                Ingredientes Principales
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-300 font-medium">
                {dish.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Allergens warning */}
          {dish.allergens && dish.allergens.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 mb-1">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Alérgenos declarados por el restaurante</span>
              </div>
              <div className="flex flex-wrap gap-1.5 text-xs text-amber-200/90 font-medium">
                {dish.allergens.join(', ')}
              </div>
            </div>
          )}

          {/* Prep time & AI Badge */}
          <div className="flex items-center gap-4 text-xs text-stone-300 font-medium pt-1">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Tiempo de cocina: <strong className="text-stone-100">{dish.prepTimeMinutes} min</strong></span>
            </div>
            {dish.isAiEnhanced && (
              <div className="flex items-center gap-1 text-amber-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Video Mejorado con IA</span>
              </div>
            )}
          </div>

          {/* Order Note input */}
          <div className="pt-2 border-t border-white/[0.06]">
            <label className="block text-xs font-semibold text-stone-300 mb-1.5">
              Nota o preferencia para tu pedido (Opcional)
            </label>
            <input
              type="text"
              value={orderNote}
              onChange={(e) => setOrderNote(e.target.value)}
              placeholder="Ej. Sin cebolla, punto de cocción, aderezo aparte..."
              className="w-full px-3.5 py-2.5 bg-stone-900/90 border border-white/[0.1] rounded-xl text-stone-100 text-xs focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>
        </div>

        {/* Sticky Bottom Actions with Safe Area */}
        <div className="pb-safe p-4 glass-dock border-t border-white/[0.08] flex items-center gap-3">
          <button
            onClick={() => toggleSaveDish(dish.id)}
            className="p-3.5 rounded-2xl glass-action-btn text-stone-200 hover:text-amber-400 transition-all active:scale-95"
            title={isSaved ? 'Quitar de guardados' : 'Guardar plato'}
          >
            <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>

          <button
            onClick={handleOrder}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl font-display font-extrabold text-sm text-white bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 shadow-[0_8px_24px_rgba(16,185,129,0.35)] hover:scale-[1.01] active:scale-95 transition-all cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 fill-white/20" />
            <span>Pedir por WhatsApp (${dish.price.toFixed(2)})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
