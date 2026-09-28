import { API } from '../../api'
import { teamsResponseSchema } from './schemas'

export const getTeams = async () => {
  const response = await API.get<unknown>('/api/almanac/national-teams')

  return teamsResponseSchema.parse(response)
}
