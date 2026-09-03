import { useEffect } from "react"
import { useForm, FormProvider, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { WeddingInput } from "@/components/WeddingInput"
import { WeddingTextarea } from "@/components/WeddingTextarea"
import { AttendanceToggle } from "./AttendanceToggle"
import { Button } from "@/components/Button"
import { FormInput } from "@/components/Form/FormInput"
import { FormTextArea } from "@/components/Form/FormTextArea"
import { Card } from "@/components/Card"

interface FormValues {
  name: string
  message: string
  attendance: "hadir" | "tidak_hadir" | "ragu"
}

interface CommentFormProps {
  /** @deprecated — terpusat via Tailwind */
  accent?: string
  /** @deprecated */
  border?: string
  /** @deprecated */
  textSecondary?: string
  /** @deprecated */
  textPrimary?: string
  /** @deprecated */
  isDark?: boolean
  /** @deprecated */
  surface?: string
  onSubmit: (data: FormValues) => Promise<void>
  isSubmitting: boolean
  submitted: boolean
  guestName?: string
}

const schema = yup.object({
  name: yup.string().min(2, "Minimal 2 karakter").required("Nama wajib diisi"),
  message: yup
    .string()
    .min(5, "Minimal 5 karakter")
    .required("Ucapan wajib diisi"),
  attendance: yup.string().oneOf(["hadir", "tidak_hadir", "ragu"]).required(),
})

export function CommentForm({
  onSubmit,
  isSubmitting,
  submitted,
  guestName,
}: CommentFormProps) {
  const methods = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: { name: guestName ?? "", message: "", attendance: "hadir" },
  })

  useEffect(() => {
    if (guestName) methods.setValue("name", guestName)
  }, [guestName, methods])

  const handleSubmit = methods.handleSubmit(async (data) => {
    await onSubmit(data)
    methods.reset()
  })

  return (
    <FormProvider {...methods}>
      <Card
        className="cs-form-wrap overflow-hidden p-0"
        radius="20px"
      >
        <div className="flex items-center gap-3 px-8 py-5 border-b border-wedding-border rounded-t-[20px]">
          <span className="h-2 w-2 rounded-full bg-wedding-accent" />
          <span className="font-sans text-[10px] md:text-[11px] font-bold tracking-[0.30em] uppercase text-wedding-text-secondary">
            Tulis Ucapan
          </span>
        </div>

        <div className="flex flex-col gap-24 px-8 py-10">
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Controller
                name="name"
                control={methods.control}
                render={({ field, fieldState }) => (
                  <FormInput
                    label="Nama"
                    error={fieldState.error?.message}
                    placeholder="Nama lengkap Anda"
                    {...field}
                  />
                )}
              />

              <Controller
                name="attendance"
                control={methods.control}
                render={({ field, fieldState }) => (
                  <AttendanceToggle
                    value={field.value}
                    onChange={field.onChange}
                    label="Konfirmasi Kehadiran"
                    error={fieldState.error?.message}
                  />
                )}
              />
            </div>

            <Controller
              name="message"
              control={methods.control}
              render={({ field, fieldState }) => (
                <FormTextArea
                  label="Ucapan & Doa"
                  error={fieldState.error?.message}
                  rows={4}
                  placeholder="Tulis ucapan atau doa Anda untuk kedua mempelai..."
                  {...field}
                />
              )}
            />
          </div>

          <div className="flex items-center justify-center">
            <Button
              type="button"
              onClick={handleSubmit}
              className="cs-submit-btn flex cursor-pointer items-center justify-center rounded-xl px-8 py-6 font-sans text-[10px] md:text-[11px] font-bold tracking-[0.3em] uppercase transition-all duration-300 bg-green-800 text-white hover:bg-green-700 dark:bg-red-800 dark:hover:bg-red-700 z-15"
            >
              {isSubmitting
                ? "Mengirim..."
                : submitted
                  ? "Terkirim"
                  : "Kirim Ucapan"}
            </Button>
          </div>
        </div>
      </Card>
    </FormProvider>
  )
}
