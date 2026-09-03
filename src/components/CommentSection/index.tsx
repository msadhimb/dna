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
import { useComments } from "@/hooks/useComments"
import { useToast } from "@/hooks/use-toast"
import type { Attendance } from "@/types/comment"

gsap.registerPlugin(ScrollTrigger)

interface Comment {
  id: string
  name: string
  message: string
  attendance: Attendance
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

export const CommentSection = forwardRef<
  CommentSectionRef,
  { guestId?: string; guestName?: string }
>(({ guestId, guestName }, ref) => {
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

  const {
    data: remoteComments = [],
    createComment,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useComments(guestId)
  const { toast } = useToast()
  const [submitted, setSubmitted] = useState(false)
  const comments: Comment[] = remoteComments.map((comment) => ({
    id: comment.id,
    name: comment.name,
    message: comment.comment,
    attendance: comment.attendance,
    date: new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(comment.created_at)),
  }))
  const isSubmitting = createComment.isPending

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

  const handleFormSubmit = async (data: {
    name: string
    message: string
    attendance: Attendance
  }) => {
    if (!guestId) {
      toast({
        title: "Tautan undangan tidak lengkap",
        description:
          "Buka halaman undangan melalui URL dengan ID tamu agar ucapan dapat dikirim.",
      })
      return
    }

    const loadingToast = toast({
      title: "Mengirim ucapan...",
      description: "Mohon tunggu sebentar.",
    })

    try {
      await createComment.mutateAsync({
        name: data.name,
        comment: data.message,
        attendance: data.attendance,
      })
      loadingToast.dismiss()
      toast({
        title: "Ucapan terkirim",
        description: "Terima kasih atas doa dan harapannya.",
      })
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 3000)
    } catch (submitError) {
      loadingToast.dismiss()
      toast({
        title: "Ucapan gagal dikirim",
        description:
          submitError instanceof Error
            ? submitError.message
            : "Silakan coba lagi.",
      })
      throw submitError
    }
  }

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-background gsap-element"
      style={{ perspective: "1500px" }}
    >
      
      <div className="pointer-events-none absolute left-1/2 top-[52%] h-[92vw] max-h-[560px] w-[92vw] max-w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full md:h-[860px] md:max-h-[860px] md:w-[860px] md:max-w-[860px] lg:h-[1040px] lg:max-h-[1040px] lg:w-[1040px] lg:max-w-[1040px] overflow-hidden">
        <div
          className="absolute inset-0 bg-wedding-dot opacity-50"
          style={{
            maskImage: "radial-gradient(circle, black 60%, transparent 78%)",
            WebkitMaskImage: "radial-gradient(circle, black 60%, transparent 78%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--wedding-accent) 13%, transparent) 0%, color-mix(in srgb, var(--wedding-accent) 5%, transparent) 38%, transparent 72%)",
          }}
        />
      </div>

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
        className="pointer-events-auto relative z-40 mx-auto flex w-full max-w-5xl flex-col gap-5 px-6 py-10 gsap-element md:px-10"
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
        />

        <CommentForm
          onSubmit={handleFormSubmit}
          isSubmitting={isSubmitting}
          submitted={submitted}
          guestName={guestName}
        />

        <CounterBadge count={comments.length} />

        <CommentList
          comments={comments}
          hasMore={Boolean(hasNextPage)}
          isLoadingMore={isFetchingNextPage}
          onLoadMore={() => fetchNextPage()}
        />
      </div>
    </section>
  )
})

CommentSection.displayName = "CommentSection"
export default CommentSection
