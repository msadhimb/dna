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
  ({ className, label, error, id, style, ...props }, ref) => {
    const generatedId = React.useId()
    const textareaId = id ?? generatedId

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <Label
            htmlFor={textareaId}
            className="font-sans text-[10px] font-bold tracking-[0.30em] uppercase md:text-[11px] text-wedding-text-secondary"
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
            "min-h-32 w-full resize-none rounded-xl bg-transparent p-3 text-xs font-medium shadow-none ring-0 transition-all duration-300 outline-none placeholder:opacity-40 border-wedding-border text-wedding-text-primary focus-visible:border-wedding-accent focus-visible:ring-wedding-accent/50 md:text-base",
            error && "border-red-500! focus-visible:ring-red-200",
            className
          )}
          style={style}
        />
        {error && <span className="font-sans text-xs text-red-500">{error}</span>}
      </div>
    )
  }
)
FormTextArea.displayName = "FormTextArea"

export { FormTextArea }
