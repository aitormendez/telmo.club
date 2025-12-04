import { defineCollection, z } from "astro:content";

const imageMeta = z
  .object({
    src: z.string(),
    width: z.number(),
    height: z.number(),
    format: z.string(),
  })
  .passthrough();

const merz = defineCollection({
  type: "content",
  slug: ({ id }) => {
    const parts = id
      .replace(/^merz\//, "")
      .replace(/\.mdx?$/, "")
      .split("/");
    // Usamos la carpeta como slug para evitar colisiones entre archivos
    return parts[0] || id.replace(/\.mdx?$/, "");
  },
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(), // ACF `fecha` formato Ymd
    lugar: z.string().optional(),
    mapa: z
      .object({
        address: z.string().optional(),
        lat: z.coerce.number().optional(),
        lng: z.coerce.number().optional(),
      })
      .optional(),
    tags: z.array(z.string()).default([]),
    // Permitimos tanto ImageMetadata como rutas string existentes
    thumbnail: z.union([imageMeta, z.string()]).optional(),
  }),
});

const dialogos = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(), // ACF `fecha_conversacion` formato Ymd
  }),
});

const historias = defineCollection({
  type: "content",
  slug: ({ id }) => {
    const parts = id
      .replace(/^historias\//, "")
      .replace(/\.mdx?$/, "")
      .split("/");
    return parts[0] || id.replace(/\.mdx?$/, "");
  },
  schema: z.object({
    title: z.string(),
    date: z.coerce.date().optional(), // usa post_date si hace falta ordenar
  }),
});

const projects = defineCollection({
  type: "content",
  slug: ({ id }) => {
    const parts = id
      .replace(/^projects\//, "")
      .replace(/\.mdx?$/, "")
      .split("/");
    return parts[0] || id.replace(/\.mdx?$/, "");
  },
  schema: z.object({
    title: z.string(),
    date: z.coerce.date().optional(),
    thumbnail: z.union([imageMeta, z.string()]).optional(),
  }),
});

const sitePages = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
  }),
});

export const collections = { merz, dialogos, historias, projects, sitePages };
