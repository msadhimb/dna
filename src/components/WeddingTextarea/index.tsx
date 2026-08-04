import * as React from "react"
import { Textarea as ShadcnTextarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface WeddingTextareaProps extends React.ComponentProps<"textarea"> {
  accent?: string
  borderColor?: string
  label?: string
  error?: string
  labelColor?: string
}

const WeddingTextarea = React.forwardRef<
  HTMLTextAreaElement,
  WeddingTextareaProps
>(
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
        <ShadcnTextarea
          ref={ref}
          data-slot="wedding-textarea"
          className={cn(
            "min-h-32 resize-none border-2 bg-transparent p-2 text-sm md:text-base font-medium shadow-none ring-0 transition-all duration-300 outline-none placeholder:opacity-40 rounded-xl focus-visible:dark:border-red-800 focus-visible:dark:ring-red-800/50 focus-visible:border-green-800 focus-visible:ring-green-800/50",
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
WeddingTextarea.displayName = "WeddingTextarea"

export { WeddingTextarea }
