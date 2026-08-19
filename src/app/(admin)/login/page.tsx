"use client"

import { GalleryVerticalEndIcon } from "lucide-react"
import Login from "@/view/Admin/Login"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

export default function LoginPage() {
  const { resolvedTheme } = useTheme()
  const [images, setImages] = useState<{ dark?: string; light?: string }>({})

  useEffect(() => {
    fetch("/api/get-image?folder=pre-wed/dark")
      .then((response) => response.json())
      .then((result) => {
        const dark = result?.data?.dark?.[0]?.link
        if (dark) setImages((current) => ({ ...current, dark }))
      })
      .catch(() => undefined)
    fetch("/api/get-image?folder=pre-wed/light")
      .then((response) => response.json())
      .then((result) => {
        const light = result?.data?.light?.[0]?.link
        if (light) setImages((current) => ({ ...current, light }))
      })
      .catch(() => undefined)
  }, [])

  const image = resolvedTheme === "dark" ? images.dark : images.light

  return (
    <div className="grid min-h-svh lg:grid-cols-2 font-manrope">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <div className="flex items-center gap-2 font-medium">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEndIcon className="size-4" />
            </div>
            Link Generator
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md rounded-lg bg-card p-10 shadow-sm">
            <Login />
          </div>
        </div>
      </div>
      <div className="relative hidden overflow-hidden bg-muted lg:block">
        {image ? (
          <img src={image} alt="Foto pre-wedding" className="absolute inset-0 size-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-muted" />
        )}
      </div>
    </div>
  )
}
