import { useContents } from './use-contents'

export const TableOfContentsScreen = () => {
  const { data, isError, isPending } = useContents()

  return (
    <section className="min-h-svh w-full bg-paper px-10 py-12 font-display text-ink">
      <h1 className="w-fit border-4 border-ink p-6 text-6xl font-semibold uppercase">
        Table of contents
      </h1>

      {isPending && <p className="mt-8 text-2xl">Loading contents...</p>}

      {isError && <p className="mt-8 text-2xl">Unable to load contents.</p>}

      {data && (
        <ol className="mt-10 max-w-3xl divide-y-2 divide-ink border-y-2 border-ink">
          {data.contents.map((item) => (
            <li key={item.path}>
              <a
                href={item.path}
                className="flex items-center justify-between gap-8 py-5 text-3xl uppercase"
              >
                <span>{item.label}</span>
                <span>{item.pageNumber}</span>
              </a>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
