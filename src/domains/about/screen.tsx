export const AboutScreen = () => {
  return (
    <section className="flex min-h-svh w-full flex-col bg-paper px-10 py-12 font-display text-ink">
      <h1 className="w-fit text-8xl font-semibold uppercase">
        About the tournament
      </h1>

      <div className="flex flex-1 items-center justify-center py-16 text-center">
        <div className="w-full max-w-3xl border-y-4 border-ink py-12">
          <p className="text-sm font-semibold uppercase tracking-[0.35em]">
            Under construction
          </p>
          <p className="mt-4 text-7xl font-semibold uppercase leading-none sm:text-8xl">
            Coming soon
          </p>
          <p className="mx-auto mt-6 max-w-xl text-xl leading-relaxed">
            The story, history, and format of the tournament are being prepared
            for this page.
          </p>
        </div>
      </div>
    </section>
  )
}
