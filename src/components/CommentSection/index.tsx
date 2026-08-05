"use client"

import { useState, useRef, forwardRef, useImperativeHandle } from "react"
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
  const isDark = resolvedTheme === "dark"

  const floatImgBackRef = useRef<HTMLDivElement>(null)
  const floatImgFrontRef = useRef<HTMLDivElement>(null)
  const floatImgRightRef = useRef<HTMLDivElement>(null)
  const floatImgRightFrontRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const floatSTs = useRef<ScrollTrigger[]>([])
  const floatLineAnimRef = useRef<gsap.core.Tween | null>(null)

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
    ? "/asset/pre-wed/image/dark/2.jpg"
    : "/asset/pre-wed/image/light/2.jpg"
  const imgFront = isDark
    ? "/asset/pre-wed/image/dark/1.jpg"
    : "/asset/pre-wed/image/light/1.jpg"
  const imgRight = isDark
    ? "/asset/pre-wed/image/dark/3.jpg"
    : "/asset/pre-wed/image/light/3.jpg"
  const imgRightFront = isDark
    ? "/asset/pre-wed/image/dark/4.jpg"
    : "/asset/pre-wed/image/light/4.jpg"

  useImperativeHandle(ref, () => ({
    getTimeline: () => {
      const triggerEl = sectionRef.current
      if (!triggerEl) return gsap.timeline()

      const tl = gsap.timeline()

      // Clean up previous ScrollTriggers before creating new ones
      floatSTs.current.forEach((st) => st.kill())
      floatSTs.current = []

      // Clean up previous float line animation
      floatLineAnimRef.current?.kill()

      const isMobile = window.innerWidth < 768
      // Use shorter scrub on mobile for smoother response
      const scrubValue = isMobile ? 3 : 2

      // Float image 1
      const st1 = ScrollTrigger.create({
        trigger: triggerEl,
        start: "top 85%",
        end: "bottom 15%",
        scrub: scrubValue,
        onUpdate: (self) => {
          if (floatImgBackRef.current) {
            gsap.set(floatImgBackRef.current, { y: self.progress * -40 })
          }
        },
      })
      floatSTs.current.push(st1)

      // Float image 2
      const st2 = ScrollTrigger.create({
        trigger: triggerEl,
        start: "top 80%",
        end: "bottom 20%",
        scrub: scrubValue,
        onUpdate: (self) => {
          if (floatImgFrontRef.current) {
            gsap.set(floatImgFrontRef.current, { y: self.progress * -160 })
          }
        },
      })
      floatSTs.current.push(st2)

      // Float image 3
      const st3 = ScrollTrigger.create({
        trigger: triggerEl,
        start: "top 80%",
        end: "bottom 20%",
        scrub: scrubValue,
        onUpdate: (self) => {
          if (floatImgRightRef.current) {
            gsap.set(floatImgRightRef.current, { y: self.progress * -120 })
          }
        },
      })
      floatSTs.current.push(st3)

      // Float image 4
      const st4 = ScrollTrigger.create({
        trigger: triggerEl,
        start: "top 80%",
        end: "bottom 20%",
        scrub: scrubValue,
        onUpdate: (self) => {
          if (floatImgRightFrontRef.current) {
            gsap.set(floatImgRightFrontRef.current, { y: self.progress * -120 })
          }
        },
      })
      floatSTs.current.push(st4)

      // Staggered entrance animations — reduced on mobile
      const entranceStagger = isMobile ? 0.05 : 0.08
      const entranceDuration = isMobile ? 0.5 : 0.7

      tl.fromTo(
        ".cs-eyebrow",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: entranceDuration, ease: "power3.out" }
      )
        .fromTo(
          ".cs-title-word",
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: entranceDuration + 0.2,
            stagger: entranceStagger,
            ease: "power3.out",
          },
          "-=0.3"
        )
        .fromTo(
          ".cs-line-deco",
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: entranceDuration,
            ease: "power3.inOut",
            transformOrigin: "center",
          },
          "-=0.3"
        )
        .fromTo(
          ".cs-desc",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: entranceDuration, ease: "power3.out" },
          "-=0.3"
        )
        .fromTo(
          ".cs-form-wrap",
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, duration: entranceDuration + 0.2, ease: "power3.out" },
          "-=0.3"
        )
        .fromTo(
          ".cs-submit-btn",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: entranceDuration, ease: "power3.out" },
          "-=0.3"
        )
        .fromTo(
          ".cs-count",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: entranceDuration, ease: "power3.out" },
          "-=0.2"
        )
        .fromTo(
          ".cs-card-item",
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: entranceDuration + 0.1,
            stagger: isMobile ? 0.06 : 0.12,
            ease: "power3.out",
          },
          "-=0.3"
        )

      // Float line animation — only on desktop to save mobile resources
      if (!isMobile) {
        floatLineAnimRef.current = gsap.to(".cs-float-line", {
          y: -8,
          duration: 3,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          stagger: 0.4,
        })
      }

      return tl
    },
  }))

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
        className="relative z-30 mx-auto flex w-full max-w-5xl flex-col gap-5 px-6 py-10 md:px-10 gsap-element"
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
