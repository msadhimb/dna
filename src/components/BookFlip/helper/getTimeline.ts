export const getTimeline = ({
  gsap,
  pageRefs,
  coverRef,
  bookRef,
  shadowRef,
  ribbonRef,
  coverFrontShadowRef,
  coverBackShadowRef,
  pageFrontShadowRefs,
  pageBackShadowRefs,
}: {
  gsap: any
  pageRefs: React.MutableRefObject<(HTMLDivElement | null)[]>
  coverRef: React.MutableRefObject<HTMLDivElement | null>
  bookRef: React.MutableRefObject<HTMLDivElement | null>
  shadowRef: React.MutableRefObject<HTMLDivElement | null>
  ribbonRef: React.MutableRefObject<HTMLDivElement | null>
  coverFrontShadowRef: React.MutableRefObject<HTMLDivElement | null>
  coverBackShadowRef: React.MutableRefObject<HTMLDivElement | null>
  pageFrontShadowRefs: React.MutableRefObject<(HTMLDivElement | null)[]>
  pageBackShadowRefs: React.MutableRefObject<(HTMLDivElement | null)[]>
}) => {
  return () => {
    const tl = gsap.timeline()
    const validPageRefs = pageRefs.current.filter(Boolean) as HTMLDivElement[]
    if (!bookRef.current || !coverRef.current || validPageRefs.length === 0)
      return tl

    tl.eventCallback("onUpdate", () => {
      if (!coverRef.current) return
      const rotY = gsap.getProperty(coverRef.current, "rotateY") as number
      if (rotY > -90) {
        gsap.set(coverRef.current, { zIndex: 100 })
      } else {
        gsap.set(coverRef.current, { zIndex: 10 })
      }
    })

    const shadowNodes = [
      coverFrontShadowRef.current,
      coverBackShadowRef.current,
      ...pageFrontShadowRefs.current.filter(Boolean),
      ...pageBackShadowRefs.current.filter(Boolean),
    ] as HTMLDivElement[]

    gsap.set(bookRef.current, {
      rotateX: 68,
      rotateY: -10,
      rotateZ: 2,
      scale: 0.82,
      x: "0%",
      z: 0,
      y: 160,
      opacity: 0,
      transformOrigin: "center 80%",
      force3D: true,
    })
    gsap.set(coverRef.current, {
      rotateY: 0,
      rotateX: 0,
      zIndex: 100,
      transformOrigin: "left center",
      force3D: true,
    })
    validPageRefs.forEach((pageEl) => {
      gsap.set(pageEl, {
        rotateY: 0,
        rotateX: 0,
        transformOrigin: "left center",
        force3D: true,
      })
    })
    gsap.set(shadowRef.current, { opacity: 0, scaleX: 0.4 })
    gsap.set(ribbonRef.current, { opacity: 1, y: 0 })
    gsap.set(shadowNodes, { opacity: 0 })

    const isDesktop = window.innerWidth >= 768

    tl.to(bookRef.current, {
      opacity: 1,
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      scale: 1,
      y: 0,
      duration: 2,
      ease: "none",
    })
      .to(
        shadowRef.current,
        { opacity: 0.5, scaleX: 1, duration: 1.6, ease: "none" },
        "<"
      )
      .to(
        ribbonRef.current,
        { y: 24, opacity: 0, duration: 0.5, ease: "none" },
        "-=0.5"
      )
      .to({}, { duration: 0.4 })

    if (isDesktop) {
      // DESKTOP: Cover flip + N page flips, Centered spread
      tl.to(bookRef.current, {
        rotateY: -12,
        rotateX: 12,
        z: 150,
        scale: 1.05,
        x: "50%",
        duration: 1.2,
        ease: "none",
      })
        .to(
          coverRef.current,
          { rotateY: -180, duration: 1.2, ease: "none" },
          "<"
        )
        .to(
          [coverFrontShadowRef.current, coverBackShadowRef.current],
          { opacity: 0.55, duration: 0.6, yoyo: true, repeat: 1 },
          "<"
        )
        .to(
          bookRef.current,
          {
            rotateY: 0,
            rotateX: 0,
            z: 50,
            scale: 1,
            duration: 0.8,
            ease: "none",
          },
          "-=0.4"
        )

      // Loop through each page for desktop flips
      validPageRefs.slice(0, -1).forEach((pageEl, i) => {
        const frontShadow = pageFrontShadowRefs.current[i]
        const backShadow = pageBackShadowRefs.current[i]
        const baseZIndex = 15 + i * 5

        tl.to({}, { duration: 0.8 })
          .to(bookRef.current, {
            rotateY: -12,
            rotateX: 12,
            z: 150,
            scale: 1.05,
            duration: 1.2,
            ease: "none",
          })
          .to(pageEl, { rotateY: -180, duration: 1.2, ease: "none" }, "<")
          .to(
            [frontShadow, backShadow].filter(Boolean),
            { opacity: 0.55, duration: 0.6, yoyo: true, repeat: 1 },
            "<"
          )
          .set(pageEl, { zIndex: baseZIndex + 15 }, "<0.6")
          .to(
            bookRef.current,
            {
              rotateY: 0,
              rotateX: 0,
              z: 50,
              scale: 1,
              duration: 0.8,
              ease: "none",
            },
            "-=0.4"
          )
      })
    } else {
      // MOBILE: Cover flip + N page flips, Dynamic Journey Sequence
      tl.to(bookRef.current, {
        rotateY: -15,
        rotateX: 15,
        z: 200,
        x: "10%",
        duration: 1,
        ease: "none",
      })
        .to(coverRef.current, { rotateY: -180, duration: 1, ease: "none" }, "<")
        .to(
          [coverFrontShadowRef.current, coverBackShadowRef.current],
          { opacity: 0.55, duration: 0.5, yoyo: true, repeat: 1 },
          "<"
        )
        .to(
          bookRef.current,
          {
            rotateY: 0,
            rotateX: 0,
            z: 100,
            x: "0%",
            duration: 0.8,
            ease: "none",
          },
          "-=0.2"
        )

      // Loop through each page for mobile flips
      validPageRefs.slice(0, -1).forEach((pageEl, i) => {
        const frontShadow = pageFrontShadowRefs.current[i]
        const backShadow = pageBackShadowRefs.current[i]
        const baseZIndex = 15 + i * 5

        tl.to({}, { duration: 0.6 }) // Pause to read current page
          .to(bookRef.current, {
            rotateY: -15,
            rotateX: 15,
            z: 250,
            x: "15%",
            duration: 1,
            ease: "none",
          })
          .to(pageEl, { rotateY: -180, duration: 1, ease: "none" }, "<")
          .to(
            [frontShadow, backShadow].filter(Boolean),
            { opacity: 0.55, duration: 0.5, yoyo: true, repeat: 1 },
            "<"
          )
          .set(pageEl, { zIndex: baseZIndex + 15 }, "<0.5")
          .to(
            bookRef.current,
            {
              rotateY: 0,
              rotateX: 0,
              z: 120,
              x: "0%",
              duration: 0.8,
              ease: "none",
            },
            "-=0.2"
          )
      })
    }

    return tl
  }
}
