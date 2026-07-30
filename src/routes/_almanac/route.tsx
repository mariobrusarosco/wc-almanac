import { createFileRoute, useMatchRoute } from '@tanstack/react-router'
import { EditionLayout } from '../../domains/editions/edition-layout'
import { AlmanacLayout } from '../../domains/shared/layouts/almanac-layout'
import { TeamLayout } from '../../domains/teams/team-layout'

export const Route = createFileRoute('/_almanac')({
  component: AlmanacLayoutSelector,
})

function AlmanacLayoutSelector() {
  const matchRoute = useMatchRoute()
  const teamParams = matchRoute({ to: '/teams/$teamCode' })
  const editionParams = matchRoute({ to: '/editions/$year' })

  // if (teamParams) {
  //   return <TeamLayout teamCode={teamParams.teamCode} />
  // }

  // if (editionParams) {
  //   return <EditionLayout year={editionParams.year} />
  // }

  return <AlmanacLayout />
}
