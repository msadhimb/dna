"use client"

import { Check, Download, Filter, Loader2 } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"
import { cn } from "@/lib/utils"
import { Button } from "@/components/Button"
import { guestFromList } from "@/helper/guestFormList"
import { Switch } from "@/components/ui/switch"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import type { GuestFilters } from "../../hooks/useGuestFilters"

type GuestToolbarProps = {
  filters: GuestFilters
  isExporting: boolean
  onExport: () => void
  onShareWa: () => void
}

const pill =
  "h-9 rounded-xl bg-background text-sm font-medium shadow-xs transition-all hover:-translate-y-px hover:shadow-sm"

// Toolbar DataTable: satu dropdown Filter (Tamu Dari + status) + export/share.
export const GuestToolbar = ({
  filters,
  isExporting,
  onExport,
  onShareWa,
}: GuestToolbarProps) => {
  const {
    guestFromFilter,
    setGuestFromFilter,
    mantuOnly,
    setMantuOnly,
    unduhOnly,
    setUnduhOnly,
    physicalOnly,
    setPhysicalOnly,
    sendedOnly,
    setSendedOnly,
    hasActiveFilters,
    resetFilters,
  } = filters

  const activeCount =
    (guestFromFilter !== "all" ? 1 : 0) +
    [mantuOnly, unduhOnly, physicalOnly, sendedOnly].filter(Boolean).length

  const selectedFromName =
    guestFromList.find((x) => x.id === guestFromFilter)?.name ?? null

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              pill,
              "w-full gap-1.5 border-dashed bg-transparent sm:w-auto",
              activeCount > 0 && "border-book-ornament/60"
            )}
          >
            <Filter className="size-3.5 text-muted" />
            <span className="max-w-36 truncate">
              {selectedFromName ?? "Filter"}
            </span>
            {activeCount > 0 && (
              <span className="ml-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-bold text-secondary">
                {activeCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[calc(100vw-2rem)] rounded-2xl p-0 font-manrope shadow-wedding-card sm:w-80"
          align="end"
        >
          <Command>
            <div className="flex items-center justify-between px-3 pt-3 pb-1">
              <h4 className="text-sm font-semibold">Filter Tamu</h4>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="cursor-pointer text-[11px] font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-destructive hover:underline"
                >
                  Reset semua
                </button>
              )}
            </div>
            <div className="px-2 pb-1">
              <CommandInput placeholder="Cari tamu dari..." className="h-9" />
            </div>
            <CommandList className="max-h-48">
              <CommandEmpty>Tidak ditemukan.</CommandEmpty>
              <CommandGroup heading="Tamu Dari">
                <CommandItem
                  value="Semua Tamu Dari"
                  onSelect={() => setGuestFromFilter("all")}
                  className="rounded-lg data-selected:bg-book-ornament/15"
                >
                  <Check
                    className={cn(
                      "mr-2 size-4",
                      guestFromFilter === "all" ? "opacity-100" : "opacity-0"
                    )}
                  />
                  Semua Tamu
                </CommandItem>
                {guestFromList.map((item) => (
                  <CommandItem
                    value={item.name}
                    key={item.id}
                    onSelect={() => setGuestFromFilter(item.id)}
                    className="rounded-lg data-selected:bg-book-ornament/15"
                  >
                    <Check
                      className={cn(
                        "mr-2 size-4",
                        item.id === guestFromFilter
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {item.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
            <div className="space-y-1 p-3">
              <p className="px-1 pb-1 text-[11px] font-bold tracking-[0.18em] text-muted-foreground uppercase">
                Status
              </p>
              {(
                [
                  ["Mantu", mantuOnly, setMantuOnly],
                  ["Ngunduh Mantu", unduhOnly, setUnduhOnly],
                  ["Undangan Fisik", physicalOnly, setPhysicalOnly],
                  ["WA Terkirim", sendedOnly, setSendedOnly],
                ] as const
              ).map(([label, checked, set]) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-lg px-1 py-1.5"
                >
                  <span className="text-xs font-medium text-foreground">
                    {label}
                  </span>
                  <Switch checked={checked} onCheckedChange={set} size="sm" />
                </div>
              ))}
            </div>
          </Command>
        </PopoverContent>
      </Popover>

      <Button
        variant="outline"
        size="sm"
        disabled={isExporting}
        onClick={onExport}
        title="Export Excel (urut Tamu Dari A-Z)"
        className={cn(
          pill,
          "w-full gap-1.5 border-dashed border-emerald-600/40 bg-transparent sm:w-auto"
        )}
      >
        {isExporting ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : (
          <Download className="size-3.5 text-emerald-600" />
        )}
        Export
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={onShareWa}
        title="Bagikan undangan via WhatsApp"
        className={cn(
          pill,
          "w-full gap-1.5 border-dashed border-[#25D366]/40 bg-transparent sm:w-auto"
        )}
      >
        <FaWhatsapp className="size-3.5 text-[#25D366]" />
        Share WA
      </Button>
    </>
  )
}
