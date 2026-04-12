import { useState } from "react"
import { toast } from "sonner"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

type NotificationItem = {
  id: string
  label: string
  description: string
  defaultValue: boolean
}

type NotificationSection = {
  title: string
  description: string
  items: NotificationItem[]
}

const notificationSections: NotificationSection[] = [
  {
    title: "Email Notifications",
    description: "Choose what you receive in your inbox.",
    items: [
      {
        id: "email_task_assigned",
        label: "Task assigned",
        description: "When someone assigns a task to you.",
        defaultValue: true,
      },
      {
        id: "email_task_comment",
        label: "Task comments",
        description: "When someone comments on your task.",
        defaultValue: true,
      },
      {
        id: "email_mentions",
        label: "Mentions",
        description: "When someone mentions you in a comment or task.",
        defaultValue: true,
      },
      {
        id: "email_digest",
        label: "Weekly digest",
        description: "A weekly summary of your workspace activity.",
        defaultValue: false,
      },
    ],
  },
  {
    title: "In-App Notifications",
    description: "Manage notifications that appear inside the app.",
    items: [
      {
        id: "inapp_task_due",
        label: "Task due reminders",
        description: "Remind you when a task is approaching its due date.",
        defaultValue: true,
      },
      {
        id: "inapp_project_update",
        label: "Project updates",
        description: "When a project status or deadline changes.",
        defaultValue: true,
      },
      {
        id: "inapp_member_join",
        label: "New member joined",
        description: "When a new member joins your workspace.",
        defaultValue: false,
      },
    ],
  },
  {
    title: "Push Notifications",
    description: "Control browser push notifications.",
    items: [
      {
        id: "push_urgent",
        label: "Urgent alerts",
        description: "Only for high-priority tasks and deadlines.",
        defaultValue: true,
      },
      {
        id: "push_all",
        label: "All activity",
        description: "Every update across your workspace.",
        defaultValue: false,
      },
    ],
  },
]

function Notification() {
  const [values, setValues] = useState<Record<string, boolean>>(() =>
    notificationSections.reduce(
      (acc, section) => {
        section.items.forEach((item) => {
          acc[item.id] = item.defaultValue
        })
        return acc
      },
      {} as Record<string, boolean>
    )
  )

  const [isDirty, setIsDirty] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  function handleToggle(id: string, checked: boolean) {
    setValues((prev) => ({ ...prev, [id]: checked }))
    setIsDirty(true)
  }

  async function handleSave() {
    setIsSaving(true)
    try {
      // TODO: wire up notification preferences API
      await new Promise((resolve) => setTimeout(resolve, 800))
      toast.success("Notification preferences saved")
      setIsDirty(false)
    } catch {
      toast.error("Failed to save preferences. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Notifications</h2>
        <p className="text-sm text-muted-foreground">
          Control how and when you receive notifications.
        </p>
      </div>

      <Separator />

      <div className="space-y-8">
        {notificationSections.map((section, sectionIndex) => (
          <div key={section.title} className="space-y-4">
            <div className="space-y-0.5">
              <h3 className="text-base font-medium">{section.title}</h3>
              <p className="text-sm text-muted-foreground">
                {section.description}
              </p>
            </div>

            <div className="space-y-3">
              {section.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border px-4 py-3"
                >
                  <div className="space-y-0.5">
                    <Label htmlFor={item.id} className="cursor-pointer text-sm font-medium">
                      {item.label}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  <Switch
                    id={item.id}
                    checked={values[item.id]}
                    onCheckedChange={(checked) => handleToggle(item.id, checked)}
                  />
                </div>
              ))}
            </div>

            {sectionIndex < notificationSections.length - 1 && <Separator />}
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-2">
        <Button onClick={handleSave} disabled={isSaving || !isDirty}>
          {isSaving ? "Saving..." : "Save preferences"}
        </Button>
      </div>
    </div>
  )
}

export default Notification
