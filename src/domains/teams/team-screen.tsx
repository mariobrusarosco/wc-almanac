import { useTeams } from './use-teams'

type TeamScreenProps = {
  teamCode: string
}

export const TeamScreen = ({ teamCode }: TeamScreenProps) => {
  const { data, isError, isPending } = useTeams()
  const team = data?.teams.find(
    ({ code }) => code === teamCode.toUpperCase(),
  )

  return (
    <section className="min-h-svh w-full bg-paper px-10 py-12 font-display text-ink">
      {isPending && <p className="text-2xl">Loading team...</p>}

      {isError && <p className="text-2xl">Unable to load team.</p>}

      {data && !team && <p className="text-2xl">Team not found.</p>}

      {team && (
        <>
          <h1 className="w-fit border-4 border-ink p-6 text-6xl font-semibold uppercase">
            {team.displayName}
          </h1>
          <p className="mt-8 text-3xl">{team.code}</p>
          <p className="mt-2 text-xl">Page {team.pageNumber}</p>
        </>
      )}
    </section>
  )
}
