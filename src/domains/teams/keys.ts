export const teamsKey = ['teams'] as const

export const teamKey = (teamCode: string) => ['team', { teamCode }] as const
