import React from 'react';
import { Restaurant, Dish } from '../../types';
import { Star, Flame } from 'lucide-react';

interface CustomRestaurantPinProps {
  restaurant: Restaurant;
  heroDish?: Dish;
  isSelected: boolean;
  coords: { x: number; y: number };
  onClick: () => void;
}

export const CustomRestaurantPin: React.FC<CustomRestaurantPinProps> = ({
  restaurant,
  heroDish,
  isSelected,
  coords,
  onClick,
}) => {
  return (
    <div
      style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer transition-transform duration-300"
    >
      {/* Radar pulse for active selected restaurant */}
      {isSelected && (
        <div className="absolute inset-0 -m-3 rounded-full bg-amber-400/35 animate-ping pointer-events-none" />
      )}

      {/* Floating Pin Capsule with Warm Glass */}
      <div
        className={`relative flex items-center gap-2 p-1.5 rounded-2xl transition-all duration-300 shadow-2xl ${
          isSelected
            ? 'glass-dock ring-2 ring-amber-400 shadow-[0_0_24px_rgba(245,158,11,0.45)] scale-110 z-30'
            : 'glass-warm text-stone-100 hover:border-amber-400/40 hover:scale-105'
        }`}
      >
        {/* Thumbnail Image: Hero dish or restaurant logo */}
        <div className="relative w-8 h-8 rounded-xl overflow-hidden shrink-0 border border-white/[0.12]">
          <img
            src={heroDish?.posterUrl || restaurant.logo}
            alt={restaurant.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          {heroDish?.isFeatured && (
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-amber-400 rounded-bl-md flex items-center justify-center">
              <Flame className="w-1.5 h-1.5 text-stone-950 fill-stone-950" />
            </span>
          )}
        </div>

        {/* Text information */}
        <div className="text-left pr-1.5">
          <div className="flex items-center gap-1">
            <span className={`text-[11px] font-bold leading-tight truncate max-w-[110px] ${
              isSelected ? 'text-amber-300' : 'text-stone-100 group-hover:text-amber-200'
            }`}>
              {restaurant.name}
            </span>
          </div>

          <div className="text-[10px] flex items-center gap-1.5 text-stone-400 font-medium">
            <span className="font-mono text-amber-300/90 font-semibold">{restaurant.priceTier}</span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <div className="flex items-center gap-0.5 text-amber-400">
              <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
              <span className="font-mono text-[9px]">{restaurant.rating.toFixed(1)}</span>
            </div>
            {heroDish && (
              <>
                <span aria-hidden="true" className="text-stone-600">·</span>
                <span className="font-mono text-stone-300 font-bold text-[9px]">
                  ${heroDish.price.toFixed(0)}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Pin Tip Arrow */}
        <div
          className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 transition-colors ${
            isSelected
              ? 'bg-[#1c1815] border-r border-b border-amber-400'
              : 'bg-[#14110f] border-r border-b border-white/[0.12]'
          }`}
        />
      </div>
    </div>
  );
};
