import React from 'react';
import { useMenu } from '../../context/MenuContext';
import { CITY_ZONES, CATEGORIES_LIST } from '../../data/initialData';
import { 
  X, 
  MapPin, 
  SlidersHorizontal, 
  RotateCcw, 
  Search, 
  ArrowUpDown,
  Sparkles
} from 'lucide-react';

export const FilterDrawer: React.FC = () => {
  const {
    filterDrawerOpen,
    setFilterDrawerOpen,
    filters,
    setFilters,
    resetFilters,
  } = useMenu();

  if (!filterDrawerOpen) return null;

  return (
    <div 
      onClick={() => setFilterDrawerOpen(false)}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg glass-dock border border-white/[0.09] rounded-t-[32px] sm:rounded-3xl max-h-[90dvh] flex flex-col overflow-hidden shadow-2xl animate-bottom-sheet"
      >
        {/* Mobile Tactile Drag Handle */}
        <div className="w-12 h-1.5 rounded-full bg-white/20 mx-auto mt-3 mb-1 shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-amber-400" />
            <h3 className="font-display font-extrabold text-base text-stone-50">
              Filtros y Descubrimiento
            </h3>
          </div>
          <button
            onClick={() => setFilterDrawerOpen(false)}
            className="w-8 h-8 rounded-full glass-action-btn text-stone-400 hover:text-white flex items-center justify-center transition-colors"
            aria-label="Cerrar filtros"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6 no-scrollbar">
          {/* Search bar */}
          <div>
            <label className="block text-[11px] font-bold text-stone-300 uppercase tracking-wider mb-2">
              Búsqueda Libre
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={filters.searchQuery}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))
                }
                placeholder="Buscar por plato, ingrediente o restaurante..."
                className="w-full pl-10 pr-4 py-2.5 bg-stone-900/90 border border-white/[0.1] rounded-xl text-stone-100 text-xs focus:outline-none focus:border-amber-400 placeholder:text-stone-500 transition-colors"
              />
            </div>
          </div>

          {/* Location / City Zone */}
          <div>
            <label className="block text-[11px] font-bold text-stone-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Zona / Municipio</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CITY_ZONES.map((zone) => {
                const isSelected = filters.city === zone.id;
                return (
                  <button
                    key={zone.id}
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, city: zone.id as any }))
                    }
                    className={`p-3 rounded-2xl text-left border transition-all ${
                      isSelected
                        ? 'bg-amber-400/20 border-amber-400 text-amber-300 font-bold ring-1 ring-amber-400/40'
                        : 'glass-warm text-stone-300 hover:border-white/20'
                    }`}
                  >
                    <div className="text-xs font-bold leading-tight">{zone.name}</div>
                    <div className="text-[10px] text-stone-400 truncate mt-0.5">
                      {zone.subtitle}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-[11px] font-bold text-stone-300 uppercase tracking-wider mb-2">
              Tipo de Comida
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES_LIST.map((cat) => {
                const isSelected = filters.category === cat;
                return (
                  <button
                    key={cat}
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, category: cat }))
                    }
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 font-bold border-amber-400 shadow-md'
                        : 'glass-action-btn text-stone-300 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Maximum Price Range */}
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <label className="font-bold text-stone-300 uppercase tracking-wider text-[11px]">
                Precio Máximo
              </label>
              <span className="font-mono text-amber-400 font-bold text-sm">
                Hasta ${filters.maxPrice} USD
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              step="1"
              value={filters.maxPrice}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))
              }
              className="w-full accent-amber-400 cursor-pointer h-2 bg-stone-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-stone-500 font-mono mt-1.5">
              <span>$5 USD</span>
              <span>$25 USD</span>
              <span>$50+ USD</span>
            </div>
          </div>

          {/* Sorting */}
          <div>
            <label className="block text-[11px] font-bold text-stone-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
              <span>Ordenar Por</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'trending', label: '🔥 En Tendencia' },
                { id: 'distance', label: '📍 Más Cercanos' },
                { id: 'price-asc', label: '💵 Menor Precio' },
                { id: 'popular', label: '❤️ Más Populares' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, sortBy: opt.id as any }))
                  }
                  className={`p-3 rounded-2xl text-xs text-left border transition-all ${
                    filters.sortBy === opt.id
                      ? 'bg-amber-400/20 border-amber-400 text-amber-300 font-bold ring-1 ring-amber-400/40'
                      : 'glass-warm text-stone-300 hover:border-white/20'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dietary Tags */}
          <div>
            <label className="block text-[11px] font-bold text-stone-300 uppercase tracking-wider mb-2">
              Etiquetas Especiales
            </label>
            <div className="flex flex-wrap gap-2">
              {['Recomendado del Chef', 'Sin Gluten', 'Carne Angus', 'Horno de Leña', 'Cacao Venezolano'].map(
                (tag) => {
                  const isSelected = filters.selectedTag === tag;
                  return (
                    <button
                      key={tag}
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          selectedTag: isSelected ? null : tag,
                        }))
                      }
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        isSelected
                          ? 'bg-amber-400 text-stone-950 font-bold border-amber-400 shadow-md'
                          : 'glass-action-btn text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                }
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions with Safe Area */}
        <div className="pb-safe p-4 glass-dock border-t border-white/[0.08] flex items-center gap-3">
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 px-4 py-3 rounded-2xl text-xs font-bold text-stone-300 hover:text-white glass-action-btn transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer</span>
          </button>

          <button
            onClick={() => setFilterDrawerOpen(false)}
            className="flex-1 py-3 px-5 rounded-2xl font-display font-extrabold text-xs text-stone-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-[0_4px_16px_rgba(245,158,11,0.25)] transition-all text-center cursor-pointer"
          >
            Ver Platos
          </button>
        </div>
      </div>
    </div>
  );
};
