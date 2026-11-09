import React from 'react';
import { useMenu } from '../context/MenuContext';
import { Sparkles } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useMenu();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-bounce-short">
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-stone-900/95 text-stone-100 text-xs font-semibold shadow-2xl border border-stone-700/80 backdrop-blur-md">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span>{toastMessage}</span>
      </div>
    </div>
  );
};
