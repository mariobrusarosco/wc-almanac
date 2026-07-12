import { createFileRoute } from '@tanstack/react-router'
import PocButtonFootballApp from '../../../../domains/poc-button-football/App'
import type { PlayerPositionFilter } from '../../../../domains/poc-button-football/types'

const positionFilters = new Set<PlayerPositionFilter>([
  'goalkeeper',
  'defense',
  'midfield',
  'attack',
])

export const Route = createFileRoute('/v0/$year/$teamCode')({
  validateSearch: (search: Record<string, unknown>): { position?: PlayerPositionFilter } => ({
    position: parsePositionFilter(search.position),
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { year, teamCode } = Route.useParams()
  const { position } = Route.useSearch()

  return <PocButtonFootballApp year={Number(year)} teamCode={teamCode} selectedPosition={position} />
}

function parsePositionFilter(value: unknown) {
  return typeof value === 'string' && positionFilters.has(value as PlayerPositionFilter)
    ? (value as PlayerPositionFilter)
    : undefined
}
