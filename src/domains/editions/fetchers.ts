import { API } from '../../api'
import { editionResponseSchema, editionsResponseSchema } from './schemas'
import type { EditionResponse, EditionsResponse } from './schemas'

export const getEditions = async () => {
  const response = await API.get<EditionsResponse>('/api/almanac/editions')

  return editionsResponseSchema.parse(response)
}

export const getEdition = async (year: string) => {
  const response = await API.get<EditionResponse>(`/api/almanac/editions/${year}`)

  return editionResponseSchema.parse(response)
}
