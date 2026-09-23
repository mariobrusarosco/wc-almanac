import { Outlet, useMatchRoute } from '@tanstack/react-router'
import { AlmanacSidebar } from '../components/almanac-sidebar'

export const AlmanacLayout = () => {
    const matchRoute = useMatchRoute()
    const teamParams = matchRoute({ to: '/teams/$teamCode' })
    const editionParams = matchRoute({ to: '/editions/$year' })
  

  console.log({ teamParams, editionParams})
    
  return (
    <main className="grid min-h-svh w-full grid-cols-[88px_minmax(0,1fr)] bg-paper">
      <AlmanacSidebar showVersion />

      <div className="h-screen overflow-y-auto">
        <Outlet />
      </div>
    </main>
  )
}
