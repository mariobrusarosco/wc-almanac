import { EditionCard } from './edition-card'
import { useEditions } from './use-editions'

export const EditionsScreen = () => {
  const { data, isError, isPending } = useEditions()

  return (
    <section className="min-h-svh w-full bg-paper px-10 py-12 font-display text-ink">
      <h1 className="w-fit text-8xl font-semibold uppercase">
        Editions
      </h1>

      {isPending && <p className="mt-8 text-2xl">Loading editions...</p>}

      {isError && <p className="mt-8 text-2xl">Unable to load editions.</p>}

      {data && (
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.editions.map((edition) => (
            <EditionCard key={edition.id} edition={edition} />
          ))}
        </ul>
      )}
    </section>
  )
}
