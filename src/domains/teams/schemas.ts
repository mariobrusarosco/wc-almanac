import { z } from 'zod'

const teamNavigationItemSchema = z.object({
  name: z.string(),
  path: z.string(),
})

const teamSummarySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  path: z.string(),
  pageNumber: z.number().int(),
  flagUrl: z.string().nullable(),
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

export const teamResponseSchema = z.object({
  team: z.object({
    name: z.string(),
    navigation: z.object({
      previous: teamNavigationItemSchema.nullable(),
      next: teamNavigationItemSchema.nullable(),
    }),
  }),
})

export type TeamResponse = z.infer<typeof teamResponseSchema>
