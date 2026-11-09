import React, { useState } from 'react';
import { useMenu } from '../../context/MenuContext';
import { 
  X, 
  Clock, 
  MapPin, 
  MessageCircle, 
  Sparkles, 
  Flame, 
  CheckCircle2, 
  AlertTriangle, 
  Bookmark, 
  Share2, 
  Store
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      {/* Container: Bottom Sheet on mobile, modal card on desktop */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-stone-900 border border-stone-800 rounded-t-3xl sm:rounded-3xl max-h-[90dvh] flex flex-col overflow-hidden shadow-2xl"
      >
        {/* Mobile Grab Handle */}
        <div className="sm:hidden w-10 h-1.5 bg-stone-700 rounded-full mx-auto my-3 shrink-0" />

        {/* Close Button */}
        <button
          onClick={() => setSelectedDishForModal(null)}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-stone-950/70 border border-stone-700 flex items-center justify-center text-stone-300 hover:text-white transition-colors"
          aria-label="Cerrar detalles"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Top Dish Media Header */}
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-stone-800">
            <img
              src={dish.posterUrl}
              alt={dish.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
              <div>
                <span className="text-xs font-semibold text-amber-400">
                  {dish.category}
                </span>
                <h2 className="font-display font-extrabold text-xl text-white leading-tight">
                  {dish.name}
                </h2>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black font-display text-amber-400 font-mono">
                  ${dish.price.toFixed(2)}
                </span>
                <span className="block text-[10px] text-stone-400">USD</span>
              </div>
            </div>
          </div>

          {/* Restaurant Quick Row */}
          <button
            onClick={handleGoToRestaurant}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-stone-950 border border-stone-800 hover:border-amber-500/40 transition-colors text-left group"
          >
            <div className="flex items-center gap-3">
              <img
                src={dish.restaurantLogo}
                alt={dish.restaurantName}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover border border-amber-500/30"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-stone-100 group-hover:text-amber-400 transition-colors">
                    {dish.restaurantName}
                  </span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="flex items-center gap-1 text-xs text-stone-400">
                  <MapPin className="w-3 h-3 text-stone-500" />
                  <span>{dish.restaurantCity}</span>
                  {dish.distanceKm !== undefined && (
                    <>
                      <span>·</span>
                      <span className="font-mono text-stone-300">{dish.distanceKm} km</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <span className="text-xs text-amber-400 font-semibold group-hover:translate-x-0.5 transition-transform">
              Ver local →
            </span>
          </button>

          {/* Description */}
          <div>
            <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
              Descripción del Plato
            </h4>
            <p className="text-sm text-stone-200 leading-relaxed">
              {dish.description}
            </p>
          </div>

          {/* Ingredients list */}
          {dish.ingredients && dish.ingredients.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
                Ingredientes
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-stone-300">
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
            <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/40">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
                <AlertTriangle className="w-4 h-4" />
                <span>Alérgenos declarados por el restaurante</span>
              </div>
              <div className="flex flex-wrap gap-1.5 text-xs text-amber-200/90">
                {dish.allergens.join(', ')}
              </div>
            </div>
          )}

          {/* Prep time & Tags */}
          <div className="flex items-center gap-4 text-xs text-stone-300">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-stone-400" />
              <span>Tiempo estimado: <strong>{dish.prepTimeMinutes} min</strong></span>
            </div>
            {dish.isAiEnhanced && (
              <div className="flex items-center gap-1 text-amber-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Video Mejorado con IA</span>
              </div>
            )}
          </div>

          {/* Custom Note input for WhatsApp */}
          <div className="pt-2 border-t border-stone-800">
            <label className="block text-xs font-medium text-stone-300 mb-1">
              ¿Alguna preferencia para tu pedido? (Opcional)
            </label>
            <input
              type="text"
              value={orderNote}
              onChange={(e) => setOrderNote(e.target.value)}
              placeholder="Ej. Sin cebolla, aderezo aparte, punto de cocción..."
              className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 text-xs focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 flex items-center gap-2.5">
          <button
            onClick={() => toggleSaveDish(dish.id)}
            className="p-3 rounded-xl bg-stone-900 border border-stone-700 text-stone-200 hover:text-amber-400 transition-colors"
            title={isSaved ? 'Quitar de guardados' : 'Guardar plato'}
          >
            <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>

          <button
            onClick={handleOrder}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-950/40 active:scale-[0.98] transition-all"
          >
            <MessageCircle className="w-5 h-5 fill-white/20" />
            <span>Pedir por WhatsApp (${dish.price.toFixed(2)})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
