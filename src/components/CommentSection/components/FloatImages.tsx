import { useRef } from "react"
import Image from "next/image"

interface FloatImagesProps {
  imgBack: string
  imgFront: string
  imgRight: string
  imgRightFront: string
  floatImgBackRef: React.RefObject<HTMLDivElement | null>
  floatImgFrontRef: React.RefObject<HTMLDivElement | null>
  floatImgRightRef: React.RefObject<HTMLDivElement | null>
  floatImgRightFrontRef: React.RefObject<HTMLDivElement | null>
}

export function FloatImages({
  imgBack,
  imgFront,
  imgRight,
  imgRightFront,
  floatImgBackRef,
  floatImgFrontRef,
  floatImgRightRef,
  floatImgRightFrontRef,
}: FloatImagesProps) {
  return (
    <>
      <div
        ref={floatImgBackRef}
        className="pointer-events-none absolute top-[80%] left-0 z-10 h-50 w-40 overflow-hidden md:top-[65%] md:left-24"
      >
        <Image
          key={imgBack}
          src={imgBack}
          alt=""
          fill
          sizes="(max-width: 768px) 160px, 320px"
          className="object-cover"
        />
      </div>

      <div
        ref={floatImgFrontRef}
        className="pointer-events-none absolute top-[60%] left-10 z-20 h-65 w-50 overflow-hidden md:top-[50%] md:left-50"
      >
        <Image
          key={imgFront}
          src={imgFront}
          alt=""
          fill
          sizes="(max-width: 768px) 200px, 400px"
          className="object-cover"
        />
      </div>

      <div
        ref={floatImgRightRef}
        className="pointer-events-none absolute top-[90%] right-20 z-10 h-60 w-40 -translate-y-1/2 overflow-hidden md:top-[45%] md:right-50"
      >
        <Image
          key={imgRight}
          src={imgRight}
          alt=""
          fill
          sizes="(max-width: 768px) 160px, 320px"
          style={{
            objectFit: "cover",
            filter: "brightness(0.85) saturate(0.9)",
          }}
        />
      </div>

      <div
        ref={floatImgRightFrontRef}
        className="pointer-events-none absolute top-[70%] right-0 z-10 h-70 w-50 -translate-y-1/2 overflow-hidden md:top-[80%] md:right-0"
      >
        <Image
          key={imgRightFront}
          src={imgRightFront}
          alt=""
          fill
          sizes="(max-width: 768px) 200px, 400px"
          style={{
            objectFit: "cover",
            filter: "brightness(0.85) saturate(0.9)",
          }}
        />
      </div>
    </>
  )
}
