import Link from "next/link"

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <section className="w-full max-w-lg text-center" aria-labelledby="notfound-title">
        <p className="mb-5 font-serif text-xs font-semibold tracking-[0.45em] text-muted-foreground uppercase">
          Undangan Pernikahan
        </p>
        <h1
          id="notfound-title"
          className="font-serif text-4xl leading-tight font-semibold tracking-wide md:text-6xl"
        >
          Mohon Maaf
        </h1>
        <p className="mx-auto mt-6 max-w-md font-sans text-sm leading-relaxed text-muted-foreground md:text-base">
          Tautan undangan tidak ditemukan atau sudah tidak berlaku. Pastikan URL dari undangan personal Anda sudah benar.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <p className="font-sans text-xs tracking-[0.2em] uppercase text-muted-foreground/70">
            Jika Anda merasa ini kesalahan, hubungi mempelai.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-foreground px-6 py-3 font-sans text-xs font-semibold tracking-[0.2em] uppercase text-background transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </section>
    </main>
  )
}
