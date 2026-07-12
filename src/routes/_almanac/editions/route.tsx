import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_almanac/editions')({
  component: Outlet,
})
