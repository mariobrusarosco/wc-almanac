import { createFileRoute } from '@tanstack/react-router'
import { TableOfContentsScreen } from '../../domains/table-of-contents/screen'

export const Route = createFileRoute('/_almanac/table-of-contents')({
  component: TableOfContentsScreen,
})
