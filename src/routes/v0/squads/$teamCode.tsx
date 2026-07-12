import { createFileRoute } from '@tanstack/react-router'
import TeamOverviewScreen from '../../../domains/poc-button-football/screens/team-overview/TeamOverviewScreen'

export const Route = createFileRoute('/v0/squads/$teamCode')({
  component: RouteComponent,
})

function RouteComponent() {
  const { teamCode } = Route.useParams()

  return <TeamOverviewScreen teamCode={teamCode} />
}
