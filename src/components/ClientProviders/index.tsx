"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React, { useState } from "react"
import { Toaster } from "@/components/ui/toaster"
import { TooltipProvider } from "../ui/tooltip"

const ClientProviders = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>{children}</TooltipProvider>
      <Toaster />
    </QueryClientProvider>
  )
}

export default ClientProviders
