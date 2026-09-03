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
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner" 

const schema = yup.object({
  guest: yup.string().required("Tamu wajib dipilih"),
  guest_total: yup
    .number()
    .typeError("Jumlah tamu harus berupa angka")
    .required("Jumlah tamu wajib diisi")
    .min(1, "Jumlah tamu minimal 1"),
})

type FormValues = yup.InferType<typeof schema>

const PagarAyu = () => {
  const {
    watch,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      guest: "",
      guest_total: 0,
    },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormValues) => {
      const res = await clientApi({
        url: `/guests/${data.guest}/pager-ayu`,
        method: "PATCH",
        data: { guest_total: data.guest_total },
      })
      return res
    },
    onSuccess: () => {
      toast?.success?.("Silahkan Masuk")
      reset()
    },
    onError: (err: any) => {
      toast?.error?.(err?.response?.data?.error || "Gagal menyimpan data")
    },
  })

  const onSubmit = (data: FormValues) => {
    mutate(data)
  }

  const fetchGuests = React.useCallback(async ({ page, search }: any) => {
    return clientApi({
      url: "/guests",
      method: "GET",
      params: { page, search },
    })
  }, [])

  return (
    <div className="h-[80vh]">
      <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-sans text-3xl font-bold tracking-[0.2em] text-foreground uppercase">
            Pagar Ayu
          </h1>
          <p className="mt-1 text-md text-muted-foreground">
            Kelola tamu yang bertugas sebagai pagar ayu/among tamu.
          </p>
        </div>
      </div>
      <div className="h-full flex items-center justify-center">
        <div className="bg-card border border-border rounded-xl shadow-sm w-2xl flex flex-col gap-8 p-8">
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
              name="guest_total"
              control={control}
              render={({ field }) => (
                <NumericFormat
                  value={field.value}
                  thousandSeparator=","
                  onValueChange={(values: any) => {
                    field.onChange(values.floatValue)
                  }}
                  label="Jumlah Tamu"
                  customInput={FormInput}
                  error={errors.guest_total?.message}
                />
              )}
            />
          </div>

          <Button
            variant="default"
            size="lg"
            className="w-full"
            onClick={handleSubmit(onSubmit)}
            disabled={isPending}
          >
            {isPending ? "Menyimpan..." : "Kirim"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PagarAyu
