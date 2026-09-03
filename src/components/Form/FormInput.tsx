import * as React from "react"
import { Input as ShadcnInput } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

export interface FormInputProps extends React.ComponentProps<"input"> {
  
  accent?: string
  
  borderColor?: string
  label?: string
  error?: string
  
  labelColor?: string
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, label, error, id, style, ...props }, ref) => {
    const generatedId = React.useId()
    const inputId = id ?? generatedId

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <Label
            htmlFor={inputId}
            className="font-sans text-[10px] font-bold tracking-[0.30em] uppercase md:text-[11px] text-wedding-text-secondary"
          >
            {label}
          </Label>
        )}
        <ShadcnInput
          {...props}
          id={inputId}
          ref={ref}
          data-slot="wedding-input"
          aria-invalid={!!error}
          className={cn(
            "h-auto w-full bg-transparent p-3 text-xs font-medium shadow-none ring-0 transition-all duration-300 outline-none placeholder:opacity-40 border-wedding-border text-wedding-text-primary focus-visible:border-wedding-accent focus-visible:ring-wedding-accent/50 md:text-base",
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
FormInput.displayName = "FormInput"

export { FormInput }
