"use client"

import React, { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Copy, Check, Loader2, Link2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { FormInput } from "@/components/Form/FormInput"
import { FormDropdown } from "@/components/Form/FormDropdown"
import { guestFromList } from "@/helper/guestFormList"
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "../Button"
import { defaultGuestValues } from "./form"
import { guestFormSchema } from "./validation"

export type GuestFormModalProps = {
  isModal?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
} & (
  | {
      mode: "create"
      onSuccess?: (guestId: string, link: string) => void
    }
  | {
      mode: "edit"
      guest: typeof defaultGuestValues & { id: string }
      onSuccess?: () => void
    }
)

const HEADER_TITLE = "Buat Link Undangan"
const HEADER_DESCRIPTION =
  "Isi form berikut untuk membuat link undangan personal."

const GuestFormModal = (props: GuestFormModalProps) => {
  const { mode, isModal = true } = props
  const isEdit = mode === "edit"
  const openState = isModal ? props.open : true
  const origin = typeof window !== "undefined" ? window.location.origin : ""

  const [isLoading, setIsLoading] = useState(false)
  const [generatedLink, setGeneratedLink] = useState("")
  const [copied, setCopied] = useState(false)
  const queryClient = useQueryClient()

  const saveGuest = useMutation({
    mutationFn: async (values: typeof defaultGuestValues) => {
      const endpoint =
        isEdit && "guest" in props
          ? `/api/guests/${props.guest.id}`
          : "/api/guests"
      const response = await fetch(endpoint, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      const result = await response.json().catch(() => null)
      if (!response.ok)
        throw new Error(result?.error ?? "Gagal menyimpan data tamu")
      return result
    },
  })

  const form = useForm({
    resolver: yupResolver(guestFormSchema),
    defaultValues: defaultGuestValues,
    mode: "onSubmit",
  })

  const handleSubmit = form.handleSubmit(async (values) => {
    setIsLoading(true)
    const toastId = toast.loading(
      isEdit ? "Menyimpan perubahan..." : "Membuat link..."
    )
    try {
      const result = await saveGuest.mutateAsync(values)
      queryClient.invalidateQueries({ queryKey: ["guests"] })
      const id =
        result?.ids?.[0] ?? ("guest" in props ? props.guest.id : result?.id)
      if (id) setGeneratedLink(`${origin}/${id}`)
      toast.success(
        isEdit ? "Data tamu berhasil diperbarui" : "Link berhasil dibuat",
        { id: toastId }
      )
      if (isEdit) {
        if ("onSuccess" in props) props.onSuccess?.()
      } else if ("onSuccess" in props && id) {
        props.onSuccess?.(id, `${origin}/${id}`)
      }
      if (isModal) props.onOpenChange?.(false)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal menyimpan data tamu",
        { id: toastId }
      )
    } finally {
      setIsLoading(false)
    }
  })

  const handleCopy = async () => {
    if (!generatedLink) return
    await navigator.clipboard.writeText(generatedLink)
    setCopied(true)
    toast.success("Link disalin!")
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    if (isEdit && openState && "guest" in props) {
      form.reset({
        full_name: props.guest.full_name,
        guest_from: props.guest.guest_from,
        mantu_status: props.guest.mantu_status,
        unduh_mantu_status: props.guest.unduh_mantu_status,
      })
      setGeneratedLink(`${origin}/${props.guest.id}`)
    } else if (!isEdit && openState) {
      form.reset(defaultGuestValues)
      setGeneratedLink("")
    }
  }, [openState, isEdit, props, origin])

  const submitButtonContent = isLoading ? (
    <>
      <Loader2 className="size-4 animate-spin mr-2" />
      Membuat...
    </>
  ) : (
    "Generate Link"
  )
  const renderHeader = () =>
    isModal ? (
      <DialogHeader className={`gap-0`}>
        <DialogTitle className="text-2xl">{HEADER_TITLE}</DialogTitle>
        <DialogDescription className="text-md">
          {HEADER_DESCRIPTION}
        </DialogDescription>
      </DialogHeader>
    ) : (
      <div className={` flex flex-col gap-1`}>
        <h1 className="text-2xl font-semibold text-foreground">
          {HEADER_TITLE}
        </h1>
        <p className="text-md text-muted-foreground">{HEADER_DESCRIPTION}</p>
      </div>
    )

  const renderFields = () => (
    <div className={`flex flex-col gap-5`}>
      {/* Guest Name */}
      <Controller
        control={form.control}
        name="full_name"
        render={({ field, fieldState }) => (
          <div className="flex flex-col gap-1">
            <FormInput
              {...field}
              label="Nama Tamu"
              placeholder="Contoh: Budi Santoso"
              required
              disabled={isLoading}
              error={fieldState.error?.message}
            />
          </div>
        )}
      />

      {/* Guest From */}
      <Controller
        control={form.control}
        name="guest_from"
        render={({ field, fieldState }) => (
          <div className="flex flex-col gap-1">
            <FormDropdown
              {...field}
              label="Tamu Dari"
              options={guestFromList.map(({ id, name }) => ({
                value: id,
                label: name,
              }))}
              placeholder="Pilih asal tamu"
              required
              disabled={isLoading}
              error={fieldState.error?.message}
            />
          </div>
        )}
      />

      <div className="flex flex-col sm:flex-row gap-4">
        <Controller
          control={form.control}
          name="mantu_status"
          render={({ field }) => (
            <div className="flex flex-row items-center justify-between rounded-lg border border-input p-3 flex-1 bg-transparent">
              <div className="space-y-0.5">
                <Label className="font-sans text-[10px] md:text-[11px] font-bold tracking-[0.30em] uppercase">
                  Mantu
                </Label>
              </div>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={isLoading}
              />
            </div>
          )}
        />
        <Controller
          control={form.control}
          name="unduh_mantu_status"
          render={({ field }) => (
            <div className="flex flex-row items-center justify-between rounded-lg border border-input p-3 flex-1 bg-transparent">
              <div className="space-y-0.5">
                <Label className="font-sans text-[10px] md:text-[11px] font-bold tracking-[0.30em] uppercase">
                  Unduh Mantu
                </Label>
              </div>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={isLoading}
              />
            </div>
          )}
        />
      </div>

      {/* Generated or Existing Link */}
      {generatedLink && (
        <div className="flex flex-col gap-2">
          <Label className="font-sans text-[10px] md:text-[11px] font-bold tracking-[0.30em] uppercase">
            Link undangan:
          </Label>
          <div className="flex items-center gap-2 bg-border border border-border rounded-md px-3 py-2">
            <Link2 className="size-4 text-muted dark:text-white shrink-0" />
            <span className="text-xs text-muted dark:text-white break-all flex-1 select-all font-mono">
              {generatedLink}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="shrink-0 text-muted dark:text-white hover:text-primary transition-colors p-1"
              title="Salin link"
            >
              {copied ? (
                <Check className="size-4 text-muted" />
              ) : (
                <Copy className="size-4" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )

  const renderActions = () =>
    isModal ? (
      <DialogFooter
        className={` py-4 border-t border-border bg-muted dark:bg-border`}
      >
        <Button
          type="button"
          variant="destructive"
          onClick={() => props.onOpenChange?.(false)}
          disabled={isLoading}
        >
          Batal
        </Button>
        <Button type="button" onClick={handleSubmit} disabled={isLoading}>
          {submitButtonContent}
        </Button>
      </DialogFooter>
    ) : (
      <div className={``}>
        <Button
          type="button"
          onClick={handleSubmit}
          className="w-full"
          disabled={isLoading}
        >
          {submitButtonContent}
        </Button>
      </div>
    )

  const content = (
    <>
      {isModal ? (
        <div className="p-3 pb-0 flex flex-col gap-8">
          {renderHeader()}
          {renderFields()}
        </div>
      ) : (
        <>
          {renderHeader()}
          {renderFields()}
        </>
      )}
      {renderActions()}
    </>
  )

  if (isModal) {
    return (
      <Dialog open={props.open} onOpenChange={props.onOpenChange}>
        <DialogContent className="max-w-2xl! gap-8">{content}</DialogContent>
      </Dialog>
    )
  }

  // Non-modal rendering — identical structure/padding, no footer wrapper.
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="bg-card border border-border rounded-xl shadow-sm w-2xl flex flex-col gap-8 p-8">
        {content}
      </div>
    </div>
  )
}

export default GuestFormModal
