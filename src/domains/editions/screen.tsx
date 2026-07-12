import { useEditions } from './use-editions'

export const EditionsScreen = () => {
  const { data, isError, isPending } = useEditions()

  return (
    <section className="min-h-svh w-full bg-paper px-10 py-12 font-display text-ink">
      <h1 className="w-fit border-4 border-ink p-6 text-6xl font-semibold uppercase">
        Editions
      </h1>

      {isPending && <p className="mt-8 text-2xl">Loading editions...</p>}

      {isError && <p className="mt-8 text-2xl">Unable to load editions.</p>}

      {data && (
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.editions.map((edition) => (
            <li key={edition.id} className="border-2 border-ink p-6">
              {edition.host.flagUrl && (
                <img
                  src={edition.host.flagUrl}
                  alt={`${edition.host.displayName} flag`}
                  className="mb-5 h-12 w-16 object-contain"
                />
              )}
              <p className="text-4xl font-semibold">{edition.year}</p>
              <p className="mt-1 text-lg">Hosted by {edition.host.displayName}</p>
              <p className="mt-1 text-lg">Page {edition.pageNumber}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
