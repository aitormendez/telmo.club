# telmo.club (Astro)

Reconstrucción estática del sitio telmo.club usando Astro. El proyecto reemplaza el WordPress anterior manteniendo la estética minimalista y los contenidos (diálogos, merz, cuentos, proyectos, páginas).

## Estado actual
- Integraciones: sitemap, Tailwind 4 (`@tailwindcss/vite`), MDX, GSAP.
- Tipografías: Garagord y Dino copiadas a `public/fonts`, importadas vía `src/styles/app.css`.
- Layout global (`SiteLayout`): cabecera con marca y menú hamburguesa, overlay de navegación animado (GSAP) con enlaces a merz, mapa, conversaciones, historias, projects, ¿qué?.
- Home: muestra la ilustración `/svg/telmo.svg` y usa `SiteLayout`.
- Conversaciones:
  - Contenido en `src/content/dialogos/dialogo-0001…0250.mdx` (importado del export WP) con `title` y `date`.
  - Listado en `src/pages/conversaciones/index.astro`: agrupa por mes/año, calcula la edad de Telmo (dob 2013-02-16), separadores discontinuos (SVG `dash-gray.svg`), títulos enlazan al diálogo.
  - Cada diálogo se renderiza en `src/pages/[slug].astro` con `SiteLayout`.
- Estilos globales: `src/styles/app.css` importa `theme.css` (line-height ajustados), `fonts.css`, `global.css`; utilitario `.dash-line` para líneas discontinuas configurable con `--dash-gap`/`--dash-height`.

## Estructura
- `src/content/` — colecciones (dialogos, merz, cuentos, projects, sitePages).
- `src/layouts/` — `SiteLayout` (cabecera + menú), `Column` (no usado actualmente).
- `src/pages/` — home, listado de conversaciones, ruta dinámica de diálogos.
- `public/svg/` — assets del tema antiguo: telmo.svg, menú/cerrar, dashed/dash-gray.
- `backup/` — export WP, ACF, uploads (fuera del repo).

## Comandos
```bash
npm install
npm run dev     # desarrollo en localhost:4321
npm run build   # genera dist estático
npm run preview # sirve el build
```

## Notas pendientes
- Migrar merz, cuentos, projects y páginas estáticas a las colecciones con sus vistas.
- Manejo de imágenes: copiar originales a `public/uploads` y usar `astro:assets`/`<Image>` si se quieren variantes responsivas.
