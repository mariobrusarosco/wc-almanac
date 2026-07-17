import { TeamCard } from './team-card'
import { useTeams } from './use-teams'

export const TeamsScreen = () => {
  const { data, isError, isPending } = useTeams()

  return (
    <section className="min-h-svh w-full bg-paper px-10 py-12 font-display text-ink overflow-y-auto">
      <h1 className="w-fit text-8xl font-semibold uppercase">
        Teams
      </h1>

      {isPending && <p className="mt-8 text-2xl">Loading teams...</p>}

      {isError && <p className="mt-8 text-2xl">Unable to load teams.</p>}

      {data && (
        <ul className="mt-20 grid gap-y-16 gap-x-6 md:grid-cols-2">
          {data.teams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </ul>
      )}
    </section>
  )
}
