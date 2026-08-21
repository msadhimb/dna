import * as React from "react"
import { Input as ShadcnInput } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Label } from "../ui/label"

interface FormInputProps extends React.ComponentProps<"input"> {
  accent?: string
  borderColor?: string
  label?: string
  error?: string
  labelColor?: string
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
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
        <ShadcnInput
          ref={ref}
          data-slot="wedding-input"
          className={cn(
            "h-auto w-full bg-transparent p-3 text-xs md:text-base font-medium shadow-none ring-0 transition-all duration-300 outline-none placeholder:opacity-40 focus-visible:dark:border-red-800 focus-visible:dark:ring-red-800/50 focus-visible:border-green-800 focus-visible:ring-green-800/50",
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
FormInput.displayName = "FormInput"

export { FormInput }
