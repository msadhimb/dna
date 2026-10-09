import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"
import React from "react"

const ScrollIndicator = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "relative flex justify-center text-wedding-accent",
        className
      )}
    >
      <ChevronDown className=" absolute animate-bounce" size={18} />
      <ChevronDown className=" absolute top-2 animate-bounce" size={18} />
      <ChevronDown className=" absolute top-4 animate-bounce" size={18} />
    </div>
  )
}

export default ScrollIndicator
