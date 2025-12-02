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
    thumbnail: z.string().optional(), // ruta pública a la imagen
  }),
});

const dialogos = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(), // ACF `fecha_conversacion` formato Ymd
  }),
});

const cuentos = defineCollection({
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
  }),
});

const sitePages = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
  }),
});

export const collections = { merz, dialogos, cuentos, projects, sitePages };
