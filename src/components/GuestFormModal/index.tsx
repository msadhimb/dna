"use client"

import React, { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
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
import { FormInput } from "@/components/Form/FormInput"
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "../Button"

export type GuestFormValues = {
  guest_name: string
  akad_status: boolean
  mantu_status: boolean
  unduh_mantu_status: boolean
  guest_knock_status: boolean
}

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
      guest: GuestFormValues & { id: string }
      onSuccess?: () => void
    }
)

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
    mutationFn: async (values: GuestFormValues) => {
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
    defaultValues: {
      guest_name: "",
      akad_status: false,
      mantu_status: false,
      unduh_mantu_status: false,
      guest_knock_status: false,
    },
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

  const switchFields: {
    name: keyof GuestFormValues
    label: string
    id: string
  }[] = [
    { name: "akad_status", label: "Akad", id: "switch-akad" },
    { name: "guest_knock_status", label: "Menerima Tamu", id: "switch-knock" },
    { name: "mantu_status", label: "Mantu", id: "switch-mantu" },
    { name: "unduh_mantu_status", label: "Unduh Mantu", id: "switch-unduh" },
  ]

  useEffect(() => {
    if (isEdit && openState && "guest" in props) {
      form.reset({
        guest_name: props.guest.guest_name,
        akad_status: props.guest.akad_status,
        mantu_status: props.guest.mantu_status,
        unduh_mantu_status: props.guest.unduh_mantu_status,
        guest_knock_status: props.guest.guest_knock_status,
      })
      setGeneratedLink(`${origin}/${props.guest.id}`)
    } else if (!isEdit && openState) {
      form.reset({
        guest_name: "",
        akad_status: false,
        mantu_status: false,
        unduh_mantu_status: false,
        guest_knock_status: false,
      })
      setGeneratedLink("")
    }
  }, [openState, isEdit, props, origin])

  const renderFormContent = () => (
    <div className="flex flex-col gap-6 w-full ">
      {/* Title / Description (shown when rendered inline) */}
      {!isModal && (
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold text-foreground">
            Buat Link Undangan
          </h1>
          <p className="text-xs text-muted-foreground">
            Isi form berikut untuk membuat link undangan personal.
          </p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 pt-1 font-manropen"
      >
        <div className="py-2 px-5 flex flex-col gap-5">
          {/* Guest Name */}
          <Controller
            control={form.control}
            name="guest_name"
            rules={{ required: "Nama tamu wajib diisi" }}
            render={({ field, fieldState }) => (
              <div className="flex flex-col gap-1">
                <FormInput
                  {...field}
                  label="Nama Tamu"
                  placeholder="Contoh: Budi Santoso"
                  required
                  disabled={isLoading}
                />
                {fieldState.error && (
                  <p className="text-xs text-destructive mt-1">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          {/* Status Toggles */}

          {/* Generated or Existing Link */}
          {generatedLink && (
            <div className="flex flex-col gap-2">
              <Label className="text-xs text-muted-foreground">
                Link undangan:
              </Label>
              <div className="flex items-center gap-2 bg-border border border-border rounded-md px-3 py-2">
                <Link2 className="size-4 text-[#d4af37] shrink-0" />
                <span className="text-xs text-[#d4af37] break-all flex-1 select-all font-mono">
                  {generatedLink}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="shrink-0 text-[#d4af37] hover:text-primary transition-colors p-1"
                  title="Salin link"
                >
                  {copied ? (
                    <Check className="size-4 text-[#d4af37]" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {isModal ? (
          <DialogFooter className="-mx-4 -mb-4 mt-2 bg-muted dark:bg-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => props.onOpenChange?.(false)}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  Membuat...
                </>
              ) : (
                "Generate Link"
              )}
            </Button>
          </DialogFooter>
        ) : (
          <Button type="submit" className="w-full mt-2" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" />
                Membuat...
              </>
            ) : (
              "Generate Link"
            )}
          </Button>
        )}
      </form>
    </div>
  )

  if (isModal) {
    return (
      <Dialog open={props.open} onOpenChange={props.onOpenChange}>
        <DialogContent className="!max-w-2xl font-manrope ">
          <DialogHeader className="p-5">
            <DialogTitle>Buat Link Undangan</DialogTitle>
            <DialogDescription>
              Isi form berikut untuk membuat link undangan personal.
            </DialogDescription>
          </DialogHeader>
          {renderFormContent()}
        </DialogContent>
      </Dialog>
    )
  }

  // Non-modal rendering
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="bg-card border border-border rounded-xl shadow-sm p-8 flex flex-col gap-6 w-2xl">
        {renderFormContent()}
      </div>
    </div>
  )
}

export default GuestFormModal
