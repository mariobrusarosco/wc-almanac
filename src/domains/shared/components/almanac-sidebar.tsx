import { version } from '../../../../package.json'
import { Link } from '@tanstack/react-router'

import cupImage from '../assets/cup.png'
import { Logo } from './logo'

export const AlmanacSidebar = ({showVersion = false}: {showVersion?: boolean}) => {
  return (
    <aside className="relative flex min-h-svh flex-col items-center justify-between overflow-hidden bg-almanac-blue py-8">
      <div className="relative z-10">
        <Logo />
      </div>


      <div className='flex flex-col gap-4 font-display items-center'>
     
        <Link
          className="relative z-10 mt-auto pb-1 text-center text-sm uppercase leading-none text-ink"
          to="/table-of-contents"
        >
          Table of<br />contents
        </Link>
           {showVersion && (
        <span className="text-xs text-ink">v{version}</span>
      )}
      </div>


      <img
        aria-hidden="true"
        alt=""
        className="pointer-events-none absolute -right-40 top-[27%] w-[360px] max-w-none"
        src={cupImage}
      />
    </aside>
  )
}
