import { createFileRoute } from '@tanstack/react-router'
import SquadsScreen from '../../../domains/poc-button-football/screens/squads/SquadsScreen'

export const Route = createFileRoute('/v0/squads/')({
  component: SquadsScreen,
})
