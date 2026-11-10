# MyMenu – Plan de Implementación de Arquitectura y Backend Supabase

Plan integral para escalar **MyMenu** incorporando backend en la nube con Supabase (Autenticación real de restaurantes, base de datos relacional PostgreSQL con Row Level Security), geolocalización GPS nativa con cálculo dinámico de distancias en kilómetros, y un sistema optimizado de videos gastronómicos preconfigurados en alta resolución.

---

## Decisiones Confirmadas del Usuario

> [!IMPORTANT]
> Decisiones clave acordadas durante la fase de consulta:
> - **Prioridad de la fase actual**: Integración de backend relacional con **Supabase**, autenticación real (login/registro para dueños de restaurantes y perfiles de usuario) y persistencia en PostgreSQL con RLS.
> - **Ubicación y Descubrimiento**: Uso de **Geolocalización GPS real** del navegador (`navigator.geolocation`) con cálculo dinámico de distancia (fórmula Haversine en km) ordenando restaurantes y platos según la proximidad real del comensal.
> - **Gestión de Videos**: Catálogo curado de **videos gourmet preconfigurados** en bucle de alta calidad (1 plato = 1 video), garantizando rendimiento instantáneo, sin costos excesivos de transcoding ni fallos de carga en conexiones móviles.

---

## 1. Visión General y Concepto

MyMenu resuelve la indecisión gastronómica en la zona metropolitana de Anzoátegui (Lechería, Puerto La Cruz, Barcelona y Guanta) sustituyendo menús estáticos y PDFs por un feed vertical dinámico estilo TikTok.

- **Comensales**: Exploran platos en video a pantalla completa (100dvh), filtran por antojo o presupuesto, ven la distancia real a su ubicación y piden en un toque directo vía WhatsApp.
- **Restaurantes**: Inician sesión con autenticación segura en Supabase, administran su catálogo de platos seleccionando videos culinarios de alta fidelidad, actualizan precios en USD y activan promociones destacadas (Boost).

---

## 2. Experiencia de Usuario y Diseño Visual

### Flujos Principales
1. **Flujo de Descubrimiento (Comensal)**:
   - Al ingresar, la app solicita permiso de GPS de forma no invasiva para calcular distancias exactas.
   - Navegación vertical por videos de platos con autoplay/pause inmediato según viewport.
   - Pestaña de mapa interactivo con pines y radar de cercanía.
   - Botón directo de pedido por WhatsApp con plantilla de orden pre-llenada.
2. **Flujo de Restaurante (Gestión & Auth)**:
   - Modal/Página de autenticación con Supabase (Email/Password y Magic Link).
   - Panel de control para crear platos seleccionando categoría, precio, ingredientes, alérgenos y video gourmet asociado.
   - Generador culinario con IA para descripciones irresistibles.

### Identidad Visual y Estilo
- **Paleta de Colores**: Fondo neutro profundo (`bg-stone-950`), superficies estructurales en pizarra oscura (`bg-stone-900/90`), acento ámbar/dorado cálido (`#f59e0b` / `amber-400`) y verde WhatsApp para conversión directa (`#10b981` / `emerald-500`).
- **Tipografía**: `Outfit` para títulos gastronómicos de impacto y `Plus Jakarta Sans` para lectura fluida, con cifras tabulares monoespaciadas (`tabular-nums`) para precios y tiempos.
- **Disciplina Anti-Slop (Zero-Pill)**: Los metadatos (distancia, tiempo de cocción, alérgenos) se presentan como texto limpio con separadores tipográficos (`·`), reservando contenedores exclusivamente para controles de filtrado interactivos.

---

## 3. Decisiones de Producto y Arquitectura

### A. Autenticación y Base de Datos (Supabase)
- **Decisión**: Integrar `@supabase/supabase-js` con cliente desacoplado y fallback a almacenamiento local seguro cuando no haya credenciales activas.
- **Razón**: Permite a los restaurantes tener cuentas reales con contraseñas seguras, mientras que los comensales pueden usar la app de inmediato sin barreras de registro.
- **Políticas RLS**:
  - `restaurants`: Lectura pública; actualización restringida al `auth.uid() = user_id`.
  - `dishes`: Lectura pública; inserción y modificación restringida a los restaurantes propietarios.

### B. Geolocalización GPS Real
- **Decisión**: Hook reactivo `useGeolocation` con la API nativa del navegador y fallback a las coordenadas centrales de Lechería (`10.1982, -64.6854`).
- **Cálculo**: Algoritmo de Haversine para computar distancias precisas en kilómetros en tiempo real.

### C. Catálogo de Videos Gastronómicos
- **Decisión**: Biblioteca de videos gourmet preconfigurados organizados por categoría (hamburguesas, pizzas a la leña, cortes de carne, sushi flameado, pastas, postres).
- **Razón**: Evita demoras de subida móvil en redes 3G/4G, asegurando que cada plato cargue de forma ultra rápida y con estética cinematográfica.

---

## 4. Arquitectura Técnica y Estrategia de Datos

### Diagrama del Sistema

```text
┌─────────────────────────────────────────────────────────────────┐
│                    MYMENU CLIENT (REACT SPA / PWA)              │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐   ┌─────────────────┐   ┌───────────────┐  │
│  │   TikTokFeed    │   │  DiscoveryMap   │   │ PartnerPortal │  │
│  │ (100dvh Videos) │   │ (GPS & Radar)   │   │ (Auth & CRUD) │  │
│  └────────┬────────┘   └────────┬────────┘   └───────┬───────┘  │
│           │                     │                    │          │
│           ▼                     ▼                    ▼          │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                       MenuContext                         │  │
│  │  - Estado reactivo de platos y restaurantes               │  │
│  │  - Geolocalización en vivo (Haversine km)                 │  │
│  │  - Sesión activa de restaurante (Supabase Auth)           │  │
│  └──────────────────────────────┬────────────────────────────┘  │
└─────────────────────────────────┼───────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                     SUPABASE CLOUD SERVICES                     │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐   ┌─────────────────┐   ┌───────────────┐  │
│  │  Supabase Auth  │   │ PostgreSQL RLS  │   │ Stock Videos  │  │
│  │ (Restaurantes)  │   │ (Platos/Locales)│   │ (Fast CDN)    │  │
│  └─────────────────┘   └─────────────────┘   └───────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Esquema de Tablas (PostgreSQL / Supabase)

1. **`restaurants`**:
   - `id` (uuid, primary key)
   - `user_id` (uuid, references auth.users)
   - `name` (text), `tagline` (text), `description` (text)
   - `logo_url` (text), `cover_url` (text)
   - `address` (text), `city` (text: Lechería, PLC, Barcelona, Guanta)
   - `lat` (float8), `lng` (float8)
   - `whatsapp` (text), `rating` (numeric)
   - `created_at` (timestamp with time zone)

2. **`dishes`**:
   - `id` (uuid, primary key)
   - `restaurant_id` (uuid, references restaurants.id on delete cascade)
   - `name` (text), `description` (text), `price` (numeric)
   - `category` (text), `prep_time_minutes` (int)
   - `tags` (text[]), `allergens` (text[]), `ingredients` (text[])
   - `video_url` (text), `poster_url` (text)
   - `is_ai_enhanced` (boolean), `is_featured` (boolean)
   - `views_count` (int), `likes_count` (int), `shares_count` (int)
   - `created_at` (timestamp with time zone)

---

## 5. Fases de Ejecución

1. **Fase 1: Capa de Geolocalización en Vivo**
   - Implementar el hook de geoposicionamiento y recálculo dinámico de distancia en km para todos los platos del feed y del mapa.
2. **Fase 2: Módulo de Supabase & Autenticación**
   - Configuración de cliente `src/lib/supabase.ts` y formulario modal de Login / Registro para restaurantes.
   - Sincronización bidireccional entre Supabase y almacenamiento local de contingencia.
3. **Fase 3: Biblioteca Gastronómica y Panel de Restaurante**
   - Selector interactivo de videos gourmet categorizados con previsualización inmediata.
   - Publicación y edición en tiempo real conectada a la base de datos.
4. **Fase 4: Verificación y Despliegue en Vercel**
   - Pruebas de compilación, linters y validación de variables de entorno.
