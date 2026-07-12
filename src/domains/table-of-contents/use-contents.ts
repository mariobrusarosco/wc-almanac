import { useQuery } from '@tanstack/react-query'
import { getContents } from './fetchers'
import { contentsKey } from './keys'

export const useContents = () => {
  return useQuery({
    queryKey: contentsKey,
    queryFn: getContents,
  })
}
