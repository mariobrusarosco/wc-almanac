import { createFileRoute } from '@tanstack/react-router'
import { EditionScreen } from '../../../domains/editions/edition-screen'

export const Route = createFileRoute('/_almanac/editions/$year')({
  component: EditionRoute,
})

function EditionRoute() {
  const { year } = Route.useParams()

  return <EditionScreen year={year} />
}
