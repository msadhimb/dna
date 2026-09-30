"use client"

import {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react"
import { useTheme } from "next-themes"
import { gsap, ScrollTrigger } from "@/lib/gsap"
import { FloatImages, CommentForm, CommentList } from "./components"
import { useImageUrl } from "@/store/useImageUrl"
import { useComments } from "@/hooks/useComments"
import { useToast } from "@/hooks/use-toast"
import type { Attendance } from "@/types/comment"
import Header from "../Header"

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
  const spinTlRef = useRef<gsap.core.Timeline | null>(null)
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
    ? (imageUrl as any)?.dark?.[1]?.link ?? ""
    : (imageUrl as any)?.light?.[1]?.link ?? ""
  const imgFront = isDark
    ? (imageUrl as any)?.dark?.[0]?.link ?? ""
    : (imageUrl as any)?.light?.[0]?.link ?? ""
  const imgRight = isDark
    ? (imageUrl as any)?.dark?.[2]?.link ?? ""
    : (imageUrl as any)?.light?.[2]?.link ?? ""
  const imgRightFront = isDark
    ? (imageUrl as any)?.dark?.[3]?.link ?? ""
    : (imageUrl as any)?.light?.[3]?.link ?? ""

  useImperativeHandle(ref, () => ({
    getTimeline: () => {
      const triggerEl = sectionRef.current
      if (!triggerEl) return gsap.timeline()

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

      // Tanpa fade entrance: konten langsung tampil apa adanya.
      // Parallax float di atas tetap dipertahankan.
      return gsap.timeline()
    },
  }))

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    const el = contentRef.current
    if (!el) return

    if (spinTlRef.current) {
      spinTlRef.current.kill()
      spinTlRef.current = null
    }
    gsap.killTweensOf(el)

    const tl = gsap.timeline({
      defaults: { overwrite: "auto" },
      onComplete: () => {
        gsap.set(el, { scale: 1, rotateY: 0, x: 0, y: 0 })
        if (spinTlRef.current === tl) spinTlRef.current = null
      },
      onInterrupt: () => {
        if (spinTlRef.current === tl) spinTlRef.current = null
      },
    })
    spinTlRef.current = tl
    const startRot = Number(gsap.getProperty(el, "rotateY")) || 0
    const endRot = Math.round(startRot / 360) * 360 + 360
    tl.to(el, { scale: 0.85, x: 0, y: 0, duration: 0.3, ease: "power2.in" })
      .to(el, { rotateY: endRot, duration: 0.8, ease: "power2.inOut" }, ">")
      .to(
        el,
        {
          scale: 1,
          x: 0,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
        },
        ">"
      )

    return () => {
      tl.kill()
      if (spinTlRef.current === tl) spinTlRef.current = null
    }
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
      id="comment"
      className="relative w-full scroll-mt-16 overflow-hidden bg-background gsap-element"
      style={{ perspective: "1500px" }}
    >
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
        className="pointer-events-auto relative z-40 mx-auto flex w-full max-w-5xl flex-col gap-5 px-5 gsap-element py-1"
        style={{
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
          willChange: "transform",
        }}
      >
        <Header
          subHeader="Kartu Ucapan"
          title="Ucapan & Doa"
          subTitle="Sematkan doa dan harapan terbaik Anda untuk Devi & Adhim. Setiap kata yang ditulis akan menjadi kenangan berharga."
        />

        <CommentForm
          onSubmit={handleFormSubmit}
          isSubmitting={isSubmitting}
          submitted={submitted}
          guestName={guestName}
        />

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
