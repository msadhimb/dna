import { cn } from "@/lib/utils"
import { Field, FieldGroup } from "@/components/ui/field"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { FormInput } from "@/components/Form/FormInput"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/Button"

const Login = ({ className, ...props }: React.ComponentProps<"form">) => {
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    const supabase = createClient()
    const toastId = toast.loading("Loading...")

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      toast.success("Login berhasil", {
        id: toastId,
        duration: 1000,
      })

      router.push("/dashboard")
    } catch (error: unknown) {
      toast.error("Login gagal", {
        id: toastId,
        duration: 3000,
      })
    }
  }
  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={handleSubmit}
    >
      <FieldGroup className="space-y-10">
        <div className="space-y-8">
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-5xl font-serif">D & A</h1>
            <h1 className="text-2xl font-bold">Login to your account</h1>
            <p className="text-sm text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <div className="space-y-5">
            <FormInput
              placeholder="Email"
              name="email"
              type="email"
              required
              label="Email"
            />
            <FormInput
              placeholder="Password"
              name="password"
              type="password"
              required
              label="Password"
            />
          </div>
        </div>

        <Field>
          <Button type="submit">Login</Button>
        </Field>
      </FieldGroup>
    </form>
  )
}

export default Login
