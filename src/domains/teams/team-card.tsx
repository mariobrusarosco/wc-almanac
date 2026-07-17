import { Link } from '@tanstack/react-router'
import type { TeamsResponse } from './schemas'

type TeamCardProps = {
  team: TeamsResponse['teams'][number]
}

export const TeamCard = ({ team }: TeamCardProps) => {
  return (
    <li data-ui="team-card" className="min-[128px]">
      <Link
        to="/teams/$teamCode"
        params={{ teamCode: team.code.toLowerCase() }}
        className="flex items-center gap-6 justify-start relative block py-4"
      >
        <img
          src={team.flagUrl}
          alt={`${team.displayName} flag`}
          width={42}
          height={42}
          loading="lazy"
          decoding="async"
          className="rounded-lg"
        />
        <p className="text-4xl font-semibold ">{team.displayName}</p>

        <p className="ml-6 font-bold text-xl">{team.pageNumber}</p>
      </Link>
    </li>
  )
}
