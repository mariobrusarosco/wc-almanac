import { Link } from '@tanstack/react-router'
import type { EditionsResponse } from './schemas'

type EditionCardProps = {
  edition: EditionsResponse['editions'][number]
}

export const EditionCard = ({ edition }: EditionCardProps) => {
  return (
    <li data-ui="edition-card" className="min-[128px]">
      <Link
        to="/editions/$year"
        params={{ year: String(edition.year) }}
        className="flex items-center gap-6 justify-start relative block py-4"
      >
        <img
          src={edition.logoUrl}
          alt={`${edition.host.displayName} ${edition.year} World Cup logo`}
          width={42}
          height={42}
          loading="lazy"
          decoding="async"
          className="rounded-lg"
        />
        <p className="text-4xl font-semibold ">{edition.year}</p>

        <p className="ml-6 font-bold text-xl">{edition.pageNumber}</p>
      </Link>
    </li>
  )
}
