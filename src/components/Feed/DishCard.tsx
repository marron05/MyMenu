import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Dish } from '../../types';
import { useMenu } from '../../context/MenuContext';
import { 
  Heart, 
  Bookmark, 
  Share2, 
  Info, 
  Clock, 
  MapPin, 
  MessageCircle, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  ChevronRight,
  Flame,
  CheckCircle2,
  Play,
  RotateCcw
} from 'lucide-react';

interface DishCardProps {
  dish: Dish;
  isActive: boolean;
  onSelectRestaurant?: (restaurantId: string) => void;
}

export const DishCard: React.FC<DishCardProps> = ({ dish, isActive, onSelectRestaurant }) => {
  const {
    isMuted,
    toggleMute,
    isDishSaved,
    toggleSaveDish,
    likedDishIds,
    toggleLikeDish,
    openWhatsAppOrder,
    setSelectedDishForModal,
    showToast,
    restaurants,
    setSelectedRestaurantForView,
  } = useMenu();

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState<boolean>(false);
  const [hasVideoError, setHasVideoError] = useState<boolean>(false);
  const [showHeartBurst, setShowHeartBurst] = useState<boolean>(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState<boolean>(false);
  const lastTapRef = useRef<number>(0);

  const isLiked = likedDishIds.includes(dish.id);
  const isSaved = isDishSaved(dish.id);

  // Autoplay or pause based on active state in viewport
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      video.muted = isMuted;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setHasVideoError(false);
          })
          .catch((err) => {
            console.log('Autoplay prevented or paused:', err);
            setIsPlaying(false);
          });
      }
    } else {
      video.pause();
      video.currentTime = 0;
      setIsPlaying(false);
    }
  }, [isActive, isMuted]);

  // Sync mute state when global mute changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Double tap to like or single tap to play/pause
  const handleCardClick = (e: React.MouseEvent) => {
    // If click happened on interactive buttons, ignore
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('a')) {
      return;
    }

    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Double tap detected
      if (!isLiked) {
        toggleLikeDish(dish.id);
      }
      setShowHeartBurst(true);
      setTimeout(() => setShowHeartBurst(false), 900);
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
      // Single tap toggles play/pause
      const video = videoRef.current;
      if (video) {
        if (video.paused) {
          video.play().then(() => setIsPlaying(true)).catch(() => {});
        } else {
          video.pause();
          setIsPlaying(false);
        }
      }
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareData = {
      title: `${dish.name} - MyMenu`,
      text: `¡Mira este plato increíble de ${dish.restaurantName} en MyMenu! ${dish.name} por $${dish.price.toFixed(2)}`,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        showToast('Enlace compartido ✨');
      } catch {
        // User cancelled or unsupported
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      showToast('¡Enlace del plato copiado al portapapeles! 📋');
    }
  };

  const handleOpenRestaurant = () => {
    const targetRest = restaurants.find((r) => r.id === dish.restaurantId);
    if (targetRest) {
      setSelectedRestaurantForView(targetRest);
    } else if (onSelectRestaurant) {
      onSelectRestaurant(dish.restaurantId);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="relative w-full h-full bg-stone-950 overflow-hidden select-none flex items-center justify-center cursor-pointer"
    >
      {/* Background Poster fallback / loader */}
      <img
        src={dish.posterUrl}
        alt={dish.name}
        referrerPolicy="no-referrer"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          isVideoLoaded && !hasVideoError ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* Main HTML5 Video */}
      <video
        ref={videoRef}
        src={dish.videoUrl}
        poster={dish.posterUrl}
        loop
        playsInline
        muted={isMuted}
        onLoadedData={() => {
          setIsVideoLoaded(true);
          setHasVideoError(false);
        }}
        onError={() => {
          setHasVideoError(true);
        }}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />

      {/* Play/Pause state indicator flash */}
      {!isPlaying && isActive && isVideoLoaded && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 bg-black/20">
          <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white/90 shadow-2xl animate-fade-in">
            <Play className="w-8 h-8 ml-1" />
          </div>
        </div>
      )}

      {/* Heart Burst on Double-Tap */}
      {showHeartBurst && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <div className="animate-ping duration-700">
            <Heart className="w-28 h-28 text-red-500 fill-red-500 drop-shadow-2xl" />
          </div>
        </div>
      )}

      {/* Top Gradient Overlay */}
      <div className="absolute top-0 left-0 right-0 h-36 bg-gradient-to-b from-black/80 via-black/30 to-transparent pointer-events-none z-10" />

      {/* Top Badge: AI Enhanced or Featured badge */}
      <div className="absolute top-4 left-4 right-16 flex items-center justify-between gap-2 z-20 pointer-events-auto">
        <div className="flex items-center gap-2">
          {dish.isAiEnhanced && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/30 text-amber-300 text-xs font-medium shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Video Mejorado con IA</span>
            </div>
          )}
          {dish.isFeatured && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-600/20 backdrop-blur-md border border-orange-500/30 text-orange-300 text-xs font-medium">
              <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
              <span>Plato Destacado</span>
            </div>
          )}
        </div>

        {/* Global Sound Quick Toggle on card */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleMute();
          }}
          className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/90 hover:bg-black/70 transition-colors pointer-events-auto"
          aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-stone-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
        </button>
      </div>

      {/* Bottom Gradient Overlay for High Contrast Text Legibility */}
      <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-black via-black/70 to-transparent pointer-events-none z-10" />

      {/* Bottom Content Area: Dish Information */}
      <div className="absolute bottom-0 left-0 right-18 sm:right-22 p-4 sm:p-6 z-20 pointer-events-auto text-left">
        {/* Restaurant Header Row */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleOpenRestaurant();
          }}
          className="group flex items-center gap-2.5 mb-2 hover:opacity-95 transition-opacity"
        >
          <img
            src={dish.restaurantLogo}
            alt={dish.restaurantName}
            referrerPolicy="no-referrer"
            className="w-9 h-9 rounded-full object-cover border border-amber-500/50 shadow-md"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm text-stone-100 group-hover:text-amber-400 transition-colors">
                {dish.restaurantName}
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
            </div>
            {/* Unboxed Metadata (Zero-Pill discipline) */}
            <div className="flex items-center gap-1.5 text-xs text-stone-400">
              <MapPin className="w-3 h-3 text-amber-400/80 shrink-0" />
              <span>{dish.restaurantCity}</span>
              {dish.distanceKm !== undefined && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums font-mono text-stone-300">{dish.distanceKm} km</span>
                </>
              )}
            </div>
          </div>
        </button>

        {/* Dish Name & Price */}
        <div className="mb-2">
          <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white tracking-tight leading-snug drop-shadow-md">
            {dish.name}
          </h2>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="font-display font-black text-2xl sm:text-3xl text-amber-400 tracking-tight tabular-nums">
              ${dish.price.toFixed(2)}
            </span>
            <span className="text-xs text-stone-400 font-medium">USD</span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <div className="flex items-center gap-1 text-xs text-stone-300">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <span className="tabular-nums">{dish.prepTimeMinutes} min</span>
            </div>
          </div>
        </div>

        {/* Short Description */}
        <p className="text-xs sm:text-sm text-stone-300/90 leading-relaxed max-w-xl line-clamp-2">
          {dish.description}
        </p>

        {/* Unboxed Tags & Dietary separator (Zero-pill compliant) */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-stone-300 font-medium mt-2.5">
          <span className="text-amber-300 font-semibold">{dish.category}</span>
          {dish.tags.slice(0, 3).map((tag, idx) => (
            <React.Fragment key={idx}>
              <span aria-hidden="true" className="text-stone-600">·</span>
              <span className="text-stone-300">{tag}</span>
            </React.Fragment>
          ))}
        </div>

        {/* Quick Ingredients preview trigger */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedDishForModal(dish);
          }}
          className="mt-2.5 inline-flex items-center gap-1 text-xs text-amber-400/90 hover:text-amber-300 font-medium transition-colors"
        >
          <span>Ver ingredientes y alérgenos</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right Column Action Rail (TikTok style) */}
      <div className="absolute right-2 sm:right-4 bottom-6 flex flex-col items-center gap-3 sm:gap-4 z-30 pointer-events-auto">
        {/* Primary CTA: WhatsApp Direct Order */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            openWhatsAppOrder(dish);
          }}
          className="group relative flex flex-col items-center"
          aria-label={`Pedir ${dish.name} por WhatsApp`}
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 flex items-center justify-center text-white shadow-lg shadow-emerald-950/50 hover:scale-110 active:scale-95 transition-transform ring-2 ring-emerald-400/40">
            <MessageCircle className="w-6 h-6 fill-white/20" />
          </div>
          <span className="text-[11px] font-bold text-emerald-400 mt-1 tracking-tight drop-shadow">
            Pedir
          </span>
        </button>

        {/* Like Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleLikeDish(dish.id);
          }}
          className="flex flex-col items-center group"
          aria-label={isLiked ? 'Quitar Me Gusta' : 'Me Gusta'}
        >
          <div className="w-11 h-11 rounded-full bg-stone-900/70 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:bg-stone-800/80 active:scale-90 transition-all">
            <Heart
              className={`w-5 h-5 transition-colors ${
                isLiked ? 'text-red-500 fill-red-500' : 'text-stone-200'
              }`}
            />
          </div>
          <span className="text-[11px] font-mono tabular-nums text-stone-200 mt-1 drop-shadow">
            {dish.likesCount}
          </span>
        </button>

        {/* Save / Bookmark Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleSaveDish(dish.id);
          }}
          className="flex flex-col items-center group"
          aria-label={isSaved ? 'Quitar de guardados' : 'Guardar plato'}
        >
          <div className="w-11 h-11 rounded-full bg-stone-900/70 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:bg-stone-800/80 active:scale-90 transition-all">
            <Bookmark
              className={`w-5 h-5 transition-colors ${
                isSaved ? 'text-amber-400 fill-amber-400' : 'text-stone-200'
              }`}
            />
          </div>
          <span className="text-[11px] text-stone-300 mt-1">
            {isSaved ? 'Guardado' : 'Guardar'}
          </span>
        </button>

        {/* Share Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleShare();
          }}
          className="flex flex-col items-center group"
          aria-label="Compartir plato"
        >
          <div className="w-11 h-11 rounded-full bg-stone-900/70 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:bg-stone-800/80 active:scale-90 transition-all">
            <Share2 className="w-5 h-5 text-stone-200" />
          </div>
          <span className="text-[11px] font-mono tabular-nums text-stone-300 mt-1">
            {dish.sharesCount}
          </span>
        </button>

        {/* Info Drawer Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedDishForModal(dish);
          }}
          className="flex flex-col items-center group"
          aria-label="Detalles del plato"
        >
          <div className="w-11 h-11 rounded-full bg-stone-900/70 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:bg-stone-800/80 active:scale-90 transition-all">
            <Info className="w-5 h-5 text-stone-200" />
          </div>
          <span className="text-[11px] text-stone-300 mt-1">Info</span>
        </button>
      </div>
    </div>
  );
};
