import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Camera, Dot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AvatarInput } from "@/components/avatar-input"
import { DatePicker } from "@/components/date-picker"
import SettingsPageHeader from "@/components/project-settings/settings-page-header"
import SettingsSection from "@/components/project-settings/settings-section"
import useProject from "@/hooks/useProject"
import { cn } from "@/lib/utils"

const PROJECT_STATUSES = [
  { id: 1, name: "Active" },
  { id: 2, name: "Inactive" },
  { id: 3, name: "Completed" },
  { id: 4, name: "Cancelled" },
] as const

const generalSchema = z.object({
  name: z.string().min(1, "Project name is required").max(60),
  description: z.string().max(280, "Keep it under 280 characters").optional(),
  status_id: z.number().int().min(1).max(4),
  due_date: z.string().optional(),
})

type GeneralFormValues = z.infer<typeof generalSchema>

function GeneralSettings() {
  const { project } = useProject()

  const form = useForm<GeneralFormValues>({
    resolver: zodResolver(generalSchema),
    defaultValues: {
      name: project?.name ?? "",
      description: project?.description ?? "",
      status_id: project?.status?.id ?? 1,
      due_date: project?.due_date ?? "",
    },
  })

  async function onSubmit(values: GeneralFormValues) {
    try {
      await new Promise((r) => setTimeout(r, 600))
      toast.success("Project updated", { position: "top-center" })
      form.reset(values)
    } catch {
      toast.error("Failed to update project")
    }
  }

  async function onAvatarChange(_: {
    blob: Blob
    file: File
    previewUrl: string
  }) {
    try {
      await new Promise((r) => setTimeout(r, 400))
      toast.success("Avatar updated")
    } catch {
      toast.error("Failed to update avatar")
    }
  }

  const description = form.watch("description") ?? ""

  return (
    <div className="space-y-6">
      <SettingsPageHeader
        title="General"
        description="Basic information and identity of this project."
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Identity */}
          <SettingsSection
            footer={
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => form.reset()}
                  disabled={!form.formState.isDirty}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={
                    form.formState.isSubmitting || !form.formState.isDirty
                  }
                >
                  {form.formState.isSubmitting ? "Saving..." : "Save changes"}
                </Button>
              </>
            }
          >
            <div className="space-y-5">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <AvatarInput
                  defaultImageUrl={project?.logo_url}
                  accept="image/jpeg,image/png"
                  icon={<Camera className="size-5 text-neutral-400" />}
                  className="cursor-pointer"
                  onCropped={onAvatarChange}
                />
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Project logo</p>
                  <p className="text-xs text-muted-foreground">
                    PNG or JPG up to 2MB. Square images work best.
                  </p>
                </div>
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project name</FormLabel>
                    <FormControl>
                      <Input placeholder="My awesome project" {...field} />
                    </FormControl>
                    <FormDescription>
                      Shown in lists, menus, and page titles.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel>Project key</FormLabel>
                <div className="flex items-center gap-2">
                  <Input
                    value={project?.key ?? ""}
                    disabled
                    className="max-w-40 font-mono uppercase"
                  />
                  <Badge variant="outline" className="text-xs">
                    Read only
                  </Badge>
                </div>
                <FormDescription>
                  Used as a prefix for task IDs. Cannot be changed.
                </FormDescription>
              </FormItem>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={3}
                        placeholder="What is this project about?"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {description.length}/280 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </SettingsSection>

          {/* Lifecycle */}
          <SettingsSection
            title="Lifecycle"
            description="Track the project's current phase and target completion."
          >
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="status_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      value={String(field.value)}
                      onValueChange={(v) => field.onChange(Number(v))}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PROJECT_STATUSES.map((s) => (
                          <SelectItem key={s.id} value={String(s.id)}>
                            <div className="flex items-center">
                              <Dot
                                strokeWidth={12}
                                className={cn(
                                  s.id === 1 && "text-emerald-500",
                                  s.id === 2 && "text-muted-foreground",
                                  s.id === 3 && "text-blue-500",
                                  s.id === 4 && "text-destructive"
                                )}
                              />
                              {s.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="due_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due date</FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Pick a due date"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </SettingsSection>
        </form>
      </Form>
    </div>
  )
}

export default GeneralSettings
