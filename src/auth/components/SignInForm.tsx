import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { z } from "zod"
import { Link } from "react-router"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import _ from "lodash"
import TokenManager from "../utils/tokenManager"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FetchApiError } from "@/utils/apiFetch"
import { type SignInPayload } from "../providers/JwtAuthProvider"
import useAuth from "../context/useJwtAuth"

const schema = z.object({
  email: z
    .string()
    .email("You must enter a valid email")
    .min(1, "You must enter an email"),
  password: z
    .string()
    .min(4, "Password is too short - must be at least 4 chars.")
    .min(1, "Please enter your password."),
})

type FormType = SignInPayload & {
  remember?: boolean
}

const defaultValues = {
  email: "",
  password: "",
  remember: true,
}

function SignInForm() {
  const googleOauthUrl =
    window.__ENV__?.GOOGLE_OAUTH_URL || import.meta.env.GOOGLE_OAUTH_URL
  const googleClientId =
    window.__ENV__?.GOOGLE_CLIENT_ID || import.meta.env.GOOGLE_CLIENT_ID
  const googleRedirectUri =
    window.__ENV__?.GOOGLE_REDIRECT_URI || import.meta.env.GOOGLE_REDIRECT_URI
  const { signIn } = useAuth()
  const [isShowPassword, setIsShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const togglePasswordVisibility = () => {
    setIsShowPassword((prev) => !prev)
  }

  const form = useForm<FormType>({
    mode: "onChange",
    defaultValues,
    resolver: zodResolver(schema),
  })

  const { setValue, setError } = form

  useEffect(() => {
    setValue("email", "phonsing@gmail.com", {
      shouldDirty: true,
      shouldValidate: true,
    })
    setValue("password", "@aplps9921", {
      shouldDirty: true,
      shouldValidate: true,
    })
  }, [setValue])

  function onSubmit(formData: FormType) {
    const { email, password } = formData

    setIsLoading(true)
    signIn({
      email,
      password,
    })
      .catch((error: FetchApiError) => {
        const errorData = error.data as {
          code?: number
          error?: string | null
          message?: string
        }
        setError("password", {
          type: "manual",
          message:
            errorData?.error || errorData?.message || "Something went wrong",
        })
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const handleGoogleLogin = async () => {
    const nonce = crypto.randomUUID()
    TokenManager.setGoogleNonce(nonce)
    const oauthUrl =
      googleOauthUrl +
      "?" +
      new URLSearchParams({
        client_id: googleClientId || "",
        redirect_uri: (googleRedirectUri || "") + "/auth/callback/google",
        response_type: "id_token",
        scope: "openid email profile",
        nonce: nonce,
      }).toString()

    window.location.href = oauthUrl
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">Login to your account</h1>
            <p className="text-sm text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <Field>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="m@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Field>
          <Field>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="********"
                        {...field}
                        type={isShowPassword ? "text" : "password"}
                        className="pr-10"
                      />
                      <Button
                        variant="ghost"
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute top-0 right-0 h-full px-3 hover:bg-transparent"
                      >
                        {isShowPassword ? (
                          <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <EyeIcon className="h-4 w-4 text-muted-foreground" />
                        )}{" "}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Field>
          <Field>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Sign in..." : "Sign in"}{" "}
            </Button>
          </Field>
          <FieldSeparator>Or continue with</FieldSeparator>
          <Field>
            <div className="grid grid-cols-3 gap-4">
              <Button
                variant="outline"
                type="button"
                onClick={handleGoogleLogin}
                className="col-span-3"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                Google
              </Button>
            </div>
            <FieldDescription className="text-center">
              Don&apos;t have an account?{" "}
              <Link to="/auth/signup" className="underline underline-offset-4">
                Sign up
              </Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </Form>
  )
}

export default SignInForm
