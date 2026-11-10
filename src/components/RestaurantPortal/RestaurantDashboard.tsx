import React, { useState, useRef } from 'react';
import { useMenu } from '../../context/MenuContext';
import { Dish, DishCategory, CityZone } from '../../types';
import { STOCK_VIDEO_PRESETS, CATEGORIES_LIST, CITY_ZONES } from '../../data/initialData';
import { RestaurantHeader } from './RestaurantHeader';
import { RestaurantStatsGrid } from './RestaurantStatsGrid';
import { PublishHeroCTA } from './PublishHeroCTA';
import { 
  PlusCircle, 
  Sparkles, 
  Play, 
  Flame, 
  Trash2, 
  Clock, 
  Eye, 
  Heart, 
  MessageCircle, 
  Store, 
  Settings, 
  Save,
  CheckCircle2
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
    currentUser,
    setIsAuthModalOpen,
    signOut,
  } = useMenu();

  const currentRestaurant =
    restaurants.find((r) => r.id === activeRestaurantId) || restaurants[0];
  const restaurantDishes = dishes.filter((d) => d.restaurantId === currentRestaurant.id);

  // Active view tab: 'upload' | 'menu' | 'profile'
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

  // Video source state
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

  // Select stock preset video
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
        generatedText = `Elaborada con carne Certified Angus sellada en plancha a fuego vivo para lograr una costra crujiente e interior jugoso, cubierta con queso fundido sedoso y pan brioche artesanal sellado con mantequilla.`;
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
      description: description.trim() || 'Especialidad culinaria preparada con ingredientes frescos del día.',
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

  // Aggregated performance metrics
  const totalViews = restaurantDishes.reduce((acc, d) => acc + d.viewsCount, 0);
  const totalLikes = restaurantDishes.reduce((acc, d) => acc + d.likesCount, 0);
  const totalWhatsAppOrders = restaurantDishes.reduce((acc, d) => acc + d.sharesCount, 0);

  return (
    <div className="w-full min-h-[calc(100dvh-57px)] bg-[#0c0a09] text-stone-100 p-3 sm:p-6 lg:p-8 select-none">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* 1. Header del Restaurante en Warm Glass */}
        <RestaurantHeader
          currentRestaurant={currentRestaurant}
          allRestaurants={restaurants}
          activeRestaurantId={activeRestaurantId}
          onSelectRestaurantId={(id) => {
            setActiveRestaurantId(id);
            const r = restaurants.find((item) => item.id === id);
            if (r) {
              setProfileName(r.name);
              setProfileTagline(r.tagline);
              setProfileAddress(r.address);
              setProfileCity(r.city);
              setProfileWhatsapp(r.whatsapp);
              setProfileHours(r.openingHours);
            }
          }}
          currentUser={currentUser}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onSignOut={signOut}
        />

        {/* 2. Stats Cards con Profundidad */}
        <RestaurantStatsGrid
          dishesCount={restaurantDishes.length}
          totalViews={totalViews}
          totalLikes={totalLikes}
          totalWhatsAppOrders={totalWhatsAppOrders}
        />

        {/* 3. Heroic Action Banner */}
        <PublishHeroCTA
          onPublishClick={() => setPortalTab('upload')}
          activeDishesCount={restaurantDishes.length}
        />

        {/* 4. Tab Navigation Dock */}
        <div className="flex items-center gap-1.5 p-1 glass-dock rounded-2xl max-w-xl">
          <button
            onClick={() => setPortalTab('upload')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              portalTab === 'upload'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 font-bold shadow-md'
                : 'text-stone-300 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Publicar Plato</span>
          </button>

          <button
            onClick={() => setPortalTab('menu')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              portalTab === 'menu'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 font-bold shadow-md'
                : 'text-stone-300 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Gestionar Menú ({restaurantDishes.length})</span>
          </button>

          <button
            onClick={() => setPortalTab('profile')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              portalTab === 'profile'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 font-bold shadow-md'
                : 'text-stone-300 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Datos del Local</span>
          </button>
        </div>

        {/* TAB 1: FORMULARIO PUBLICAR PLATO */}
        {portalTab === 'upload' && (
          <form onSubmit={handlePublishDish} className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Column: Visual Video Selection */}
            <div className="lg:col-span-5 space-y-4">
              <div className="glass-warm rounded-3xl p-4 sm:p-5 border border-white/[0.08] shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display font-bold text-sm text-stone-100 flex items-center gap-2">
                    <span>1. Video del Plato (Formato Reel)</span>
                  </h3>
                  {isAiEnhanced && (
                    <span className="text-[11px] text-amber-300 flex items-center gap-1 font-semibold">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Mejora con IA
                    </span>
                  )}
                </div>

                {/* 9:16 Video Preview Box */}
                <div className="relative aspect-[9/16] max-h-[440px] w-full rounded-2xl overflow-hidden bg-black border border-white/[0.08] flex items-center justify-center shadow-2xl">
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
                    className="absolute inset-0 flex items-center justify-center bg-black/25 hover:bg-black/15 transition-colors cursor-pointer"
                  >
                    {!isPreviewPlaying && (
                      <div className="w-14 h-14 rounded-full glass-action-btn flex items-center justify-center text-amber-300 shadow-2xl scale-100 hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 ml-0.5 fill-amber-300" />
                      </div>
                    )}
                  </button>

                  <div className="absolute bottom-2.5 left-2.5 right-2.5 p-3 glass-dock rounded-xl text-left text-xs">
                    <div className="font-display font-bold text-stone-50 truncate">{name || 'Nombre del plato'}</div>
                    <div className="text-amber-400 font-mono font-bold mt-0.5">${price || '0.00'} USD · {category}</div>
                  </div>
                </div>

                {/* Video Presets Selector */}
                <div className="mt-4 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-200">
                      Biblioteca Gourmet Preconfigurada:
                    </span>
                    <span className="text-[10px] text-amber-400 font-mono">
                      Video HD 60fps
                    </span>
                  </div>

                  {/* Preset Category Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                    {['all', 'Hamburguesas', 'Pizzas', 'Carnes & Grill', 'Sushi & Asiática', 'Postres & Dulces', 'Brunch & Café', 'Tacos & Tex-Mex', 'Mariscos & Pescados'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setPresetCategoryFilter(cat)}
                        className={`px-2.5 py-1 rounded-xl text-[10px] font-medium whitespace-nowrap transition-colors ${
                          presetCategoryFilter === cat
                            ? 'bg-amber-400 text-stone-950 font-bold'
                            : 'glass-action-btn text-stone-400 hover:text-stone-200'
                        }`}
                      >
                        {cat === 'all' ? 'Todos' : cat}
                      </button>
                    ))}
                  </div>

                  {/* Presets Grid */}
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
                            : 'glass-action-btn text-stone-400 hover:text-stone-200'
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
                          <span className="text-amber-400 font-bold">${preset.defaultPrice.toFixed(2)}</span>
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
              <div className="glass-warm rounded-3xl p-5 sm:p-6 border border-white/[0.08] space-y-4 shadow-xl">
                <h3 className="font-display font-bold text-sm text-stone-100">
                  2. Datos y Presentación del Plato
                </h3>

                {/* Dish Name */}
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                    Nombre del Plato *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Truffle Double Smash Burger, Pizza Quattro Formaggi..."
                    className="w-full px-3.5 py-2.5 bg-stone-900/90 border border-white/[0.1] rounded-xl text-stone-100 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>

                {/* Price, Category & Prep Time */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                      Precio en USD ($) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-amber-400 font-mono font-bold text-sm">$</span>
                      <input
                        type="number"
                        step="0.5"
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="12.00"
                        className="w-full pl-7 pr-3 py-2 bg-stone-900/90 border border-white/[0.1] rounded-xl text-stone-100 text-sm font-mono focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                      Categoría *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as DishCategory)}
                      className="w-full px-3 py-2 bg-stone-900/90 border border-white/[0.1] rounded-xl text-stone-100 text-sm focus:outline-none focus:border-amber-400"
                    >
                      {CATEGORIES_LIST.filter((c) => c !== 'Todo').map((cat) => (
                        <option key={cat} value={cat} className="bg-stone-900">
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                      Preparación (min) *
                    </label>
                    <div className="relative">
                      <Clock className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-2.5" />
                      <input
                        type="number"
                        required
                        value={prepTime}
                        onChange={(e) => setPrepTime(e.target.value)}
                        placeholder="15"
                        className="w-full pl-8 pr-3 py-2 bg-stone-900/90 border border-white/[0.1] rounded-xl text-stone-100 text-sm font-mono focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Description with AI Assistant */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-stone-300">
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
                    className="w-full px-3.5 py-2.5 bg-stone-900/90 border border-white/[0.1] rounded-xl text-stone-100 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>

                {/* Ingredients & Allergens */}
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                    Ingredientes Principales (separados por coma)
                  </label>
                  <input
                    type="text"
                    value={ingredientsText}
                    onChange={(e) => setIngredientsText(e.target.value)}
                    placeholder="Carne Angus 180g, queso cheddar fundido, tocineta crujiente, pan brioche..."
                    className="w-full px-3.5 py-2 bg-stone-900/90 border border-white/[0.1] rounded-xl text-stone-100 text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5">
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
                            className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
                              isChecked
                                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm'
                                : 'glass-action-btn text-stone-400 hover:text-stone-300'
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
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                    Etiquetas de Autor (separadas por coma)
                  </label>
                  <input
                    type="text"
                    value={tagsText}
                    onChange={(e) => setTagsText(e.target.value)}
                    placeholder="Recomendado del Chef, Sin Gluten, Picante, Para Compartir..."
                    className="w-full px-3.5 py-2 bg-stone-900/90 border border-white/[0.1] rounded-xl text-stone-100 text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Toggles */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-white/[0.08]">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-300 font-medium">
                    <input
                      type="checkbox"
                      checked={isAiEnhanced}
                      onChange={(e) => setIsAiEnhanced(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-stone-950 border-stone-700"
                    />
                    <span>Mostrar badge "Mejorado con IA"</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-300 font-medium">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-stone-950 border-stone-700"
                    />
                    <span className="flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      <span>Destacar en primeros lugares (Boost)</span>
                    </span>
                  </label>
                </div>

                {/* Submit Hero Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-5 rounded-2xl font-display font-extrabold text-sm text-stone-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:via-amber-400 hover:to-amber-500 shadow-[0_8px_24px_rgba(245,158,11,0.3)] hover:scale-[1.01] active:scale-95 transition-all cursor-pointer"
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
              <h3 className="font-display font-bold text-base text-stone-100">
                Platos de {currentRestaurant.name} ({restaurantDishes.length})
              </h3>
              <button
                onClick={() => setPortalTab('upload')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 hover:from-amber-300 hover:to-amber-400 shadow-md transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Agregar Otro Plato</span>
              </button>
            </div>

            {restaurantDishes.length === 0 ? (
              <div className="text-center py-12 p-6 rounded-3xl glass-warm border border-white/[0.08]">
                <Store className="w-12 h-12 text-stone-600 mx-auto mb-2" />
                <p className="text-stone-300 text-sm">Aún no has publicado platos en video para este local.</p>
                <button
                  onClick={() => setPortalTab('upload')}
                  className="mt-3 px-4 py-2 text-xs font-bold text-stone-950 bg-amber-400 rounded-xl"
                >
                  Subir mi primer plato en video
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {restaurantDishes.map((dish) => (
                  <div
                    key={dish.id}
                    className="flex gap-4 p-4 rounded-3xl glass-warm border border-white/[0.08] hover:border-amber-400/40 transition-all shadow-xl group"
                  >
                    {/* Dish Video Thumbnail */}
                    <div className="relative w-24 h-32 rounded-2xl overflow-hidden bg-black shrink-0 border border-white/[0.08]">
                      <img
                        src={dish.posterUrl}
                        alt={dish.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-1.5 right-1.5 glass-action-btn rounded-full p-1 text-white">
                        <Play className="w-3 h-3 fill-white/80" />
                      </div>
                      <div className="absolute bottom-1.5 left-2 font-display font-black text-xs text-amber-400 drop-shadow">
                        ${dish.price.toFixed(2)}
                      </div>
                    </div>

                    {/* Dish Info & Stats */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-display font-extrabold text-sm text-stone-100 line-clamp-1">
                            {dish.name}
                          </h4>
                        </div>
                        <span className="text-[11px] text-amber-300 font-semibold block mt-0.5">
                          {dish.category} · {dish.prepTimeMinutes} min
                        </span>
                        <p className="text-xs text-stone-400 line-clamp-2 mt-1">
                          {dish.description}
                        </p>
                      </div>

                      {/* Performance metrics */}
                      <div className="flex items-center gap-3 text-xs text-stone-300 font-mono pt-2 border-t border-white/[0.06]">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-stone-500" />
                          <span>{dish.viewsCount}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5 text-rose-500" />
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
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold transition-colors ${
                            dish.isFeatured
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'glass-action-btn text-stone-400 hover:text-stone-200'
                          }`}
                        >
                          <Flame className="w-3.5 h-3.5 text-amber-400" />
                          <span>{dish.isFeatured ? 'Destacado ⭐' : 'Destacar'}</span>
                        </button>

                        <button
                          onClick={() => deleteDish(dish.id)}
                          className="p-1.5 rounded-xl glass-action-btn text-stone-400 hover:text-rose-400 transition-colors"
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
          <form onSubmit={handleSaveProfile} className="max-w-2xl p-6 rounded-3xl glass-warm border border-white/[0.08] space-y-4 shadow-xl">
            <h3 className="font-display font-bold text-base text-stone-100">
              Configuración de Perfil: {currentRestaurant.name}
            </h3>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Nombre del Restaurante
              </label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-900/90 border border-white/[0.1] rounded-xl text-stone-100 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Eslogan / Especialidad Principal
              </label>
              <input
                type="text"
                value={profileTagline}
                onChange={(e) => setProfileTagline(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-900/90 border border-white/[0.1] rounded-xl text-stone-100 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Ciudad / Municipio
                </label>
                <select
                  value={profileCity}
                  onChange={(e) => setProfileCity(e.target.value as CityZone)}
                  className="w-full px-3 py-2.5 bg-stone-900/90 border border-white/[0.1] rounded-xl text-stone-100 text-sm focus:outline-none focus:border-amber-400"
                >
                  {CITY_ZONES.filter((z) => z.id !== 'all').map((z) => (
                    <option key={z.id} value={z.id} className="bg-stone-900">
                      {z.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  WhatsApp para Pedidos Directos
                </label>
                <input
                  type="text"
                  value={profileWhatsapp}
                  onChange={(e) => setProfileWhatsapp(e.target.value)}
                  placeholder="584129991122"
                  className="w-full px-3.5 py-2.5 bg-stone-900/90 border border-white/[0.1] rounded-xl text-stone-100 text-sm font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Dirección Física
              </label>
              <input
                type="text"
                value={profileAddress}
                onChange={(e) => setProfileAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-900/90 border border-white/[0.1] rounded-xl text-stone-100 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Horario de Atención
              </label>
              <input
                type="text"
                value={profileHours}
                onChange={(e) => setProfileHours(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-900/90 border border-white/[0.1] rounded-xl text-stone-100 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 rounded-2xl font-display font-bold text-xs text-stone-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Guardar Cambios de Perfil</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
