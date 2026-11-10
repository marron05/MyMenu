import React from 'react';
import { Restaurant, AuthUser } from '../../types';
import { 
  CheckCircle2, 
  MapPin, 
  MessageCircle, 
  Store, 
  Sparkles, 
  LogOut, 
  ChevronDown 
} from 'lucide-react';

interface RestaurantHeaderProps {
  currentRestaurant: Restaurant;
  allRestaurants: Restaurant[];
  activeRestaurantId: string;
  onSelectRestaurantId: (id: string) => void;
  currentUser: AuthUser | null;
  onOpenAuth: () => void;
  onSignOut: () => void;
}

export const RestaurantHeader: React.FC<RestaurantHeaderProps> = ({
  currentRestaurant,
  allRestaurants,
  activeRestaurantId,
  onSelectRestaurantId,
  currentUser,
  onOpenAuth,
  onSignOut,
}) => {
  return (
    <div className="w-full glass-dock rounded-3xl p-5 sm:p-6 border border-white/[0.08] shadow-2xl relative overflow-hidden transition-all duration-300">
      {/* Subtle gold ambient glow behind logo */}
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        {/* Restaurant Identity Row */}
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <img
              src={currentRestaurant.logo}
              alt={currentRestaurant.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-amber-400/40 shadow-xl ring-2 ring-white/10"
            />
            {currentRestaurant.isVerified && (
              <span 
                title="Restaurante Verificado"
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-stone-950 shadow-md ring-2 ring-stone-950"
              >
                <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
              </span>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-display font-extrabold text-xl sm:text-2xl text-stone-50 tracking-tight leading-tight truncate">
                {currentRestaurant.name}
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Verificado
              </span>
            </div>

            {/* Zero-Pill Unboxed Metadata */}
            <div className="flex items-center gap-2 text-xs text-stone-400 mt-1 flex-wrap font-medium">
              <div className="flex items-center gap-1 text-stone-300">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{currentRestaurant.city}</span>
              </div>
              <span aria-hidden="true" className="text-stone-600">·</span>
              <div className="flex items-center gap-1 text-stone-300 font-mono text-[11px]">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>+{currentRestaurant.whatsapp}</span>
              </div>
              <span aria-hidden="true" className="text-stone-600">·</span>
              <span className="text-amber-300/90 font-mono font-semibold">{currentRestaurant.priceTier}</span>
            </div>

            <p className="text-xs text-stone-400 line-clamp-1 mt-1 max-w-lg">
              {currentRestaurant.tagline}
            </p>
          </div>
        </div>

        {/* Right Action Tools: Multi-branch Switcher & Cloud Session */}
        <div className="flex items-center gap-2.5 self-start md:self-auto flex-wrap sm:flex-nowrap">
          {/* Multi-venue selector */}
          <div className="relative">
            <select
              value={activeRestaurantId}
              onChange={(e) => onSelectRestaurantId(e.target.value)}
              aria-label="Cambiar local gastronómico"
              className="appearance-none pl-3 pr-8 py-2 bg-stone-900/90 hover:bg-stone-800/90 border border-white/[0.1] rounded-xl text-stone-200 text-xs font-semibold focus:outline-none focus:border-amber-400 cursor-pointer shadow-md transition-colors"
            >
              {allRestaurants.map((r) => (
                <option key={r.id} value={r.id} className="bg-stone-900 text-stone-100">
                  {r.name} ({r.city})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Cloud Auth Pill */}
          {currentUser ? (
            <button
              onClick={onSignOut}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-400 hover:text-white glass-action-btn hover:border-white/20 transition-all"
              title="Cerrar sesión de restaurante"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-stone-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-[0_2px_12px_rgba(245,158,11,0.3)] transition-all active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Conectar Cuenta</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
