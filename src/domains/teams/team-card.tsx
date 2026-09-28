import { Link } from '@tanstack/react-router'
import type { TeamSummary } from './schemas'

type TeamCardProps = {
  team: TeamSummary
}

export const TeamCard = ({ team }: TeamCardProps) => {
  const teamSlug = team.path.replace('/teams/', '')

  return (
    <li data-ui="team-card" className="min-[128px]">
      <Link
        to="/teams/$teamCode"
        params={{ teamCode: teamSlug }}
        className="flex items-center gap-6 justify-start relative block py-4"
      >
        <img
          src={team.flagUrl}
          alt={`${team.name} flag`}
          width={42}
          height={42}
          loading="lazy"
          decoding="async"
          className="rounded-lg"
        />
        <p className="text-4xl font-semibold ">{team.name}</p>

        <p className="ml-6 font-bold text-xl">{team.pageNumber}</p>
      </Link>
    </li>
  )
}
