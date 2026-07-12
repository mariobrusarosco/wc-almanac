import { z } from 'zod'

export const teamsResponseSchema = z.object({
  teams: z.array(
    z.object({
      id: z.string().uuid(),
      code: z.string(),
      displayName: z.string(),
      path: z.string(),
      pageNumber: z.number().int(),
      flagUrl: z.string(),
    }),
  ),
})

export type TeamsResponse = z.infer<typeof teamsResponseSchema>
