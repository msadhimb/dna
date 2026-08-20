import * as React from "react"
import { Textarea as ShadcnTextarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Label } from "../ui/label"

interface FormTextAreaProps extends React.ComponentProps<"textarea"> {
  accent?: string
  borderColor?: string
  label?: string
  error?: string
  labelColor?: string
}

const FormTextArea = React.forwardRef<HTMLTextAreaElement, FormTextAreaProps>(
  (
    { className, accent, borderColor, label, error, labelColor, ...props },
    ref
  ) => {
    const [focused, setFocused] = React.useState(false)

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <Label
            className="font-sans text-[10px] md:text-[11px] font-bold tracking-[0.30em] uppercase"
            style={{ color: labelColor }}
          >
            {label}
          </Label>
        )}
        <ShadcnTextarea
          ref={ref}
          data-slot="wedding-textarea"
          className={cn(
            "min-h-32 resize-none bg-transparent p-3 text-xs md:text-base font-medium shadow-none ring-0 transition-all duration-300 outline-none placeholder:opacity-40 rounded-xl focus-visible:dark:border-red-800 focus-visible:dark:ring-red-800/50 focus-visible:border-green-800 focus-visible:ring-green-800/50",
            error && "border-red-500! focus-visible:ring-red-200",
            className
          )}
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
FormTextArea.displayName = "FormTextArea"

export { FormTextArea }
