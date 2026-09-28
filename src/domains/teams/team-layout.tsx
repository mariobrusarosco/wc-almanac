import { Outlet } from '@tanstack/react-router'
import { AlmanacSidebar } from '../shared/components/almanac-sidebar'
import { useTeams } from './use-teams'

type TeamLayoutProps = {
  teamCode: string
}

export const TeamLayout = ({ teamCode }: TeamLayoutProps) => {
  const { data } = useTeams()
  const team = data?.nationalTeams.find(
    ({ path }) => path === `/teams/${teamCode}`,
  )

  return (
    <main className="grid min-h-svh w-full grid-cols-[88px_minmax(0,1fr)] bg-paper">
      <AlmanacSidebar
        accentColor={team?.visualIdentity.accentColor}
        accentTextColor={team?.visualIdentity.accentTextColor}
        backgroundColor={team?.visualIdentity.spineColor}
        logo={
          team
            ? {
                alt: `${team.name} badge`,
                src: team.visualIdentity.badgeUrl,
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
