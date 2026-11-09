import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useMenu } from '../../context/MenuContext';
import { DishCard } from './DishCard';
import { CATEGORIES_LIST, CITY_ZONES } from '../../data/initialData';
import { 
  ChevronUp, 
  ChevronDown, 
  SlidersHorizontal, 
  MapPin, 
  Sparkles, 
  Search, 
  RotateCcw,
  UtensilsCrossed
} from 'lucide-react';

export const TikTokFeed: React.FC = () => {
  const {
    filteredDishes,
    filters,
    setFilters,
    resetFilters,
    setFilterDrawerOpen,
    restaurants,
  } = useMenu();

  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);

  // Keep index within bounds when filters change
  useEffect(() => {
    setActiveIndex(0);
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [filters]);

  // Scroll to a specific dish index
  const scrollToIndex = useCallback((index: number) => {
    if (!containerRef.current || index < 0 || index >= filteredDishes.length) return;
    setIsScrolling(true);
    setActiveIndex(index);
    const container = containerRef.current;
    const targetElement = container.children[index] as HTMLElement;
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
    setTimeout(() => {
      setIsScrolling(false);
    }, 450);
  }, [filteredDishes.length]);

  // Handle scroll events with Intersection Observer or scroll debounce
  const handleScroll = useCallback(() => {
    if (!containerRef.current || isScrolling) return;
    const container = containerRef.current;
    const scrollPosition = container.scrollTop;
    const itemHeight = container.clientHeight;
    const newIndex = Math.round(scrollPosition / itemHeight);

    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < filteredDishes.length) {
      setActiveIndex(newIndex);
    }
  }, [activeIndex, filteredDishes.length, isScrolling]);

  // Keyboard navigation (ArrowUp, ArrowDown)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        scrollToIndex(Math.min(filteredDishes.length - 1, activeIndex + 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        scrollToIndex(Math.max(0, activeIndex - 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, filteredDishes.length, scrollToIndex]);

  return (
    <div className="relative w-full h-[calc(100dvh-57px)] bg-stone-950 flex flex-col items-center justify-center overflow-hidden">
      {/* Category Horizontal Filter Bar */}
      <div className="absolute top-3 left-0 right-0 z-30 px-3 sm:px-6 pointer-events-none">
        <div className="max-w-md mx-auto flex items-center justify-between gap-2 pointer-events-auto">
          {/* Categories Horizontal Carousel */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-1 bg-stone-950/70 backdrop-blur-md border border-stone-800/80 rounded-2xl shadow-xl">
            {CATEGORIES_LIST.slice(0, 7).map((cat) => {
              const isActive = filters.category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setFilters((prev) => ({ ...prev, category: cat }))}
                  className={`px-3 py-1 rounded-xl text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-amber-400 text-stone-950 font-bold shadow-md shadow-amber-400/20 scale-[1.02]'
                      : 'text-stone-300 hover:text-white hover:bg-stone-900/60'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Filter Modal Trigger */}
          <button
            onClick={() => setFilterDrawerOpen(true)}
            className="w-8 h-8 rounded-xl bg-stone-950/80 backdrop-blur-md border border-stone-800 flex items-center justify-center text-stone-200 hover:text-amber-400 shadow-md shrink-0 transition-colors"
            title="Abrir filtros"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Reel Viewport */}
      {filteredDishes.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-6 max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-center text-amber-400 mb-4">
            <UtensilsCrossed className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold font-display text-stone-100">
            No encontramos platos con estos filtros
          </h3>
          <p className="text-xs text-stone-400 mt-1 mb-4 leading-relaxed">
            Prueba seleccionando otra categoría o ampliando el rango de precio y ubicación.
          </p>
          <button
            onClick={resetFilters}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer Filtros</span>
          </button>
        </div>
      ) : (
        <div className="relative w-full h-full max-w-md mx-auto flex items-center justify-center sm:rounded-2xl sm:overflow-hidden sm:border sm:border-stone-800/80 sm:shadow-2xl sm:my-auto sm:max-h-[92dvh]">
          {/* Scrollable Container with Snapping */}
          <div
            ref={containerRef}
            onScroll={handleScroll}
            className="w-full h-full overflow-y-scroll snap-y-mandatory no-scrollbar relative"
          >
            {filteredDishes.map((dish, index) => (
              <div
                key={dish.id}
                className="w-full h-full snap-start relative flex-shrink-0"
              >
                <DishCard
                  dish={dish}
                  isActive={index === activeIndex}
                />
              </div>
            ))}
          </div>

          {/* Desktop/Tablet Up/Down Navigation Buttons */}
          <div className="hidden lg:flex flex-col gap-2 absolute -right-14 top-1/2 -translate-y-1/2 z-40">
            <button
              onClick={() => scrollToIndex(Math.max(0, activeIndex - 1))}
              disabled={activeIndex === 0}
              className="w-10 h-10 rounded-full bg-stone-900/90 border border-stone-800 text-stone-200 hover:text-amber-400 hover:bg-stone-800 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center shadow-lg transition-all"
              title="Plato anterior (Flecha Arriba)"
              aria-label="Plato anterior"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
            <div className="text-[10px] font-mono tabular-nums text-center text-stone-400">
              {activeIndex + 1}/{filteredDishes.length}
            </div>
            <button
              onClick={() => scrollToIndex(Math.min(filteredDishes.length - 1, activeIndex + 1))}
              disabled={activeIndex === filteredDishes.length - 1}
              className="w-10 h-10 rounded-full bg-stone-900/90 border border-stone-800 text-stone-200 hover:text-amber-400 hover:bg-stone-800 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center shadow-lg transition-all"
              title="Siguiente plato (Flecha Abajo)"
              aria-label="Siguiente plato"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
