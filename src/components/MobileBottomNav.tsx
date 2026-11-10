import React from 'react';
import { useMenu } from '../context/MenuContext';
import { PlaySquare, MapPin, Bookmark, Store } from 'lucide-react';
export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab, savedDishIds } = useMenu();

  return (
    <div className="sm:hidden fixed bottom-3 left-3 right-3 z-40 max-w-sm mx-auto glass-dock rounded-2xl h-14 px-3 flex items-center justify-around shadow-2xl transition-all duration-300 mb-[env(safe-area-inset-bottom,0px)]">
      <button
        onClick={() => setActiveTab('feed')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 relative group ${
          activeTab === 'feed' ? 'text-amber-400 font-semibold scale-105' : 'text-stone-400 hover:text-stone-200'
        }`}
      >
        <div className="relative">
          <PlaySquare className={`w-5 h-5 transition-transform duration-200 ${activeTab === 'feed' ? 'fill-amber-400/20 stroke-amber-400' : 'group-hover:scale-110'}`} />
          {activeTab === 'feed' && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
          )}
        </div>
        <span className="text-[10px] mt-1 tracking-tight">Feed</span>
      </button>

      <button
        onClick={() => setActiveTab('map')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 relative group ${
          activeTab === 'map' ? 'text-amber-400 font-semibold scale-105' : 'text-stone-400 hover:text-stone-200'
        }`}
      >
        <div className="relative">
          <MapPin className={`w-5 h-5 transition-transform duration-200 ${activeTab === 'map' ? 'fill-amber-400/20 stroke-amber-400' : 'group-hover:scale-110'}`} />
          {activeTab === 'map' && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
          )}
        </div>
        <span className="text-[10px] mt-1 tracking-tight">Mapa</span>
      </button>

      <button
        onClick={() => setActiveTab('saved')}
        className={`relative flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 group ${
          activeTab === 'saved' ? 'text-amber-400 font-semibold scale-105' : 'text-stone-400 hover:text-stone-200'
        }`}
      >
        <div className="relative">
          <Bookmark className={`w-5 h-5 transition-transform duration-200 ${activeTab === 'saved' ? 'fill-amber-400/20 stroke-amber-400' : 'group-hover:scale-110'}`} />
          {savedDishIds.length > 0 && (
            <span className="absolute -top-1 -right-2.5 w-4 h-4 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-[9px] flex items-center justify-center font-mono shadow-sm">
              {savedDishIds.length}
            </span>
          )}
          {activeTab === 'saved' && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
          )}
        </div>
        <span className="text-[10px] mt-1 tracking-tight">Guardados</span>
      </button>

      <button
        onClick={() => setActiveTab('portal')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 relative group ${
          activeTab === 'portal' ? 'text-amber-400 font-semibold scale-105' : 'text-stone-400 hover:text-stone-200'
        }`}
      >
        <div className="relative">
          <Store className={`w-5 h-5 transition-transform duration-200 ${activeTab === 'portal' ? 'fill-amber-400/20 stroke-amber-400' : 'group-hover:scale-110'}`} />
          {activeTab === 'portal' && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
          )}
        </div>
        <span className="text-[10px] mt-1 tracking-tight">Mi Local</span>
      </button>
    </div>
  );
};
