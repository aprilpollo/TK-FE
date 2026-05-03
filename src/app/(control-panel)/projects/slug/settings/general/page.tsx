import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Camera, Dot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AvatarInput } from "@/components/avatar-input"
import { fetchProjectStatuses } from "@/api/project"
import { cn } from "@/lib/utils"
import { PopoverDateTimePicker } from "@/components/date-picker"
import SettingsPageHeader from "@/components/project-settings/settings-page-header"
import SettingsSection from "@/components/project-settings/settings-section"
import useProject from "@/hooks/useProject"

const generalSchema = z.object({
  name: z.string().min(1, "Project name is required").max(60),
  description: z.string().max(280, "Keep it under 280 characters").optional(),
  status_id: z.number().int().min(1).max(4),
  due_date: z.object({ start: z.string(), end: z.string(), allDay: z.boolean() }).optional(),
})

type Status = {
  id: number
  name: string
  description?: string
}

type GeneralFormValues = z.infer<typeof generalSchema>

function GeneralSettings() {
  const { project } = useProject()
  const [status, setStatus] = useState<Status[]>([])

  const loadProjectStatuses = async () => {
    try {
      const response = await fetchProjectStatuses()
      if (response.ok) {
        const data = (await response.json()) as {
          code: number
          error: string | null
          message: string
          payload: Status[]
        }
        setStatus(data.payload)
      } else {
        console.error("Failed to fetch project statuses:", response.statusText)
      }
    } catch (error) {
      console.error("Error fetching project statuses:", error)
    }
  }

  useEffect(() => {
    loadProjectStatuses()
  }, [])

  const form = useForm<GeneralFormValues, unknown, GeneralFormValues>({
    resolver: zodResolver(generalSchema),
    defaultValues: {
      name: project?.name ?? "",
      description: project?.description ?? "",
      status_id: project?.status?.id ?? 1,
      due_date: project?.due_date ? { start: project.due_date, end: project.due_date, allDay: true } : undefined,
    },
  })

  async function onSubmit(values: GeneralFormValues) {
    try {
      console.log("Submitting form with values:", values)
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
                  // size="sm"
                  onClick={() => form.reset()}
                  disabled={!form.formState.isDirty}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  // size="sm"
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
              {/* Lifecycle */}
              <SettingsSection
                title="Lifecycle"
                description="Track the project's current phase and target completion."
                className="space-y-3"
              >
                <FormField
                  control={form.control}
                  name="status_id"
                  render={({ field }) => (
                    <FormItem className="flex h-16 items-center justify-between rounded-md border px-4">
                      <div>
                        <FormLabel>Status</FormLabel>
                        <FormDescription className="text-xs">
                          Active, completed, or on hold? This helps keep
                        </FormDescription>
                      </div>
                      <Select
                        value={String(field.value)}
                        onValueChange={(v) => field.onChange(Number(v))}
                      >
                        <FormControl>
                          <SelectTrigger
                            size="sm"
                            className="cursor-pointer font-medium capitalize"
                          >
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            {status.map((s) => (
                              <SelectItem
                                key={s.id}
                                value={String(s.id)}
                                className="cursor-pointer font-medium capitalize"
                              >
                                <div className="flex items-center gap-1">
                                  <Dot
                                    strokeWidth={12}
                                    className={cn(
                                      s.id === 1 && "text-green-700",
                                      s.id === 2 && "text-sky-700",
                                      s.id === 3 && "text-purple-700",
                                      s.id === 4 && "text-red-700"
                                    )}
                                  />
                                  {s.name}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectGroup>
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
                    <FormItem className="flex h-16 items-center justify-between rounded-md border px-4">
                      <div>
                        <FormLabel>Due date</FormLabel>
                        <FormDescription className="text-xs">
                          Set a target completion date to stay on track.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <PopoverDateTimePicker
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Pick a due date"
                          align="end"
                          displayAllDaySwitch={false}
                          buttonProps={{
                            size: "sm",
                            variant: "outline",
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </SettingsSection>
            </div>
          </SettingsSection>
        </form>
      </Form>
    </div>
  )
}

export default GeneralSettings
