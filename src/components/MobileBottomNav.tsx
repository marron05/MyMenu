import React from 'react';
import { useMenu } from '../context/MenuContext';
import { PlaySquare, MapPin, Bookmark, Store } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab, savedDishIds } = useMenu();

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-stone-950/95 backdrop-blur-lg border-t border-stone-800/80 px-4 py-1.5 flex items-center justify-around h-14">
      <button
        onClick={() => setActiveTab('feed')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
          activeTab === 'feed' ? 'text-amber-400 font-bold' : 'text-stone-400 hover:text-stone-200'
        }`}
      >
        <PlaySquare className={`w-5 h-5 ${activeTab === 'feed' ? 'fill-amber-400/20' : ''}`} />
        <span className="text-[10px] mt-0.5 tracking-tight">Feed</span>
      </button>

      <button
        onClick={() => setActiveTab('map')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
          activeTab === 'map' ? 'text-amber-400 font-bold' : 'text-stone-400 hover:text-stone-200'
        }`}
      >
        <MapPin className={`w-5 h-5 ${activeTab === 'map' ? 'fill-amber-400/20' : ''}`} />
        <span className="text-[10px] mt-0.5 tracking-tight">Mapa</span>
      </button>

      <button
        onClick={() => setActiveTab('saved')}
        className={`relative flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
          activeTab === 'saved' ? 'text-amber-400 font-bold' : 'text-stone-400 hover:text-stone-200'
        }`}
      >
        <div className="relative">
          <Bookmark className={`w-5 h-5 ${activeTab === 'saved' ? 'fill-amber-400/20' : ''}`} />
          {savedDishIds.length > 0 && (
            <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-amber-500 text-stone-950 font-bold text-[9px] flex items-center justify-center font-mono">
              {savedDishIds.length}
            </span>
          )}
        </div>
        <span className="text-[10px] mt-0.5 tracking-tight">Guardados</span>
      </button>

      <button
        onClick={() => setActiveTab('portal')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
          activeTab === 'portal' ? 'text-amber-400 font-bold' : 'text-stone-400 hover:text-stone-200'
        }`}
      >
        <Store className={`w-5 h-5 ${activeTab === 'portal' ? 'fill-amber-400/20' : ''}`} />
        <span className="text-[10px] mt-0.5 tracking-tight">Mi Local</span>
      </button>
    </div>
  );
};
