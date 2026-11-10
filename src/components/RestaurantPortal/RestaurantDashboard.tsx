import React, { useState, useRef } from 'react';
import { useMenu } from '../../context/MenuContext';
import { Dish, DishCategory, CityZone } from '../../types';
import { STOCK_VIDEO_PRESETS, CATEGORIES_LIST, CITY_ZONES } from '../../data/initialData';
import { 
  PlusCircle, 
  Upload, 
  Sparkles, 
  Play, 
  Pause, 
  Flame, 
  Trash2, 
  Check, 
  Clock, 
  DollarSign, 
  Eye, 
  Heart, 
  Share2, 
  MessageCircle, 
  Store, 
  Settings, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const RestaurantDashboard: React.FC = () => {
  const {
    restaurants,
    dishes,
    addDish,
    toggleDishFeatured,
    deleteDish,
    updateRestaurantProfile,
    activeRestaurantId,
    setActiveRestaurantId,
    showToast,
    setActiveTab,
    currentUser,
    setIsAuthModalOpen,
    signOut,
  } = useMenu();

  const currentRestaurant =
    restaurants.find((r) => r.id === activeRestaurantId) || restaurants[0];
  const restaurantDishes = dishes.filter((d) => d.restaurantId === currentRestaurant.id);

  // Active view inside portal: 'upload' | 'menu' | 'profile' | 'analytics'
  const [portalTab, setPortalTab] = useState<'upload' | 'menu' | 'profile'>('upload');

  // Video preset category filter
  const [presetCategoryFilter, setPresetCategoryFilter] = useState<string>('all');

  // Form State for new dish
  const [name, setName] = useState(STOCK_VIDEO_PRESETS[0].title);
  const [description, setDescription] = useState(
    'Doble carne jugosa smash con costra caramelizada, queso cheddar fundido y pan brioche artesanal tostado con mantequilla.'
  );
  const [price, setPrice] = useState(STOCK_VIDEO_PRESETS[0].defaultPrice.toString());
  const [category, setCategory] = useState<DishCategory>(STOCK_VIDEO_PRESETS[0].category);
  const [prepTime, setPrepTime] = useState(STOCK_VIDEO_PRESETS[0].defaultPrepTime.toString());
  const [ingredientsText, setIngredientsText] = useState(STOCK_VIDEO_PRESETS[0].defaultIngredients.join(', '));
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>(['Gluten', 'Lácteos']);
  const [tagsText, setTagsText] = useState(STOCK_VIDEO_PRESETS[0].defaultTags.join(', '));
  const [isAiEnhanced, setIsAiEnhanced] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  // Video source state: selected gourmet preset
  const [videoUrl, setVideoUrl] = useState(STOCK_VIDEO_PRESETS[0].videoUrl);
  const [posterUrl, setPosterUrl] = useState(STOCK_VIDEO_PRESETS[0].posterUrl);
  const [selectedPresetId, setSelectedPresetId] = useState(STOCK_VIDEO_PRESETS[0].id);

  // AI Description Generator loading state
  const [isGeneratingAiDesc, setIsGeneratingAiDesc] = useState(false);

  // Preview video playback
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);

  // Profile Form state
  const [profileName, setProfileName] = useState(currentRestaurant.name);
  const [profileTagline, setProfileTagline] = useState(currentRestaurant.tagline);
  const [profileAddress, setProfileAddress] = useState(currentRestaurant.address);
  const [profileCity, setProfileCity] = useState<CityZone>(currentRestaurant.city);
  const [profileWhatsapp, setProfileWhatsapp] = useState(currentRestaurant.whatsapp);
  const [profileHours, setProfileHours] = useState(currentRestaurant.openingHours);

  // Select stock preset video and auto-populate smart defaults
  const handleSelectPreset = (preset: typeof STOCK_VIDEO_PRESETS[0]) => {
    setVideoUrl(preset.videoUrl);
    setPosterUrl(preset.posterUrl);
    setSelectedPresetId(preset.id);
    setName(preset.title);
    setCategory(preset.category);
    setPrice(preset.defaultPrice.toFixed(2));
    setPrepTime(preset.defaultPrepTime.toString());
    setTagsText(preset.defaultTags.join(', '));
    setIngredientsText(preset.defaultIngredients.join(', '));
    showToast(`Video de "${preset.title}" cargado 🎬`);
    
    // Auto play preview
    if (previewVideoRef.current) {
      previewVideoRef.current.currentTime = 0;
      previewVideoRef.current.play().then(() => setIsPreviewPlaying(true)).catch(() => {});
    }
  };

  // AI Description Enhancer
  const handleGenerateAiDescription = () => {
    if (!name.trim()) {
      showToast('Ingresa primero el nombre del plato');
      return;
    }

    setIsGeneratingAiDesc(true);
    setTimeout(() => {
      let generatedText = '';
      if (category === 'Hamburguesas') {
        generatedText = `Elaborada con carne Certified Angus sellada en plancha a fuego vivo para lograr una costra crujiente e interior jugoso, cubierta con queso fundido sedoso, ingredientes seleccionados y pan brioche artesanal tostado con mantequilla.`;
      } else if (category === 'Pizzas') {
        generatedText = `Masa fermentada lentamente durante 48 horas para una textura aireada y crujiente, horneada a 480°C con salsa de tomates madurados al sol, mozzarella artesanal y hierbas aromáticas recién cortadas.`;
      } else if (category === 'Sushi & Asiática') {
        generatedText = `Combinación equilibrada de pesca fresca del día, arroz japonés aderezado al punto exacto, toques cítricos sutiles y terminado con técnicas de sellado al fuego para potenciar aromas umami irresistibles.`;
      } else if (category === 'Carnes & Grill') {
        generatedText = `Corte selecto madurado a la perfección y asado sobre leña natural para impregnar notas ahumadas profundas, acompañado de guarnición rústica y sales marinas aromáticas.`;
      } else if (category === 'Postres & Dulces') {
        generatedText = `Dulce tentación con texturas contrastantes: base tibia esponjosa, corazón fundente de chocolate venezolano y notas de vainilla que deleitan desde la primera cucharada.`;
      } else {
        generatedText = `Preparación de autor con ingredientes frescos de la más alta calidad, sazón balanceada y una presentación vibrante pensada para despertar todos tus sentidos desde el primer bocado.`;
      }

      setDescription(generatedText);
      setIsAiEnhanced(true);
      setIsGeneratingAiDesc(false);
      showToast('¡Descripción apetitosa generada con IA! ✨');
    }, 700);
  };

  // Publish Dish
  const handlePublishDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('El nombre del plato es obligatorio');
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      showToast('Por favor ingresa un precio válido en USD');
      return;
    }

    const ingredientsList = ingredientsText
      .split(',')
      .map((i) => i.trim())
      .filter(Boolean);

    const tagsList = tagsText
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    addDish({
      restaurantId: currentRestaurant.id,
      restaurantName: currentRestaurant.name,
      restaurantCity: currentRestaurant.city,
      restaurantLogo: currentRestaurant.logo,
      restaurantWhatsapp: currentRestaurant.whatsapp,
      name: name.trim(),
      description: description.trim() || 'Deliciosa especialidad de la casa elaborada con ingredientes frescos del día.',
      price: priceNum,
      category,
      prepTimeMinutes: parseInt(prepTime, 10) || 15,
      tags: tagsList.length ? tagsList : ['Recomendado de la Casa'],
      allergens: selectedAllergens,
      ingredients: ingredientsList.length ? ingredientsList : ['Ingredientes frescos del chef'],
      videoUrl,
      posterUrl,
      isAiEnhanced,
      isFeatured,
    });

    // Reset form
    setName('');
    setDescription('');
    setIngredientsText('');
    setPortalTab('menu');
  };

  // Save Restaurant Profile
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateRestaurantProfile(currentRestaurant.id, {
      name: profileName,
      tagline: profileTagline,
      address: profileAddress,
      city: profileCity,
      whatsapp: profileWhatsapp,
      openingHours: profileHours,
    });
  };

  // Total metrics
  const totalViews = restaurantDishes.reduce((acc, d) => acc + d.viewsCount, 0);
  const totalLikes = restaurantDishes.reduce((acc, d) => acc + d.likesCount, 0);
  const totalShares = restaurantDishes.reduce((acc, d) => acc + d.sharesCount, 0);

  return (
    <div className="w-full min-h-[calc(100dvh-57px)] bg-stone-950 text-stone-100 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Supabase Cloud & Auth Status Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-stone-900/60 border border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">
                  {currentUser ? `Sesión Activa: ${currentUser.email}` : 'Modo Restaurante'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-medium">
                  Supabase RLS
                </span>
              </div>
              <span className="text-[11px] text-stone-400">
                {currentUser
                  ? 'Tus platos se sincronizan con la base de datos PostgreSQL en la nube'
                  : 'Inicia sesión con Supabase para publicar y sincronizar tu menú en vivo'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentUser ? (
              <button
                type="button"
                onClick={signOut}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-400 hover:text-white bg-stone-950 border border-stone-800 transition-colors"
              >
                Cerrar Sesión
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 shadow-md transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Acceder con Supabase</span>
              </button>
            )}
          </div>
        </div>

        {/* Top Header Card: Restaurant Selector & Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-stone-900/90 border border-stone-800 shadow-xl">
          <div className="flex items-center gap-3.5">
            <img
              src={currentRestaurant.logo}
              alt={currentRestaurant.name}
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-xl object-cover border border-amber-500/40"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-extrabold text-lg sm:text-xl text-white">
                  {currentRestaurant.name}
                </h1>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                  Verificado
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-400 mt-0.5">
                <span>{currentRestaurant.city}</span>
                <span>·</span>
                <span>WhatsApp: +{currentRestaurant.whatsapp}</span>
              </div>
            </div>
          </div>

          {/* Quick Switch Restaurant (for demo testing multiple venues in Anzoátegui) */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-400">Cambiar local:</span>
            <select
              value={activeRestaurantId}
              onChange={(e) => {
                setActiveRestaurantId(e.target.value);
                const r = restaurants.find((item) => item.id === e.target.value);
                if (r) {
                  setProfileName(r.name);
                  setProfileTagline(r.tagline);
                  setProfileAddress(r.address);
                  setProfileCity(r.city);
                  setProfileWhatsapp(r.whatsapp);
                  setProfileHours(r.openingHours);
                }
              }}
              className="px-3 py-1.5 text-xs bg-stone-950 border border-stone-700 rounded-lg text-stone-200 focus:outline-none focus:border-amber-400"
            >
              {restaurants.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.city})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Metric Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800">
            <div className="flex items-center justify-between text-stone-400 text-xs mb-1">
              <span>Platos Publicados</span>
              <Store className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-display font-bold text-white font-mono tabular-nums">
              {restaurantDishes.length}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800">
            <div className="flex items-center justify-between text-stone-400 text-xs mb-1">
              <span>Visualizaciones Video</span>
              <Eye className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl font-display font-bold text-white font-mono tabular-nums">
              {totalViews.toLocaleString()}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800">
            <div className="flex items-center justify-between text-stone-400 text-xs mb-1">
              <span>Me Gusta Acumulados</span>
              <Heart className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-2xl font-display font-bold text-white font-mono tabular-nums">
              {totalLikes.toLocaleString()}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800">
            <div className="flex items-center justify-between text-stone-400 text-xs mb-1">
              <span>Pedidos por WhatsApp</span>
              <MessageCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-display font-bold text-white font-mono tabular-nums">
              {totalShares}
            </div>
          </div>
        </div>

        {/* Portal Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-stone-800 pb-2">
          <button
            onClick={() => setPortalTab('upload')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              portalTab === 'upload'
                ? 'bg-amber-400 text-stone-950 shadow-md shadow-amber-400/20'
                : 'text-stone-300 hover:text-white hover:bg-stone-900'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Publicar Nuevo Plato</span>
          </button>

          <button
            onClick={() => setPortalTab('menu')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              portalTab === 'menu'
                ? 'bg-amber-400 text-stone-950 shadow-md shadow-amber-400/20'
                : 'text-stone-300 hover:text-white hover:bg-stone-900'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Gestionar Menú ({restaurantDishes.length})</span>
          </button>

          <button
            onClick={() => setPortalTab('profile')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              portalTab === 'profile'
                ? 'bg-amber-400 text-stone-950 shadow-md shadow-amber-400/20'
                : 'text-stone-300 hover:text-white hover:bg-stone-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Datos del Local</span>
          </button>
        </div>

        {/* TAB 1: SUBIR NUEVO PLATO */}
        {portalTab === 'upload' && (
          <form onSubmit={handlePublishDish} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Categorized Gourmet Video Catalog */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display font-bold text-sm text-stone-200 flex items-center gap-2">
                    <span>1. Biblioteca de Videos Gourmet</span>
                  </h3>
                  {isAiEnhanced && (
                    <span className="text-[10px] text-amber-400 flex items-center gap-1 font-medium">
                      <Sparkles className="w-3 h-3" />
                      Mejora con IA
                    </span>
                  )}
                </div>

                {/* Video Preview Box */}
                <div className="relative aspect-[9/16] max-h-[440px] w-full rounded-xl overflow-hidden bg-black border border-stone-800 flex items-center justify-center shadow-lg">
                  <video
                    ref={previewVideoRef}
                    src={videoUrl}
                    poster={posterUrl}
                    loop
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!previewVideoRef.current) return;
                      if (previewVideoRef.current.paused) {
                        previewVideoRef.current.play();
                        setIsPreviewPlaying(true);
                      } else {
                        previewVideoRef.current.pause();
                        setIsPreviewPlaying(false);
                      }
                    }}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/20 transition-colors"
                  >
                    {!isPreviewPlaying && (
                      <div className="w-14 h-14 rounded-full bg-stone-950/80 border border-stone-700 flex items-center justify-center text-amber-400 shadow-xl">
                        <Play className="w-6 h-6 ml-1 fill-amber-400" />
                      </div>
                    )}
                  </button>

                  <div className="absolute bottom-2 left-2 right-2 p-2 bg-black/80 backdrop-blur-md rounded-lg text-left text-[11px] text-stone-300">
                    <div className="font-bold text-white truncate">{name || 'Nombre del plato'}</div>
                    <div className="text-amber-400 font-mono">${price || '0.00'} USD · {category}</div>
                  </div>
                </div>

                {/* Categorized Gourmet Video Presets Selector */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-200">
                      Selecciona el video para tu plato:
                    </span>
                    <span className="text-[10px] text-amber-400 font-medium">
                      Calidad HD
                    </span>
                  </div>

                  {/* Category Filter Pills */}
                  <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
                    {['all', 'Hamburguesas', 'Pizzas', 'Carnes & Grill', 'Sushi & Asiática', 'Postres & Dulces', 'Brunch & Café', 'Tacos & Tex-Mex', 'Mariscos & Pescados'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setPresetCategoryFilter(cat)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-medium whitespace-nowrap transition-colors ${
                          presetCategoryFilter === cat
                            ? 'bg-amber-400 text-stone-950 font-bold'
                            : 'bg-stone-950 text-stone-400 hover:text-stone-200 border border-stone-800'
                        }`}
                      >
                        {cat === 'all' ? 'Todos' : cat}
                      </button>
                    ))}
                  </div>

                  {/* Preset Cards Grid */}
                  <div className="grid grid-cols-2 gap-2 max-h-52 overflow-y-auto no-scrollbar pr-1">
                    {STOCK_VIDEO_PRESETS.filter(
                      (p) => presetCategoryFilter === 'all' || p.category === presetCategoryFilter
                    ).map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleSelectPreset(preset)}
                        className={`group relative p-2 rounded-xl text-left border transition-all flex flex-col justify-between ${
                          selectedPresetId === preset.id
                            ? 'bg-amber-400/20 border-amber-400 text-amber-300 ring-2 ring-amber-400/30'
                            : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700 hover:text-stone-200'
                        }`}
                      >
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-black mb-1.5">
                          <img
                            src={preset.posterUrl}
                            alt={preset.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute top-1 right-1 bg-black/60 rounded p-0.5 text-white">
                            <Play className="w-2.5 h-2.5 fill-white" />
                          </div>
                        </div>
                        <div className="text-[11px] font-bold text-stone-200 line-clamp-1 leading-snug">
                          {preset.title}
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono mt-1">
                          <span className="text-amber-400">${preset.defaultPrice.toFixed(2)}</span>
                          <span>{preset.category.split(' ')[0]}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Dish Information Form */}
            <div className="lg:col-span-7 space-y-4">
              <div className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-4">
                <h3 className="font-display font-bold text-sm text-stone-200">
                  2. Datos del Plato
                </h3>

                {/* Dish Name */}
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Nombre del Plato *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Truffle Double Smash Burger, Pizza Quattro Formaggi..."
                    className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>

                {/* Price, Category & Prep Time */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      Precio en USD ($) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-stone-500 font-mono text-sm">$</span>
                      <input
                        type="number"
                        step="0.5"
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="12.00"
                        className="w-full pl-7 pr-3 py-2 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 text-sm font-mono focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      Categoría *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as DishCategory)}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 text-sm focus:outline-none focus:border-amber-400"
                    >
                      {CATEGORIES_LIST.filter((c) => c !== 'Todo').map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      Preparación (min) *
                    </label>
                    <div className="relative">
                      <Clock className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-3" />
                      <input
                        type="number"
                        required
                        value={prepTime}
                        onChange={(e) => setPrepTime(e.target.value)}
                        placeholder="15"
                        className="w-full pl-8 pr-3 py-2 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 text-sm font-mono focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Description with AI Enhancer button */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-stone-300">
                      Descripción Apetitosa
                    </label>
                    <button
                      type="button"
                      onClick={handleGenerateAiDescription}
                      disabled={isGeneratingAiDesc}
                      className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold transition-colors disabled:opacity-50"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isGeneratingAiDesc ? 'Generando con IA...' : '✨ Mejorar con IA'}</span>
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe los sabores, la textura y por qué este plato es irresistible..."
                    className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>

                {/* Ingredients & Allergens */}
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Ingredientes Principales (separados por coma)
                  </label>
                  <input
                    type="text"
                    value={ingredientsText}
                    onChange={(e) => setIngredientsText(e.target.value)}
                    placeholder="Carne Angus 180g, queso cheddar fundido, tocineta crujiente, pan brioche..."
                    className="w-full px-3.5 py-2 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    Alérgenos Presentes
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Gluten', 'Lácteos', 'Huevo', 'Crustáceos', 'Pescado', 'Frutos Secos', 'Soya'].map(
                      (item) => {
                        const isChecked = selectedAllergens.includes(item);
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => {
                              setSelectedAllergens((prev) =>
                                isChecked ? prev.filter((a) => a !== item) : [...prev, item]
                              );
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                              isChecked
                                ? 'bg-red-500/20 text-red-300 border-red-500/40'
                                : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-300'
                            }`}
                          >
                            {item}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Etiquetas Especiales (separadas por coma)
                  </label>
                  <input
                    type="text"
                    value={tagsText}
                    onChange={(e) => setTagsText(e.target.value)}
                    placeholder="Recomendado del Chef, Sin Gluten, Picante, Para Compartir..."
                    className="w-full px-3.5 py-2 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Toggles: AI Enhanced & Featured */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-stone-800">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-300">
                    <input
                      type="checkbox"
                      checked={isAiEnhanced}
                      onChange={(e) => setIsAiEnhanced(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-stone-950 border-stone-700"
                    />
                    <span>Mostrar etiqueta "Mejorado con IA"</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-300">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-stone-950 border-stone-700"
                    />
                    <span className="flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-orange-400" />
                      <span>Destacar en primeros lugares (Boost)</span>
                    </span>
                  </label>
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl font-display font-bold text-sm text-stone-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-lg shadow-amber-500/20 active:scale-[0.99] transition-all"
                  >
                    Publicar Plato en el Feed de MyMenu
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* TAB 2: GESTIONAR MENÚ */}
        {portalTab === 'menu' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-white">
                Platos de {currentRestaurant.name} ({restaurantDishes.length})
              </h3>
              <button
                onClick={() => setPortalTab('upload')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-400 text-stone-950 hover:bg-amber-300 shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Agregar Otro Plato</span>
              </button>
            </div>

            {restaurantDishes.length === 0 ? (
              <div className="text-center py-12 p-6 rounded-2xl bg-stone-900/50 border border-stone-800">
                <Store className="w-12 h-12 text-stone-600 mx-auto mb-2" />
                <p className="text-stone-300 text-sm">Aún no has publicado platos para este local.</p>
                <button
                  onClick={() => setPortalTab('upload')}
                  className="mt-3 px-4 py-2 text-xs font-bold text-stone-950 bg-amber-400 rounded-lg"
                >
                  Subir mi primer plato en video
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {restaurantDishes.map((dish) => (
                  <div
                    key={dish.id}
                    className="flex gap-3.5 p-4 rounded-2xl bg-stone-900/80 border border-stone-800 hover:border-stone-700 transition-colors shadow-lg"
                  >
                    {/* Dish Video Thumbnail */}
                    <div className="relative w-24 h-32 rounded-xl overflow-hidden bg-black shrink-0">
                      <img
                        src={dish.posterUrl}
                        alt={dish.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1.5 right-1.5 bg-black/60 rounded p-1 text-white">
                        <Play className="w-3 h-3 fill-white" />
                      </div>
                      <div className="absolute bottom-1 left-1.5 font-mono text-[11px] font-bold text-amber-400">
                        ${dish.price.toFixed(2)}
                      </div>
                    </div>

                    {/* Dish Info & Stats */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-display font-bold text-sm text-stone-100 line-clamp-1">
                            {dish.name}
                          </h4>
                        </div>
                        <span className="text-[11px] text-amber-400/90 font-medium block">
                          {dish.category} · {dish.prepTimeMinutes} min
                        </span>
                        <p className="text-xs text-stone-400 line-clamp-2 mt-1">
                          {dish.description}
                        </p>
                      </div>

                      {/* Performance metrics */}
                      <div className="flex items-center gap-3 text-xs text-stone-400 font-mono pt-2 border-t border-stone-800/80">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-stone-500" />
                          <span>{dish.viewsCount}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5 text-red-500" />
                          <span>{dish.likesCount}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{dish.sharesCount}</span>
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between gap-2 pt-2">
                        <button
                          onClick={() => toggleDishFeatured(dish.id)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                            dish.isFeatured
                              ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30 font-semibold'
                              : 'bg-stone-800 text-stone-400 hover:text-stone-200'
                          }`}
                        >
                          <Flame className="w-3.5 h-3.5" />
                          <span>{dish.isFeatured ? 'Destacado ⭐' : 'Destacar'}</span>
                        </button>

                        <button
                          onClick={() => deleteDish(dish.id)}
                          className="p-1.5 rounded-lg text-stone-500 hover:text-red-400 hover:bg-stone-800 transition-colors"
                          title="Eliminar plato"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: DATOS DEL LOCAL */}
        {portalTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="max-w-2xl p-6 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-4">
            <h3 className="font-display font-bold text-base text-white">
              Configuración de {currentRestaurant.name}
            </h3>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Nombre del Restaurante
              </label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full px-3.5 py-2 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Eslogan / Especialidad
              </label>
              <input
                type="text"
                value={profileTagline}
                onChange={(e) => setProfileTagline(e.target.value)}
                className="w-full px-3.5 py-2 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Ciudad / Municipio
                </label>
                <select
                  value={profileCity}
                  onChange={(e) => setProfileCity(e.target.value as CityZone)}
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 text-sm focus:outline-none focus:border-amber-400"
                >
                  {CITY_ZONES.filter((z) => z.id !== 'all').map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Número de WhatsApp para Pedidos (con cód. de país)
                </label>
                <input
                  type="text"
                  value={profileWhatsapp}
                  onChange={(e) => setProfileWhatsapp(e.target.value)}
                  placeholder="584129991122"
                  className="w-full px-3.5 py-2 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 text-sm font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Dirección Física
              </label>
              <input
                type="text"
                value={profileAddress}
                onChange={(e) => setProfileAddress(e.target.value)}
                className="w-full px-3.5 py-2 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Horario de Atención
              </label>
              <input
                type="text"
                value={profileHours}
                onChange={(e) => setProfileHours(e.target.value)}
                className="w-full px-3.5 py-2 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl font-bold text-xs text-stone-950 bg-amber-400 hover:bg-amber-300 shadow-md transition-all"
              >
                Guardar Cambios de Perfil
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
