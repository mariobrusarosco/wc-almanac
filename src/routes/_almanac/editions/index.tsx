import { createFileRoute } from '@tanstack/react-router'
import { EditionsScreen } from '../../../domains/editions/screens/main'

export const Route = createFileRoute('/_almanac/editions/')({
  component: EditionsScreen,
})
