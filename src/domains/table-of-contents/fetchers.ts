import { API } from '../../api'
import type { ContentsResponse } from './schemas'

export const getContents = async () => {
  return API.get<ContentsResponse>('/api/almanac/contents')
}
