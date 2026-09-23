import { useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { getEdition } from './fetchers'
import { editionKey } from './keys'
import { useEdition } from './use-edition'

type EditionScreenProps = {
  year: string
}

const placements = [
  ['first', 'Champions'],
  ['second', 'Runners-up'],
  ['third', 'Third place'],
  ['fourth', 'Fourth place'],
] as const

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`))
}

export const EditionScreen = ({ year }: EditionScreenProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'standings'>(
    'overview',
  )
  const queryClient = useQueryClient()
  const { data, isError, isPending } = useEdition(year)
  const edition = data?.edition
  const previousYear = edition?.navigation.previous?.year
  const nextYear = edition?.navigation.next?.year

  useEffect(() => {
    if (previousYear) {
      const year = String(previousYear)
      const queryKey = editionKey(year)

      if (previousYear && queryClient.getQueryData(queryKey) === undefined) {
        void queryClient.prefetchQuery({
          queryKey,
          queryFn: () => getEdition(year),
        })
      }
    }

    if (nextYear) {
      const year = String(nextYear)
      const queryKey = editionKey(year)

      if (queryClient.getQueryData(queryKey) === undefined) {
        void queryClient.prefetchQuery({
          queryKey,
          queryFn: () => getEdition(year),
        })
      }
    }
  }, [nextYear, previousYear, queryClient])

  return (
    <section className="min-h-svh w-full bg-paper px-10 py-12 font-display text-ink">
      {isPending && <p className="text-2xl">Loading edition...</p>}

      {isError && <p className="text-2xl">Unable to load edition.</p>}

      {edition && (
        <>
          <nav className="flex items-start justify-between gap-8 text-sm font-semibold uppercase">
            {edition.navigation.previous ? (
              <Link
                to="/editions/$year"
                params={{ year: String(edition.navigation.previous.year) }}
                className="flex items-center gap-3 transition-opacity hover:opacity-60"
              >
                <span aria-hidden="true" className="text-2xl">←</span>
                <span>{edition.navigation.previous.hostDisplayName}</span>
                <span className="border-2 border-ink px-1 py-0.5">
                  {edition.navigation.previous.year}
                </span>
              </Link>
            ) : (
              <span />
            )}

            {edition.navigation.next && (
              <Link
                to="/editions/$year"
                params={{ year: String(edition.navigation.next.year) }}
                className="flex items-center gap-3 text-right transition-opacity hover:opacity-60"
              >
                <span>{edition.navigation.next.hostDisplayName}</span>
                <span className="border-2 border-ink px-1 py-0.5">
                  {edition.navigation.next.year}
                </span>
                <span aria-hidden="true" className="text-2xl">→</span>
              </Link>
            )}
          </nav>

          <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <h1 className="flex flex-wrap items-end gap-x-8 gap-y-2 uppercase">
              <span className="text-7xl font-semibold leading-none sm:text-8xl">
                {edition.displayName}
              </span>
              <span className="pb-2 text-3xl font-semibold leading-none">
                {edition.year}
              </span>
            </h1>

            <div
              aria-label="Edition sections"
              className="flex items-center self-start sm:self-auto"
              role="tablist"
            >
              <button
                aria-selected={activeTab === 'overview'}
                className="px-4 py-4 text-sm font-semibold uppercase"
                onClick={() => setActiveTab('overview')}
                role="tab"
                style={
                  activeTab === 'overview'
                    ? {
                        backgroundColor: edition.visualIdentity.accentColor,
                        color: edition.visualIdentity.accentTextColor,
                      }
                    : undefined
                }
                type="button"
              >
                Overview
              </button>
              <button
                aria-selected={activeTab === 'standings'}
                className="px-4 py-4 text-sm font-semibold uppercase"
                onClick={() => setActiveTab('standings')}
                role="tab"
                style={
                  activeTab === 'standings'
                    ? {
                        backgroundColor: edition.visualIdentity.accentColor,
                        color: edition.visualIdentity.accentTextColor,
                      }
                    : undefined
                }
                type="button"
              >
                Standings
              </button>
            </div>
          </div>

          {activeTab === 'overview' && (
            <div className="mt-14 flex flex-wrap items-end gap-x-12 gap-y-8" role="tabpanel">
              <div className="flex items-center gap-5">
                {edition.visualIdentity.trophyUrl && (
                  <img
                    alt={`${edition.year} World Cup trophy`}
                    className="h-24 w-14 object-contain"
                    src={edition.visualIdentity.trophyUrl}
                  />
                )}

                <div>
                  <p className="text-2xl font-semibold uppercase">Winner</p>
                  <p className="mt-1 text-5xl font-semibold uppercase leading-none">
                    {edition.placements.first.name}
                  </p>
                  <p className="mt-2 text-lg font-semibold">
                    {edition.placements.first.code}
                  </p>
                </div>
              </div>

              <dl className="flex flex-wrap gap-x-10 gap-y-6">
                <div>
                  <dt className="text-xl font-semibold uppercase">From</dt>
                  <dd className="mt-2 text-lg">
                    <time dateTime={edition.startDate}>
                      {formatDate(edition.startDate)}
                    </time>
                  </dd>
                </div>
                <div>
                  <dt className="text-xl font-semibold uppercase">To</dt>
                  <dd className="mt-2 text-lg">
                    <time dateTime={edition.endDate}>
                      {formatDate(edition.endDate)}
                    </time>
                  </dd>
                </div>
                <div>
                  <dt className="text-xl font-semibold uppercase">Participants</dt>
                  <dd className="mt-2 text-lg">{edition.participantCount}</dd>
                </div>
              </dl>
            </div>
          )}

          {activeTab === 'standings' && (
            <ol
              className="mt-14 grid max-w-5xl gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4"
              role="tabpanel"
            >
              {placements.map(([placement, label]) => {
                const team = edition.placements[placement]

                return (
                  <li key={team.id} className="border-t-4 border-ink pt-4">
                    <p className="text-sm font-semibold uppercase tracking-wider">
                      {label}
                    </p>
                    <p className="mt-3 text-3xl font-semibold uppercase">
                      {team.name}
                    </p>
                    <p className="mt-1 text-lg">{team.code}</p>
                  </li>
                )
              })}
            </ol>
          )}
        </>
      )}
    </section>
  )
}
