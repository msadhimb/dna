"use client"

import * as React from "react"
import {
  Tabs as BaseTabs,
  TabsContent as BaseTabsContent,
  TabsList as BaseTabsList,
  TabsTrigger as BaseTabsTrigger,
} from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

export type TabsMode = "glass" | "solid"

export interface TabsItem {
  value: string
  label: React.ReactNode
}

export interface TabsProps extends Omit<
  React.ComponentProps<typeof BaseTabs>,
  "children"
> {

  mode?: TabsMode
  items: TabsItem[]

  listLabel?: string
  listClassName?: string
  triggerClassName?: string
  contentClassName?: string
  children: React.ReactNode
}

const listModeClass: Record<TabsMode, string> = {
  glass:
    "border-white/15 bg-white/[0.08] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.55)] backdrop-blur-xl",
  solid: "border-wedding-border-accent bg-wedding-surface shadow-wedding-card",
}

const triggerModeClass: Record<TabsMode, string> = {
  glass: "text-white/70 hover:text-white data-[state=inactive]:bg-transparent",
  solid:
    "text-wedding-text-secondary hover:text-wedding-text-primary data-[state=inactive]:bg-transparent",
}

export function Tabs({
  mode = "solid",
  items,
  listLabel,
  listClassName,
  triggerClassName,
  contentClassName: _contentClassName,
  className,
  children,
  ...props
}: TabsProps) {
  return (
    <BaseTabs
      className={cn("flex w-full flex-col items-center gap-5", className)}
      {...props}
    >
      <BaseTabsList
        aria-label={listLabel}
        className={cn(
          "h-auto max-w-full flex-wrap items-center justify-center gap-1.5 rounded-full border border-transparent bg-transparent p-1.5",
          listModeClass[mode],
          listClassName
        )}
      >
        {items.map((item) => (
          <BaseTabsTrigger
            key={item.value}
            value={item.value}
            className={cn(
              "h-auto flex-none rounded-full border-0 px-4 py-2.5 text-[11px] font-bold tracking-[0.14em] uppercase transition-all duration-200 data-[state=active]:bg-wedding-accent data-[state=active]:text-white data-[state=active]:shadow-md md:px-5 ",
              triggerModeClass[mode],
              triggerClassName
            )}
          >
            {item.label}
          </BaseTabsTrigger>
        ))}
      </BaseTabsList>
      {children}
    </BaseTabs>
  )
}

export { BaseTabsContent as TabsContent }
export default Tabs
