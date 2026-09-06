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
  disabled?: boolean
  isCheckingPermission?: boolean
  permissionMsg?: string | null
}

const schema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, "Minimal 2 karakter")
    .max(100, "Maksimal 100 karakter")
    .required("Nama wajib diisi"),
  message: yup
    .string()
    .trim()
    .min(5, "Minimal 5 karakter")
    .max(1000, "Maksimal 1000 karakter")
    .required("Ucapan wajib diisi"),
  attendance: yup.string().oneOf(["hadir", "tidak_hadir", "ragu"]).required(),
})

export function CommentForm({
  onSubmit,
  isSubmitting,
  submitted,
  guestName,
  disabled = false,
  isCheckingPermission = false,
  permissionMsg = null,
}: CommentFormProps) {
  const methods = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: { name: guestName ?? "", message: "", attendance: "hadir" },
  })

  useEffect(() => {
    if (guestName) methods.setValue("name", guestName)
  }, [guestName, methods])

  const nameVal = methods.watch("name") ?? ""
  const messageVal = methods.watch("message") ?? ""

  const handleSubmit = methods.handleSubmit(async (data) => {
    try {
      await onSubmit({
        name: data.name.trim().slice(0, 100),
        message: data.message.trim().slice(0, 1000),
        attendance: data.attendance,
      })
      methods.reset({ name: guestName ?? "", message: "", attendance: "hadir" })
    } catch {
      // error toast handled by parent; keep form values for retry
    }
  })

  const isFormDisabled = disabled || isCheckingPermission

  return (
    <FormProvider {...methods}>
      <Card className="cs-form-wrap overflow-hidden p-0" radius="20px">
        <div className="flex items-center gap-3 px-8 py-5 border-b border-wedding-border rounded-t-[20px]">
          <span className="h-2 w-2 rounded-full bg-wedding-accent" />
          <span className="font-sans text-[10px] md:text-[11px] font-bold tracking-[0.30em] uppercase text-wedding-text-secondary">
            Tulis Ucapan
          </span>
          {isCheckingPermission && (
            <span className="ml-auto font-sans text-[10px] text-muted-foreground">
              Memeriksa izin...
            </span>
          )}
        </div>

        {disabled && permissionMsg && (
          <div
            role="alert"
            aria-live="polite"
            className="mx-8 mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900/50 dark:bg-amber-950/30"
          >
            <p className="font-sans text-xs font-semibold text-amber-800 dark:text-amber-200">
              Anda tidak memiliki izin untuk menambahkan komentar.
            </p>
            <p className="mt-1 font-sans text-xs leading-relaxed text-amber-700 dark:text-amber-300">
              {permissionMsg.includes("Jika peringatan ini salah")
                ? permissionMsg
                : "Anda tidak memiliki izin untuk menambahkan komentar. Jika peringatan ini salah hubungi pengirim link ini."}
            </p>
          </div>
        )}

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
                    disabled={isFormDisabled}
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
                    disabled={isFormDisabled}
                  />
                )}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Controller
                name="message"
                control={methods.control}
                render={({ field, fieldState }) => (
                  <FormTextArea
                    label="Ucapan & Doa"
                    error={fieldState.error?.message}
                    rows={4}
                    placeholder="Tulis ucapan atau doa Anda untuk kedua mempelai..."
                    disabled={isFormDisabled}
                    {...field}
                  />
                )}
              />
              <div className="flex w-full justify-end font-sans text-[10px] text-muted-foreground">
                <span>{messageVal.length}/1000</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center justify-center">
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || isFormDisabled}
                aria-busy={isSubmitting}
                aria-disabled={isFormDisabled}
                title={
                  disabled
                    ? "Anda tidak memiliki izin untuk menambahkan komentar. Jika peringatan ini salah hubungi pengirim link ini."
                    : undefined
                }
                className="cs-submit-btn flex cursor-pointer items-center justify-center rounded-xl px-8 py-6 font-sans text-[10px] md:text-[11px] font-bold tracking-[0.3em] uppercase transition-all duration-300 bg-green-800 text-white hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed dark:bg-red-800 dark:hover:bg-red-700 z-15"
              >
                {isCheckingPermission
                  ? "Memeriksa..."
                  : isSubmitting
                    ? "Mengirim..."
                    : submitted
                      ? "✓ Terkirim"
                      : "Kirim Ucapan"}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </FormProvider>
  )
}
