import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Calendar, CornerDownLeft, Users, Flag } from "lucide-react"
import { toast } from "sonner"

const taskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
})

type TaskFormValues = z.infer<typeof taskSchema>

export function AddTask({
  columnId,
  setAddTaskOpen,
}: {
  columnId: string | number
  setAddTaskOpen: (open: boolean) => void
}) {
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  })

  const onSubmit = async (data: TaskFormValues) => {}

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="sticky top-2 z-10 h-26.5 rounded-sm border bg-background px-1 pt-1 pb-1"
      >
        <div className="flex flex-col">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="mb-1">
                <FormControl>
                  <div className="flex items-center justify-between gap-1">
                    <input
                      {...field}
                      placeholder="Task Name..."
                      className="flex-1 border-0 bg-transparent p-0 px-1 text-xs font-medium outline-none placeholder:text-xs placeholder:text-muted-foreground"
                    />
                    <Button
                      type="submit"
                      className="h-5 cursor-pointer rounded-md text-xs"
                      disabled={form.watch("title").trim().length < 3}
                    >
                      Save
                      <CornerDownLeft className="size-3.5" />
                    </Button>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            type="button"
            variant="ghost"
            className="h-6 cursor-pointer items-center justify-start gap-1 rounded-[3px] pl-1 text-xs text-neutral-500"
          >
            <Users className="size-3.5 text-neutral-500" />
            Add Assignees
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="h-6 cursor-pointer items-center justify-start gap-1 rounded-[3px] pl-1 text-xs text-neutral-500"
          >
            <Calendar className="size-3.5 text-neutral-500" />
            Add Due Date
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="h-6 cursor-pointer items-center justify-start gap-1 rounded-[3px] pl-1 text-xs text-neutral-500"
          >
            <Flag className="size-3.5 text-neutral-500" />
            Add Priority
          </Button>
        </div>
      </form>
    </Form>
  )
}
