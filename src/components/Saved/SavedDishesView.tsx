import React from 'react';
import { useMenu } from '../../context/MenuContext';
import { 
  Bookmark, 
  Play, 
  Trash2, 
  MessageCircle, 
  MapPin, 
  Clock, 
  Sparkles,
  ChevronRight,
  Flame,
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
    <div className="w-full min-h-[calc(100dvh-57px)] bg-stone-950 text-stone-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-4">
          <div>
            <h1 className="font-display font-extrabold text-2xl text-white flex items-center gap-2">
              <Bookmark className="w-6 h-6 text-amber-400 fill-amber-400/20" />
              <span>Platos Guardados</span>
            </h1>
            <p className="text-xs text-stone-400 mt-1">
              Tu selección personal para decidir con amigos o pedir directo cuando tengas hambre.
            </p>
          </div>
          <span className="text-xs font-mono text-stone-400 bg-stone-900 px-3 py-1.5 rounded-lg border border-stone-800">
            {savedDishes.length} {savedDishes.length === 1 ? 'plato' : 'platos'}
          </span>
        </div>

        {/* Empty State */}
        {savedDishes.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-2xl bg-stone-900/40 border border-stone-800">
            <Bookmark className="w-12 h-12 text-stone-600 mx-auto mb-3" />
            <h3 className="font-display font-bold text-base text-stone-200">
              No tienes platos guardados todavía
            </h3>
            <p className="text-xs text-stone-400 max-w-sm mx-auto mt-1 mb-5">
              Explora el feed de videos y toca el icono de guardar en cualquier plato que te provoque.
            </p>
            <button
              onClick={() => setActiveTab('feed')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 shadow-md transition-all"
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
                className="group relative flex gap-3.5 p-4 rounded-2xl bg-stone-900/80 border border-stone-800 hover:border-stone-700 transition-all shadow-lg"
              >
                {/* Video / Poster thumbnail with play trigger */}
                <div
                  onClick={() => setSelectedDishForModal(dish)}
                  className="relative w-28 h-36 rounded-xl overflow-hidden bg-black shrink-0 cursor-pointer"
                >
                  <img
                    src={dish.posterUrl}
                    alt={dish.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-amber-400">
                      <Play className="w-4 h-4 ml-0.5 fill-amber-400" />
                    </div>
                  </div>
                  <div className="absolute bottom-1.5 left-2 font-mono text-xs font-bold text-amber-400 drop-shadow">
                    ${dish.price.toFixed(2)}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-[11px] text-amber-400 font-semibold">
                        {dish.restaurantName}
                      </span>
                      <button
                        onClick={() => toggleSaveDish(dish.id)}
                        className="text-stone-500 hover:text-red-400 transition-colors p-1"
                        title="Quitar de guardados"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h3
                      onClick={() => setSelectedDishForModal(dish)}
                      className="font-display font-bold text-sm sm:text-base text-white hover:text-amber-300 cursor-pointer line-clamp-1 transition-colors"
                    >
                      {dish.name}
                    </h3>

                    {/* Unboxed metadata */}
                    <div className="flex items-center gap-1.5 text-xs text-stone-400 mt-1">
                      <MapPin className="w-3 h-3 text-stone-500" />
                      <span>{dish.restaurantCity}</span>
                      <span>·</span>
                      <Clock className="w-3 h-3 text-stone-500" />
                      <span>{dish.prepTimeMinutes}m</span>
                    </div>

                    <p className="text-xs text-stone-300 line-clamp-2 mt-1.5 leading-relaxed">
                      {dish.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-stone-800/80">
                    <button
                      onClick={() => openWhatsAppOrder(dish)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-white/20" />
                      <span>Pedir WhatsApp</span>
                    </button>

                    <button
                      onClick={() => setSelectedDishForModal(dish)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-white bg-stone-800 hover:bg-stone-700 transition-colors"
                      title="Ver detalles e ingredientes"
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
