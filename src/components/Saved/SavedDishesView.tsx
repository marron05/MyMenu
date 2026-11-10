import React from 'react';
import { useMenu } from '../../context/MenuContext';
import { 
  Bookmark, 
  Play, 
  Trash2, 
  MessageCircle, 
  MapPin, 
  Clock, 
  ChevronRight,
  ArrowRight
} from 'lucide-react';

export const SavedDishesView: React.FC = () => {
  const {
    dishes,
    savedDishIds,
    toggleSaveDish,
    openWhatsAppOrder,
    setSelectedDishForModal,
    setActiveTab,
  } = useMenu();

  const savedDishes = dishes.filter((d) => savedDishIds.includes(d.id));

  return (
    <div className="w-full min-h-screen bg-[#0c0a09] text-stone-100 p-4 sm:p-8 select-none">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div>
            <h1 className="font-display font-extrabold text-2xl text-stone-50 flex items-center gap-2.5">
              <Bookmark className="w-6 h-6 text-amber-400 fill-amber-400/20" />
              <span>Platos Guardados</span>
            </h1>
            <p className="text-xs text-stone-400 mt-1">
              Tu selección personal para decidir con amigos o pedir directo cuando tengas antojo.
            </p>
          </div>
          <span className="text-xs font-mono text-amber-300 glass-pill px-3 py-1.5 rounded-xl font-bold">
            {savedDishes.length} {savedDishes.length === 1 ? 'plato' : 'platos'}
          </span>
        </div>

        {/* Empty State */}
        {savedDishes.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl glass-warm border border-white/[0.08] shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-amber-950/20 border border-amber-400/30 flex items-center justify-center text-amber-400 mx-auto mb-3">
              <Bookmark className="w-8 h-8" />
            </div>
            <h3 className="font-display font-bold text-base text-stone-200">
              No tienes platos guardados todavía
            </h3>
            <p className="text-xs text-stone-400 max-w-sm mx-auto mt-1.5 mb-6 leading-relaxed">
              Explora el feed vertical de videos y toca el icono de guardar en cualquier plato que te provoque.
            </p>
            <button
              onClick={() => setActiveTab('feed')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold text-stone-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-[0_4px_16px_rgba(245,158,11,0.25)] transition-all active:scale-95 cursor-pointer"
            >
              <span>Ir al Feed de Videos</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {savedDishes.map((dish) => (
              <div
                key={dish.id}
                className="group relative flex gap-3.5 p-4 rounded-3xl glass-warm border border-white/[0.08] hover:border-amber-400/40 transition-all shadow-xl"
              >
                {/* Video thumbnail with play trigger */}
                <div
                  onClick={() => setSelectedDishForModal(dish)}
                  className="relative w-28 h-36 rounded-2xl overflow-hidden bg-black shrink-0 cursor-pointer border border-white/[0.08]"
                >
                  <img
                    src={dish.posterUrl}
                    alt={dish.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="w-9 h-9 rounded-full glass-action-btn flex items-center justify-center text-amber-300">
                      <Play className="w-4 h-4 ml-0.5 fill-amber-300" />
                    </div>
                  </div>
                  <div className="absolute bottom-1.5 left-2 font-display font-black text-xs text-amber-400 drop-shadow">
                    ${dish.price.toFixed(2)}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-[11px] text-amber-300 font-semibold truncate">
                        {dish.restaurantName}
                      </span>
                      <button
                        onClick={() => toggleSaveDish(dish.id)}
                        className="text-stone-400 hover:text-rose-400 transition-colors p-1"
                        title="Quitar de guardados"
                        aria-label="Quitar de guardados"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h3
                      onClick={() => setSelectedDishForModal(dish)}
                      className="font-display font-extrabold text-sm sm:text-base text-stone-100 hover:text-amber-300 cursor-pointer line-clamp-1 transition-colors mt-0.5"
                    >
                      {dish.name}
                    </h3>

                    {/* Unboxed metadata (Zero-Pill) */}
                    <div className="flex items-center gap-1.5 text-xs text-stone-400 font-medium mt-1">
                      <MapPin className="w-3 h-3 text-amber-400/90" />
                      <span>{dish.restaurantCity}</span>
                      <span aria-hidden="true" className="text-stone-600">·</span>
                      <Clock className="w-3 h-3 text-stone-500" />
                      <span>{dish.prepTimeMinutes}m</span>
                    </div>

                    <p className="text-xs text-stone-300/90 line-clamp-2 mt-1.5 leading-relaxed">
                      {dish.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-white/[0.06]">
                    <button
                      onClick={() => openWhatsAppOrder(dish)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-md shadow-emerald-950/40 active:scale-95 transition-all"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-white/20" />
                      <span>Pedir WhatsApp</span>
                    </button>

                    <button
                      onClick={() => setSelectedDishForModal(dish)}
                      className="p-2 rounded-xl glass-action-btn text-stone-400 hover:text-white transition-colors"
                      title="Ver detalles e ingredientes"
                      aria-label="Ver detalles"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
