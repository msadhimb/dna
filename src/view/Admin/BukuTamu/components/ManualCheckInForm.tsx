"use client"

import React from "react"
import { Controller, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { PencilLine } from "lucide-react"
import { NumericFormat } from "react-number-format"
import { Button } from "@/components/Button"
import Card from "@/components/Card"
import { FormInput } from "@/components/Form/FormInput"
import FormSelect from "@/components/Form/FormSelect"
import clientApi from "@/services/client"

const manualSchema = yup.object({
  guest: yup.string().required("Tamu wajib dipilih"),
  arrived_count: yup
    .number()
    .typeError("Jumlah datang harus berupa angka")
    .required("Jumlah datang wajib diisi")
    .min(1, "Jumlah datang minimal 1"),
})

type ManualValues = yup.InferType<typeof manualSchema>

// Fallback saat kamera/QR bermasalah: cari nama manual.
export const ManualCheckInForm = ({
  activeEvent = "mantu",
}: {
  activeEvent?: "mantu" | "unduh"
}) => {
  const queryClient = useQueryClient()
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ManualValues>({
    resolver: yupResolver(manualSchema),
    defaultValues: { guest: "", arrived_count: 0 },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: ManualValues) =>
      clientApi({
        url: `/guests/${data.guest}/buku-tamu`,
        method: "PATCH",
        data: { arrived_count: data.arrived_count, event: activeEvent },
      }),
    onSuccess: () => {
      toast?.success?.("Silakan masuk")
      queryClient.invalidateQueries({ queryKey: ["guests", "checked-in"] })
      queryClient.invalidateQueries({ queryKey: ["guests"] })
      reset()
    },
    onError: (err: any) => {
      toast?.error?.(err?.response?.data?.error || "Gagal menyimpan data")
    },
  })

  const fetchGuests = React.useCallback(async ({ page, search }: any) => {
    return clientApi({ url: "/guests", method: "GET", params: { page, search } })
  }, [])

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-2xl gap-0 overflow-hidden p-0">
        <div className="flex items-center gap-3 border-b border-wedding-border bg-wedding-surface/60 px-6 py-4 sm:px-8">
          <span className="flex size-10 items-center justify-center rounded-full border border-book-ornament/40 bg-book-ornament/10 text-book-ornament dark:text-book-cover-title">
            <PencilLine className="size-4" />
          </span>
          <div>
            <p className="font-serif text-lg font-semibold text-foreground">
              Check-in Manual
            </p>
            <p className="text-xs text-muted-foreground">
              Untuk tamu tanpa QR / kamera bermasalah.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-5 px-6 py-6 sm:px-8">
          <Controller
            name="guest"
            control={control}
            render={({ field }) => (
              <FormSelect
                {...field}
                label="Tamu"
                apiConfig={fetchGuests}
                valueKey="id"
                labelKey="full_name"
                resolveEndpoint="/guests"
                placeholder="Cari & pilih tamu..."
                error={errors.guest?.message}
              />
            )}
          />
          <Controller
            name="arrived_count"
            control={control}
            render={({ field }) => (
              <NumericFormat
                value={field.value}
                thousandSeparator=","
                allowNegative={false}
                decimalScale={0}
                onValueChange={(values: any) => field.onChange(values.floatValue)}
                label="Jumlah Datang"
                customInput={FormInput}
                error={errors.arrived_count?.message}
              />
            )}
          />
          <Button
            className="w-full rounded-xl"
            size="lg"
            onClick={handleSubmit((data) => mutate(data))}
            disabled={isPending}
          >
            {isPending ? "Menyimpan..." : "Catat Kedatangan"}
          </Button>
        </div>
      </Card>
    </div>
  )
}
