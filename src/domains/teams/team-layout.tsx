import { Outlet } from '@tanstack/react-router'
import { AlmanacSidebar } from '../shared/components/almanac-sidebar'
import { useTeams } from './use-teams'

type TeamLayoutProps = {
  teamCode: string
}

export const TeamLayout = ({ teamCode }: TeamLayoutProps) => {
  const { data } = useTeams()
  const team = data?.teams.find(
    ({ code }) => code === teamCode.toUpperCase(),
  )

  return (
    <main className="grid min-h-svh w-full grid-cols-[88px_minmax(0,1fr)] bg-paper">
      <AlmanacSidebar
        logo={
          team
            ? {
                alt: `${team.displayName} flag`,
                src: team.flagUrl,
              }
            : undefined
        }
      />
      <div className="h-screen overflow-y-auto">
        <Outlet />
      </div>
    </main>
  )
}
