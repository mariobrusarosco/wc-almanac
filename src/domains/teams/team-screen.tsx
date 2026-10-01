import { useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import brazilBadge from '../poc-button-football/assets/team-BRA.svg'
import { getTeam } from './fetchers'
import { teamKey } from './keys'
import { useTeam } from './use-team'
import { useTeams } from './use-teams'

type TeamScreenProps = {
  teamCode: string
}

const teamProfile = {
  appearances: 22,
  titles: [1958, 1962, 1970, 1994, 2002],
  goals: 237,
  wins: 76,
  draws: 19,
  losses: 19,
  topScorer: 'Ronaldo',
  mostAssists: 'Pelé',
  editions: [
    {
      year: 1994,
      host: 'USA',
      primaryColor: '#b73135',
      secondaryColor: '#151b38',
      goalsAllowed: 3,
      finish: 'Champions',
      goalkeeper: 'Taffarel',
    },
    {
      year: 1998,
      host: 'FRA',
      primaryColor: '#175aa7',
      secondaryColor: '#ef3f4b',
      goalsAllowed: 10,
      finish: 'Runners-up',
      goalkeeper: 'Taffarel',
    },
    {
      year: 2002,
      host: 'KOR · JPN',
      primaryColor: '#e6323b',
      secondaryColor: '#1956a4',
      goalsAllowed: 4,
      finish: 'Champions',
      goalkeeper: 'Marcos',
    },
    {
      year: 2006,
      host: 'GER',
      primaryColor: '#191919',
      secondaryColor: '#d92d3d',
      goalsAllowed: 2,
      finish: 'Quarter-finals',
      goalkeeper: 'Dida',
    },
    {
      year: 2010,
      host: 'RSA',
      primaryColor: '#e4b400',
      secondaryColor: '#087a4b',
      goalsAllowed: 4,
      finish: 'Quarter-finals',
      goalkeeper: 'Júlio César',
    },
    {
      year: 2014,
      host: 'BRA',
      primaryColor: '#ffe600',
      secondaryColor: '#079447',
      goalsAllowed: 14,
      finish: 'Fourth place',
      goalkeeper: 'Júlio César',
    },
    {
      year: 2018,
      host: 'RUS',
      primaryColor: '#d52b1e',
      secondaryColor: '#174c95',
      goalsAllowed: 3,
      finish: 'Quarter-finals',
      goalkeeper: 'Alisson',
    },
    {
      year: 2022,
      host: 'QAT',
      primaryColor: '#8a1538',
      secondaryColor: '#d8b66a',
      goalsAllowed: 3,
      finish: 'Quarter-finals',
      goalkeeper: 'Alisson',
    },
  ],
} as const

type TeamEdition = (typeof teamProfile.editions)[number]
type TeamEditionYear = TeamEdition['year']

const toTeamParams = (path: string) => ({
  teamCode: path.replace('/teams/', ''),
})

const formatTeamName = (teamCode: string) => {
  return teamCode.replaceAll('-', ' ')
}

export const TeamScreen = ({ teamCode }: TeamScreenProps) => {
  const [selectedYear, setSelectedYear] = useState<TeamEditionYear>(2002)
  const queryClient = useQueryClient()
  const { data, isError, isPending } = useTeam(teamCode)
  const { data: teamsData } = useTeams()
  const team = data?.team
  const teamSummary = teamsData?.nationalTeams.find(
    ({ path }) => path === `/teams/${teamCode}`,
  )
  const teamName = team?.name ?? formatTeamName(teamCode)
  const badgeUrl = teamSummary?.visualIdentity.badgeUrl ?? brazilBadge
  const selectedEdition = teamProfile.editions.find(
    ({ year }) => year === selectedYear,
  ) ?? teamProfile.editions[0]

  useEffect(() => {
    const navigationItems = [
      team?.navigation.previous,
      team?.navigation.next,
    ]

    navigationItems.forEach((navigationItem) => {
      if (!navigationItem) {
        return
      }

      const navigationTeamCode = toTeamParams(navigationItem.path).teamCode
      const queryKey = teamKey(navigationTeamCode)

      if (queryClient.getQueryData(queryKey) === undefined) {
        void queryClient.prefetchQuery({
          queryKey,
          queryFn: () => getTeam(navigationTeamCode),
        })
      }
    })
  }, [queryClient, team?.navigation.next, team?.navigation.previous])

  return (
    <section className="grid min-h-svh w-full grid-cols-[56px_minmax(0,1fr)] bg-[#fbf8f7] font-display text-ink lg:grid-cols-[72px_minmax(0,1fr)]">
      <EditionRail
        onSelect={setSelectedYear}
        selectedEdition={selectedEdition}
      />

      <div className="min-w-0 px-4 py-8 sm:px-8 lg:px-10 lg:py-10 xl:px-14">
      {isPending && <p className="text-2xl">Loading team...</p>}

      {isError && <p className="text-2xl">Unable to load team.</p>}

      {team && (
        <>
      <nav
        aria-label={`${teamName} team navigation`}
        className="flex items-center justify-between text-sm font-semibold uppercase"
      >
        {team.navigation.previous ? (
          <Link
            className="group flex items-center gap-3 transition-opacity hover:opacity-55"
            params={toTeamParams(team.navigation.previous.path)}
            to="/teams/$teamCode"
          >
            <span aria-hidden="true" className="text-2xl leading-none transition-transform group-hover:-translate-x-1">
              ←
            </span>
            <span>{team.navigation.previous.name}</span>
          </Link>
        ) : (
          <span />
        )}

        {team.navigation.next ? (
          <Link
            className="group flex items-center gap-3 transition-opacity hover:opacity-55"
            params={toTeamParams(team.navigation.next.path)}
            to="/teams/$teamCode"
          >
            <span>{team.navigation.next.name}</span>
            <span aria-hidden="true" className="text-2xl leading-none transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        ) : (
          <span />
        )}
      </nav>

      <header className="mt-7 flex flex-wrap items-end justify-between gap-x-8 gap-y-5 border-b-2 border-ink pb-5 lg:mt-9">
        <div className="flex min-w-0 items-end gap-3 sm:gap-7">
          <h1 className="text-[clamp(3rem,14vw,4.5rem)] font-semibold uppercase leading-[0.82] tracking-[-0.025em] sm:text-[clamp(4.5rem,9vw,9.5rem)]">
            {teamName}
          </h1>
          <img
            alt={`${teamName} badge`}
            className="mb-1 hidden shrink-0 rounded-lg object-contain sm:block sm:size-16 lg:size-20"
            src={badgeUrl}
          />
        </div>

        <p className="mb-1 flex items-center gap-3 text-lg font-semibold uppercase lg:text-xl">
          <span className="border-2 border-ink px-3 py-2">All time</span>
          <span aria-hidden="true" className="h-0.5 w-8 bg-ink" />
          <span>World Cups</span>
        </p>
      </header>

      <dl
        aria-label={`${teamName} all-time World Cup statistics`}
        className="grid gap-x-5 gap-y-7 border-b-2 border-ink py-7 sm:grid-cols-3 lg:grid-cols-[0.8fr_2.2fr_repeat(4,0.6fr)_1.15fr_1.15fr]"
      >
        <TeamStat label="Appearances" value={teamProfile.appearances} />

        <div>
          <dt className="text-lg font-semibold uppercase">Titles</dt>
          <dd className="mt-3 flex flex-wrap gap-2">
            {teamProfile.titles.map((title) => (
              <span className="border-2 border-ink px-2 py-1 text-xs font-semibold" key={title}>
                {title}
              </span>
            ))}
          </dd>
        </div>

        <TeamStat label="Goals" value={teamProfile.goals} />
        <TeamStat label="Wins" value={teamProfile.wins} />
        <TeamStat label="Draws" value={teamProfile.draws} />
        <TeamStat label="Losses" value={teamProfile.losses} />
        <TeamStat label="Top scorer" value={teamProfile.topScorer} />
        <TeamStat label="Most assists" value={teamProfile.mostAssists} />
      </dl>

      <section aria-labelledby="evolution-heading" className="pt-7 lg:pt-9">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">
              Last eight tournaments
            </p>
            <h2
              className="mt-1 text-5xl font-semibold uppercase leading-none sm:text-6xl"
              id="evolution-heading"
            >
              Evolution
            </h2>
          </div>

          <div aria-label="Evolution metric" className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold uppercase">
            <span className="flex items-center gap-2 text-[#a51649]">
              <span className="size-2.5 rounded-full bg-[#a51649]" />
              Goals allowed
            </span>
            <span className="text-ink/35">Possession</span>
            <span className="text-ink/35">Goals scored</span>
          </div>
        </div>

        <div className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1fr)_220px]">
          <div className="overflow-x-auto border-t-2 border-ink pt-6">
            <div className="min-w-[760px]">
              <EvolutionChart
                selectedEdition={selectedEdition}
                teamName={teamName}
              />

              <ol className="mt-3 grid grid-cols-8 gap-2">
                {teamProfile.editions.map((edition) => (
                  <li className="text-center" key={edition.year}>
                    <button
                      aria-pressed={edition.year === selectedYear}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold transition-transform hover:-translate-y-0.5"
                      onClick={() => setSelectedYear(edition.year)}
                      style={{
                        color: edition.year === selectedYear
                          ? edition.primaryColor
                          : undefined,
                      }}
                      type="button"
                    >
                      <span
                        aria-hidden="true"
                        className="h-4 w-2 rounded-r-full"
                        style={{ backgroundColor: edition.primaryColor }}
                      />
                      {edition.year}
                    </button>
                    <p className="mt-4 text-[0.7rem] font-medium uppercase text-ink/55">
                      {edition.finish}
                    </p>
                    <img
                      alt=""
                      aria-hidden="true"
                      className="mx-auto mt-3 size-7 object-contain"
                      src={badgeUrl}
                    />
                    <p className="mt-2 text-sm font-semibold uppercase">
                      {edition.goalkeeper}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <aside
            className="flex min-h-56 flex-col justify-between p-5 text-white transition-colors duration-500"
            style={{ backgroundColor: selectedEdition.secondaryColor }}
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#fbf8f7]/60">
                Position focus
              </p>
              <h3 className="mt-2 text-3xl font-semibold uppercase">Goalkeeper</h3>
            </div>

            <GoalkeeperGlove />

            <dl className="grid grid-cols-2 gap-3 border-t border-[#fbf8f7]/40 pt-4">
              <div>
                <dt className="text-[0.65rem] uppercase text-[#fbf8f7]/60">Edition</dt>
                <dd className="mt-1 text-xl font-semibold">{selectedEdition.year}</dd>
              </div>
              <div>
                <dt className="text-[0.65rem] uppercase text-[#fbf8f7]/60">Allowed</dt>
                <dd className="mt-1 text-xl font-semibold">{selectedEdition.goalsAllowed} goals</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>
        </>
      )}
      </div>
    </section>
  )
}

const TeamStat = ({ label, value }: { label: string; value: number | string }) => {
  return (
    <div>
      <dt className="text-lg font-semibold uppercase leading-none">{label}</dt>
      <dd className="mt-3 text-base font-medium uppercase">{value}</dd>
    </div>
  )
}

type EditionRailProps = {
  onSelect: (year: TeamEditionYear) => void
  selectedEdition: TeamEdition
}

const EditionRail = ({
  onSelect,
  selectedEdition,
}: EditionRailProps) => {
  return (
    <aside
      aria-label="World Cup editions"
      className="sticky top-0 flex h-svh flex-col items-center bg-[#fbf8f7] py-5 lg:py-9"
    >
      <p className="text-[0.65rem] font-semibold uppercase lg:text-sm">Editions</p>
      <span aria-hidden="true" className="mt-3 text-2xl lg:mt-4 lg:text-3xl">↑</span>
      <ol className="mt-3 flex flex-1 flex-col items-center justify-center gap-1 lg:mt-4 lg:gap-2">
          {teamProfile.editions.map((edition) => {
            const isSelected = edition.year === selectedEdition.year

            return (
              <li key={edition.year}>
                <button
                  aria-label={`${edition.year} ${edition.host}`}
                  aria-pressed={isSelected}
                  className={isSelected
                    ? 'w-10 overflow-hidden rounded-md text-xs font-semibold text-white shadow-sm transition-transform hover:scale-105 lg:w-12 lg:text-sm'
                    : 'w-10 py-0.5 text-base font-semibold transition-transform hover:scale-110 lg:w-12 lg:py-1 lg:text-lg'}
                  onClick={() => onSelect(edition.year)}
                  type="button"
                >
                  {isSelected ? (
                    <>
                      <span
                        className="block px-1 py-1 lg:py-1.5"
                        style={{ backgroundColor: edition.primaryColor }}
                      >
                        {String(edition.year).slice(-2)}
                      </span>
                      <span
                        className="block truncate px-1 py-1 text-[0.5rem] uppercase lg:py-1.5 lg:text-[0.6rem]"
                        style={{ backgroundColor: edition.secondaryColor }}
                      >
                        {edition.host}
                      </span>
                    </>
                  ) : String(edition.year).slice(-2)}
                </button>
              </li>
            )
          })}
      </ol>
      <span aria-hidden="true" className="text-2xl lg:text-3xl">↓</span>
    </aside>
  )
}

type EvolutionChartProps = {
  selectedEdition: TeamEdition
  teamName: string
}

const EvolutionChart = ({ selectedEdition, teamName }: EvolutionChartProps) => {
  const maxGoalsAllowed = Math.max(
    ...teamProfile.editions.map(({ goalsAllowed }) => goalsAllowed),
  )
  const points = teamProfile.editions.map(({ goalsAllowed }, index) => ({
    x: 50 + index * 100,
    y: 118 - (goalsAllowed / maxGoalsAllowed) * 82,
    goalsAllowed,
  }))

  return (
    <svg
      aria-labelledby="evolution-chart-title evolution-chart-description"
      className="h-36 w-full"
      role="img"
      viewBox="0 0 800 150"
    >
      <title id="evolution-chart-title">Goals allowed by {teamName} at recent World Cups</title>
      <desc id="evolution-chart-description">
        A line chart showing goals allowed from 1994 through 2022.
      </desc>
      <line stroke="currentColor" strokeOpacity="0.12" x1="50" x2="750" y1="118" y2="118" />
      <polyline
        fill="none"
        points={points.map(({ x, y }) => `${x},${y}`).join(' ')}
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      {points.map(({ goalsAllowed, x, y }, index) => {
        const edition = teamProfile.editions[index]
        const isSelected = edition.year === selectedEdition.year

        return (
        <g key={edition.year}>
          {isSelected && (
            <circle
              cx={x}
              cy={y}
              fill={selectedEdition.primaryColor}
              fillOpacity="0.14"
              r="11"
            />
          )}
          <circle
            cx={x}
            cy={y}
            fill={isSelected ? selectedEdition.primaryColor : '#4d4d4d'}
            r={isSelected ? 5 : 4}
          />
          <text
            fill="currentColor"
            fontFamily="Antonio Variable, sans-serif"
            fontSize="12"
            fontWeight="600"
            textAnchor="middle"
            x={x}
            y={y - 12}
          >
            {goalsAllowed}
          </text>
        </g>
        )
      })}
    </svg>
  )
}

const GoalkeeperGlove = () => {
  return (
    <svg
      aria-hidden="true"
      className="mx-auto my-5 h-20 w-20"
      fill="none"
      viewBox="0 0 88 88"
    >
      <path
        d="M25 39V23c0-4 6-4 6 0v12-18c0-5 7-5 7 0v18-21c0-5 7-5 7 0v21-17c0-5 7-5 7 0v20-12c0-5 7-5 7 0v24c0 16-9 25-25 25-12 0-21-8-21-20V43c0-7 9-9 12-4Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
      />
      <path d="M20 58h38M25 69h28" stroke="currentColor" strokeWidth="3" />
    </svg>
  )
}
