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
            className="font-sans text-sm font-bold tracking-[0.30em] uppercase"
            style={{ color: labelColor }}
          >
            {label}
          </label>
        )}
        <ShadcnInput
          ref={ref}
          data-slot="wedding-input"
          className={cn(
            "h-auto w-full border-2 border-border bg-transparent px-4 py-3 text-base font-medium shadow-none ring-0 transition-all duration-300 outline-none placeholder:opacity-40",
            className
          )}
          style={{
            borderColor: focused ? accent : (borderColor ?? "transparent"),
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        {error && (
          <span className="font-sans text-xs" style={{ color: "#EF4444" }}>
            {error}
          </span>
        )}
      </div>
    )
  }
)
WeddingInput.displayName = "WeddingInput"

export { WeddingInput }
