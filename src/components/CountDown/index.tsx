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
  const { title, isEventDay, units, isFinished, unduhMantuDate, mantuDate } =
    useCountdown()

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center gap-1 font-bold text-primary dark:text-muted animate-fade-up">
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

  if (isEventDay) {
    return (
      <div className="flex flex-col items-center justify-center gap-1 font-bold text-primary dark:text-muted animate-fade-up">
        <span className="font-signature text-4xl leading-none  md:text-6xl">
          Acara Telah Dimulai
        </span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-1 font-bold text-primary dark:text-muted",
        className
      )}
    >
      {title && isVisibleLabel && (
        <span className="mb-3 text-[10px] font-bold tracking-[0.3em] uppercase opacity-80 md:text-xs">
          {title}
        </span>
      )}

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
