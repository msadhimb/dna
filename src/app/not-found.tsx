export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <section className="w-full max-w-lg text-center">
        <p className="mb-5 font-serif text-xs font-semibold tracking-[0.45em] text-muted-foreground uppercase">
          Undangan Pernikahan
        </p>
        <h1 className="font-serif text-4xl leading-tight font-semibold tracking-wide md:text-6xl">
          Mohon Maaf
        </h1>
        <p className="mx-auto mt-6 max-w-md font-sans text-sm leading-relaxed text-muted-foreground md:text-base">
          Anda tidak diundang ke pernikahan kami.
        </p>
      </section>
    </main>
  )
}
