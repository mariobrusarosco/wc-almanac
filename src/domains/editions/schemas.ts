import { z } from 'zod'

const editionNavigationItemSchema = z.object({
  year: z.number().int(),
  path: z.string(),
  hostDisplayName: z.string(),
})

export const editionsResponseSchema = z.object({
  editions: z.array(
    z.object({
      id: z.string().uuid(),
      year: z.number().int(),
      path: z.string(),
      pageNumber: z.number().int(),
      host: z.object({
        displayName: z.string(),
        flagUrl: z.string().nullable(),
      }),
    }),
  ),
})

export type EditionsResponse = z.infer<typeof editionsResponseSchema>

export const editionResponseSchema = z.object({
  edition: z.object({
    id: z.string().uuid(),
    year: z.number().int(),
    name: z.string(),
    pageNumber: z.number().int(),
    host: z.object({
      displayName: z.string(),
    }),
    visualIdentity: z.object({
      logoUrl: z.string(),
      trophyUrl: z.string(),
      accentColor: z.string(),
      accentTextColor: z.string(),
      spineColor: z.string(),
    }),
    navigation: z.object({
      previous: editionNavigationItemSchema.nullable(),
      next: editionNavigationItemSchema.nullable(),
    }),
  }),
})

export type EditionResponse = z.infer<typeof editionResponseSchema>
