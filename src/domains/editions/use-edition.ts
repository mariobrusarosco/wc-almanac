import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getEdition } from './fetchers'
import { editionKey } from './keys'

export const useEdition = (year: string) => {
  const queryClient = useQueryClient()
  const isThisEditionOnCache = !!queryClient.getQueryData(editionKey(year))

  return useQuery({
    queryKey: editionKey(year),
    queryFn: () => getEdition(year),
    enabled: !!year && !isThisEditionOnCache
  })
}
