import { z } from 'zod'

export const contentsResponseSchema = z.object({
  contents: z.array(
    z.object({
      label: z.string(),
      path: z.string(),
      pageNumber: z.number().int(),
    }),
  ),
})

export type ContentsResponse = z.infer<typeof contentsResponseSchema>
