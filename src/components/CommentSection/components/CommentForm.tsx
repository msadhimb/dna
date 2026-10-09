import { useEffect } from "react"
import { useForm, FormProvider, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Check, Loader2, Send } from "lucide-react"
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
  accent?: string

  border?: string

  textSecondary?: string

  textPrimary?: string

  isDark?: boolean

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
        shadow={false}
      >
        <div className="flex items-center gap-3 px-6 py-4 border-b border-wedding-border rounded-t-[20px] md:px-8">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-wedding-accent opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-wedding-accent" />
          </span>
          <span className="font-sans text-[10px] md:text-[11px] font-bold tracking-[0.30em] uppercase text-wedding-text-secondary">
            Tulis Ucapan
          </span>
        </div>

        <div className="flex flex-col gap-6 px-6 py-6 md:px-8 md:py-8">
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
              disabled={isSubmitting}
              className="h-9 rounded-full px-4 text-[10px] font-bold tracking-[0.14em] uppercase transition-all duration-200 focus-visible:ring-2 focus-visible:ring-wedding-accent focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.98] text-white dark:text-white bg-wedding-accent dark:bg-primary"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : submitted ? (
                <Check />
              ) : (
                <Send />
              )}
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
