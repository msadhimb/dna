"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export type FormDropdownOption = {
  label: string
  value: string
  disabled?: boolean
}

export interface FormDropdownProps {
  options: FormDropdownOption[]
  label?: string
  error?: string
  labelColor?: string
  accent?: string
  borderColor?: string
  placeholder?: string
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  onBlur?: () => void
  name?: string
  required?: boolean
  disabled?: boolean
  className?: string
  triggerClassName?: string
  contentClassName?: string
}

function FormDropdown({
  options,
  label,
  error,
  labelColor,
  borderColor,
  placeholder = "Pilih opsi",
  value,
  defaultValue,
  onChange,
  onBlur,
  name,
  required,
  disabled,
  className,
  triggerClassName,
  contentClassName,
}: FormDropdownProps) {
  const generatedId = React.useId()
  const selectedValue = value ?? defaultValue ?? ""
  const selectedOption = options.find(
    (option) => option.value === selectedValue
  )

  const handleChange = (nextValue: string) => {
    onChange?.(nextValue)
    onBlur?.()
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <Label
          htmlFor={generatedId}
          className="font-sans text-[10px] font-bold tracking-[0.30em] uppercase md:text-[11px]"
          style={{ color: labelColor }}
        >
          {label}
        </Label>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger
          id={generatedId}
          disabled={disabled}
          aria-invalid={!!error}
          aria-required={required}
          className={cn(
            "flex h-auto w-full items-center justify-between gap-2 rounded-lg border border-input bg-input/30 p-3 text-left text-xs font-medium shadow-none ring-0 transition-all duration-300 outline-none data-[state=open]:border-green-800 data-[state=open]:dark:border-red-800/50 data-[state=open]:ring-3 data-[state=open]:ring-green-800/50 data-[state=open]:dark:ring-red-800/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-base",
            !selectedOption && "text-muted-foreground",
            error && "border-red-500!",
            triggerClassName
          )}
          style={{ borderColor }}
        >
          <span
            className={cn(
              "text-white",
              !selectedOption && "text-muted-foreground/50"
            )}
          >
            {selectedOption?.label ?? placeholder}
          </span>
          <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className={cn(contentClassName)}>
          <DropdownMenuRadioGroup
            value={selectedValue}
            onValueChange={handleChange}
          >
            {options.map((option) => (
              <DropdownMenuRadioItem
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className="py-2 px-4"
              >
                {option.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {name && <input type="hidden" name={name} value={selectedValue} />}
      {error && <span className="font-sans text-xs text-red-500">{error}</span>}
    </div>
  )
}

FormDropdown.displayName = "FormDropdown"

export { FormDropdown }
