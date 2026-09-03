import React from "react"

const BookPages = ({
  isDesktop,
  resolvedPages,
  pageRefs,
  pageFrontShadowRefs,
  pageBackShadowRefs,
  isSpinning,
}: {
  isDesktop: boolean
  resolvedPages: React.ReactNode[]
  pageRefs: React.MutableRefObject<(HTMLDivElement | null)[]>
  pageFrontShadowRefs: React.MutableRefObject<(HTMLDivElement | null)[]>
  pageBackShadowRefs: React.MutableRefObject<(HTMLDivElement | null)[]>
  isSpinning: boolean
}) => {
  return (
    <>
      {isDesktop
        ? Array.from({
            length: Math.ceil((resolvedPages.length - 1) / 2),
          }).map((_, spreadIndex) => {
            const leftIndex = 1 + spreadIndex * 2
            const rightIndex = leftIndex + 1

            return (
              <div
                key={spreadIndex}
                ref={(el) => {
                  pageRefs.current[spreadIndex] = el
                }}
                className="absolute inset-0"
                style={{
                  zIndex:
                    15 +
                    (Math.ceil((resolvedPages.length - 1) / 2) -
                      1 -
                      spreadIndex) *
                      5,
                  transformStyle: "preserve-3d",
                }}
              >
                
                <div
                  className="absolute inset-0 flex overflow-hidden rounded-[4px_8px_8px_4px] border bg-[#fdf8f0] dark:bg-[#141414] border-border"
                  style={{
                    transform: "translateZ(1px)",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                >
                  
                  <div className="relative w-full flex flex-col items-center justify-center gap-3 sm:gap-4 px-5 py-6 sm:px-7 sm:py-9 max-[390px]:px-4 max-[390px]:py-5 text-center border-r border-border">
                    {resolvedPages[leftIndex] ?? null}
                  </div>
                  <div
                    ref={(el) => {
                      pageFrontShadowRefs.current[spreadIndex] = el
                    }}
                    className="pointer-events-none absolute inset-0 bg-linear-to-r from-black/10 to-black/60"
                  />
                </div>

                
                <div
                  className="absolute inset-0 flex overflow-hidden rounded-[8px_4px_4px_8px] border bg-[#fdf8f0] dark:bg-[#141414] border-border"
                  style={{
                    transform: "rotateY(180deg) translateZ(1px)",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                >
                  <div className="relative w-full flex flex-col items-center justify-center gap-3 sm:gap-4 px-5 py-6 sm:px-7 sm:py-9 max-[390px]:px-4 max-[390px]:py-5 text-center border-r border-border">
                    {resolvedPages[rightIndex] ?? null}
                  </div>
                  <div
                    ref={(el) => {
                      pageBackShadowRefs.current[spreadIndex] = el
                    }}
                    className="pointer-events-none absolute inset-0 bg-linear-to-r from-black/10 to-black/60"
                  />
                </div>
              </div>
            )
          })
        : resolvedPages.map((pageContent, pageIndex) => (
            <div
              key={pageIndex}
              ref={(el) => {
                pageRefs.current[pageIndex] = el
              }}
              className="absolute inset-0"
              style={{
                zIndex: 15 + (resolvedPages.length - 1 - pageIndex) * 5,
                transformStyle: "preserve-3d",
              }}
            >
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-3 sm:gap-4 overflow-hidden rounded-[4px_8px_8px_4px] border bg-[#fdf8f0] px-5 py-6 sm:px-7 sm:py-9 max-[390px]:px-4 max-[390px]:py-5 text-center dark:bg-[#141414] border-border"
                style={{
                  transform: "translateZ(1px)",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                {pageContent}
                <div
                  ref={(el) => {
                    pageFrontShadowRefs.current[pageIndex] = el
                  }}
                  className="pointer-events-none absolute inset-0 bg-linear-to-r from-black/10 to-black/60"
                />
              </div>
              <div
                className="absolute inset-0 rounded-[8px_4px_4px_8px] border bg-[#f7f2e8] dark:bg-[#0f0f0f] border-border"
                style={{
                  transform: "rotateY(180deg) translateZ(1px)",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                <div
                  ref={(el) => {
                    pageBackShadowRefs.current[pageIndex] = el
                  }}
                  className="pointer-events-none absolute inset-0 bg-linear-to-r from-black/10 to-black/60"
                />
              </div>
            </div>
          ))}
    </>
  )
}

export default BookPages
