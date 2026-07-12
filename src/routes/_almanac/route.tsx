import { createFileRoute } from '@tanstack/react-router'
import { AlmanacLayout } from '../../domains/shared/layouts/almanac-layout'

export const Route = createFileRoute('/_almanac')({
  component: AlmanacLayout,
})
