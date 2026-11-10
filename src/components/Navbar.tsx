import React from 'react';
import { useMenu } from '../context/MenuContext';
import { Volume2, VolumeX, SlidersHorizontal, MapPin, Sparkles, PlusCircle } from 'lucide-react';
import { CITY_ZONES } from '../data/initialData';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    isMuted,
    toggleMute,
    filters,
    setFilterDrawerOpen,
    savedDishIds,
    isUsingRealGps,
    requestLocation,
    currentUser,
    setIsAuthModalOpen,
  } = useMenu();

  const currentCityName =
    CITY_ZONES.find((z) => z.id === filters.city)?.name || 'Toda la Zona';

  return (
    <header className="fixed top-0 inset-x-0 z-40 w-full glass-dock border-b border-white/[0.07] px-3.5 sm:px-6 md:px-8 py-2 md:py-2.5 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 md:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setActiveTab('feed')}
            className="flex items-center gap-2 text-left group focus-visible:outline-none"
            aria-label="Ir al inicio de MyMenu"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-[0_4px_16px_rgba(245,158,11,0.25)] group-hover:scale-105 transition-transform ring-1 ring-white/20">
              <span className="font-display font-black text-stone-950 text-base tracking-tighter">M</span>
            </div>
            <div>
              <span className="font-display font-black text-base sm:text-lg tracking-tight text-stone-100 flex items-center gap-1">
                MyMenu
              </span>
              <span className="hidden sm:block text-[9px] text-stone-400 font-medium -mt-1 tracking-wider uppercase">
                En video · Anzoátegui
              </span>
            </div>
          </button>

          {/* Quick Zone Pill (Visible on all devices, opens filter) */}
          <button
            onClick={() => setFilterDrawerOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-stone-300 hover:text-white glass-pill rounded-xl transition-colors whitespace-nowrap"
            title="Cambiar zona"
          >
            <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="truncate max-w-[100px] sm:max-w-none">{currentCityName}</span>
          </button>

          {/* GPS Status Indicator */}
          <button
            onClick={requestLocation}
            title={isUsingRealGps ? 'GPS Calibrado (Click para recalcular)' : 'Activar GPS de tu dispositivo'}
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 text-[11px] rounded-lg transition-all ${
              isUsingRealGps
                ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 font-medium'
                : 'glass-pill text-stone-400 hover:text-stone-200'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isUsingRealGps ? 'bg-emerald-400 animate-pulse' : 'bg-stone-500'
              }`}
            />
            <span className="font-mono">
              {isUsingRealGps ? 'GPS Activo' : 'Activar GPS'}
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Hidden on mobile where MobileBottomNav takes over) */}
        <nav className="hidden sm:flex items-center gap-1 sm:gap-2 md:gap-5 text-sm font-medium">
          <button
            onClick={() => setActiveTab('feed')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap shrink-0 text-xs sm:text-sm ${
              activeTab === 'feed'
                ? 'bg-white/[0.08] text-amber-300 font-semibold shadow-inner border border-white/[0.07]'
                : 'text-stone-300 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            Feed Video
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap shrink-0 text-xs sm:text-sm ${
              activeTab === 'map'
                ? 'bg-white/[0.08] text-amber-300 font-semibold shadow-inner border border-white/[0.07]'
                : 'text-stone-300 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            Mapa de Zona
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`relative px-3 py-1.5 rounded-xl transition-all whitespace-nowrap shrink-0 text-xs sm:text-sm ${
              activeTab === 'saved'
                ? 'bg-white/[0.08] text-amber-300 font-semibold shadow-inner border border-white/[0.07]'
                : 'text-stone-300 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            Guardados
            {savedDishIds.length > 0 && (
              <span className="ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full bg-amber-400/20 text-amber-300 font-mono font-bold">
                {savedDishIds.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('portal')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap shrink-0 text-xs sm:text-sm ${
              activeTab === 'portal'
                ? 'bg-white/[0.08] text-amber-300 font-semibold shadow-inner border border-white/[0.07]'
                : 'text-stone-300 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Soy Restaurante</span>
          </button>
        </nav>

        {/* Zone 3: Audio, Filters & Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Mute/Unmute audio button */}
          <button
            onClick={toggleMute}
            className="w-8 h-8 rounded-xl glass-action-btn flex items-center justify-center text-stone-300 hover:text-white transition-all active:scale-90"
            title={isMuted ? 'Activar Sonido' : 'Silenciar'}
            aria-label={isMuted ? 'Activar Sonido' : 'Silenciar'}
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-stone-400" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-amber-300" />
            )}
          </button>

          {/* Filter drawer trigger */}
          <button
            onClick={() => setFilterDrawerOpen(true)}
            className="w-8 h-8 rounded-xl glass-action-btn flex items-center justify-center text-stone-300 hover:text-white transition-all active:scale-90"
            title="Filtros y Zonas"
            aria-label="Filtros y Zonas"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-stone-300" />
          </button>

          {/* Restaurant Quick Publish on Desktop */}
          <button
            onClick={() => setActiveTab('portal')}
            className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-stone-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-400 rounded-xl shadow-[0_4px_16px_rgba(245,158,11,0.25)] transition-all active:scale-95 whitespace-nowrap shrink-0"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Publicar Plato</span>
          </button>
        </div>
      </div>
    </header>
  );
};
