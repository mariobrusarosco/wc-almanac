import { createFileRoute } from '@tanstack/react-router'
import { AboutScreen } from '../../domains/about/screen'

export const Route = createFileRoute('/_almanac/about')({
  component: AboutScreen,
})
