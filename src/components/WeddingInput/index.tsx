import * as React from "react"
import { Input as ShadcnInput } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface WeddingInputProps extends React.ComponentProps<"input"> {
  accent?: string
  borderColor?: string
  label?: string
  error?: string
  labelColor?: string
}

const WeddingInput = React.forwardRef<HTMLInputElement, WeddingInputProps>(
  (
    { className, accent, borderColor, label, error, labelColor, ...props },
    ref
  ) => {
    const [focused, setFocused] = React.useState(false)

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label
            className="font-sans text-[11px] font-bold tracking-[0.30em] uppercase"
            style={{ color: labelColor }}
          >
            {label}
          </label>
        )}
        <ShadcnInput
          ref={ref}
          data-slot="wedding-input"
          className={cn(
            "h-auto w-full border-2 bg-transparent px-2 py-3 text-sm md:text-base font-medium shadow-none ring-0 transition-all duration-300 outline-none placeholder:opacity-40 focus-visible:dark:border-red-800 focus-visible:dark:ring-red-800/50 focus-visible:border-green-800 focus-visible:ring-green-800/50",
            className
          )}
          style={{
            borderTopColor: focused ? accent : (borderColor ?? "transparent"),
            borderRightColor: focused ? accent : (borderColor ?? "transparent"),
            borderBottomColor: focused
              ? accent
              : (borderColor ?? "transparent"),
            borderLeftColor: focused ? accent : (borderColor ?? "transparent"),
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        {error && (
          <span className="font-sans text-xs text-red-500">{error}</span>
        )}
      </div>
    )
  }
)
WeddingInput.displayName = "WeddingInput"

export { WeddingInput }
