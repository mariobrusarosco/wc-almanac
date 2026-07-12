import { createFileRoute } from '@tanstack/react-router'
import { EditionsScreen } from '../../domains/editions/screen'

export const Route = createFileRoute('/_almanac/editions')({
  component: EditionsScreen,
})
