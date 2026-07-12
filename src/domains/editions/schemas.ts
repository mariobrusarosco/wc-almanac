import { z } from 'zod'

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
