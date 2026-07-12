import { Outlet } from '@tanstack/react-router'
import { AlmanacSidebar } from '../components/almanac-sidebar'

export const AlmanacLayout = () => {
  return (
    <main className="grid min-h-svh w-full grid-cols-[88px_minmax(0,1fr)] bg-paper">
      <AlmanacSidebar showVersion />
      <div className="min-w-0">
        <Outlet />
      </div>
    </main>
  )
}
