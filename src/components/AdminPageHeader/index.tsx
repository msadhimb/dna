"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import OrnamentalDivider from "@/components/Icons/OrnamentalDivider"

type AdminPageHeaderProps = {
  eyebrow?: string
  title: string
  description?: string
  actions?: React.ReactNode
  align?: "left" | "center"
  className?: string
}

// Header halaman admin yang seragam: eyebrow script + judul serif
// uppercase + divider ornamental + deskripsi + slot aksi.
export const AdminPageHeader = ({
  eyebrow = "Devi & Adhim",
  title,
  description,
  actions,
  align = "left",
  className,
}: AdminPageHeaderProps) => {
  const centered = align === "center"
  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-b border-wedding-border pb-5 lg:flex-row",
        centered
          ? "items-center text-center"
          : "lg:items-end lg:justify-between",
        className
      )}
    >
      <div className={cn("min-w-0", centered && "flex flex-col items-center")}>
        <p className="font-signature text-2xl leading-none text-muted">
          {eyebrow}
        </p>
        <h1 className="mt-1 font-serif text-2xl font-bold tracking-[0.18em] text-foreground uppercase sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-[15px] font-serif">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div
          className={cn(
            "flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:gap-2.5",
            centered ? "justify-center" : "lg:w-auto lg:justify-end"
          )}
        >
          {actions}
        </div>
      )}
    </div>
  )
}

export default AdminPageHeader
