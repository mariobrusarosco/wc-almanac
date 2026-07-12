import { API } from '../../api'
import { editionResponseSchema, editionsResponseSchema } from './schemas'

export const getEditions = async () => {
  const response = await API.get('/api/almanac/editions')

  return editionsResponseSchema.parse(response)
}

export const getEdition = async (year: string) => {
  const response = await API.get(`/api/almanac/editions/${year}`)

  return editionResponseSchema.parse(response)
}
