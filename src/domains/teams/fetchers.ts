import { API } from '../../api'
import { teamResponseSchema, teamsResponseSchema } from './schemas'
import type { TeamResponse, TeamsResponse } from './schemas'

export const getTeams = async () => {
  const response = await API.get<TeamsResponse>('/api/almanac/national-teams')

  return teamsResponseSchema.parse(response)
}

export const getTeam = async (teamCode: string) => {
  const response = await API.get<TeamResponse>(
    `/api/almanac/national-teams/${teamCode}`,
  )

  return teamResponseSchema.parse(response)
}
