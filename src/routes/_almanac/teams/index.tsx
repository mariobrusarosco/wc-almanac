import { createFileRoute } from '@tanstack/react-router'
import { TeamsScreen } from '../../../domains/teams/screen'

export const Route = createFileRoute('/_almanac/teams/')({
  component: TeamsScreen,
})
