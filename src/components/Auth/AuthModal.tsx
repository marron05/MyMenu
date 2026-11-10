import React, { useState } from 'react';
import { useMenu } from '../../context/MenuContext';
import { supabase, isSupabaseConfigured, SUPABASE_SQL_SCHEMA } from '../../lib/supabase';
import { CITY_ZONES } from '../../data/initialData';
import { CityZone } from '../../types';
import { 
  X, 
  Store, 
  Lock, 
  Mail, 
  Phone, 
  MapPin, 
  Check, 
  Copy, 
  Database, 
  Sparkles, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    currentUser,
    setCurrentUser,
    activeRestaurantId,
    setActiveRestaurantId,
    restaurants,
    showToast,
  } = useMenu();

  const [mode, setMode] = useState<'login' | 'register' | 'schema'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [city, setCity] = useState<CityZone>('Lechería');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    showToast('¡Script SQL de Supabase copiado al portapapeles! 📋');
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        setCurrentUser({
          id: data.user.id,
          email: data.user.email || email,
          restaurantId: activeRestaurantId,
        });
        showToast('¡Sesión iniciada con éxito en Supabase! 🚀');
      } else {
        // Fallback local auth simulation
        setCurrentUser({
          id: `user-${Date.now()}`,
          email,
          restaurantId: activeRestaurantId,
        });
        showToast('¡Sesión iniciada con éxito! (Modo Local/Vercel) 🎉');
      }

      setIsAuthModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        setCurrentUser({
          id: data.user?.id || `user-${Date.now()}`,
          email,
          restaurantId: activeRestaurantId,
        });
        showToast('¡Restaurante registrado en Supabase! 🥂');
      } else {
        setCurrentUser({
          id: `user-${Date.now()}`,
          email,
          restaurantId: activeRestaurantId,
        });
        showToast(`¡Bienvenido ${restaurantName}! Perfil creado.`);
      }

      setIsAuthModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Error al registrar restaurante');
    } finally {
      setIsLoading(false);
    }
  };

  // One-click quick demo login for instant testing
  const handleDemoLogin = (restId: string) => {
    const target = restaurants.find((r) => r.id === restId) || restaurants[0];
    setActiveRestaurantId(target.id);
    setCurrentUser({
      id: `demo-${target.id}`,
      email: `admin@${target.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      restaurantId: target.id,
    });
    showToast(`Acceso concedido como: ${target.name} 🔑`);
    setIsAuthModalOpen(false);
  };

  return (
    <div 
      onClick={() => setIsAuthModalOpen(false)}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md glass-dock border border-white/[0.09] rounded-t-[32px] sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-bottom-sheet"
      >
        {/* Mobile Drag Handle */}
        <div className="sm:hidden w-12 h-1.5 rounded-full bg-white/20 mx-auto mt-3 mb-1 shrink-0" />

        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/[0.08] relative bg-gradient-to-b from-white/[0.04] to-transparent">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full glass-action-btn flex items-center justify-center text-stone-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-lg text-white">
                Portal de Restaurantes
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-stone-400 mt-0.5">
                <span>Supabase Auth & PostgreSQL</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-emerald-400 font-mono text-[11px]">
                  {isSupabaseConfigured ? 'Cloud Activo' : 'Offline Ready'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center px-6 pt-3 pb-1 border-b border-stone-800 bg-stone-950/50 text-xs">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 font-semibold text-center border-b-2 transition-colors ${
              mode === 'login'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-2 font-semibold text-center border-b-2 transition-colors ${
              mode === 'register'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Registrar Local
          </button>
          <button
            onClick={() => setMode('schema')}
            className={`flex-1 py-2 font-semibold text-center border-b-2 transition-colors flex items-center justify-center gap-1 ${
              mode === 'schema'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>SQL Supabase</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[70dvh] space-y-4">
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="gerencia@turestaurante.com"
                    className="w-full pl-9 pr-3 py-2 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl font-display font-bold text-xs text-stone-950 bg-amber-400 hover:bg-amber-300 shadow-md transition-all disabled:opacity-50"
              >
                {isLoading ? 'Autenticando...' : 'Entrar al Panel de Restaurante'}
              </button>

              {/* Quick Demo Access Bar */}
              <div className="pt-3 border-t border-stone-800">
                <span className="block text-[11px] text-stone-400 mb-2 font-medium">
                  ⚡ O prueba instantáneamente con un local demo:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('rest-1')}
                    className="px-2.5 py-1.5 rounded-lg bg-stone-950 hover:bg-stone-800 border border-stone-700 text-[11px] text-stone-300 text-left truncate transition-colors"
                  >
                    🍔 Smash & Co. (Lechería)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('rest-2')}
                    className="px-2.5 py-1.5 rounded-lg bg-stone-950 hover:bg-stone-800 border border-stone-700 text-[11px] text-stone-300 text-left truncate transition-colors"
                  >
                    🍕 Nonna Rosa (PLC)
                  </button>
                </div>
              </div>
            </form>
          )}

          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Nombre del Restaurante / Negocio *
                </label>
                <input
                  type="text"
                  required
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  placeholder="Ej. Trattoria del Morro"
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Municipio *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value as CityZone)}
                    className="w-full px-2.5 py-2 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 text-xs focus:outline-none focus:border-amber-400"
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
                    WhatsApp Pedidos *
                  </label>
                  <input
                    type="text"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="584129991122"
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 text-xs font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Correo del Administrador *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@local.com"
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Contraseña Segura *
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl font-display font-bold text-xs text-stone-950 bg-amber-400 hover:bg-amber-300 shadow-md transition-all disabled:opacity-50 mt-1"
              >
                {isLoading ? 'Registrando...' : 'Crear Cuenta y Comenzar a Publicar'}
              </button>
            </form>
          )}

          {mode === 'schema' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/40 text-xs text-stone-300 leading-relaxed">
                <span className="font-bold text-amber-400 block mb-0.5">
                  SQL de Inicialización para Supabase:
                </span>
                Copia este script y pégalo en el **SQL Editor** de tu panel de Supabase para crear las tablas de `restaurants`, `dishes` y configurar la seguridad RLS.
              </div>

              <div className="relative">
                <pre className="p-3 bg-stone-950 border border-stone-800 rounded-xl text-[10px] font-mono text-stone-300 max-h-44 overflow-y-auto">
                  {SUPABASE_SQL_SCHEMA}
                </pre>
                <button
                  onClick={handleCopySql}
                  className="absolute top-2 right-2 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-400 text-stone-950 font-bold text-[10px] shadow-sm hover:bg-amber-300 transition-colors"
                >
                  {copiedSql ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedSql ? 'Copiado' : 'Copiar SQL'}</span>
                </button>
              </div>

              <div className="text-[11px] text-stone-400 space-y-1">
                <p>💡 Variables de entorno en tu proyecto (Vercel o .env):</p>
                <code className="block p-2 bg-stone-950 rounded text-amber-300 text-[10px] font-mono">
                  VITE_SUPABASE_URL="https://tu-proyecto.supabase.co"<br />
                  VITE_SUPABASE_ANON_KEY="tu-anon-key"
                </code>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
