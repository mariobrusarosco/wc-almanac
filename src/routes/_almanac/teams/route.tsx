import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_almanac/teams')({
  component: Outlet,
})
