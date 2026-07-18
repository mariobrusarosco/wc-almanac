import { API } from '../../api'
import type { TeamsResponse } from './schemas'

export const getTeams = async () => {
  return API.get<TeamsResponse>('/api/almanac/teams')
}
