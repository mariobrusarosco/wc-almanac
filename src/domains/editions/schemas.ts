import { z } from 'zod'

const editionNavigationItemSchema = z.object({
  year: z.number().int(),
  path: z.string(),
  hostDisplayName: z.string(),
})

const editionPlacementSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  code: z.string(),
})

export const editionsResponseSchema = z.object({
  editions: z.array(
    z.object({
      id: z.string().uuid(),
      year: z.number().int(),
      path: z.string(),
      pageNumber: z.number().int(),
      displayName: z.string(),
      logoUrl: z.string(),

    }),
  ),
})

export type EditionsResponse = z.infer<typeof editionsResponseSchema>
export type EditionSummary = EditionsResponse['editions'][number]

export const editionResponseSchema = z.object({
  edition: z.object({
    id: z.string().uuid(),
    year: z.number().int(),
    startDate: z.string(),
    endDate: z.string(),
    participantCount: z.number().int(),
    pageNumber: z.number().int(),
    displayName: z.string(),
    visualIdentity: z.object({
      logoUrl: z.string(),
      trophyUrl: z.string().nullable(),
      accentColor: z.string(),
      accentTextColor: z.string(),
      spineColor: z.string(),
    }),
    placements: z.object({
      first: editionPlacementSchema,
      second: editionPlacementSchema,
      third: editionPlacementSchema,
      fourth: editionPlacementSchema,
    }),
    navigation: z.object({
      previous: editionNavigationItemSchema.nullable(),
      next: editionNavigationItemSchema.nullable(),
    }),
  }),
})

export type EditionResponse = z.infer<typeof editionResponseSchema>
