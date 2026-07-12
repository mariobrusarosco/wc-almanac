import { API } from '../../api'
import { contentsResponseSchema } from './schemas'

export const getContents = async () => {
  const response = await API.get('/api/almanac/contents')

  return contentsResponseSchema.parse(response)
}
