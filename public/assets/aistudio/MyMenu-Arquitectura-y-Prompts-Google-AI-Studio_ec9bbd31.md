# MyMenu – Arquitectura + Prompts para Google AI Studio

Documento completo de definición de producto, arquitectura recomendada y prompts listos para usar en Google AI Studio (Gemini).

---

## 1. Resumen del Producto (Product Brief)

**Nombre:** MyMenu  
**Tagline tentativo:** “Descubre qué comer cerca, en video.”

### Propuesta de valor
MyMenu es una web-app (PWA) estilo TikTok enfocada en menús de restaurantes. En lugar de PDFs estáticos, fotos malas y precios desactualizados, el usuario scrollea videos cortos y apetitosos de **platos individuales**, filtrados por categoría, ubicación y preferencias. Está pensada para gente que no sabe qué comer o qué hay nuevo en la zona (Lechería, Puerto La Cruz, Guanta y Barcelona).

### Vibe
Apetitoso + premium (limpio, elegante, colores cálidos, tipografía cuidada y videos de alta calidad).

### Usuarios principales
- Personas buscando qué comer cerca
- Grupos de amigos decidiendo juntos
- Edad: 15+

### Contenido
- Solo restaurantes suben videos (1 video = 1 plato)
- Feed por categorías del restaurante + filtros globales (pizzas, hamburguesas, etc.)
- Información obligatoria por plato:
  - Nombre del plato
  - Precio
  - Descripción corta
  - Ingredientes / alérgenos
  - Categoría
  - Tiempo de preparación
  - Etiquetas (vegano, sin gluten, picante, etc.)
  - Distancia / ubicación
  - Link de contacto (WhatsApp / pedir / reservar)
- Se puede compartir
- Label visible si el video fue mejorado con IA

### Descubrimiento
- Feed vertical + Mapa de la zona (puntos de restaurantes)
- Filtros: ubicación, tipo de comida, precio, popularidad, trending y búsqueda libre
- Se puede ver solo cercanos o explorar toda la zona

### Lado Restaurante
- Panel web simple y mobile-first
- Subida fácil: video + datos básicos
- Modelo de suscripción + posibilidad de destacar videos

### Alcance inicial
Lechería, Puerto La Cruz, Guanta y Barcelona (Venezuela).

### Diferenciador clave
Está hecha para gente que no sabe qué comer y no sabe qué hay de nuevo o qué hay en general en la zona. Permite ver múltiples opciones de manera mucho más rápida y apetitosa que Instagram, TikTok o Google Maps.

---

## 2. Arquitectura Recomendada

### Stack propuesto

| Capa              | Tecnología                          | Justificación                                      |
|-------------------|-------------------------------------|----------------------------------------------------|
| Frontend          | Next.js 15 (App Router) + TypeScript + Tailwind CSS | Excelente DX, PWA, Server Components, performance |
| Estilos & Anim.   | Tailwind + Framer Motion            | Diseño rápido + animaciones fluidas                |
| Backend & Auth    | Supabase                            | Auth, PostgreSQL, Storage, Realtime, RLS           |
| Videos            | Mux (recomendado) o Cloudflare Stream | Transcoding, player excelente, thumbnails         |
| Mapas             | Mapbox GL JS                        | Control de estilo, costos predecibles, buena DX    |
| Pagos             | Stripe                              | Suscripciones + one-time payments (boosts)         |
| Geolocalización   | HTML5 Geolocation + PostGIS         | Consultas “cerca de mí” eficientes                 |

### Estructura de alto nivel
- **Frontend (PWA mobile-first)**
- **Backend (Supabase)**
- **Video Pipeline (Mux / Cloudflare Stream)**
- **Pagos (Stripe)**
- **Mapas (Mapbox)**

### Consideraciones importantes
- Feed de videos con Intersection Observer + lazy loading + preloading inteligente
- Autenticación separada: usuarios normales vs cuentas de restaurante
- Row Level Security (RLS) estricta en Supabase
- Mobile-first absoluto + instalación como PWA

---

## 3. Modelo de Datos Principal (simplificado)

**Restaurants**
- id, name, description, logo, cover, address, lat, lng, city, whatsapp, subscription_status, created_at

**Dishes (Platos)**
- id, restaurant_id, name, description, price, category, prep_time, tags[], allergens[], video_url, thumbnail_url, is_ai_enhanced, is_featured, views, shares, created_at

**Categories**
- Globales + por restaurante

**Users** (opcional en MVP)
- id, name, avatar, favorites

**Subscriptions**
- Control de planes de los restaurantes

---

## 4. Flujos Principales

### Usuario
1. Abre la app → pide ubicación (o elige zona)
2. Ve mapa con puntos + feed de videos
3. Filtra por categoría / precio / distancia
4. Scrollea videos de platos → ve info + botón de WhatsApp / compartir
5. Entra al perfil del restaurante → ve todas sus categorías y platos

### Restaurante
1. Se registra / inicia sesión
2. Completa perfil del local
3. Sube video + rellena datos del plato
4. Publica
5. Ve analytics básicos + opción de destacar video (pago)

---

## 5. Prompts listos para Google AI Studio

> **Instrucciones de uso:**
> 1. Abre una conversación nueva en Google AI Studio.
> 2. Pega primero el **Prompt Maestro**.
> 3. Luego ve pegando los demás prompts según lo que necesites generar.
> 4. Si el modelo se desvía, escribe: “Sigue estrictamente el contexto de MyMenu que te di al inicio”.

---

### Prompt 1 – Maestro (usar siempre primero)

```text
Eres un Senior Product Engineer y Full-Stack Developer especializado en aplicaciones web modernas, PWAs y experiencias tipo TikTok.

Voy a construir una aplicación llamada **MyMenu**.

Contexto del producto:
- MyMenu es una web-app (PWA) mobile-first que permite a los restaurantes subir videos cortos de sus platos (1 video = 1 plato).
- El usuario scrollea videos de forma vertical (estilo TikTok) en lugar de leer PDFs o menús estáticos.
- Vibe: apetitoso + premium (elegante, limpio, cálido, de alta calidad).
- Zona inicial: Lechería, Puerto La Cruz, Guanta y Barcelona (Venezuela).
- Usuarios principales: personas que no saben qué comer y grupos de amigos decidiendo juntos.
- Solo los restaurantes pueden subir contenido.
- Se puede compartir los platos.
- Cada plato debe mostrar: nombre, precio, descripción corta, ingredientes/alérgenos, categoría, tiempo de preparación, etiquetas (vegano, sin gluten, picante, etc.), distancia/ubicación y botón de contacto (WhatsApp / pedir / reservar).
- Debe haber feed por categorías + filtros globales + mapa con los restaurantes.
- Lado restaurante: panel simple para subir video + datos básicos.
- Monetización: suscripción de restaurantes + posibilidad de destacar videos.
- Stack recomendado: Next.js 15 (App Router) + TypeScript + Tailwind CSS + Supabase + Mux (o Cloudflare Stream) + Stripe + Mapbox.

Tu trabajo es ayudarme a diseñar y generar el código, arquitectura, componentes y flujos de forma profesional, limpia, escalable y con excelente UX mobile.

A partir de ahora, responde siempre teniendo en cuenta este contexto completo de MyMenu.
```

---

### Prompt 2 – Arquitectura completa + estructura de carpetas

```text
Con el contexto completo de MyMenu, genera una arquitectura técnica detallada y profesional.

Incluye:
1. Diagrama de arquitectura en texto (Frontend, Backend, Storage de videos, Auth, Pagos, Mapas, etc.).
2. Stack definitivo recomendado con justificación breve de cada tecnología.
3. Estructura de carpetas completa del proyecto Next.js 15 (App Router) lista para usar.
4. Separación clara entre:
   - Lado usuario (feed, mapa, perfil de restaurante)
   - Lado restaurante (dashboard, subida de platos, suscripción)
5. Consideraciones importantes de performance para el feed de videos (lazy loading, preloading, intersection observer, etc.).
6. Estrategia de autenticación (usuarios normales vs restaurantes).
7. Cómo manejar la geolocalización y el “cerca de mí”.

Entrega la respuesta de forma clara, estructurada y lista para implementar.
```

---

### Prompt 3 – Feed estilo TikTok (UI + lógica)

```text
Con el contexto de MyMenu, genera el componente principal del feed de videos estilo TikTok.

Requisitos:
- Scroll vertical a pantalla completa (100dvh).
- Cada item es un plato (video + overlay de información).
- El video debe reproducirse automáticamente cuando está en viewport y pausarse cuando sale.
- Overlay elegante y premium con:
  - Nombre del plato
  - Precio
  - Nombre del restaurante
  - Distancia
  - Etiquetas principales
  - Botón de WhatsApp / Contactar
  - Botón de compartir
  - Indicador si el video fue mejorado con IA
- Debe soportar filtros (por categoría, precio, etc.).
- Diseño 100% mobile-first, vibe apetitoso + premium.
- Usa Tailwind CSS + TypeScript.
- Incluye el uso de Intersection Observer o similar para el control de videos.
- Haz el componente reutilizable y limpio.

Genera:
1. El código completo del componente Feed.
2. El componente individual VideoCard / DishCard.
3. Explicación breve de cómo funciona el autoplay/pause.
4. Sugerencias de mejoras de UX.
```

---

### Prompt 4 – Panel del Restaurante (subida de videos)

```text
Con el contexto de MyMenu, diseña y genera el panel del restaurante (dashboard) enfocado en la subida de platos.

Requisitos:
- Mobile-first y muy fácil de usar.
- Flujo principal: Subir video → Completar datos del plato → Publicar.
- Campos obligatorios: nombre del plato, precio, descripción corta, categoría, tiempo de preparación, etiquetas, ingredientes/alérgenos, video.
- El video se sube directamente (idealmente con Mux o similar).
- Debe mostrar preview del video antes de publicar.
- Diseño limpio, premium y confiable.
- Incluye estados de carga, éxito y error.

Genera:
1. Estructura de las páginas/rutas del dashboard del restaurante.
2. Código del formulario de creación/edición de plato (con TypeScript + Tailwind + React Hook Form o similar).
3. Cómo integrar la subida de video (ejemplo con Mux o Supabase Storage + Cloudflare Stream).
4. Recomendaciones de UX para que los restaurantes suban contenido de calidad.
```

---

### Prompt 5 – Mapa + Filtros + Descubrimiento

```text
Con el contexto de MyMenu, genera la experiencia de descubrimiento que combina Mapa + Feed + Filtros.

Requisitos:
- Vista dual: Mapa (con puntos de los restaurantes) + Feed de videos.
- El usuario puede alternar fácilmente entre mapa y feed.
- Filtros disponibles: ubicación/distancia, tipo de comida, rango de precio, categorías, trending, búsqueda libre.
- Al hacer clic en un restaurante del mapa, se debe poder ver sus platos.
- El mapa debe centrarse en la zona de Lechería / Puerto La Cruz / Guanta / Barcelona.
- Diseño premium y mobile-first.

Genera:
1. Propuesta de UX/UI para la combinación Mapa + Feed.
2. Código de ejemplo del componente de Mapa (usando Mapbox o Google Maps).
3. Cómo conectar el mapa con el feed (al seleccionar un restaurante o zona).
4. Componente de filtros (chips + bottom sheet o drawer).
5. Consideraciones de performance y geolocalización.
```

---

### Prompt 6 – Modelo de datos + Endpoints

```text
Con el contexto completo de MyMenu, diseña el modelo de datos y la API.

Usa Supabase (PostgreSQL) como base.

Genera:
1. Esquema completo de las tablas principales (SQL) con relaciones, índices y tipos de datos correctos.
   Tablas mínimas: restaurants, dishes, categories, users (si aplica), subscriptions.
2. Políticas de Row Level Security (RLS) básicas recomendadas.
3. Endpoints / Server Actions necesarios (usando Next.js Server Actions o Route Handlers).
4. Cómo modelar:
   - Platos con video
   - Etiquetas y alérgenos
   - Destacar videos (featured)
   - Suscripciones de restaurantes
5. Consideraciones para búsquedas por ubicación (PostGIS) y filtros eficientes.

Entrega el SQL listo para ejecutar y la estructura de las Server Actions más importantes.
```

---

## 6. Próximos pasos recomendados

1. Pegar el **Prompt Maestro** en Google AI Studio.
2. Generar la arquitectura completa (Prompt 2).
3. Generar el Feed (Prompt 3) y el Panel del Restaurante (Prompt 4).
4. Definir el sistema de diseño (colores, tipografía, componentes base).
5. Implementar el MVP centrado en:
   - Registro/login de restaurantes
   - Subida de platos con video
   - Feed + filtros básicos
   - Mapa de la zona

---

**Documento generado para MyMenu**  
Listo para usar en Google AI Studio y como referencia de arquitectura.
