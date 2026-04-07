import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router";
import _ from "lodash";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import useAuth from "../context/useJwtAuth";
import { FetchApiError } from "@/utils/apiFetch";
import { type SignUpPayload } from "../providers/JwtAuthProvider";

/**
 * Form Validation Schema
 */
const schema = z
  .object({
    displayName: z.string().min(1, "You must enter your name"),
    email: z
      .string()
      .email("You must enter a valid email")
      .min(1, "You must enter an email"),
    password: z
      .string()
      .min(1, "Please enter your password.")
      .min(8, "Password is too short - should be 8 chars minimum."),
    passwordConfirm: z.string().min(1, "Password confirmation is required"),
    acceptTermsConditions: z
      .boolean()
      .refine(
        (val) => val === true,
        "The terms and conditions must be accepted."
      ),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords must match",
    path: ["passwordConfirm"],
  });

type FormType = SignUpPayload & {
  passwordConfirm: string;
  acceptTermsConditions: boolean;
};

const defaultValues = {
  displayName: "",
  email: "",
  password: "",
  passwordConfirm: "",
  acceptTermsConditions: false,
};

function SignUpForm() {
  const { signUp } = useAuth();

  const form = useForm<FormType>({
    mode: "onChange",
    defaultValues,
    resolver: zodResolver(schema),
  });

  const { formState, handleSubmit, setError } = form;
  const { isValid, dirtyFields } = formState;

  function onSubmit(formData: FormType) {
    const { displayName, email, password } = formData;

    signUp({
      displayName,
      password,
      email,
    })
      .then(() => {
        // No need to do anything, registered user data will be set at app/auth/AuthRouteProvider
      })
      .catch((error: FetchApiError) => {
        const errorData = error.data as {
          type: "email" | "password" | `root.${string}` | "root";
          message: string;
        }[];

        errorData?.forEach?.(({ message, type }) => {
          setError(type, { type: "manual", message });
        });
      });
  }

  return (
    <Form {...form}>
      <form
        name="registerForm"
        noValidate
        className="mt-8 flex w-full flex-col justify-center space-y-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder="Enter your name"
                  autoFocus
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="Enter your email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  placeholder="Enter your password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="passwordConfirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  placeholder="Confirm your password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="acceptTermsConditions"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm font-normal cursor-pointer">
                  I agree with{" "}
                  <Link to="/terms" className="text-primary hover:underline">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Button
          className="w-full"
          disabled={_.isEmpty(dirtyFields) || !isValid}
          type="submit"
          size="lg"
        >
          Create your free account
        </Button>
      </form>
    </Form>
  );
}

export default SignUpForm;
