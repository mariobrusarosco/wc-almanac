import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getTeam } from './fetchers'
import { teamKey } from './keys'

export const useTeam = (teamCode: string) => {
  const queryClient = useQueryClient()
  const isThisTeamOnCache = !!queryClient.getQueryData(teamKey(teamCode))

  return useQuery({
    queryKey: teamKey(teamCode),
    queryFn: () => getTeam(teamCode),
    enabled: !!teamCode && !isThisTeamOnCache,
  })
}
