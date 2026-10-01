import { API } from '../../api'
import { contentsResponseSchema } from './schemas'
import type { ContentsResponse } from './schemas'

export const getContents = async () => {
  const response = await API.get<ContentsResponse>('/api/almanac/contents')

  return contentsResponseSchema.parse(response)
}
