"use client"

import React, { useState, useRef } from "react"
import { useTheme } from "next-themes"
import { Send, CheckCircle2, XCircle, HelpCircle } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger)

/* ── Shared decorative elements ─────────────────────────────────── */

const WideOrnament = ({
  color,
  flip = false,
}: {
  color: string
  flip?: boolean
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "16px",
      width: "100%",
      maxWidth: "260px",
      transform: flip ? "rotate(180deg)" : "none",
    }}
  >
    <div style={{ height: "1px", flex: 1, background: color, opacity: 0.5 }} />
    <div
      style={{
        width: "4px",
        height: "4px",
        borderRadius: "50%",
        background: color,
        opacity: 0.8,
      }}
    />
    <div style={{ height: "1px", flex: 1, background: color, opacity: 0.5 }} />
  </div>
)

// The signature element: a hand-stamped wax seal, reused as the submit
// button and again as the "pin" on every card in the list, so the two
// halves of the section visibly belong to each other.
const Seal = ({
  color,
  ink,
  size = 44,
}: {
  color: string
  ink: string
  size?: number
}) => (
  <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
    <circle cx="22" cy="22" r="21" stroke={color} strokeWidth="1.2" />
    <circle
      cx="22"
      cy="22"
      r="16"
      stroke={color}
      strokeWidth="0.6"
      opacity="0.6"
    />
    <path
      d="M22 13 C25 17 29 18 29 22 C29 26.4 25.9 30 22 30 C18.1 30 15 26.4 15 22 C15 18 19 17 22 13Z"
      fill="none"
      stroke={ink}
      strokeWidth="1.1"
    />
  </svg>
)

/* ── Types ──────────────────────────────────────────────────────── */

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
      "MasyaAllah, barakallahu lakuma. Semoga menjadi keluarga yang diberkahi.",
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

// Three paper tones the cards cycle through, so the list reads like a
// stack of real note cards rather than a repeating row template.
const PAPER = {
  light: ["#FBF7EE", "#F6EAE3", "#EDF1E4"],
  dark: ["#211d16", "#24191a", "#191d16"],
}
// Small alternating rotation, kept tiny so it stays elegant rather than gimmicky.
const TILT = [-0.6, 0.5, -0.4, 0.7]

/* ── Comment card ───────────────────────────────────────────────── */

const CommentCard = ({
  comment,
  index,
  accent,
  body,
  label,
  border,
  paper,
}: {
  comment: Comment
  index: number
  accent: string
  body: string
  label: string
  border: string
  paper: string
}) => {
  const attendanceConfig = {
    hadir: {
      icon: <CheckCircle2 className="h-3 w-3" />,
      text: "Hadir",
      color: "#4ade80",
    },
    tidak_hadir: {
      icon: <XCircle className="h-3 w-3" />,
      text: "Tidak Hadir",
      color: "#f87171",
    },
    ragu: {
      icon: <HelpCircle className="h-3 w-3" />,
      text: "Ragu-ragu",
      color: accent,
    },
  }
  const att = attendanceConfig[comment.attendance]

  return (
    <div
      className="comment-card-anim group relative flex flex-col gap-3 px-6 pt-8 pb-5 transition-transform duration-300 hover:-translate-y-1"
      style={{
        background: paper,
        border: `1px solid ${border}`,
        borderRadius: "2px",
        transform: `rotate(${TILT[index % TILT.length]}deg)`,
        boxShadow: "0 8px 20px -12px rgba(0,0,0,0.25)",
      }}
    >
      {/* Pin — the seal motif, tying this card back to the send button */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{ top: "-16px" }}
      >
        <Seal color={accent} ink={accent} size={28} />
      </div>

      <div className="flex items-start justify-between gap-3">
        <p
          className="font-signature text-lg leading-none"
          style={{ color: body }}
        >
          {comment.name}
        </p>
        <span
          className="flex shrink-0 items-center gap-1 text-[10px] font-medium tracking-wide"
          style={{ color: att.color }}
        >
          {att.icon}
          {att.text}
        </span>
      </div>

      <p
        className="font-sans text-sm leading-relaxed"
        style={{ color: body, opacity: 0.8 }}
      >
        {comment.message}
      </p>

      <p
        className="font-sans text-[10px] tracking-[0.15em] uppercase"
        style={{ color: label }}
      >
        {comment.date}
      </p>
    </div>
  )
}

/* ── Main section ───────────────────────────────────────────────── */

export const CommentSection = () => {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const containerRef = useRef<HTMLElement>(null)

  const [comments, setComments] = useState<Comment[]>(DUMMY_COMMENTS)
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [attendance, setAttendance] = useState<
    "hadir" | "tidak_hadir" | "ragu"
  >("hadir")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const accent = isDark ? "#d4af37" : "#c9a227"
  const label = isDark ? "#8a7060" : "#9a865a"
  const body = isDark ? "#e0d8d0" : "#1e1a14"
  const border = isDark ? "rgba(212,175,55,0.22)" : "rgba(201,162,39,0.22)"
  const inputBg = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.015)"
  const paperTones = isDark ? PAPER.dark : PAPER.light

  useGSAP(
    () => {
      const header = gsap.utils.toArray<HTMLElement>(".ucapan-header")
      const form = gsap.utils.toArray<HTMLElement>(".ucapan-form")
      const cards = gsap.utils.toArray<HTMLElement>(".comment-card-anim")

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      })

      tl.fromTo(
        header,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: "power3.out" }
      )
        .fromTo(
          form,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.9, ease: "power3.out" },
          "-=0.5"
        )
        .fromTo(
          cards,
          { opacity: 0, y: 24, rotate: 0 },
          {
            opacity: 1,
            y: 0,
            rotate: (i: number) => TILT[i % TILT.length],
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
          },
          "-=0.6"
        )
    },
    { scope: containerRef, dependencies: [comments.length] }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return

    setIsSubmitting(true)
    setTimeout(() => {
      const newComment: Comment = {
        id: Date.now().toString(),
        name,
        message,
        attendance,
        date: "Baru saja",
      }
      setComments([newComment, ...comments])
      setName("")
      setMessage("")
      setAttendance("hadir")
      setIsSubmitting(false)
    }, 600)
  }

  const attendanceOptions: {
    value: "hadir" | "tidak_hadir" | "ragu"
    label: string
  }[] = [
    { value: "hadir", label: "Hadir" },
    { value: "tidak_hadir", label: "Tidak Hadir" },
    { value: "ragu", label: "Ragu-ragu" },
  ]

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden bg-background"
    >
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-14 p-6 py-24 md:py-32">
        {/* Header — left-aligned, editorial, no boxed frame */}
        <div className="flex flex-col gap-4">
          <p
            className="ucapan-header font-serif text-[10px] tracking-[0.5em] uppercase"
            style={{ color: label }}
          >
            Kartu Ucapan
          </p>
          <h2
            className="ucapan-header font-signature text-5xl md:text-6xl"
            style={{ color: body }}
          >
            Ucapan &amp; Doa
          </h2>
          <p
            className="ucapan-header max-w-md font-sans text-sm leading-relaxed"
            style={{ color: label, lineHeight: 1.8 }}
          >
            Tuliskan doa dan harapan terbaik untuk kedua mempelai — setiap kartu
            akan kami simpan sebagai kenangan.
          </p>
          <div className="ucapan-header flex">
            <WideOrnament color={accent} />
          </div>
        </div>

        <div className="flex flex-col gap-12 md:flex-row md:items-start">
          {/* Form panel */}
          <div
            className="ucapan-form relative w-full px-7 py-8 md:sticky md:top-24 md:w-[340px] md:shrink-0"
            style={{
              background: isDark
                ? "rgba(255,255,255,0.02)"
                : "rgba(0,0,0,0.012)",
              border: `1px solid ${border}`,
              borderLeft: `2px solid ${accent}`,
            }}
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label
                  className="font-serif text-[10px] tracking-[0.3em] uppercase"
                  style={{ color: label }}
                >
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masukkan nama Anda..."
                  className="border-b bg-transparent px-2 py-2.5 font-sans text-sm transition-all duration-300 outline-none placeholder:opacity-40"
                  style={{
                    borderColor: border,
                    color: body,
                    background: inputBg,
                  }}
                  onFocus={(e) => (e.target.style.borderColor = accent)}
                  onBlur={(e) => (e.target.style.borderColor = border)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  className="font-serif text-[10px] tracking-[0.3em] uppercase"
                  style={{ color: label }}
                >
                  Konfirmasi Kehadiran
                </label>
                <div className="flex flex-col gap-1.5">
                  {attendanceOptions.map((opt) => {
                    const isActive = attendance === opt.value
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setAttendance(opt.value)}
                        className="flex items-center justify-between px-3 py-2 text-left text-[11px] font-medium tracking-[0.15em] uppercase transition-all duration-300"
                        style={{
                          border: `1px solid ${isActive ? accent : border}`,
                          color: isActive ? accent : label,
                          background: isActive ? `${accent}12` : "transparent",
                        }}
                      >
                        {opt.label}
                        {isActive && <span style={{ color: accent }}>✓</span>}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  className="font-serif text-[10px] tracking-[0.3em] uppercase"
                  style={{ color: label }}
                >
                  Ucapan &amp; Doa
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tulis ucapan atau doa Anda..."
                  className="resize-none border bg-transparent p-3 font-sans text-sm transition-all duration-300 outline-none placeholder:opacity-40"
                  style={{
                    borderColor: border,
                    color: body,
                    background: inputBg,
                  }}
                  onFocus={(e) => (e.target.style.borderColor = accent)}
                  onBlur={(e) => (e.target.style.borderColor = border)}
                />
              </div>

              {/* Submit — the seal stamp, doubling as the send button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="group mt-1 flex items-center gap-3 self-start"
                style={{ opacity: isSubmitting ? 0.6 : 1 }}
              >
                <span className="transition-transform duration-300 group-hover:rotate-12">
                  <Seal color={accent} ink={accent} size={40} />
                </span>
                <span
                  className="font-serif text-[11px] tracking-[0.25em] uppercase"
                  style={{ color: body }}
                >
                  {isSubmitting ? "Mengirim..." : "Kirim Ucapan"}
                </span>
                <Send className="h-3.5 w-3.5" style={{ color: accent }} />
              </button>
            </form>
          </div>

          {/* Card grid */}
          <div className="flex w-full flex-col gap-8">
            <p
              className="font-serif text-[10px] tracking-[0.3em] uppercase"
              style={{ color: label }}
            >
              {comments.length} Ucapan telah masuk
            </p>

            {comments.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16">
                <Seal color={accent} ink={accent} size={36} />
                <p className="font-sans text-xs" style={{ color: label }}>
                  Jadilah yang pertama mengirim ucapan
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2">
                {comments.map((comment, i) => (
                  <CommentCard
                    key={comment.id}
                    comment={comment}
                    index={i}
                    accent={accent}
                    body={body}
                    label={label}
                    border={border}
                    paper={paperTones[i % paperTones.length]}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CommentSection
