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
        className="absolute top-[80%] md:top-[65%] left-0 md:left-24 z-10 h-50 w-40 overflow-hidden"
      >
        <Image
          key={imgBack}
          src={imgBack}
          alt=""
          fill
          sizes="(max-width: 768px) 400vw, 220vw"
          className="object-cover"
        />
      </div>

      <div
        ref={floatImgFrontRef}
        className="absolute top-[60%] md:top-[50%] left-10 md:left-50 z-20 h-65 w-50 overflow-hidden"
      >
        <Image
          key={imgFront}
          src={imgFront}
          alt=""
          fill
          sizes="(max-width: 768px) 400vw, 220vw"
          className="object-cover"
        />
      </div>

      <div
        ref={floatImgRightRef}
        className="absolute top-[90%] md:top-[45%] right-20 md:right-50 z-10 h-60 w-40 -translate-y-1/2 overflow-hidden"
      >
        <Image
          key={imgRight}
          src={imgRight}
          alt=""
          fill
          sizes="(max-width: 768px) 400vw, 220vw"
          style={{
            objectFit: "cover",
            filter: "brightness(0.85) saturate(0.9)",
          }}
        />
      </div>

      <div
        ref={floatImgRightFrontRef}
        className="absolute top-[70%] md:top-[80%] right-0 md:right-0 z-10 h-70 w-50 -translate-y-1/2 overflow-hidden"
      >
        <Image
          key={imgRightFront}
          src={imgRightFront}
          alt=""
          fill
          sizes="(max-width: 768px) 400vw, 220vw"
          style={{
            objectFit: "cover",
            filter: "brightness(0.85) saturate(0.9)",
          }}
        />
      </div>
    </>
  )
}
