import { Link } from '@tanstack/react-router'
import cupImage from './assets/cup.png'

export const CoverScreen = () => {
  return (
    <main className="grid grid-cols-[135px_1fr] w-full">
      <div className="relative bg-paper">

      <span
          aria-hidden="true"
          className="
            pointer-events-none absolute inset-y-0 left-[16.5px] z-[2]
            w-[5px] bg-[rgba(57,123,160,0.01)]
            shadow-[12px_0_10px_1px_rgba(0,0,0,0.1)]
          "
      />

      </div>

      <div className="flex flex-col justify-between bg-almanac-blue py-16 px-12">
        <div className="flex gap-6 items-center justify-between uppercase font-display text-xl text-ink">
          <span>editions</span>
          <span className='h-0.5 flex-1 bg-ink'  />
          <span>2018 - 2022</span>
        </div>

        <div className='flex justify-between items-end uppercase font-display text-ink'>
          <div className='cursor-pointer text-3xl font-semibold h-fit px-8 py-6 border-3 border-ink hover:bg-ink hover:text-almanac-blue transition-colors' >open</div>
          <div className='flex flex-col tracking-tighter leading-none text-right pr-23'>
            <span className='text-9xl font-bold'>world cup</span>
            <span className='text-8xl font-thin'>almanac</span>
          </div>
        </div>

        <img src={cupImage} alt="" className='absolute -right-[300px] -bottom-[150px] w-[620px]' />

      </div>
    </main>
  )
}
