import { useQuery } from '@tanstack/react-query'
import { getEdition } from './fetchers'
import { editionKey } from './keys'

export const useEdition = (year: string) => {
  return useQuery({
    queryKey: editionKey(year),
    queryFn: () => getEdition(year),
  })
}
