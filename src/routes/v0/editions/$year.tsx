import { createFileRoute } from '@tanstack/react-router'
import EditionDetailScreen from '../../../domains/poc-button-football/screens/edition-detail/EditionDetailScreen'

export const Route = createFileRoute('/v0/editions/$year')({
  component: RouteComponent,
})

function RouteComponent() {
  const { year } = Route.useParams()

  return <EditionDetailScreen year={Number(year)} />
}
