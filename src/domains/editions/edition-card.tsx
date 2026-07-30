import { useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { getEdition } from './fetchers'
import { editionKey } from './keys'
import type { EditionSummary } from './schemas'

type EditionCardProps = {
  edition: EditionSummary
}

export const EditionCard = ({ edition }: EditionCardProps) => {
  const queryClient = useQueryClient()
  const year = String(edition.year)

  const prefetchEdition = () => {
    void queryClient.prefetchQuery({
      queryKey: editionKey(year),
      queryFn: () => getEdition(year),
    })
  }

  return (
    <li data-ui="edition-card" className="group">
      <Link
        to="/editions/$year"
        params={{ year }}
        onMouseEnter={prefetchEdition}
        className="flex gap-6 relative"
      >
        {edition.logoUrl && (
          <img
          src={edition.logoUrl}
          alt={`${edition.displayName} logo`}
          loading="lazy"
          decoding="async"
          className="rounded-lg w-[58px] h-[126px]"
          />
        )}
        <div className='flex flex-col gap-1 uppercase '>
          <span className="text-3xl font-semibold">{edition.displayName}</span>
          <p className="p-1 border-2 border-ink w-fit text-sm group-hover:bg-ink group-hover:text-paper transition-colors duration-300">{edition.year}</p>
          <p className="mt-auto text-sm">page {edition.pageNumber}</p>
        </div>

      </Link>
    </li>
  )
}
