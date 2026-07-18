import { Link } from '@tanstack/react-router'
import type { EditionSummary } from './schemas'

type EditionCardProps = {
  edition: EditionSummary
}

export const EditionCard = ({ edition }: EditionCardProps) => {
  return (
    <li data-ui="edition-card" className="min-[128px]">
      <Link
        to="/editions/$year"
        params={{ year: String(edition.year) }}
        className="flex items-center gap-6 justify-start relative block py-4"
      >
        {edition.host.flagUrl && (
          <img
            src={edition.host.flagUrl}
            alt={`${edition.host.displayName} flag`}
            width={42}
            height={42}
            loading="lazy"
            decoding="async"
            className="rounded-lg"
          />
        )}
        <p className="text-4xl font-semibold ">{edition.year}</p>

        <p className="ml-6 font-bold text-xl">{edition.pageNumber}</p>
      </Link>
    </li>
  )
}
