import { createFileRoute } from '@tanstack/react-router'
import { CoverScreen } from '../domains/cover/screen'

export const Route = createFileRoute('/')({
  component: CoverScreen,
})
