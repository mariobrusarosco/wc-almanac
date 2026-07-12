import { createFileRoute } from '@tanstack/react-router'
import { TeamScreen } from '../../../domains/teams/team-screen'

export const Route = createFileRoute('/_almanac/teams/$teamCode')({
  component: TeamRoute,
})

function TeamRoute() {
  const { teamCode } = Route.useParams()

  return <TeamScreen teamCode={teamCode} />
}
