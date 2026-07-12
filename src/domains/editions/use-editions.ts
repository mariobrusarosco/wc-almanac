import { useQuery } from '@tanstack/react-query'
import { getEditions } from './fetchers'
import { editionsKey } from './keys'

export const useEditions = () => {
  return useQuery({
    queryKey: editionsKey,
    queryFn: getEditions,
  })
}
