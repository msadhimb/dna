"use client"

import { useEffect, useState, useMemo, useRef } from "react"
import { useTheme } from "next-themes"
import { Heart } from "lucide-react"
import HeroSection from "../../components/HeroSection"
import {
  CurtainTransition,
  CurtainTransitionRef,
} from "@/components/Transition/CuratinTransition"
import JourneySequence, {
  JourneySequenceRef,
} from "@/components/JourneySequence"
import BookFlip, { BookFlipRef } from "@/components/BookFlip"
import {
  WelcomeSection,
  WelcomeSectionRef,
} from "../../components/WelcomeSection"
import { LoadingScreen } from "@/components/LoadingScreen"
import RomanticQuote from "@/components/RomanticQuote"
import DigitalGift from "@/components/DigitalGift"
import CommentSection, { CommentSectionRef } from "@/components/CommentSection"
import Footer from "@/components/Footer"
import Image from "next/image"
import { Tools } from "@/components/Tools"
import { useImageUrl } from "@/store/useImageUrl"
import { useGuest, Guest } from "@/store/useGuest"
import { registerGSAP } from "@/lib/gsap"
import { usePinnedScrollSequence } from "@/hooks/usePinnedScrollSequence"

registerGSAP()

const MainView = ({
  guestId,
  guestName,
  guest,
}: {
  guestId?: string
  guestName?: string
  guest?: Guest
}) => {
  const { resolvedTheme } = useTheme()
  const { imageUrl } = useImageUrl()
  const setGuest = useGuest((state) => state.setGuest)

  useEffect(() => {
    setGuest(guest ?? null)
  }, [guest, setGuest])

  const [mounted, setMounted] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  const theme = resolvedTheme === "dark" ? "dark" : "light"

  const mainRef = useRef<HTMLElement>(null)
  const welcomeRef = useRef<WelcomeSectionRef>(null)
  const curtainRef = useRef<CurtainTransitionRef>(null)
  const journeyRef = useRef<JourneySequenceRef>(null)
  const bookFlipRef = useRef<BookFlipRef>(null)
  const commentRef = useRef<CommentSectionRef>(null)

  const PREVIEW_FRAMES = [
    {
      light: imageUrl.light?.[1]?.link,
      dark: imageUrl.dark?.[1]?.link,
    },
    {
      light: imageUrl.light?.[2]?.link,
      dark: imageUrl.dark?.[2]?.link,
    },
    {
      light: imageUrl.light?.[3]?.link,
      dark: imageUrl.dark?.[3]?.link,
    },
    {
      light: imageUrl.light?.[4]?.link,
      dark: imageUrl.dark?.[4]?.link,
    },
    {
      light: imageUrl.light?.[5]?.link,
      dark: imageUrl.dark?.[5]?.link,
    },
    {
      light: (
        <div className="relative flex h-full w-full flex-col items-center justify-center gap-4 bg-primary px-6 py-10 text-muted md:px-10">
          <p className="max-w-sm text-center font-signature text-2xl leading-relaxed font-bold tracking-wide md:max-w-lg md:text-3xl">
            وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا
            لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ
            إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ
          </p>
          <div className="flex items-center gap-3 opacity-70">
            <span className="h-px w-8 bg-current" />
            <span className="text-xs">✦</span>
            <span className="h-px w-8 bg-current" />
          </div>
          <p className="font-sans text-xs tracking-[0.2em] uppercase opacity-80">
            QS. Ar-Rum : 21
          </p>
          <p className="max-w-sm text-center font-sans text-sm leading-relaxed font-light italic opacity-90 md:max-w-lg">
            &ldquo;Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan
            pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung
            dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa
            kasih dan sayang. Sesungguhnya pada yang demikian itu benar-benar
            terdapat tanda-tanda bagi kaum yang berpikir.&rdquo;
          </p>
        </div>
      ),
      dark: (
        <div className="relative flex h-full w-full flex-col items-center justify-center gap-4 bg-primary px-6 py-10 text-black md:px-10">
          <p className="max-w-sm text-center font-signature text-2xl leading-relaxed font-bold tracking-wide md:max-w-lg md:text-3xl">
            رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ
            أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا
          </p>
          <div className="flex items-center gap-3 opacity-70">
            <span className="h-px w-8 bg-current" />
            <span className="text-xs">✦</span>
            <span className="h-px w-8 bg-current" />
          </div>
          <p className="font-sans text-xs tracking-[0.2em] uppercase opacity-80">
            QS. Al-Furqan : 74
          </p>
          <p className="max-w-sm text-center font-sans text-sm leading-relaxed font-light italic opacity-90 md:max-w-lg">
            &ldquo;Wahai Tuhan kami, anugerahkanlah kepada kami istri-istri kami
            dan keturunan kami sebagai penyejuk mata (bagi kami), dan jadikanlah
            kami imam bagi orang-orang yang bertakwa.&rdquo;
          </p>
        </div>
      ),
    },
  ]

  const frames = useMemo(() => {
    return PREVIEW_FRAMES.map((frame, i) => {
      const content: any = theme === "dark" ? frame.dark : frame.light

      if (typeof content === "string") {
        return (
          <Image
            key={i}
            src={content}
            alt={`Curtain Photo ${i + 1}`}
            fill
            sizes="100vw"
            priority={i === 0}
            className="object-cover object-center"
          />
        )
      }

      return (
        <div key={i} className="absolute inset-0 h-full w-full">
          {content}
        </div>
      )
    })
  }, [theme, imageUrl])

  useEffect(() => {
    setMounted(true)
  }, [])

  // Orkestrasi pinned scroll dipindah ke hook terpisah
  usePinnedScrollSequence(
    mainRef,
    { welcomeRef, curtainRef, journeyRef, bookFlipRef, commentRef },
    { isLoaded, theme }
  )

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Heart className="h-6 w-6 animate-pulse text-foreground/20" />
      </div>
    )
  }

  const handleLoadingComplete = () => setIsLoaded(true)

  return (
    <main ref={mainRef} className="bg-background">
      <Tools />
      {!isLoaded && <LoadingScreen onComplete={handleLoadingComplete} />}

      <section
        id="master-trigger"
        className="gsap-element relative h-screen w-full overflow-hidden bg-background"
        style={{ willChange: "transform" }}
      >
        <div className="absolute inset-0 z-0">
          <HeroSection />
        </div>

        <WelcomeSection ref={welcomeRef} guestName={guestName} />

        <div className="pointer-events-none absolute inset-0 z-30">
          <CurtainTransition ref={curtainRef} frames={frames} />
        </div>

        <div
          id="journey-wrapper"
          className="gsap-element pointer-events-none absolute inset-0 z-20 flex h-full w-full flex-col justify-center overflow-hidden bg-background opacity-0"
        >
          <JourneySequence ref={journeyRef} theme={theme} />
        </div>

        <div
          id="book-flip-wrapper"
          className="gsap-element pointer-events-none absolute inset-0 z-20 flex h-full w-full flex-col justify-center overflow-hidden bg-background opacity-0"
        >
          <BookFlip ref={bookFlipRef} theme={theme} />
        </div>
      </section>
      <div className="flex flex-col gap-0 bg-background">
        <RomanticQuote />
        <CommentSection
          ref={commentRef}
          guestId={guestId}
          guestName={guestName}
        />
        <DigitalGift />
        <Footer />
      </div>
    </main>
  )
}

export default MainView
