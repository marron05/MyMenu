# Plan de Implementación: Optimización Integral Mobile-First ("Warm Cinematic Glass")

Este plan detalla la reestructuración completa de MyMenu para convertirla en una aplicación web móvil (PWA) de máxima ergonomía, velocidad táctil y estética cinematográfica cálida, diseñada específicamente para teléfonos móviles e interactuable con una sola mano.

---

## 1. Diagnóstico y Objetivos Mobile-First

1. **Aprovechamiento Real del Viewport (100dvh)**:
   - Eliminar cortes de scroll y saltos causados por las barras de navegación tradicionales.
   - El Feed de videos estilo TikTok y el Mapa ocupan el 100% de la altura visible dinámica (`100dvh`), con el header flotando suavemente por encima sin desplazar el contenido.
2. **Header Translúcido Flotante**:
   - Barra superior ultra-delgada y flotante con `glass-dock` y desenfoque óptico (`backdrop-filter: blur(24px)`), permitiendo que el video y el mapa se extiendan por debajo.
3. **Conversión de Modales a Bottom Sheets Nativos**:
   - `DishDetailsModal`, `FilterDrawer` y `RestaurantProfileModal` se transforman en **hojas inferiores deslizables** con tirador táctil superior (`drag handle`), esquinas superiores redondeadas (`rounded-t-[32px]`) y scroll interno suave.
4. **Ergonomía de Zona del Pulgar (Thumb Zone)**:
   - Botón WhatsApp, acciones de guardado y cambio de pantalla ubicados dentro del alcance natural del pulgar en pantallas de 5.8" a 6.7".
   - Botón flotante inferior (`MobileBottomNav`) con elevación sobre el borde inferior (`bottom-3`) y soporte para `env(safe-area-inset-bottom)`.
5. **Rendimiento Táctil y Prevención de Zoom Accidental**:
   - Estricto `touch-action: manipulation` para prevenir retardos de 300ms al tocar.
   - Fuentes de inputs fijadas a mínimo 16px para evitar auto-zoom indeseado en iOS Safari.
   - Metadatos con la disciplina *Zero-Pill* para mantener la densidad visual limpia y sin apiñamientos.

---

## 2. Cambios Propuestos por Módulo

### A. Estilos Globales y Safe Areas (`src/index.css`)
- Añadir utilidades de padding para safe-area de iOS (`pb-[env(safe-area-inset-bottom)]`).
- Añadir keyframes para deslizamiento de hojas inferiores (`@keyframes slideUpBottomSheet`).
- Deshabilitar el rebote elástico de scroll indeseado en el body (`overscroll-behavior-y: none`).

### B. Shell Principal de la App (`src/App.tsx`)
- Reconfigurar el contenedor principal para que los tabs de `feed` y `map` sean pantallas completas sin padding estático forzado.
- Montar el `Navbar` en modo flotante absoluto (`absolute top-0 inset-x-0 z-40`).

### C. Header Minimal Flotante (`src/components/Navbar.tsx`)
- Convertir el header en una barra de cristal flotante con altura compacta de 52px, logo de MyMenu con isotipo ámbar, selector sutil de zona/GPS y accesos rápidos sin recargar la pantalla.

### D. Feed de Videos TikTok (`src/components/Feed/TikTokFeed.tsx` y `DishCard.tsx`)
- Integrar el espaciado superior para el header flotante y los chips de categorías.
- Garantizar que los elementos de control (WhatsApp, like, save, share) se ubiquen en el margen derecho inferior con hitboxes táctiles de 44x44px mínimo.
- En pantallas grandes (tablets/desktops), mantener el contenedor enmarcado como un dispositivo de lujo centrado (`max-w-[430px] rounded-[32px]`).

### E. Mapa de Descubrimiento (`src/components/Map/DiscoveryMap.tsx` y `RestaurantSpotlightCard.tsx`)
- Ajustar la tarjeta spotlight inferior para que flote a `bottom-20` en móvil con margen inferior seguro respecto al `MobileBottomNav`.
- Garantizar que los filtros de ciudad superiores tengan scroll táctil horizontal suave con snap.

### F. Conversión de Modales a Bottom Sheets Deslizables
- **`src/components/Modals/DishDetailsModal.tsx`**:
  - Transformar el modal centrado en una hoja inferior deslizable (`fixed inset-x-0 bottom-0 max-h-[88dvh] rounded-t-[32px] glass-dock overflow-y-auto`).
  - Cabecera con barra de agarre táctil (`w-12 h-1.5 rounded-full bg-white/20 mx-auto my-3`).
  - Botón principal de WhatsApp fijo en la parte inferior de la hoja.
- **`src/components/Modals/FilterDrawer.tsx`**:
  - Hoja inferior de filtros con sliders de precio y categorías con botones grandes y táctiles.
- **`src/components/RestaurantDetail/RestaurantProfileModal.tsx`**:
  - Hoja inferior para el perfil del restaurante con carrusel de platos y contacto directo.

### G. Portal "Mi Local" (`src/components/RestaurantPortal/RestaurantDashboard.tsx`)
- Ajustar el flujo móvil a 1 columna continua con espaciado ergonómico.
- Previsualizador vertical 9:16 con tamaño adaptativo en pantallas pequeñas.
- Botones con estado `:active` que simulan pulsación háptica.

### H. Platos Guardados (`src/components/Saved/SavedDishesView.tsx`)
- Cuadrícula responsive de 2 columnas en móvil con pósters verticales en proporción 4:5, insignia de precio dorado y acción rápida para ordenar o reproducir.

---

## 3. Plan de Verificación

1. **Pruebas de Compilación y Tipado**:
   - Ejecutar co-validación con `compile_applet` y `lint_applet` para garantizar 0 errores de TypeScript y 0 errores de ESLint.
2. **Verificación de Viewports Móviles**:
   - iPhone SE / pantallas pequeñas (360px - 375px): Verificar que no haya desbordamiento horizontal (`overflow-x`) y que todos los textos se lean con claridad.
   - Teléfonos modernos (390px - 430px): Comprobar el ajuste perfecto de 100dvh, la viñeta cinematográfica y el clearance de la barra inferior.
   - Vista escritorio: Asegurar que el marco de teléfono de lujo centrado conserve su elegancia sin estirar los videos.
3. **Pruebas de Gestos y Táctil**:
   - Verificar apertura y cierre de las hojas inferiores (Bottom Sheets).
   - Verificar doble-tap en los videos del feed y fluidez del snap vertical.
