import * as React from "react"
import { Textarea as ShadcnTextarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

export interface FormTextAreaProps extends React.ComponentProps<"textarea"> {
  accent?: string
  borderColor?: string
  label?: string
  error?: string
  labelColor?: string
}

const FormTextArea = React.forwardRef<HTMLTextAreaElement, FormTextAreaProps>(
  ({ className, accent, borderColor, label, error, labelColor, id, ...props }, ref) => {
    const generatedId = React.useId()
    const textareaId = id ?? generatedId

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <Label
            htmlFor={textareaId}
            className="font-sans text-[10px] font-bold tracking-[0.30em] uppercase md:text-[11px]"
            style={{ color: labelColor }}
          >
            {label}
          </Label>
        )}
        <ShadcnTextarea
          {...props}
          id={textareaId}
          ref={ref}
          data-slot="wedding-textarea"
          aria-invalid={!!error}
          className={cn(
            "min-h-32 w-full resize-none rounded-xl bg-transparent p-3 text-xs font-medium shadow-none ring-0 transition-all duration-300 outline-none placeholder:opacity-40 focus-visible:dark:border-red-800 focus-visible:dark:ring-red-800/50 focus-visible:border-green-800 focus-visible:ring-green-800/50 md:text-base",
            error && "border-red-500! focus-visible:ring-red-200",
            className
          )}
          style={{ borderColor, color: accent, ...props.style }}
        />
        {error && <span className="font-sans text-xs text-red-500">{error}</span>}
      </div>
    )
  }
)
FormTextArea.displayName = "FormTextArea"

export { FormTextArea }
