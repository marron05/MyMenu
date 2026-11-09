import React from 'react';
import { useMenu } from '../../context/MenuContext';
import { CITY_ZONES, CATEGORIES_LIST } from '../../data/initialData';
import { 
  X, 
  MapPin, 
  SlidersHorizontal, 
  RotateCcw, 
  Check, 
  Search, 
  DollarSign, 
  Sparkles,
  ArrowUpDown
} from 'lucide-react';
import { CityZone } from '../../types';

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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-stone-900 border border-stone-800 rounded-t-3xl sm:rounded-3xl max-h-[90dvh] flex flex-col overflow-hidden shadow-2xl"
      >
        {/* Mobile Grab Handle */}
        <div className="sm:hidden w-10 h-1.5 bg-stone-700 rounded-full mx-auto my-3 shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-amber-400" />
            <h3 className="font-display font-bold text-base text-white">
              Filtros y Descubrimiento
            </h3>
          </div>
          <button
            onClick={() => setFilterDrawerOpen(false)}
            className="w-8 h-8 rounded-full bg-stone-800 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Search bar */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
              Búsqueda Libre
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={filters.searchQuery}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))
                }
                placeholder="Buscar por plato, ingrediente o restaurante..."
                className="w-full pl-9 pr-4 py-2 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 text-xs focus:outline-none focus:border-amber-400 placeholder:text-stone-500"
              />
            </div>
          </div>

          {/* Location / City Zone */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
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
                    className={`p-2.5 rounded-xl text-left border transition-all ${
                      isSelected
                        ? 'bg-amber-400/20 border-amber-400 text-amber-300 font-semibold'
                        : 'bg-stone-950 border-stone-800 text-stone-300 hover:bg-stone-800'
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
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
              Tipo de Comida
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES_LIST.map((cat) => {
                const isSelected = filters.category === cat;
                return (
                  <button
                    key={cat}
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, category: cat }))
                    }
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                      isSelected
                        ? 'bg-amber-400 text-stone-950 font-bold border-amber-400 shadow-sm'
                        : 'bg-stone-950 text-stone-300 border-stone-800 hover:text-white'
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
              <label className="font-semibold text-stone-300 uppercase tracking-wider">
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
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-500 font-mono mt-1">
              <span>$5 USD</span>
              <span>$25 USD</span>
              <span>$50+ USD</span>
            </div>
          </div>

          {/* Sorting */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
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
                  className={`p-2.5 rounded-xl text-xs text-left border transition-all ${
                    filters.sortBy === opt.id
                      ? 'bg-amber-400/20 border-amber-400 text-amber-300 font-semibold'
                      : 'bg-stone-950 border-stone-800 text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dietary Tags */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
              Etiquetas Especiales
            </label>
            <div className="flex flex-wrap gap-1.5">
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
                      className={`px-3 py-1 rounded-lg text-xs border transition-colors ${
                        isSelected
                          ? 'bg-amber-400 text-stone-950 font-bold border-amber-400'
                          : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200'
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

        {/* Footer Actions */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 flex items-center gap-3">
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-300 hover:text-white bg-stone-900 border border-stone-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer</span>
          </button>

          <button
            onClick={() => setFilterDrawerOpen(false)}
            className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs text-stone-950 bg-amber-400 hover:bg-amber-300 shadow-md transition-all text-center"
          >
            Ver Resultados
          </button>
        </div>
      </div>
    </div>
  );
};
