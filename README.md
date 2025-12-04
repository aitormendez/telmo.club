# telmo.club (Astro)

Reconstrucción estática de telmo.club en Astro, manteniendo la estética minimalista.

## Estado y colecciones
- Integraciones: Tailwind 4 (`astro add tailwind`), sitemap, MDX, GSAP. Fuentes Garagord/Dino en `public/fonts`, importadas desde `src/styles/app.css`.
- Layout global (`SiteLayout`): cabecera + menú hamburguesa con overlay animado (GSAP) y enlaces a merz, mapa, conversaciones, historias, projects, ¿qué?.
- Conversaciones: MDX en `src/content/dialogos/dialogo-0001…` (dob 2013-02-16 para calcular edad). Listado en `src/pages/conversaciones/index.astro`, singles en `src/pages/[slug].astro`.
- Merz: cada entrada co-ubicada en `src/content/merz/<slug>/` con imágenes locales (`thumbnail: "./archivo.ext"`). Portada en mosaico filtrable (`src/pages/merz/index.astro`), singles con imagen hero, meta y mapa Leaflet opcional.
- Historias: co-ubicadas en `src/content/historias/<slug>/` (contenido original, comentarios omitidos). Listado simple en `src/pages/historias/index.astro`, singles en `src/pages/historias/[slug].astro`. Audio player (Vidstack web components) en `la-tarara-para-telmo`.
- Projects: co-ubicados en `src/content/projects/<slug>/` con thumbs locales (`./`). Portada mosaico en `src/pages/projects/index.astro`, singles en `src/pages/projects/[slug].astro`. Binarios grandes siguen enlazados (Thingiverse/zips en `public/uploads`).
- ¿Qué?: página estática `src/pages/que.astro` con contenido explicativo.
- Mapas: componente `LeafletMap.astro` + `src/scripts/leaflet-map.ts` (Stadia watercolor tiles con `PUBLIC_STADIA_API_KEY`, fallback OSM, modo fullscreen). Mapa general en `src/pages/mapa.astro` y mapas en merz individuales.

## Estructura relevante
- `src/content/` — colecciones: dialogos, merz, historias, projects, sitePages. Merz/historias/projects co-ubican imágenes en su carpeta.
- `src/layouts/` — `SiteLayout`.
- `src/components/` — `LeafletMap`, `VideoPlayer` (vidstack), `AudioPlayer` (vidstack web components).
- `src/pages/` — home, conversaciones, merz, mapa, historias, projects, ¿qué?, rutas dinámicas de diálogos/merz/historias/projects.
- `public/` — SVG heredados (telmo.svg, menú/cerrar, dash-gray), audios, y cualquier binario pesado que no se procese (p.ej. zips STL).
- `backup/` (fuera de `site/`) — export WP/ACF, uploads, proyecto Bedrock para consulta (tipografías, SVG, etc.).

## Uso
```bash
npm install
npm run dev     # desarrollo en localhost:4321
npm run build   # genera dist estático
npm run preview # sirve el build generado
```

Variables:
- `PUBLIC_STADIA_API_KEY` para tiles Stamen vía Stadia Maps.

Notas de imágenes:
- Preferencia por co-ubicación en `src/content/<coleccion>/<slug>/` y usar rutas relativas `./` en frontmatter/contenido; `astro:assets` genera las optimizaciones. Colocar en `public/` solo binarios pesados o no procesables. Images en conversaciones se dejaron como sólo texto (sin migrar media).*** End Patch Or cancel?
