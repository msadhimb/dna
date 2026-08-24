"use client"

import * as React from "react"
import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  Row,
} from "@tanstack/react-table"
import { useQuery, keepPreviousData } from "@tanstack/react-query"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
  MoreHorizontal,
} from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "../Button"

export type ActionItem<TData> = {
  label: string
  icon?: React.ReactNode
  onClick: (row: TData) => void
  /** Tampilkan separator sebelum item ini */
  separator?: boolean
  /** Warna merah untuk aksi destructive seperti delete */
  destructive?: boolean
}

interface DataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[]
  queryKey: string
  fetcher: (params: any) => Promise<any>
  filterColumn?: string
  filterPlaceholder?: string
  /** Daftar aksi untuk dropdown kolom Action */
  actions?: ActionItem<TData>[]
}

const PAGE_SIZE_OPTIONS = [5, 10, 20, 30, 50]

export function DataTable<TData>({
  columns,
  queryKey,
  fetcher,
  filterPlaceholder = "Search...",
  actions,
}: DataTableProps<TData>) {
  // ── Internal state ────────────────────────────────────────────────────────
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(20)
  const [search, setSearch] = React.useState("")
  const [debouncedSearch, setDebouncedSearch] = React.useState("")
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "full_name", desc: false },
  ])
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  // ── Debounce search ───────────────────────────────────────────────────────
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [search])

  // ── Build query params ────────────────────────────────────────────────────
  const sortDir = sorting[0]?.desc === false ? "asc" : "desc"

  const params = {
    page,
    pageSize,
    search: debouncedSearch,
    sortBy: sorting[0]?.id ?? "full_name",
    sortDir,
  }

  // ── React Query ───────────────────────────────────────────────────────────
  const { data, isLoading, isError } = useQuery({
    queryKey: [queryKey, params],
    queryFn: () => fetcher(params),
    placeholderData: keepPreviousData,
  })

  const rows = (data?.data?.[queryKey] ??
    data?.data?.guests ??
    data?.data?.comments ??
    []) as TData[]
  const meta = data?.pagination
  const totalPages = meta?.totalPages ?? 1
  const totalItems = meta?.totalItems ?? 0
  const canPrev = page > 1
  const canNext = page < totalPages

  // ── Scroll Shadow detection ───────────────────────────────────────────────
  const [showShadow, setShowShadow] = React.useState(true)
  const scrollAreaRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const scrollArea = scrollAreaRef.current
    if (!scrollArea) return

    const viewport = scrollArea.querySelector(
      '[data-slot="scroll-area-viewport"]'
    )
    if (!viewport) return

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = viewport
      const isAtRight = scrollWidth - scrollLeft - clientWidth <= 15
      const hasOverflow = scrollWidth > clientWidth

      setShowShadow(hasOverflow && !isAtRight)
    }

    handleScroll()

    const resizeObserver = new ResizeObserver(() => {
      handleScroll()
    })

    viewport.addEventListener("scroll", handleScroll)
    resizeObserver.observe(viewport)
    resizeObserver.observe(scrollArea)

    return () => {
      viewport.removeEventListener("scroll", handleScroll)
      resizeObserver.disconnect()
    }
  }, [rows])

  // ── Inject kolom Actions di paling kanan ──────────────────────────────────
  const columnsWithActions = React.useMemo<ColumnDef<TData, unknown>[]>(() => {
    if (!actions?.length) return columns

    const actionColumn: ColumnDef<TData, unknown> = {
      id: "actions",
      enableHiding: false,
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }: { row: Row<TData> }) => (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="font-manrope min-w-[150px]"
            >
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              {actions.map((action, index) => (
                <React.Fragment key={index}>
                  {action.separator && <DropdownMenuSeparator />}
                  <DropdownMenuItem
                    onClick={() => action.onClick(row.original)}
                    className={cn(
                      "flex items-center gap-2 cursor-pointer ",
                      action.destructive
                        ? "text-red-500 focus:text-red-500 focus:bg-red-50/10"
                        : ""
                    )}
                  >
                    {action.icon && (
                      <span className="shrink-0">{action.icon}</span>
                    )}
                    <span>{action.label}</span>
                  </DropdownMenuItem>
                </React.Fragment>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    }

    return [...columns, actionColumn]
  }, [columns, actions])

  // ── TanStack Table ────────────────────────────────────────────────────────
  const table = useReactTable({
    data: rows,
    columns: columnsWithActions,
    manualPagination: true,
    manualSorting: true,
    pageCount: totalPages,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      pagination: { pageIndex: page - 1, pageSize },
    },
    onSortingChange: (updater) => {
      setSorting(updater)
      setPage(1)
    },
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="space-y-4 max-w-screen">
      <div className="flex items-center gap-2 py-2">
        <Input
          placeholder={filterPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        {/* <DataTableViewOptions table={table} /> */}
      </div>

      <ScrollArea
        ref={scrollAreaRef}
        className="w-full rounded-md border border-border"
      >
        <Table className="min-w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:!bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "whitespace-nowrap border-b border-border bg-border px-4 py-3",
                      header.id === "actions" &&
                        "relative sticky right-0 z-20 bg-border border-l border-border/50"
                    )}
                  >
                    {header.id === "actions" && showShadow && (
                      <div className="absolute top-0 -left-3 bottom-0 w-3 pointer-events-none bg-linear-to-l from-black/80 to-transparent" />
                    )}
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow className="hover:!bg-transparent">
                <TableCell
                  colSpan={columnsWithActions.length}
                  className="h-32 text-center border-border"
                >
                  <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow className="hover:!bg-transparent">
                <TableCell
                  colSpan={columnsWithActions.length}
                  className="h-24 text-center text-red-500 border-border"
                >
                  Failed to load data. Please try again.
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-border/25! data-[state=selected]:bg-border/25! has-aria-expanded:bg-border/25!"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        "whitespace-break-spaces border-b border-border px-4 py-3",
                        cell.column.id === "actions" &&
                          "relative sticky right-0 z-10 bg-background border-l border-border/50"
                      )}
                    >
                      {cell.column.id === "actions" && showShadow && (
                        <div className="absolute top-0 -left-3 bottom-0 w-3 pointer-events-none bg-linear-to-l from-black/80 to-transparent" />
                      )}
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:!bg-transparent">
                <TableCell
                  colSpan={columnsWithActions.length}
                  className="h-24 text-center text-muted-foreground border-border"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>

      {/* ── Pagination ────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-2">
        <p className="text-sm text-muted-foreground">
          {totalItems} row(s) total.
        </p>

        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${pageSize}`}
              onValueChange={(v) => {
                setPageSize(Number(v))
                setPage(1)
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent side="top" className="font-manrope">
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <p className="flex w-[110px] items-center justify-center text-sm font-medium">
            Page {page} of {totalPages}
          </p>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => setPage(1)}
              disabled={!canPrev}
            >
              <span className="sr-only">First page</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => setPage((p) => p - 1)}
              disabled={!canPrev}
            >
              <span className="sr-only">Previous page</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => setPage((p) => p + 1)}
              disabled={!canNext}
            >
              <span className="sr-only">Next page</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => setPage(totalPages)}
              disabled={!canNext}
            >
              <span className="sr-only">Last page</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
