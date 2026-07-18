const API_URL = import.meta.env.VITE_ALMANAC_API

export class ApiError extends Error {
  readonly body: unknown
  readonly status: number
  readonly url: string

  constructor(response: Response, body: unknown) {
    super(`API request failed: ${response.status} ${response.statusText}`)

    this.name = 'ApiError'
    this.body = body
    this.status = response.status
    this.url = response.url
  }
}

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: 'omit',
  })

  if (!response.ok) {
    const body: unknown = await response.json().catch(() => null)

    throw new ApiError(response, body)
  }

  const data: T = await response.json()

  return data
}

export const API = {
  get: apiGet,
}
