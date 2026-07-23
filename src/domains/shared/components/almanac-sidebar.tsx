import { version } from '../../../../package.json'
import { Link } from '@tanstack/react-router'

import cupImage from '../assets/cup.png'
import { Logo } from './logo'

type SidebarLogo = {
  alt: string
  src: string
}

type AlmanacSidebarProps = {
  accentColor?: string
  accentTextColor?: string
  backgroundColor?: string
  logo?: SidebarLogo
  showVersion?: boolean
}

export const AlmanacSidebar = ({
  accentColor,
  accentTextColor,
  backgroundColor,
  logo,
  showVersion = false,
}: AlmanacSidebarProps) => {
  console.log({ logo })
  return (
    <aside
      className="relative flex min-h-svh flex-col items-center justify-between overflow-hidden bg-almanac-blue py-8"
      style={{ backgroundColor }}
    >
      <Logo />

      <div className="flex flex-col items-center gap-4 font-display">
        <Link
          className="relative z-10 mt-auto pb-1 text-center text-sm uppercase leading-none text-ink hover:text-ink/80 hover:scale-[1.1] transition-all"
          style={{
            backgroundColor: accentColor,
            color: accentTextColor,
          }}
          to="/table-of-contents"
        >
          Table of<br />contents
        </Link>
        {showVersion && (
          <span className="text-xs text-ink" style={{ color: accentTextColor }}>
            v{version}
          </span>
        )}
      </div>


      <img
        aria-hidden="true"
        alt=""
        className="pointer-events-none absolute -right-40 top-[27%] w-[360px] max-w-none"
        src={logo ? logo?.src : cupImage}
      />
    </aside>
  )
}
