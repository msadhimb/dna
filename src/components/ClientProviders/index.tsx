"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React, { useState } from "react"
import { TooltipProvider } from "../ui/tooltip"
import { Toaster } from "../ui/toaster"
import { useTheme } from "next-themes"
import { ConfirmDialog } from "../ConfirmDialog"

const ClientProviders = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient())
  const { resolvedTheme } = useTheme()
  const theme = resolvedTheme === "dark" ? "dark" : "light"
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>{children}</TooltipProvider>
      <Toaster position="top-right" theme={theme} />
      <ConfirmDialog />
    </QueryClientProvider>
  )
}

export default ClientProviders
