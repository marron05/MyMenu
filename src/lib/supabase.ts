import { createClient } from '@supabase/supabase-js';

// Environment variables for Supabase (Vite format: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// True if real credentials are provided
export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('YOUR_SUPABASE_URL') &&
  supabaseUrl.startsWith('http')
);

// Supabase client instance
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://mock-mymenu.supabase.co', 'mock-anon-key', {
      auth: { persistSession: false },
    });

/**
 * SQL Schema script ready to run in Supabase SQL Editor
 * to provision the restaurants, dishes, and security policies (RLS).
 */
export const SUPABASE_SQL_SCHEMA = `
-- 1. TABLA DE RESTAURANTES
CREATE TABLE IF NOT EXISTS public.restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  logo TEXT NOT NULL,
  cover_image TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL CHECK (city IN ('Lechería', 'Puerto La Cruz', 'Barcelona', 'Guanta')),
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  whatsapp TEXT NOT NULL,
  instagram TEXT,
  rating NUMERIC(2,1) DEFAULT 4.8,
  price_tier TEXT DEFAULT '$$' CHECK (price_tier IN ('$', '$$', '$$$')),
  opening_hours TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. TABLA DE PLATOS EN VIDEO
CREATE TABLE IF NOT EXISTS public.dishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  category TEXT NOT NULL,
  prep_time_minutes INT NOT NULL DEFAULT 15,
  tags TEXT[] DEFAULT '{}',
  allergens TEXT[] DEFAULT '{}',
  ingredients TEXT[] DEFAULT '{}',
  video_url TEXT NOT NULL,
  poster_url TEXT NOT NULL,
  is_ai_enhanced BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  views_count INT DEFAULT 0,
  likes_count INT DEFAULT 0,
  shares_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. HABILITAR ROW LEVEL SECURITY (RLS)
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dishes ENABLE ROW LEVEL SECURITY;

-- 4. POLÍTICAS DE ACCESO
-- Cualquier comensal puede leer restaurantes y platos
CREATE POLICY "Lectura pública de restaurantes" ON public.restaurants FOR SELECT USING (true);
CREATE POLICY "Lectura pública de platos" ON public.dishes FOR SELECT USING (true);

-- Solo el restaurante dueño puede modificar o insertar sus datos
CREATE POLICY "Restaurantes pueden editar su perfil" ON public.restaurants 
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Restaurantes pueden gestionar sus platos" ON public.dishes 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.restaurants 
      WHERE restaurants.id = dishes.restaurant_id 
      AND restaurants.user_id = auth.uid()
    )
  );
`;
