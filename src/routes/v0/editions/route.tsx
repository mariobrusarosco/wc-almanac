import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/v0/editions')({
  component: Outlet,
})
