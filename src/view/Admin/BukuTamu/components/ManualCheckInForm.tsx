"use client"

import { Button } from "@/components/Button"
import { FormInput } from "@/components/Form/FormInput"
import FormSelect from "@/components/Form/FormSelect"
import clientApi from "@/services/client"
import React from "react"
import { Controller, useForm } from "react-hook-form"
import { NumericFormat } from "react-number-format"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

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
export const ManualCheckInForm = () => {
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
    mutationFn: async (data: ManualValues) => {
      const res = await clientApi({
        url: `/guests/${data.guest}/buku-tamu`,
        method: "PATCH",
        data: { arrived_count: data.arrived_count },
      })
      return res
    },
    onSuccess: () => {
      toast?.success?.("Silahkan Masuk")
      queryClient.invalidateQueries({ queryKey: ["guests", "checked-in"] })
      queryClient.invalidateQueries({ queryKey: ["guests"] })
      reset()
    },
    onError: (err: any) => {
      toast?.error?.(err?.response?.data?.error || "Gagal menyimpan data")
    },
  })

  const fetchGuests = React.useCallback(async ({ page, search }: any) => {
    return clientApi({
      url: "/guests",
      method: "GET",
      params: { page, search },
    })
  }, [])

  return (
    <div className="flex items-center justify-center">
      <div className="bg-card border-border w-2xl flex flex-col gap-8 rounded-xl border shadow-sm p-8">
        <div className="flex flex-col gap-5">
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
                placeholder="Pilih Tamu"
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
                onValueChange={(values: any) => {
                  field.onChange(values.floatValue)
                }}
                label="Jumlah Datang"
                customInput={FormInput}
                error={errors.arrived_count?.message}
              />
            )}
          />
        </div>
        <Button
          variant="default"
          size="lg"
          className="w-full"
          onClick={handleSubmit((data) => mutate(data))}
          disabled={isPending}
        >
          {isPending ? "Menyimpan..." : "Kirim"}
        </Button>
      </div>
    </div>
  )
}
