import React, { useState } from 'react';
import { useMenu } from '../../context/MenuContext';
import { CITY_ZONES, CATEGORIES_LIST } from '../../data/initialData';
import { CustomRestaurantPin } from './CustomRestaurantPin';
import { RestaurantSpotlightCard } from './RestaurantSpotlightCard';
import { 
  Navigation, 
  Compass, 
  SlidersHorizontal,
  Flame,
  Layers,
  MapPin
} from 'lucide-react';

export const DiscoveryMap: React.FC = () => {
  const {
    restaurants,
    dishes,
    filters,
    setFilters,
    userCoordinates,
    isUsingRealGps,
    requestLocation,
  } = useMenu();

  const [selectedRestId, setSelectedRestId] = useState<string>('rest-1');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todo');

  const selectedRestaurant = restaurants.find((r) => r.id === selectedRestId) || restaurants[0];
  const restaurantDishes = dishes.filter((d) => d.restaurantId === selectedRestaurant?.id);

  // Filter restaurants by active city and category
  const filteredRestaurants = restaurants.filter((r) => {
    if (filters.city !== 'all' && r.city !== filters.city) return false;
    if (selectedCategory !== 'Todo') {
      const hasDish = dishes.some(
        (d) => d.restaurantId === r.id && d.category === selectedCategory
      );
      if (!hasDish) return false;
    }
    return true;
  });

  // Calculate SVG coordinate positions for the Anzoátegui map
  // Bounds:
  // North: Guanta (10.245) - South: Barcelona (10.125)
  // West: Lechería / Playa Lido (-64.710) - East: Guanta (-64.580)
  const getMapCoordinates = (lat: number, lng: number) => {
    const minLat = 10.125;
    const maxLat = 10.248;
    const minLng = -64.710;
    const maxLng = -64.580;

    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = (1 - (lat - minLat) / (maxLat - minLat)) * 100;

    return { x: Math.max(8, Math.min(92, x)), y: Math.max(10, Math.min(90, y)) };
  };

  return (
    <div className="relative w-full h-dvh bg-[#0c0a09] flex flex-col overflow-hidden select-none">
      {/* Top Floating Glass Zone & Category Filter Bar */}
      <div className="absolute top-14 sm:top-16 left-0 right-0 z-30 px-3 sm:px-6 pointer-events-none">
        <div className="max-w-4xl mx-auto flex flex-col gap-2 pointer-events-auto">
          {/* Main Zone Filter Pills */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-1.5 glass-dock rounded-2xl shadow-xl border border-white/[0.08]">
              {CITY_ZONES.map((zone) => {
                const isSelected = filters.city === zone.id;
                return (
                  <button
                    key={zone.id}
                    onClick={() => setFilters((prev) => ({ ...prev, city: zone.id as any }))}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 font-bold shadow-[0_4px_14px_rgba(245,158,11,0.3)] scale-[1.02]'
                        : 'text-stone-300 hover:text-white hover:bg-white/[0.06]'
                    }`}
                  >
                    {zone.name}
                  </button>
                );
              })}
            </div>

            {/* Quick GPS Status Pill */}
            <button
              onClick={requestLocation}
              className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl glass-dock text-xs font-semibold text-stone-300 hover:text-amber-300 border border-white/[0.08] shadow-md transition-colors shrink-0"
              title="Calibrar ubicación GPS"
            >
              <div className={`w-2 h-2 rounded-full ${isUsingRealGps ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span>{isUsingRealGps ? 'GPS Calibrado' : 'Activar GPS'}</span>
            </button>
          </div>

          {/* Secondary Cuisine Category Carousel */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {CATEGORIES_LIST.slice(0, 6).map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all backdrop-blur-md ${
                    isActive
                      ? 'bg-amber-400/20 border border-amber-400/40 text-amber-300 font-bold'
                      : 'bg-stone-900/60 border border-white/[0.05] text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Interactive Map Canvas */}
      <div 
        className="relative flex-1 w-full bg-[#0a0c10] overflow-hidden cursor-grab active:cursor-grabbing"
        onClick={() => {
          // Keep current selection active
        }}
      >
        {/* Nocturnal Warm Obsidian Stylized SVG Map of Anzoátegui Coastal Metro Area */}
        <svg
          viewBox="0 0 1000 650"
          className="w-full h-full object-cover select-none pointer-events-none"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Water gradient: Deep warm nautical obsidian */}
            <linearGradient id="warmOceanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#080c14" />
              <stop offset="45%" stopColor="#09101b" />
              <stop offset="80%" stopColor="#0b1322" />
              <stop offset="100%" stopColor="#06090e" />
            </linearGradient>

            {/* Land gradient: Warm stone / volcanic basalt */}
            <linearGradient id="warmLandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#171412" />
              <stop offset="60%" stopColor="#13100e" />
              <stop offset="100%" stopColor="#0f0c0a" />
            </linearGradient>

            {/* Ambient Gold Gastronomic Glow for Hubs */}
            <radialGradient id="lecheriaGlow" cx="28%" cy="30%" r="20%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="plcGlow" cx="54%" cy="33%" r="18%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="bnaGlow" cx="24%" cy="55%" r="18%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Ocean Base (Bahía de Pozuelos & Mar Caribe) */}
          <rect width="1000" height="650" fill="url(#warmOceanGrad)" />

          {/* Ambient Gastronomy Hub Radial Halos */}
          <rect width="1000" height="650" fill="url(#lecheriaGlow)" />
          <rect width="1000" height="650" fill="url(#plcGlow)" />
          <rect width="1000" height="650" fill="url(#bnaGlow)" />

          {/* Luminous Warm Bathymetric Depth Contours */}
          <path
            d="M 40 100 Q 220 70 380 90 T 700 80 T 960 100"
            fill="none"
            stroke="#1d2838"
            strokeWidth="1.2"
            strokeDasharray="4 6"
            opacity="0.6"
          />
          <path
            d="M 20 180 Q 190 150 350 170 T 670 150 T 940 180"
            fill="none"
            stroke="#1d2838"
            strokeWidth="1.2"
            strokeDasharray="4 6"
            opacity="0.45"
          />

          {/* Mainland Coastline */}
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
            fill="url(#warmLandGrad)"
            stroke="#2d2521"
            strokeWidth="2.5"
          />

          {/* Iconic Peninsula: Cerro El Morro in Lechería */}
          <path
            d="
              M 220 220
              Q 230 150 260 130
              T 300 140
              Q 320 160 300 210
              Z
            "
            fill="#1c1714"
            stroke="#3a302a"
            strokeWidth="2"
          />

          {/* Mochima Islands (Offshore) */}
          <ellipse cx="210" cy="90" rx="36" ry="18" fill="#181412" stroke="#332a24" strokeWidth="1.5" />
          <text x="210" y="94" fill="#78716c" fontSize="10" textAnchor="middle" fontFamily="sans-serif">
            Isla Chimana
          </text>
          <ellipse cx="480" cy="70" rx="28" ry="14" fill="#181412" stroke="#332a24" strokeWidth="1.5" />
          <ellipse cx="780" cy="80" rx="40" ry="20" fill="#181412" stroke="#332a24" strokeWidth="1.5" />
          <text x="780" y="84" fill="#78716c" fontSize="10" textAnchor="middle" fontFamily="sans-serif">
            Isla de Plata
          </text>

          {/* Golden Arteries / Major Boulevards */}
          {/* Av. Intercomunal (Barcelona - Lechería - Puerto La Cruz) */}
          <path
            d="M 160 580 Q 280 470 420 400 T 640 330 T 840 240"
            fill="none"
            stroke="#2b231d"
            strokeWidth="6"
          />
          <path
            d="M 160 580 Q 280 470 420 400 T 640 330 T 840 240"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2"
            strokeDasharray="10 5"
            opacity="0.8"
          />

          {/* Av. Principal de Lechería & Morro ring road */}
          <path
            d="M 280 470 Q 250 350 240 240 Q 250 170 280 160"
            fill="none"
            stroke="#d97706"
            strokeWidth="2.5"
            opacity="0.85"
          />

          {/* Paseo Colón Maritime Boulevard in Puerto La Cruz */}
          <path
            d="M 420 320 Q 520 310 620 270"
            fill="none"
            stroke="#fbbf24"
            strokeWidth="2.5"
            opacity="0.8"
          />

          {/* Coastal Watermark */}
          <text 
            x="380" 
            y="215" 
            fill="#1c2534" 
            fontSize="18" 
            fontWeight="bold" 
            letterSpacing="3" 
            textAnchor="middle"
          >
            BAHÍA DE POZUELOS · MAR CARIBE
          </text>

          {/* Refined Zone Typography */}
          <g opacity="0.9">
            <text x="210" y="318" fill="#e7e5e4" fontSize="16" fontWeight="bold" letterSpacing="1">
              LECHERÍA
            </text>
            <text x="210" y="336" fill="#a8a29e" fontSize="11">
              Plaza Mayor · Playa Lido · El Morro
            </text>

            <text x="520" y="358" fill="#e7e5e4" fontSize="16" fontWeight="bold" letterSpacing="1">
              PUERTO LA CRUZ
            </text>
            <text x="520" y="376" fill="#a8a29e" fontSize="11">
              Paseo Colón · Av. Municipal
            </text>

            <text x="220" y="538" fill="#e7e5e4" fontSize="16" fontWeight="bold" letterSpacing="1">
              BARCELONA
            </text>
            <text x="220" y="556" fill="#a8a29e" fontSize="11">
              Centro Histórico · Av. Country Club
            </text>

            <text x="820" y="268" fill="#e7e5e4" fontSize="16" fontWeight="bold" letterSpacing="1">
              GUANTA
            </text>
            <text x="820" y="286" fill="#a8a29e" fontSize="11">
              Bahía Costera · Acceso Islas
            </text>
          </g>
        </svg>

        {/* Custom Warm Glass Restaurant Pins */}
        {filteredRestaurants.map((rest) => {
          const isSelected = rest.id === selectedRestaurant?.id;
          const coords = getMapCoordinates(rest.lat, rest.lng);
          const heroDish = dishes.find((d) => d.restaurantId === rest.id);

          return (
            <CustomRestaurantPin
              key={rest.id}
              restaurant={rest}
              heroDish={heroDish}
              isSelected={isSelected}
              coords={coords}
              onClick={() => setSelectedRestId(rest.id)}
            />
          );
        })}

        {/* Real User GPS Location Indicator */}
        {isUsingRealGps && (
          <div
            style={{
              left: `${getMapCoordinates(userCoordinates.latitude, userCoordinates.longitude).x}%`,
              top: `${getMapCoordinates(userCoordinates.latitude, userCoordinates.longitude).y}%`,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
            title="Tu ubicación GPS actual"
          >
            <div className="w-8 h-8 rounded-full bg-cyan-400/25 animate-ping absolute -inset-2" />
            <div className="w-4 h-4 rounded-full bg-cyan-400 border-2 border-white shadow-[0_0_12px_rgba(34,211,238,0.8)] relative flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
            <div className="absolute top-5 left-1/2 -translate-x-1/2 glass-dock border border-cyan-400/40 text-cyan-200 text-[9px] font-bold px-2 py-0.5 rounded-full shadow-lg whitespace-nowrap">
              Tú estás aquí
            </div>
          </div>
        )}

        {/* Floating Quick Compass / Zone Counter */}
        <div className="absolute top-24 left-4 z-20 hidden md:flex items-center gap-2 px-3 py-1.5 rounded-2xl glass-dock text-xs text-stone-300 shadow-xl border border-white/[0.08]">
          <Navigation className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-medium text-stone-200">
            {filteredRestaurants.length} restaurantes con platos en video
          </span>
        </div>
      </div>

      {/* Floating Spotlight Card: Positioned with clearance for MobileBottomNav */}
      {selectedRestaurant && (
        <div className="absolute bottom-20 sm:bottom-6 left-3 right-3 sm:left-6 sm:right-auto sm:w-[440px] max-w-lg z-30 pointer-events-auto">
          <RestaurantSpotlightCard
            restaurant={selectedRestaurant}
            dishes={restaurantDishes}
          />
        </div>
      )}
    </div>
  );
};
