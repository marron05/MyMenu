import React from 'react';
import { 
  Store, 
  Eye, 
  Heart, 
  MessageCircle, 
  TrendingUp, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

interface RestaurantStatsGridProps {
  dishesCount: number;
  totalViews: number;
  totalLikes: number;
  totalWhatsAppOrders: number;
}

export const RestaurantStatsGrid: React.FC<RestaurantStatsGridProps> = ({
  dishesCount,
  totalViews,
  totalLikes,
  totalWhatsAppOrders,
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* Stat 1: Platos Publicados */}
      <div className="relative glass-warm rounded-2xl p-4 sm:p-5 border border-white/[0.08] shadow-lg group hover:border-amber-400/40 transition-all duration-300">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-stone-400 font-semibold tracking-wide">
            Menú Activo
          </span>
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-400/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
            <Store className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="font-display font-black text-2xl sm:text-3xl text-stone-50 font-mono tabular-nums tracking-tight">
            {dishesCount}
          </span>
          <span className="text-[11px] text-stone-400 font-medium">platos en video</span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium mt-2 pt-2 border-t border-white/[0.06]">
          <Sparkles className="w-3 h-3" />
          <span>100% en formato reel HD</span>
        </div>
      </div>

      {/* Stat 2: Visualizaciones de Video */}
      <div className="relative glass-warm rounded-2xl p-4 sm:p-5 border border-white/[0.08] shadow-lg group hover:border-sky-400/40 transition-all duration-300">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-stone-400 font-semibold tracking-wide">
            Visualizaciones
          </span>
          <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-400/20 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
            <Eye className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="font-display font-black text-2xl sm:text-3xl text-stone-50 font-mono tabular-nums tracking-tight">
            {totalViews.toLocaleString()}
          </span>
          <span className="text-[11px] text-stone-400 font-medium">reproducciones</span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-sky-400 font-medium mt-2 pt-2 border-t border-white/[0.06]">
          <TrendingUp className="w-3 h-3" />
          <span>+24% este mes en feed</span>
        </div>
      </div>

      {/* Stat 3: Me Gusta Acumulados */}
      <div className="relative glass-warm rounded-2xl p-4 sm:p-5 border border-white/[0.08] shadow-lg group hover:border-rose-400/40 transition-all duration-300">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-stone-400 font-semibold tracking-wide">
            Me Gusta
          </span>
          <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-400/20 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
            <Heart className="w-4 h-4 fill-rose-400/20" />
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="font-display font-black text-2xl sm:text-3xl text-stone-50 font-mono tabular-nums tracking-tight">
            {totalLikes.toLocaleString()}
          </span>
          <span className="text-[11px] text-stone-400 font-medium">deseos</span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-rose-300 font-medium mt-2 pt-2 border-t border-white/[0.06]">
          <ArrowUpRight className="w-3 h-3" />
          <span>Alta tasa de intención</span>
        </div>
      </div>

      {/* Stat 4: Pedidos / Conversión WhatsApp */}
      <div className="relative glass-warm rounded-2xl p-4 sm:p-5 border border-white/[0.08] shadow-lg group hover:border-emerald-400/40 transition-all duration-300">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-stone-400 font-semibold tracking-wide">
            Conversión WhatsApp
          </span>
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
            <MessageCircle className="w-4 h-4 fill-emerald-400/20" />
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="font-display font-black text-2xl sm:text-3xl text-emerald-400 font-mono tabular-nums tracking-tight">
            {totalWhatsAppOrders}
          </span>
          <span className="text-[11px] text-stone-400 font-medium">pedidos iniciados</span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-emerald-300 font-medium mt-2 pt-2 border-t border-white/[0.06]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>ROI directo sin comisiones</span>
        </div>
      </div>
    </div>
  );
};
