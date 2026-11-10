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
    setFilters,
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
    <header className="sticky top-0 z-40 w-full bg-stone-950/90 backdrop-blur-md border-b border-stone-800/80 px-4 md:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand Wordmark (Single text element with logo mark) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('feed')}
            className="flex items-center gap-2 text-left group focus-visible:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <span className="font-display font-black text-stone-950 text-xl tracking-tighter">M</span>
            </div>
            <div>
              <span className="font-display font-black text-xl tracking-tight text-stone-100 flex items-center gap-1">
                MyMenu
              </span>
              <span className="hidden sm:block text-[11px] text-stone-400 font-medium -mt-1 tracking-wide">
                En video · Anzoátegui
              </span>
            </div>
          </button>

          {/* Quick Zone Selector & Real GPS trigger */}
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              onClick={() => setFilterDrawerOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-stone-300 hover:text-white bg-stone-900/80 hover:bg-stone-800 border border-stone-800 rounded-lg transition-colors whitespace-nowrap"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentCityName}</span>
            </button>

            {/* Real GPS trigger */}
            <button
              onClick={requestLocation}
              title={isUsingRealGps ? 'GPS Activo (Click para recalcular)' : 'Activar GPS de tu navegador'}
              className={`flex items-center gap-1.5 px-2 py-1 text-[11px] rounded-lg border transition-all ${
                isUsingRealGps
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400 font-medium'
                  : 'bg-stone-900/50 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isUsingRealGps ? 'bg-emerald-400 animate-pulse' : 'bg-stone-500'
                }`}
              />
              <span className="hidden md:inline font-mono">
                {isUsingRealGps ? 'GPS en Vivo' : 'Activar GPS'}
              </span>
            </button>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Clean single-line text links) */}
        <nav className="flex items-center gap-1 sm:gap-2 md:gap-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab('feed')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 text-xs sm:text-sm ${
              activeTab === 'feed'
                ? 'bg-stone-800/90 text-amber-400 font-semibold shadow-sm'
                : 'text-stone-300 hover:text-white hover:bg-stone-900/50'
            }`}
          >
            Feed Video
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 text-xs sm:text-sm ${
              activeTab === 'map'
                ? 'bg-stone-800/90 text-amber-400 font-semibold shadow-sm'
                : 'text-stone-300 hover:text-white hover:bg-stone-900/50'
            }`}
          >
            Mapa de Zona
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`relative px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 text-xs sm:text-sm ${
              activeTab === 'saved'
                ? 'bg-stone-800/90 text-amber-400 font-semibold shadow-sm'
                : 'text-stone-300 hover:text-white hover:bg-stone-900/50'
            }`}
          >
            Guardados
            {savedDishIds.length > 0 && (
              <span className="ml-1.5 text-[11px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                {savedDishIds.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('portal')}
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 text-xs sm:text-sm ${
              activeTab === 'portal'
                ? 'bg-stone-800/90 text-amber-400 font-semibold shadow-sm'
                : 'text-stone-300 hover:text-white hover:bg-stone-900/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Soy Restaurante</span>
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action + Utility Toggles */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Mute/Unmute audio button */}
          <button
            onClick={toggleMute}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-stone-900 border border-stone-800 text-stone-300 hover:text-white hover:bg-stone-800 transition-colors focus-visible:ring-2 focus-visible:ring-amber-500"
            title={isMuted ? 'Activar Sonido' : 'Silenciar'}
            aria-label={isMuted ? 'Activar Sonido' : 'Silenciar'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-stone-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {/* Filter drawer trigger */}
          <button
            onClick={() => setFilterDrawerOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-stone-900 border border-stone-800 text-stone-300 hover:text-white hover:bg-stone-800 transition-colors focus-visible:ring-2 focus-visible:ring-amber-500"
            title="Filtros y Zonas"
            aria-label="Filtros y Zonas"
          >
            <SlidersHorizontal className="w-4 h-4 text-stone-300" />
          </button>

          {/* Supabase Restaurant Auth trigger */}
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-2 text-xs font-medium text-stone-300 hover:text-white bg-stone-900 border border-stone-800 rounded-lg hover:bg-stone-800 transition-colors whitespace-nowrap shrink-0"
            title={currentUser ? `Conectado como ${currentUser.email}` : 'Acceso Restaurante (Supabase)'}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden lg:inline">
              {currentUser ? 'Mi Cuenta' : 'Acceso'}
            </span>
          </button>

          {/* Primary Action Button */}
          <button
            onClick={() => setActiveTab('portal')}
            className="hidden md:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-stone-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg shadow-md shadow-amber-500/10 transition-all active:scale-[0.98] whitespace-nowrap shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Publicar Plato</span>
          </button>
        </div>
      </div>
    </header>
  );
};
