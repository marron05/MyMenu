import React from 'react';
import { PlusCircle, Sparkles, Video, ArrowRight } from 'lucide-react';

interface PublishHeroCTAProps {
  onPublishClick: () => void;
  activeDishesCount: number;
}

export const PublishHeroCTA: React.FC<PublishHeroCTAProps> = ({
  onPublishClick,
  activeDishesCount,
}) => {
  return (
    <div className="relative w-full rounded-3xl p-5 sm:p-6 overflow-hidden border border-amber-400/30 shadow-[0_16px_40px_rgba(245,158,11,0.15)] bg-gradient-to-br from-[#241a12] via-[#1c140e] to-[#120e0a] group transition-all duration-300">
      {/* Specular Top Reflection */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-amber-300/50 to-transparent" />

      {/* Warm Ambient Glow in the corner */}
      <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-amber-500/15 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Formato Reel Gastronómico</span>
          </div>

          <h2 className="font-display font-extrabold text-xl sm:text-2xl text-stone-50 tracking-tight leading-snug">
            ¿Tienes un nuevo plato o especialidad del chef?
          </h2>

          <p className="text-xs sm:text-sm text-stone-300/90 leading-relaxed">
            Sube un video corto de 10 a 30 segundos. Los comensales en Lechería y la zona deciden qué comer en menos de 3 scrolls.
          </p>
        </div>

        {/* Heroic Action Button */}
        <button
          onClick={onPublishClick}
          className="relative inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl font-display font-extrabold text-sm text-stone-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:via-amber-400 hover:to-amber-500 shadow-[0_8px_24px_rgba(245,158,11,0.35)] hover:shadow-[0_12px_32px_rgba(245,158,11,0.45)] hover:scale-[1.02] active:scale-95 transition-all duration-200 shrink-0 cursor-pointer"
        >
          <PlusCircle className="w-5 h-5 stroke-[2.5]" />
          <span>Publicar Nuevo Plato</span>
          <ArrowRight className="w-4 h-4 ml-0.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
