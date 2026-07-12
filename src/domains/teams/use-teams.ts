import { useQuery } from '@tanstack/react-query'
import { getTeams } from './fetchers'
import { teamsKey } from './keys'

export const useTeams = () => {
  return useQuery({
    queryKey: teamsKey,
    queryFn: getTeams,
  })
}
