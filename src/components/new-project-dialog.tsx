import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { DatePicker } from "@/components/date-picker"
import { createProject } from "@/api/project"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: () => void
}

const schema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z
    .string()
    .max(500, "Description must be 500 characters or less")
    .optional(),
  due_date: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

function NewProjectDialog({ open, onOpenChange, onCreated }: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      due_date: "",
    },
  })

  async function onSubmit(values: FormValues) {
    try {
      const res = await createProject({
        name: values.name,
        description: values.description || undefined,
        due_date: values.due_date ? `${values.due_date}T00:00:00Z` : undefined,
      })

      if (!res.ok) {
        const err = await res.json().catch(() => null)
        toast.error(err?.message ?? "Failed to create project", {
          position: "top-center",
        })
        return
      }

      toast.success("Project created successfully", { position: "top-center" })
      form.reset()
      onOpenChange(false)
      onCreated()
    } catch {
      toast.error("Failed to create project. Please try again.", {
        position: "top-center",
      })
    }
  }

  function handleOpenChange(val: boolean) {
    if (!val) form.reset()
    onOpenChange(val)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <Plus className="size-4" />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Website Redesign" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of the project..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {form.watch("description")?.length ?? 0}/500 characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status & Due Date */}
            <FormField
                control={form.control}
                name="due_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Creating..." : "Create Project"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default NewProjectDialog
