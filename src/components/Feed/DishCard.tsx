import React, { useRef, useEffect, useState } from 'react';
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
  Play
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
  const [isDescExpanded, setIsDescExpanded] = useState<boolean>(false);
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
      setTimeout(() => setShowHeartBurst(false), 850);
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
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
        // User cancelled
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
      className="relative w-full h-full bg-[#0c0a09] overflow-hidden select-none flex items-center justify-center cursor-pointer group"
    >
      {/* Background Poster fallback / smooth crossfade */}
      <img
        src={dish.posterUrl}
        alt={dish.name}
        referrerPolicy="no-referrer"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
          isVideoLoaded && !hasVideoError ? 'opacity-0 scale-100' : 'opacity-100 scale-105'
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

      {/* Pause indicator with subtle frosted glass disc */}
      {!isPlaying && isActive && isVideoLoaded && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 bg-black/25">
          <div className="w-16 h-16 rounded-full glass-action-btn flex items-center justify-center text-amber-200/90 shadow-2xl animate-fade-in scale-100 hover:scale-105 transition-transform">
            <Play className="w-7 h-7 ml-1 fill-amber-300/80 text-amber-300" />
          </div>
        </div>
      )}

      {/* Heart Burst on Double-Tap */}
      {showHeartBurst && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <div className="animate-heart-burst">
            <Heart className="w-32 h-32 text-rose-500 fill-rose-500 drop-shadow-[0_10px_35px_rgba(244,63,94,0.6)]" />
          </div>
        </div>
      )}

      {/* Top Cinematic Vignette */}
      <div className="absolute top-0 left-0 right-0 h-40 top-vignette pointer-events-none z-10" />

      {/* Top Floating Glass Badges */}
      <div className="absolute top-26 sm:top-24 left-3 right-16 flex items-center justify-between gap-2 z-20 pointer-events-auto">
        <div className="flex items-center gap-2">
          {dish.isAiEnhanced && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-pill border border-amber-400/25 text-amber-200 text-[11px] font-medium shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Mejorado con IA</span>
            </div>
          )}
          {dish.isFeatured && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-pill border border-amber-500/30 text-amber-300 text-[11px] font-semibold">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30" />
              <span>Destacado</span>
            </div>
          )}
        </div>

        {/* Global Sound Quick Toggle with Warm Glass Disc */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleMute();
          }}
          className="w-8 h-8 rounded-full glass-action-btn flex items-center justify-center text-stone-200 hover:text-white transition-all active:scale-90"
          aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
          title={isMuted ? 'Activar sonido' : 'Silenciar'}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-stone-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-amber-300" />
          )}
        </button>
      </div>

      {/* Bottom Cinematic Vignette for maximum legibility */}
      <div className="absolute bottom-0 left-0 right-0 h-[480px] cinematic-vignette pointer-events-none z-10" />

      {/* Bottom Content Container with Warm Glass Panel (Clearance for mobile bottom dock) */}
      <div className="absolute bottom-20 sm:bottom-4 left-2.5 right-16 sm:right-20 z-20 pointer-events-auto text-left">
        <div className="glass-warm rounded-3xl p-4 sm:p-5 transition-all duration-300 border border-white/[0.08]">
          {/* Restaurant Header Row */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleOpenRestaurant();
            }}
            className="group/rest flex items-center gap-2.5 mb-2 hover:opacity-95 transition-opacity text-left w-full"
          >
            <div className="relative">
              <img
                src={dish.restaurantLogo}
                alt={dish.restaurantName}
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full object-cover border border-amber-400/40 shadow-md ring-1 ring-white/10"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border border-stone-900" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-xs sm:text-sm text-stone-100 group-hover/rest:text-amber-300 transition-colors truncate">
                  {dish.restaurantName}
                </span>
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 fill-amber-400/10 shrink-0" />
              </div>
              {/* Unboxed Metadata (Zero-Pill discipline) */}
              <div className="flex items-center gap-1.5 text-[11px] text-stone-400 mt-0.5">
                <MapPin className="w-3 h-3 text-amber-400/90 shrink-0" />
                <span className="truncate">{dish.restaurantCity}</span>
                {dish.distanceKm !== undefined && (
                  <>
                    <span aria-hidden="true" className="text-stone-600">·</span>
                    <span className="tabular-nums font-mono text-amber-200/90 font-medium shrink-0">
                      {dish.distanceKm} km
                    </span>
                  </>
                )}
              </div>
            </div>
          </button>

          {/* Dish Name & Price Banner */}
          <div className="mb-2">
            <h2 className="text-xl sm:text-2xl font-display font-extrabold text-stone-50 tracking-tight leading-tight drop-shadow-sm">
              {dish.name}
            </h2>
            <div className="flex items-baseline gap-2.5 mt-1">
              <span className="font-display font-black text-2xl sm:text-3xl text-amber-400 tracking-tight tabular-nums drop-shadow">
                ${dish.price.toFixed(2)}
              </span>
              <span className="text-[11px] font-mono text-stone-400 font-semibold">USD</span>
              <span aria-hidden="true" className="text-stone-600">·</span>
              <div className="flex items-center gap-1 text-xs text-stone-300 font-medium">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span className="tabular-nums">{dish.prepTimeMinutes} min</span>
              </div>
            </div>
          </div>

          {/* Dish Description with Expandable toggle */}
          <p
            onClick={(e) => {
              e.stopPropagation();
              setIsDescExpanded(!isDescExpanded);
            }}
            className={`text-xs text-stone-300/95 leading-relaxed cursor-pointer transition-all ${
              isDescExpanded ? 'line-clamp-none' : 'line-clamp-2'
            }`}
          >
            {dish.description}
          </p>

          {/* Unboxed Tags & Category Separator (Zero-pill compliant) */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-stone-300 font-medium mt-2.5 pt-2 border-t border-white/[0.06]">
            <span className="text-amber-300 font-semibold">{dish.category}</span>
            {dish.tags.slice(0, 3).map((tag, idx) => (
              <React.Fragment key={idx}>
                <span aria-hidden="true" className="text-stone-600">·</span>
                <span className="text-stone-300/90">{tag}</span>
              </React.Fragment>
            ))}
          </div>

          {/* Quick link to ingredients & allergens drawer */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedDishForModal(dish);
            }}
            className="mt-2 inline-flex items-center gap-1 text-[11px] text-amber-300/90 hover:text-amber-200 font-semibold tracking-wide transition-colors group/link"
          >
            <span>Ver ingredientes y alérgenos</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Right Action Rail (Vertical Thumb Zone, Clearance for mobile bottom dock) */}
      <div className="absolute right-2 sm:right-3.5 bottom-20 sm:bottom-6 flex flex-col items-center gap-3 sm:gap-4 z-30 pointer-events-auto">
        {/* Primary CTA: WhatsApp Direct Order (Warm Velvet Emerald & Champagne Glow) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            openWhatsAppOrder(dish);
          }}
          className="group relative flex flex-col items-center"
          aria-label={`Pedir ${dish.name} por WhatsApp`}
        >
          <div className="relative w-13 h-13 rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-[0_8px_24px_rgba(16,185,129,0.35)] hover:scale-105 active:scale-95 transition-all ring-2 ring-emerald-300/40">
            <MessageCircle className="w-6 h-6 fill-white/20" />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 border-2 border-stone-900" />
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
          <div className="w-11 h-11 rounded-full glass-action-btn flex items-center justify-center group-hover:border-white/20 active:scale-90 transition-all">
            <Heart
              className={`w-5 h-5 transition-transform duration-300 ${
                isLiked
                  ? 'text-rose-500 fill-rose-500 scale-110 drop-shadow-[0_2px_8px_rgba(244,63,94,0.5)]'
                  : 'text-stone-200 group-hover:scale-110'
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
          <div className="w-11 h-11 rounded-full glass-action-btn flex items-center justify-center group-hover:border-white/20 active:scale-90 transition-all">
            <Bookmark
              className={`w-5 h-5 transition-transform duration-300 ${
                isSaved
                  ? 'text-amber-400 fill-amber-400 scale-110 drop-shadow-[0_2px_8px_rgba(245,158,11,0.5)]'
                  : 'text-stone-200 group-hover:scale-110'
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
          <div className="w-11 h-11 rounded-full glass-action-btn flex items-center justify-center group-hover:border-white/20 active:scale-90 transition-all">
            <Share2 className="w-5 h-5 text-stone-200 group-hover:scale-110 transition-transform" />
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
          <div className="w-11 h-11 rounded-full glass-action-btn flex items-center justify-center group-hover:border-white/20 active:scale-90 transition-all">
            <Info className="w-5 h-5 text-stone-200 group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-[11px] text-stone-300 mt-1">Info</span>
        </button>
      </div>
    </div>
  );
};
