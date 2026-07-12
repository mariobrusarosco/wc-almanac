import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/v0/squads')({
  component: Outlet,
})
