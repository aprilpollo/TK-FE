import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { AvatarInput } from "@/components/avatar-input"
import { Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import useUser from "@/auth/hooks/useUser"

const profileSchema = z.object({
  display_name: z.string().min(1, "Display name is required"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  bio: z.string().max(200, "Bio must be 200 characters or less").optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

function Profile() {
  const { data: user } = useUser()

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      display_name: user?.display_name ?? "",
      first_name: user?.first_name ?? "",
      last_name: user?.last_name ?? "",
      email: user?.email ?? "",
      bio: user?.bio ?? "",
    },
  })

  async function onSubmit(values: ProfileFormValues) {
    try {
      console.log("Updating profile with values:", values)
      toast.success("Profile updated successfully", { position: "top-center" })
      form.reset(values)
    } catch {
      toast.error("Failed to update profile. Please try again.", { position: "top-center" })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Profile</h2>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the platform.
        </p>
      </div>

      <Separator />

      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div className="relative">
          <AvatarInput
            defaultImageUrl={"https://avatars.githubusercontent.com/u/158476440?v=4"}
            accept="image/jpeg,image/png"
            icon={<Camera className="size-6 text-neutral-400" />}
            className="cursor-pointer"
          />
        </div>
        <div className="space-y-0.5">
          <p className="text-sm font-medium">Profile picture</p>
          <p className="text-xs text-muted-foreground">
            JPG, PNG Max size 2MB.
          </p>
        </div>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Display Name */}
          <FormField
            control={form.control}
            name="display_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your display name" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name visible to other members.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* First & Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="First name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            disabled
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="your@email.com" {...field} />
                </FormControl>
                <FormDescription>
                  Used for notifications and account login.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Bio */}
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us a little about yourself..."
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {form.watch("bio")?.length ?? 0}/200 characters
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={form.formState.isSubmitting || !form.formState.isDirty}
            >
              {form.formState.isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default Profile
