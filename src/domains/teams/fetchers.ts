import { API } from '../../api'
import { teamsResponseSchema } from './schemas'

export const getTeams = async () => {
  const response = await API.get('/api/almanac/teams')

  return teamsResponseSchema.parse(response)
}
