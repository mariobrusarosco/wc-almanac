import { createFileRoute } from '@tanstack/react-router'
import EditionsScreen from '../../../domains/poc-button-football/screens/editions/EditionsScreen'

export const Route = createFileRoute('/v0/editions/')({
  component: EditionsScreen,
})
