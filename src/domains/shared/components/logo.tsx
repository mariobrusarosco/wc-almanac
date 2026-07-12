

interface Props {
  hideText?: boolean
}
export const Logo = ({ hideText = false }: Props) => {
  return (
    <div
      className="flex flex-col items-end font-display text-ink"
    >
      {!hideText && <>
      <span
        aria-hidden="true"
        className=" font-semibold uppercase leading-[0.95] tracking-[-0.04em]"
      >
        World Cup
      </span>
      <span
        aria-hidden="true"
        className="text-sm font-normal uppercase leading-[0.95] tracking-[-0.04em]"
      >
        Almanac
      </span>
      </>}


        <span
          aria-hidden="true"
          className="mt-2 rounded-sm bg-ink px-2 py-1 text-xs font-semibold leading-none text-paper"
        >
        beta
      </span>


    </div>
  )
}
