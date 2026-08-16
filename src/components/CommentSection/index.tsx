"use client"

import {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react"
import { useTheme } from "next-themes"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import {
  FloatImages,
  SectionHeader,
  CommentForm,
  CommentList,
  CounterBadge,
} from "./components"
import { useImageUrl } from "@/store/useImageUrl"

gsap.registerPlugin(ScrollTrigger)

interface Comment {
  id: string
  name: string
  message: string
  attendance: "hadir" | "tidak_hadir" | "ragu"
  date: string
}

const DUMMY_COMMENTS: Comment[] = [
  {
    id: "1",
    name: "Keluarga Bapak Budi",
    message:
      "Selamat menempuh hidup baru! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Aamiin.",
    attendance: "hadir",
    date: "Baru saja",
  },
  {
    id: "2",
    name: "Andi & Partner",
    message:
      "Happy wedding ya! Maaf belum bisa hadir, tapi doa terbaik untuk kalian berdua selalu.",
    attendance: "tidak_hadir",
    date: "1 jam lalu",
  },
  {
    id: "3",
    name: "Tante Sari",
    message:
      "MasyaAllah, barakallah lakuma. Semoga menjadi keluarga yang diberkahi.",
    attendance: "hadir",
    date: "2 jam lalu",
  },
  {
    id: "4",
    name: "Rina & Dimas",
    message: "Turut berbahagia! Semoga langgeng sampai kakek nenek ya.",
    attendance: "ragu",
    date: "3 jam lalu",
  },
]

export interface CommentSectionRef {
  getTimeline: () => gsap.core.Timeline
}

export const CommentSection = forwardRef<CommentSectionRef>((_, ref) => {
  const { resolvedTheme } = useTheme()
  const { imageUrl } = useImageUrl()
  const isDark = resolvedTheme === "dark"

  const isFirstRender = useRef(true)
  const floatImgBackRef = useRef<HTMLDivElement>(null)
  const floatImgFrontRef = useRef<HTMLDivElement>(null)
  const floatImgRightRef = useRef<HTMLDivElement>(null)
  const floatImgRightFrontRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const floatSTs = useRef<ScrollTrigger[]>([])

  const [comments, setComments] = useState<Comment[]>(DUMMY_COMMENTS)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const accent = isDark ? "#FF2D55" : "#16A34A"
  const dot = isDark ? "rgba(255,45,85,0.06)" : "rgba(212,175,55,0.06)"
  const surface = isDark ? "#0A0A0A" : "#F8F8F8"
  const textPrimary = isDark ? "#FFFFFF" : "#111111"
  const textSecondary = isDark ? "#888888" : "#555555"
  const textMuted = isDark ? "#444444" : "#AAAAAA"
  const border = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"
  const borderAccent = isDark ? "rgba(255,45,85,0.25)" : "rgba(22,163,74,0.25)"
  const bgGradient = isDark
    ? "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,45,85,0.06), transparent)"
    : "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(212,175,55,0.06), transparent)"

  const imgBack = isDark
    ? (imageUrl as any)?.dark?.[1].link
    : (imageUrl as any)?.light?.[1].link
  const imgFront = isDark
    ? (imageUrl as any)?.dark?.[0].link
    : (imageUrl as any)?.light?.[0].link
  const imgRight = isDark
    ? (imageUrl as any)?.dark?.[2].link
    : (imageUrl as any)?.light?.[2].link
  const imgRightFront = isDark
    ? (imageUrl as any)?.dark?.[3].link
    : (imageUrl as any)?.light?.[3].link

  useImperativeHandle(ref, () => ({
    getTimeline: () => {
      const triggerEl = sectionRef.current
      if (!triggerEl) return gsap.timeline()

      const tl = gsap.timeline()

      floatSTs.current.forEach((st) => st.kill())
      floatSTs.current = []

      gsap.to(floatImgBackRef.current, {
        y: -40,
        ease: "none",
        scrollTrigger: {
          trigger: triggerEl,
          start: "top 85%",
          end: "bottom 15%",
          scrub: 2,
        },
      })

      gsap.to(floatImgFrontRef.current, {
        y: -160,
        ease: "none",
        scrollTrigger: {
          trigger: triggerEl,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 1,
        },
      })

      gsap.to(floatImgRightRef.current, {
        y: -120,
        ease: "none",
        scrollTrigger: {
          trigger: triggerEl,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 1.8,
        },
      })

      gsap.to(floatImgRightFrontRef.current, {
        y: -120,
        ease: "none",
        scrollTrigger: {
          trigger: triggerEl,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 1.8,
        },
      })

      tl.fromTo(
        ".cs-eyebrow",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
      )
        .fromTo(
          ".cs-title-word",
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.08,
            ease: "power3.out",
          },
          "-=0.3"
        )
        .fromTo(
          ".cs-line-deco",
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1,
            ease: "power3.inOut",
            transformOrigin: "center",
          },
          "-=0.4"
        )
        .fromTo(
          ".cs-desc",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
          "-=0.4"
        )
        .fromTo(
          ".cs-form-wrap",
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
          "-=0.3"
        )
        .fromTo(
          ".cs-submit-btn",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          "-=0.3"
        )
        .fromTo(
          ".cs-count",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          "-=0.2"
        )
        .fromTo(
          ".cs-card-item",
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
          },
          "-=0.4"
        )

      gsap.to(".cs-float-line", {
        y: -8,
        duration: 3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.4,
      })

      return tl
    },
  }))

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    const el = contentRef.current
    if (!el) return

    const targetScale = parseFloat(
      (gsap.getProperty(el, "scale") as string) || "1"
    )
    const targetRotY = gsap.getProperty(el, "rotateY") as number
    const targetX = parseFloat((gsap.getProperty(el, "x") as string) || "0")
    const targetY = parseFloat((gsap.getProperty(el, "y") as string) || "0")

    gsap.killTweensOf(el)

    const tl = gsap.timeline()
    tl.to(el, { scale: 0.85, duration: 0.4, ease: "power2.in" })
      .to(
        el,
        { scale: 0.85, rotateY: "+=360", duration: 0.8, ease: "power2.inOut" },
        ">"
      )
      .to(
        el,
        {
          scale: targetScale,
          rotateY: targetRotY + 360,
          x: targetX,
          y: targetY,
          duration: 0.5,
          ease: "power2.out",
        },
        ">"
      )
  }, [isDark])

  const handleFormSubmit = (data: {
    name: string
    message: string
    attendance: "hadir" | "tidak_hadir" | "ragu"
  }) => {
    setIsSubmitting(true)
    setTimeout(() => {
      setComments([
        { id: Date.now().toString(), ...data, date: "Baru saja" },
        ...comments,
      ])
      setIsSubmitting(false)
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 3000)
    }, 700)
  }

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-background gsap-element"
      style={{ perspective: "1500px" }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, ${dot} 1px, transparent 0)`,
          backgroundSize: "28px 28px",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: bgGradient }}
      />

      <FloatImages
        imgBack={imgBack}
        imgFront={imgFront}
        imgRight={imgRight}
        imgRightFront={imgRightFront}
        floatImgBackRef={floatImgBackRef}
        floatImgFrontRef={floatImgFrontRef}
        floatImgRightRef={floatImgRightRef}
        floatImgRightFrontRef={floatImgRightFrontRef}
      />

      <div
        ref={contentRef}
        className="relative z-30 mx-auto w-full max-w-5xl px-6 py-10 md:px-10 flex flex-col gap-5 gsap-element"
        style={{
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
          willChange: "transform",
        }}
      >
        <SectionHeader
          eyebrow="Kartu Ucapan"
          title="Ucapan & Doa"
          description="Sematkan doa dan harapan terbaik Anda untuk Devi & Adhim. Setiap kata yang ditulis akan menjadi kenangan berharga."
          accent={accent}
          textSecondary={textSecondary}
          textPrimary={textPrimary}
        />

        <CommentForm
          accent={accent}
          border={border}
          textSecondary={textSecondary}
          textPrimary={textPrimary}
          isDark={isDark}
          surface={surface}
          onSubmit={handleFormSubmit}
          isSubmitting={isSubmitting}
          submitted={submitted}
        />

        <CounterBadge
          count={comments.length}
          borderAccent={borderAccent}
          textSecondary={textSecondary}
        />

        <CommentList
          comments={comments}
          surface={surface}
          border={border}
          textPrimary={textPrimary}
          textSecondary={textSecondary}
          textMuted={textMuted}
        />
      </div>
    </section>
  )
})

CommentSection.displayName = "CommentSection"
export default CommentSection
