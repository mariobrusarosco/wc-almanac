import { createFileRoute } from '@tanstack/react-router'
import PocHomeScreen from '../../domains/poc-button-football/screens/home/PocHomeScreen'

export const Route = createFileRoute('/v0/')({
  component: PocHomeScreen,
})
