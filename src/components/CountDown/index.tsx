"use client"

import { useCountdown } from "@/hooks/useCountDown"
import { cn } from "@/lib/utils"
import moment from "moment"
import React from "react"

export const Countdown = ({
  isVisibleLabel = true,
  className,
}: {
  isVisibleLabel?: boolean
  className?: string
}) => {
  const {
    title,
    isEventDay,
    units,
    isFinished,
    unduhMantuDate,
    mantuDate,
    isUnduhDay,
    timeLeft,
  } = useCountdown()

  if (isFinished && timeLeft === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-1 font-bold text-primary animate-fade-up">
        <span className="mt-1.5 text-md font-bold tracking-[0.3em] uppercase md:text-xl">
          Terimakasih Atas Kehadiran Anda
        </span>
        <span className="mt-1.5 text-md font-bold tracking-[0.3em] uppercase md:text-[10px]">
          Acara Pernikahan : {moment(mantuDate).format("D MMMM YYYY")}
        </span>
        <span className="mt-1.5 text-md font-bold tracking-[0.3em] uppercase md:text-[10px]">
          Acara Ngunduh Mantu : {moment(unduhMantuDate).format("D MMMM YYYY")}
        </span>
      </div>
    )
  }

  if (isEventDay && timeLeft === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-1 opacity/80 text-primary animate-fade-up">
        <span className=" text-lg md:text-2xl tracking-[0.3em] uppercase">
          Acara Telah Dimulai
        </span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 font-bold text-primary",
        className
      )}
    >
      <div className="flex flex-col gap-1 items-center">
        {title && isVisibleLabel && (
          <span className=" text-xs font-bold tracking-[0.3em] uppercase opacity-80 md:text-xs">
            {title}
          </span>
        )}

        <span className=" text-xs font-bold tracking-[0.3em] uppercase opacity-80 md:text-xs">
          {isUnduhDay
            ? moment(unduhMantuDate).format("D MMMM YYYY")
            : moment(mantuDate).format("D MMMM YYYY")}
        </span>
      </div>

      <div className="flex items-center gap-1">
        {units?.map((u, i) => (
          <React.Fragment key={u.label}>
            <div className="flex min-w-14 flex-col items-center md:min-w-18">
              <span className="font-signature text-3xl leading-none tracking-tight tabular-nums md:text-5xl">
                {String(u.value).padStart(2, "0")}
              </span>
              <span className="mt-1.5 text-[9px] font-medium tracking-[0.3em] uppercase md:text-[10px]">
                {u.label}
              </span>
            </div>

            {/* Tanda ":" di antara angka, kecuali setelah yang terakhir */}
            {i < units.length - 1 && (
              <span className="-mt-4 select-none font-serif text-2xl md:text-4xl">
                :
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
