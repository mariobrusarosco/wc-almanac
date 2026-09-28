import { z } from 'zod'

const teamSummarySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  path: z.string(),
  pageNumber: z.number().int(),
  flagUrl: z.string(),
  associationAcronym: z.string().nullable(),
  visualIdentity: z.object({
    badgeUrl: z.string(),
    accentColor: z.string(),
    accentTextColor: z.string(),
    spineColor: z.string(),
  }),
})

export const teamsResponseSchema = z.object({
  nationalTeams: z.array(teamSummarySchema),
})

export type TeamsResponse = z.infer<typeof teamsResponseSchema>
export type TeamSummary = TeamsResponse['nationalTeams'][number]
