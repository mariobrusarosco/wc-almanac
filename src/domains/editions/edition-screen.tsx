import { useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useEffect } from 'react'
import { getEdition } from './fetchers'
import { editionKey } from './keys'
import { useEdition } from './use-edition'

type EditionScreenProps = {
  year: string
}

export const EditionScreen = ({ year }: EditionScreenProps) => {
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
          <h1 className="w-fit border-4 border-ink p-6 text-6xl font-semibold uppercase">
            {edition.name}
          </h1>
          <p className="mt-8 text-3xl">{edition.displayName}</p>
          <p className="mt-2 text-xl">Page {edition.pageNumber}</p>

          <img
            src={edition.visualIdentity.trophyUrl}
            alt={`${edition.name} trophy`}
            className="mt-10 h-52 w-40 object-contain"
          />

          <nav className="mt-10 flex max-w-3xl justify-between gap-8 border-t-2 border-ink pt-6">
            {edition.navigation.previous ? (
              <Link
                to="/editions/$year"
                params={{ year: String(edition.navigation.previous.year) }}
                className="text-xl uppercase"
              >
                Previous: {edition.navigation.previous.hostDisplayName}{' '}
                {edition.navigation.previous.year}
              </Link>
            ) : (
              <span />
            )}

            {edition.navigation.next && (
              <Link
                to="/editions/$year"
                params={{ year: String(edition.navigation.next.year) }}
                className="text-xl uppercase"
              >
                Next: {edition.navigation.next.hostDisplayName}{' '}
                {edition.navigation.next.year}
              </Link>
            )}
          </nav>
        </>
      )}
    </section>
  )
}
