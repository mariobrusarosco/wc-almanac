import { API } from '../../api'
import type { EditionResponse, EditionsResponse } from './schemas'

export const getEditions = async () => {
  return API.get<EditionsResponse>('/api/almanac/editions')
}

export const getEdition = async (year: string) => {
  return API.get<EditionResponse>(`/api/almanac/editions/${year}`)
}
