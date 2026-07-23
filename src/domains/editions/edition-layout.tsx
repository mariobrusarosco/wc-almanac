import { Outlet } from '@tanstack/react-router'
import { AlmanacSidebar } from '../shared/components/almanac-sidebar'
import { useEdition } from './use-edition'

type EditionLayoutProps = {
  year: string
}

export const EditionLayout = ({ year }: EditionLayoutProps) => {
  const { data } = useEdition(year)
  const edition = data?.edition

  console.log({ edition })

  return (
    <main className="grid min-h-svh w-full grid-cols-[88px_minmax(0,1fr)] bg-paper">
      <AlmanacSidebar
        accentColor={edition?.visualIdentity.accentColor}
        accentTextColor={edition?.visualIdentity.accentTextColor}
        backgroundColor={edition?.visualIdentity.spineColor}
        logo={
          edition
            ? {
                alt: `${edition.name} logo`,
                src: edition.visualIdentity.logoUrl,
              }
            : undefined
        }
      />
      <div className="h-screen overflow-y-auto">
        <Outlet />
      </div>
    </main>
  )
}
