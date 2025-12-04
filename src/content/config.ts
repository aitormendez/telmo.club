import { defineCollection, z } from "astro:content";

const merz = defineCollection({
  type: "content",
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
    // Permitimos tanto ImageMetadata (en src/uploads/...) como rutas string existentes
    thumbnail: z
      .union([
        z
          .object({
            src: z.string(),
            width: z.number(),
            height: z.number(),
            format: z.string(),
          })
          .passthrough(),
        z.string(),
      ])
      .optional(),
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
  schema: z.object({
    title: z.string(),
    date: z.coerce.date().optional(), // usa post_date si hace falta ordenar
  }),
});

const projects = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.coerce.date().optional(),
    thumbnail: z
      .union([
        z
          .object({
            src: z.string(),
            width: z.number(),
            height: z.number(),
            format: z.string(),
          })
          .passthrough(),
        z.string(),
      ])
      .optional(),
  }),
});

const sitePages = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
  }),
});

export const collections = { merz, dialogos, historias, projects, sitePages };
