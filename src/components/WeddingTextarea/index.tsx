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
            className="font-sans text-sm font-bold tracking-[0.30em] uppercase"
            style={{ color: labelColor }}
          >
            {label}
          </label>
        )}
        <ShadcnTextarea
          ref={ref}
          data-slot="wedding-textarea"
          className={cn(
            "min-h-32 resize-none border-2 border-border bg-transparent p-4 text-base font-medium shadow-none ring-0 transition-all duration-300 outline-none placeholder:opacity-40",
            className
          )}
          style={{
            borderColor: focused ? accent : (borderColor ?? "transparent"),
            borderRadius: "12px",
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
WeddingTextarea.displayName = "WeddingTextarea"

export { WeddingTextarea }
