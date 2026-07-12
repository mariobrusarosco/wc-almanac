import { API } from '../../api'
import { editionsResponseSchema } from './schemas'

export const getEditions = async () => {
  const response = await API.get('/api/almanac/editions')

  return editionsResponseSchema.parse(response)
}
