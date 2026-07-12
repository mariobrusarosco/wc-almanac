import { Link } from '@tanstack/react-router'
import { useTeams } from './use-teams'

export const TeamsScreen = () => {
  const { data, isError, isPending } = useTeams()

  return (
    <section className="min-h-svh w-full bg-paper px-10 py-12 font-display text-ink">
      <h1 className="w-fit border-4 border-ink p-6 text-6xl font-semibold uppercase">
        Teams
      </h1>

      {isPending && <p className="mt-8 text-2xl">Loading teams...</p>}

      {isError && <p className="mt-8 text-2xl">Unable to load teams.</p>}

      {data && (
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.teams.map((team) => (
            <li key={team.id} className="border-2 border-ink">
              <Link
                to="/teams/$teamCode"
                params={{ teamCode: team.code.toLowerCase() }}
                className="block p-6"
              >
                <img
                  src={team.flagUrl}
                  alt={`${team.displayName} flag`}
                  className="mb-5 h-12 w-16 object-contain"
                />
                <p className="text-4xl font-semibold">{team.displayName}</p>
                <p className="mt-2 text-xl">{team.code}</p>
                <p className="mt-1 text-lg">Page {team.pageNumber}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
