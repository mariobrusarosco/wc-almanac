import { useEditions } from './use-editions'

type EditionScreenProps = {
  year: string
}

export const EditionScreen = ({ year }: EditionScreenProps) => {
  const { data, isError, isPending } = useEditions()
  const edition = data?.editions.find(
    ({ year: editionYear }) => editionYear === Number(year),
  )

  return (
    <section className="min-h-svh w-full bg-paper px-10 py-12 font-display text-ink">
      {isPending && <p className="text-2xl">Loading edition...</p>}

      {isError && <p className="text-2xl">Unable to load edition.</p>}

      {data && !edition && <p className="text-2xl">Edition not found.</p>}

      {edition && (
        <>
          {edition.host.flagUrl && (
            <img
              src={edition.host.flagUrl}
              alt={`${edition.host.displayName} flag`}
              className="mb-6 h-20 w-28 object-contain"
            />
          )}
          <h1 className="w-fit border-4 border-ink p-6 text-6xl font-semibold uppercase">
            {edition.year}
          </h1>
          <p className="mt-8 text-3xl">Hosted by {edition.host.displayName}</p>
          <p className="mt-2 text-xl">Page {edition.pageNumber}</p>
        </>
      )}
    </section>
  )
}
