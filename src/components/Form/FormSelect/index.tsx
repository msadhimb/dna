"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Loader2, type LucideIcon } from "lucide-react"
import debounce from "lodash/debounce"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Leapfrog } from "ldrs/react"
import "ldrs/react/Leapfrog.css"
import { Label } from "@/components/ui/label"
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import clientApi from "@/services/client"

const FormSelect = ({
  value,
  options = [],
  placeholder,
  onChange,
  searchable = true,
  className,
  label,
  error,
  disabled = false,
  apiConfig,
  queryKey,
  selectedDisplayValue,
  uniqueOptions,
  labelKey,
  valueKey,
  resolveEndpoint,
  debounceMs = 400,
}: {
  value?: string
  options?: { value: string | number; label: string }[]
  placeholder?: string
  onChange?: (value: string, data: any) => void
  searchable?: boolean
  className?: string
  label?: string
  error?: string
  disabled?: boolean
  apiConfig?: (params?: { page?: number; search?: string }) => Promise<any>
  queryKey?: string[]
  selectedDisplayValue?: string
  uniqueOptions?: { key: string; icon: LucideIcon }
  labelKey?: string
  valueKey?: string
  resolveEndpoint?: string
  debounceMs?: number
}) => {
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const bottomRef = React.useRef<HTMLDivElement>(null)
  const [open, setOpen] = React.useState(false)
  const [valueInput, setValueInput] = React.useState("")
  const [selectedOption, setSelectedOption] = React.useState<any>(null)

  // ✅ Search state — searchInput untuk tampilan input (langsung/tanpa delay),
  // debouncedSearch untuk yang benar-benar dikirim ke API (delay)
  const [searchInput, setSearchInput] = React.useState("")
  const [debouncedSearch, setDebouncedSearch] = React.useState("")

  const queryClient = useQueryClient()

  const hasError = Boolean(error)
  const isAsync = Boolean(apiConfig)

  const baseQueryKey = queryKey || [
    "combobox-data",
    apiConfig?.name || "default",
  ]

  const toStr = (val: any): string => {
    if (val === null || val === undefined) return ""
    return String(val)
  }

  const mapItem = (item: any) => ({
    ...item,
    value: toStr(valueKey ? item[valueKey] : item.id),
    label: toStr(labelKey ? item[labelKey] : item.name),
  })

  // ✅ Debounce search — dibuat sekali via useMemo, dibersihkan saat unmount
  const debouncedSetSearch = React.useMemo(
    () =>
      debounce((val: string) => {
        setDebouncedSearch(val)
      }, debounceMs),
    [debounceMs]
  )

  React.useEffect(() => {
    return () => {
      debouncedSetSearch.cancel()
    }
  }, [debouncedSetSearch])

  const handleSearchChange = (val: string) => {
    setSearchInput(val)
    debouncedSetSearch(val)
  }

  // ✅ Query list — fetch saat popover dibuka, refetch saat search berubah
  const {
    data: asyncData,
    isLoading: loading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [...baseQueryKey, "list", debouncedSearch],
    queryFn: async ({ pageParam = 1 }) => {
      if (!apiConfig) return { data: [], next: undefined }
      const rawData = await apiConfig({
        page: pageParam,
        search: debouncedSearch,
      })

      const getList = (raw: any) => {
        if (!raw) return []
        if (Array.isArray(raw)) return raw
        if (Array.isArray(raw.data)) return raw.data
        if (raw.data && typeof raw.data === "object") {
          for (const key of Object.keys(raw.data)) {
            if (Array.isArray(raw.data[key])) return raw.data[key]
          }
        }
        return []
      }

      const mappedList = getList(rawData).map(mapItem)
      return {
        data: mappedList,
        next:
          !Array.isArray(rawData) && rawData?.pagination
            ? rawData.pagination.page < rawData.pagination.totalPages
              ? rawData.pagination.page + 1
              : undefined
            : undefined,
      }
    },
    getNextPageParam: (lastPage) => lastPage.next,
    initialPageParam: 1,
    enabled: isAsync && open,
    staleTime: 0,
    refetchOnMount: true,
  })

  const asyncOptions = React.useMemo(() => {
    if (!asyncData) return []
    return asyncData.pages.flatMap((page) => page.data)
  }, [asyncData])

  const normalizedValue = value == null ? "" : String(value)
  const currentOptions = isAsync
    ? asyncOptions
    : options.map((opt) => ({ ...opt, value: toStr(opt.value) }))
  const hasLoadedValue = currentOptions.some(
    (option: any) => toStr(option.value) === normalizedValue
  )

  const { data: resolvedData, isLoading: isResolving } = useQuery({
    queryKey: [...baseQueryKey, "resolve", normalizedValue],
    queryFn: async () => {
      const response = await clientApi({
        url: `${resolveEndpoint}/${normalizedValue}`,
        method: "GET",
      })

      return mapItem(response.data)
    },
    enabled:
      isAsync &&
      Boolean(resolveEndpoint) &&
      Boolean(normalizedValue) &&
      !open &&
      !hasLoadedValue,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  // IntersectionObserver untuk infinite scroll
  React.useEffect(() => {
    if (!bottomRef.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(bottomRef.current)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, asyncOptions])

  const handleOpenChange = (newOpen: boolean) => {
    if (!disabled) {
      if (newOpen && isAsync) {
        // Refresh data tanpa menghapus opsi lama agar label terpilih tidak
        // berubah sementara menjadi ID saat dropdown dibuka kembali.
        queryClient.invalidateQueries({
          queryKey: [...baseQueryKey, "list"],
          exact: false,
        })
      }
      if (!newOpen) {
        // reset search saat popover ditutup, biar buka lagi mulai dari kosong
        debouncedSetSearch.cancel()
        setSearchInput("")
        setDebouncedSearch("")
      }
      setOpen(newOpen)
    }
  }

  const hasUniqueKey = (option: any) => {
    if (!uniqueOptions?.key) return false
    return (
      option[uniqueOptions.key] !== null &&
      option[uniqueOptions.key] !== undefined
    )
  }

  const getDisplayValue = () => {
    if (value) {
      // 1. Cari dari options yang sudah di-load (setelah popover pernah dibuka)
      const fromLoaded = currentOptions.find(
        (opt: any) => toStr(opt.value) === toStr(value)
      )
      if (fromLoaded) return fromLoaded.label

      // 2. Keep showing the selected label while the list is refreshing
      if (selectedOption && toStr(selectedOption.value) === toStr(value)) {
        return selectedOption.label
      }

      // 3. From the result of resolve by ID
      if (resolvedData) return resolvedData.label

      // 4. Static fallback
      if (!isAsync && selectedDisplayValue) return selectedDisplayValue

      // 5. Loading state
      if (isResolving) return "Loading..."

      return value
    }

    if (valueInput) {
      const found = currentOptions.find(
        (opt: any) => toStr(opt.value) === toStr(valueInput)
      )
      return found?.label || valueInput
    }

    return placeholder || "Select"
  }

  // Sinkronkan valueInput dengan value dari luar (misal saat form di-reset)
  React.useEffect(() => {
    if (!value) {
      setValueInput("")
      setSelectedOption(null)
    } else if (selectedOption && toStr(selectedOption.value) !== toStr(value)) {
      setSelectedOption(null)
    }
  }, [value, selectedOption])

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <Label className="font-sans text-[10px] font-bold tracking-[0.30em] uppercase md:text-[11px]">
          {label}
        </Label>
      )}

      <Popover open={open && !disabled} onOpenChange={handleOpenChange} modal>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            data-empty={!value}
            disabled={disabled}
            className={cn(
              "flex h-auto w-full items-center justify-between gap-2 rounded-lg border border-input bg-input/30 p-3 text-left text-xs font-medium shadow-none ring-0 transition-all duration-300 outline-none data-[state=open]:border-green-800 data-[state=open]:dark:border-red-800/50 data-[state=open]:ring-3 data-[state=open]:ring-green-800/50 data-[state=open]:dark:ring-red-800/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-base",
              "aria-expanded:bg-transparent! hover:bg-transparent!",
              error && "border-red-500! focus-visible:ring-red-200!"
            )}
            ref={buttonRef}
          >
            {isResolving && !resolvedData && value ? (
              <div className="w-full flex items-center">
                <Leapfrog size="25" speed="2.5" color="gray" />
              </div>
            ) : (
              getDisplayValue()
            )}
            <ChevronsUpDown
              className={cn(
                "opacity-50 transition-colors",
                hasError && "text-red-500"
              )}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent style={{ width: buttonRef?.current?.offsetWidth }}>
          <Command shouldFilter={!isAsync}>
            {searchable && (
              <div className="pt-0 py-3 ">
                <CommandInput
                  placeholder="Search..."
                  className="!text-muted-foreground focus:outline-none"
                  value={searchInput}
                  onValueChange={handleSearchChange}
                />
              </div>
            )}
            <CommandList>
              {loading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="ml-2 text-sm text-muted-foreground">
                    Loading...
                  </span>
                </div>
              ) : (
                <>
                  <CommandEmpty>No option found.</CommandEmpty>
                  <CommandGroup>
                    {currentOptions.map((option: any) => {
                      const hasUnique = hasUniqueKey(option)
                      const IconComponent: any = uniqueOptions?.icon
                      const optionValue = toStr(option.value)
                      const optionLabel = toStr(option.label)

                      return (
                        <CommandItem
                          key={optionValue}
                          value={optionValue}
                          keywords={[optionLabel]}
                          data-checked={
                            toStr(value) === optionValue ? "true" : undefined
                          } // ✅ tambah ini
                          onSelect={(currentValue) => {
                            onChange?.(currentValue, option)
                            setSelectedOption(option)
                            setValueInput(
                              currentValue === toStr(value) ? "" : currentValue
                            )
                            setOpen(false)
                          }}
                          className={cn(
                            "py-2 dark:hover:bg-primary hover:text-white! data-selected:text-white data-selected:dark:bg-primary",

                            hasUnique && "flex items-center gap-2"
                          )}
                        >
                          {hasUnique && IconComponent && (
                            <IconComponent className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className={cn(hasUnique && "flex-1")}>
                            {optionLabel}
                          </span>
                        </CommandItem>
                      )
                    })}

                    {isAsync && (
                      <div ref={bottomRef} className="py-1">
                        {isFetchingNextPage && (
                          <div className="flex items-center justify-center py-2">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            <span className="ml-2 text-xs text-muted-foreground">
                              Memuat lebih banyak...
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {hasError && (
        <span className="text-xs text-red-500 animate-in slide-in-from-top-1 duration-200">
          {error}
        </span>
      )}
    </div>
  )
}

export default FormSelect
