export const editionsKey = ['editions'] as const

export const editionKey = (year: string) => ['edition', { year }] as const
