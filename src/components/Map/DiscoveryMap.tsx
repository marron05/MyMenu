import React, { useState } from 'react';
import { useMenu } from '../../context/MenuContext';
import { Restaurant, Dish, CityZone } from '../../types';
import { 
  MapPin, 
  Navigation, 
  Star, 
  Phone, 
  Clock, 
  ExternalLink, 
  MessageCircle, 
  Sparkles, 
  X, 
  Play,
  ChevronRight,
  SlidersHorizontal,
  Flame
} from 'lucide-react';
import { CITY_ZONES } from '../../data/initialData';

export const DiscoveryMap: React.FC = () => {
  const {
    restaurants,
    dishes,
    setSelectedDishForModal,
    openWhatsAppOrder,
    setActiveTab,
    filters,
    setFilters,
    setSelectedRestaurantForView,
    userCoordinates,
    isUsingRealGps,
    requestLocation,
  } = useMenu();

  const [selectedRestId, setSelectedRestId] = useState<string>('rest-1');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  const selectedRestaurant = restaurants.find((r) => r.id === selectedRestId) || restaurants[0];
  const restaurantDishes = dishes.filter((d) => d.restaurantId === selectedRestaurant?.id);

  // Filter restaurants by active city or category
  const filteredRestaurants = restaurants.filter((r) => {
    if (filters.city !== 'all' && r.city !== filters.city) return false;
    if (selectedCategoryFilter !== 'all') {
      const hasDishInCategory = dishes.some(
        (d) => d.restaurantId === r.id && d.category === selectedCategoryFilter
      );
      if (!hasDishInCategory) return false;
    }
    return true;
  });

  // Calculate SVG coordinate positions for the Anzoátegui map
  // Bounds roughly:
  // North: Guanta (10.245) - South: Barcelona (10.125)
  // West: Lechería / Playa Lido (-64.710) - East: Guanta (-64.580)
  const getMapCoordinates = (lat: number, lng: number) => {
    const minLat = 10.125;
    const maxLat = 10.248;
    const minLng = -64.710;
    const maxLng = -64.580;

    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    // Invert Y because SVG top is 0
    const y = (1 - (lat - minLat) / (maxLat - minLat)) * 100;

    return { x: Math.max(5, Math.min(95, x)), y: Math.max(8, Math.min(92, y)) };
  };

  return (
    <div className="relative w-full h-[calc(100dvh-57px)] bg-stone-950 flex flex-col overflow-hidden">
      {/* Top Filter and Zone Selector Bar */}
      <div className="z-20 p-3 sm:p-4 bg-stone-950/80 backdrop-blur-md border-b border-stone-800/80 flex flex-wrap items-center justify-between gap-3">
        {/* City Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {CITY_ZONES.map((zone) => {
            const isSelected = filters.city === zone.id;
            return (
              <button
                key={zone.id}
                onClick={() => setFilters((prev) => ({ ...prev, city: zone.id as any }))}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-amber-400 text-stone-950 shadow-md shadow-amber-400/20'
                    : 'bg-stone-900 text-stone-300 hover:text-white hover:bg-stone-800 border border-stone-800'
                }`}
              >
                {zone.name}
              </button>
            );
          })}
        </div>

        {/* Status Count */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-stone-400 font-medium">
          <Navigation className="w-3.5 h-3.5 text-amber-400" />
          <span>{filteredRestaurants.length} restaurantes con platos en video</span>
        </div>
      </div>

      {/* Main Interactive Map Canvas */}
      <div className="relative flex-1 w-full bg-[#0a0d14] overflow-hidden">
        {/* SVG Stylized Cartographic Map of Puerto La Cruz / Lechería / Barcelona / Guanta */}
        <svg
          viewBox="0 0 1000 650"
          className="w-full h-full object-cover select-none pointer-events-none"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Water gradient */}
            <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#081426" />
              <stop offset="50%" stopColor="#061220" />
              <stop offset="100%" stopColor="#040b15" />
            </linearGradient>

            {/* Land gradient */}
            <linearGradient id="landGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#121721" />
              <stop offset="100%" stopColor="#0d1117" />
            </linearGradient>

            {/* Road glow */}
            <filter id="roadGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Ocean Background (Bahía de Pozuelos & Mar Caribe) */}
          <rect width="1000" height="650" fill="url(#oceanGrad)" />

          {/* Water wave texture ripples */}
          <path
            d="M 50 120 Q 200 100 350 120 T 650 110 T 950 130"
            fill="none"
            stroke="#162942"
            strokeWidth="1.5"
            strokeDasharray="4 8"
            opacity="0.5"
          />
          <path
            d="M 30 220 Q 180 200 330 220 T 630 210 T 930 230"
            fill="none"
            stroke="#162942"
            strokeWidth="1.5"
            strokeDasharray="4 8"
            opacity="0.4"
          />

          {/* Mainland Coastline: Lechería, Puerto La Cruz, Guanta, Barcelona */}
          {/* Custom coastline polygon mapping Caribbean Bay */}
          <path
            d="
              M -50 680
              L -50 380
              Q 80 370 120 330
              T 180 260
              T 240 210
              Q 260 170 300 170
              T 330 220
              Q 320 270 360 280
              T 420 310
              Q 480 320 540 290
              T 640 250
              Q 700 230 750 200
              T 820 170
              Q 860 140 920 160
              T 1050 170
              L 1050 680
              Z
            "
            fill="url(#landGrad)"
            stroke="#1e293b"
            strokeWidth="2"
          />

          {/* Cerro El Morro Peninsula in Lechería (iconic landmark) */}
          <path
            d="
              M 220 220
              Q 230 150 260 130
              T 300 140
              Q 320 160 300 210
              Z
            "
            fill="#161c28"
            stroke="#2b3648"
            strokeWidth="2"
          />

          {/* Mochima Islands (Islas Borrachas / Chimana / El Faro offshore) */}
          <ellipse cx="210" cy="90" rx="35" ry="18" fill="#141a24" stroke="#222c3c" strokeWidth="1.5" />
          <text x="210" y="94" fill="#64748b" fontSize="10" textAnchor="middle" fontFamily="sans-serif">
            Isla Chimana
          </text>
          <ellipse cx="480" cy="70" rx="28" ry="14" fill="#141a24" stroke="#222c3c" strokeWidth="1.5" />
          <ellipse cx="780" cy="80" rx="40" ry="20" fill="#141a24" stroke="#222c3c" strokeWidth="1.5" />
          <text x="780" y="84" fill="#64748b" fontSize="10" textAnchor="middle" fontFamily="sans-serif">
            Isla de Plata
          </text>

          {/* Major Arteries / Avenues (Av. Intercomunal, Av. Principal Lechería, Paseo Colón) */}
          {/* Av. Intercomunal Barcelona - PLC */}
          <path
            d="M 160 580 Q 280 470 420 400 T 640 330 T 840 240"
            fill="none"
            stroke="#263143"
            strokeWidth="6"
          />
          <path
            d="M 160 580 Q 280 470 420 400 T 640 330 T 840 240"
            fill="none"
            stroke="#d97706"
            strokeWidth="2"
            strokeDasharray="8 4"
            opacity="0.75"
          />

          {/* Av. Principal Lechería & Morro road */}
          <path
            d="M 280 470 Q 250 350 240 240 Q 250 170 280 160"
            fill="none"
            stroke="#334155"
            strokeWidth="3.5"
          />

          {/* Paseo Colón along PLC Bay */}
          <path
            d="M 420 320 Q 520 310 620 270"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="3"
            opacity="0.6"
          />

          {/* Coastal Label / Watermark */}
          <text x="380" y="220" fill="#1e2d42" fontSize="18" fontWeight="bold" letterSpacing="3" textAnchor="middle">
            BAHÍA DE POZUELOS · MAR CARIBE
          </text>

          {/* Zone City Labels */}
          <g opacity="0.85">
            <text x="210" y="320" fill="#94a3b8" fontSize="16" fontWeight="bold" letterSpacing="1">
              LECHERÍA
            </text>
            <text x="210" y="338" fill="#64748b" fontSize="11">
              Plaza Mayor · Playa Lido · El Morro
            </text>

            <text x="520" y="360" fill="#94a3b8" fontSize="16" fontWeight="bold" letterSpacing="1">
              PUERTO LA CRUZ
            </text>
            <text x="520" y="378" fill="#64748b" fontSize="11">
              Paseo Colón · Av. Municipal
            </text>

            <text x="220" y="540" fill="#94a3b8" fontSize="16" fontWeight="bold" letterSpacing="1">
              BARCELONA
            </text>
            <text x="220" y="558" fill="#64748b" fontSize="11">
              Centro Histórico · Av. Country Club
            </text>

            <text x="820" y="270" fill="#94a3b8" fontSize="16" fontWeight="bold" letterSpacing="1">
              GUANTA
            </text>
            <text x="820" y="288" fill="#64748b" fontSize="11">
              Bahía Costera · Acceso Islas
            </text>
          </g>
        </svg>

        {/* Interactive Restaurant Pins Layer */}
        {filteredRestaurants.map((rest) => {
          const isSelected = rest.id === selectedRestaurant?.id;
          const coords = getMapCoordinates(rest.lat, rest.lng);

          return (
            <div
              key={rest.id}
              style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer"
              onClick={() => setSelectedRestId(rest.id)}
            >
              {/* Radar pulse for active selected restaurant */}
              {isSelected && (
                <div className="absolute inset-0 -m-3 rounded-full bg-amber-400/30 animate-ping pointer-events-none" />
              )}

              {/* Pin Container */}
              <div
                className={`relative flex items-center gap-2 p-1.5 rounded-2xl transition-all duration-300 shadow-xl ${
                  isSelected
                    ? 'bg-amber-400 text-stone-950 scale-110 ring-4 ring-amber-400/30 z-30'
                    : 'bg-stone-900/90 text-stone-100 hover:bg-stone-800 border border-stone-700/80 hover:scale-105'
                }`}
              >
                <img
                  src={rest.logo}
                  alt={rest.name}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-xl object-cover"
                />
                <div className="hidden sm:block text-left pr-1">
                  <div className="text-[11px] font-bold leading-tight truncate max-w-[120px]">
                    {rest.name}
                  </div>
                  <div
                    className={`text-[9px] flex items-center gap-1 ${
                      isSelected ? 'text-stone-900 font-medium' : 'text-stone-400'
                    }`}
                  >
                    <span>{rest.city}</span>
                    <span>·</span>
                    <span className="font-mono">{rest.priceTier}</span>
                  </div>
                </div>

                {/* Pin Tip Arrow */}
                <div
                  className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 ${
                    isSelected ? 'bg-amber-400' : 'bg-stone-900 border-r border-b border-stone-700'
                  }`}
                />
              </div>
            </div>
          );
        })}

        {/* Real User GPS Location Marker */}
        {isUsingRealGps && (
          <div
            style={{
              left: `${getMapCoordinates(userCoordinates.latitude, userCoordinates.longitude).x}%`,
              top: `${getMapCoordinates(userCoordinates.latitude, userCoordinates.longitude).y}%`,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
            title="Tu ubicación GPS actual"
          >
            <div className="w-6 h-6 rounded-full bg-sky-400/30 animate-ping absolute -inset-1" />
            <div className="w-4 h-4 rounded-full bg-sky-400 border-2 border-white shadow-lg relative flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
            <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-sky-950/90 border border-sky-400/50 text-sky-200 text-[9px] font-bold px-1.5 py-0.5 rounded shadow whitespace-nowrap">
              Tú estás aquí
            </div>
          </div>
        )}

        {/* Floating Quick Legend / GPS Simulation */}
        <div className="absolute bottom-4 left-4 z-20 hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-stone-950/80 backdrop-blur-md border border-stone-800 text-stone-300 text-xs shadow-lg">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              isUsingRealGps ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
            }`}
          />
          <span>Zona Metropolitana Anzoátegui</span>
          <span className="text-stone-600">·</span>
          <button
            onClick={requestLocation}
            className="text-stone-300 hover:text-white font-mono hover:underline"
          >
            {isUsingRealGps ? 'GPS Calibrado' : 'Activar GPS'}
          </button>
        </div>
      </div>

      {/* Bottom Restaurant Spotlight Drawer */}
      {selectedRestaurant && (
        <div className="z-30 w-full bg-stone-950/95 backdrop-blur-xl border-t border-stone-800/80 p-4 sm:p-5 shadow-2xl transition-all">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Restaurant Info Summary */}
            <div className="flex items-start gap-3 sm:gap-4">
              <img
                src={selectedRestaurant.logo}
                alt={selectedRestaurant.name}
                referrerPolicy="no-referrer"
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border border-amber-500/40 shadow-lg shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-base sm:text-lg text-white">
                    {selectedRestaurant.name}
                  </h3>
                  <span className="text-xs text-amber-400 font-mono font-semibold">
                    {selectedRestaurant.priceTier}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-mono tabular-nums">{selectedRestaurant.rating}</span>
                  </div>
                </div>

                <p className="text-xs text-stone-300 line-clamp-1 mt-0.5 max-w-xl">
                  {selectedRestaurant.tagline}
                </p>

                {/* Clean unboxed metadata */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-stone-400 mt-1.5">
                  <span className="flex items-center gap-1 text-stone-300">
                    <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>{selectedRestaurant.address}</span>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-stone-500 shrink-0" />
                    <span>{selectedRestaurant.openingHours}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Dishes Mini Video Reel Carousel */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {restaurantDishes.map((dish) => (
                <div
                  key={dish.id}
                  onClick={() => setSelectedDishForModal(dish)}
                  className="group relative w-24 sm:w-28 h-28 sm:h-32 rounded-xl overflow-hidden bg-stone-900 border border-stone-800 shrink-0 cursor-pointer hover:border-amber-400 transition-all shadow-md"
                >
                  <img
                    src={dish.posterUrl}
                    alt={dish.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-1.5">
                    <div className="flex items-center justify-between text-[10px] text-amber-400 font-mono font-bold">
                      <span>${dish.price.toFixed(2)}</span>
                      <Play className="w-3 h-3 fill-amber-400" />
                    </div>
                    <span className="text-[10px] font-semibold text-white truncate">
                      {dish.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setSelectedRestaurantForView(selectedRestaurant)}
                className="flex-1 sm:flex-initial px-3.5 py-2 text-xs font-semibold text-stone-200 bg-stone-900 hover:bg-stone-800 border border-stone-700/80 rounded-xl transition-colors"
              >
                Ver Perfil Completo
              </button>

              <button
                onClick={() => {
                  if (restaurantDishes[0]) {
                    openWhatsAppOrder(restaurantDishes[0]);
                  }
                }}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md shadow-emerald-950/40 transition-all active:scale-[0.98]"
              >
                <MessageCircle className="w-4 h-4 fill-white/20" />
                <span>Pedir WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
