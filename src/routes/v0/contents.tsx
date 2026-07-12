import { createFileRoute } from '@tanstack/react-router'
import TableOfContentsScreen from '../../domains/poc-button-football/screens/table-of-contents/TableOfContentsScreen'

export const Route = createFileRoute('/v0/contents')({
  component: TableOfContentsScreen,
})
