import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import SettingsPageHeader from "@/components/project-settings/settings-page-header"
import SettingsSection from "@/components/project-settings/settings-section"

type Channel = "email" | "inApp"

type NotificationItem = {
  id: string
  label: string
  description: string
  defaultEmail: boolean
  defaultInApp: boolean
}

const ITEMS: NotificationItem[] = [
  {
    id: "task_assigned",
    label: "Task assigned",
    description: "Someone assigns a task to you on this project.",
    defaultEmail: true,
    defaultInApp: true,
  },
  {
    id: "task_status_changed",
    label: "Task status changed",
    description: "A task you are watching moves to a new status.",
    defaultEmail: false,
    defaultInApp: true,
  },
  {
    id: "mention",
    label: "Mentioned in a comment",
    description: "Someone @mentions you in a comment or description.",
    defaultEmail: true,
    defaultInApp: true,
  },
  {
    id: "due_soon",
    label: "Due date approaching",
    description: "Reminder 24 hours before a task you own is due.",
    defaultEmail: true,
    defaultInApp: true,
  },
  {
    id: "project_update",
    label: "Project updates",
    description: "Status, description, or due date of this project changes.",
    defaultEmail: false,
    defaultInApp: true,
  },
  {
    id: "member_activity",
    label: "New member joined",
    description: "A new member is added to this project.",
    defaultEmail: false,
    defaultInApp: false,
  },
]

type Prefs = Record<string, Record<Channel, boolean>>

function NotificationsSettings() {
  const [prefs, setPrefs] = useState<Prefs>(() =>
    ITEMS.reduce<Prefs>((acc, item) => {
      acc[item.id] = {
        email: item.defaultEmail,
        inApp: item.defaultInApp,
      }
      return acc
    }, {})
  )
  const [isDirty, setIsDirty] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  function toggle(id: string, channel: Channel, checked: boolean) {
    setPrefs((prev) => ({
      ...prev,
      [id]: { ...prev[id], [channel]: checked },
    }))
    setIsDirty(true)
  }

  async function save() {
    setIsSaving(true)
    try {
      await new Promise((r) => setTimeout(r, 600))
      toast.success("Notification preferences saved")
      setIsDirty(false)
    } catch {
      toast.error("Failed to save preferences")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <SettingsPageHeader
        title="Notifications"
        description="Choose which events send notifications — per channel."
        action={
          <Button size="sm" onClick={save} disabled={!isDirty || isSaving}>
            {isSaving ? "Saving..." : "Save preferences"}
          </Button>
        }
      />

      <SettingsSection
        title="Events"
        description="Applies to events that happen inside this project."
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-xs text-muted-foreground">
                <th className="py-2 text-left font-medium">Event</th>
                <th className="w-24 py-2 text-center font-medium">Email</th>
                <th className="w-24 py-2 text-center font-medium">In-app</th>
              </tr>
            </thead>
            <tbody>
              {ITEMS.map((item) => (
                <tr
                  key={item.id}
                  className="border-b last:border-b-0 align-top"
                >
                  <td className="py-3 pr-4">
                    <Label
                      htmlFor={`${item.id}-email`}
                      className="block cursor-pointer text-sm font-medium text-neutral-800 dark:text-neutral-200"
                    >
                      {item.label}
                    </Label>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </td>
                  <td className="py-3 text-center">
                    <Switch
                      id={`${item.id}-email`}
                      checked={prefs[item.id].email}
                      onCheckedChange={(v) => toggle(item.id, "email", v)}
                    />
                  </td>
                  <td className="py-3 text-center">
                    <Switch
                      checked={prefs[item.id].inApp}
                      onCheckedChange={(v) => toggle(item.id, "inApp", v)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Digest"
        description="Summary emails of activity on this project."
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border px-4 py-3">
            <div>
              <p className="text-sm font-medium">Daily digest</p>
              <p className="text-xs text-muted-foreground">
                Sent every morning at 9:00.
              </p>
            </div>
            <Switch defaultChecked={false} />
          </div>
          <div className="flex items-center justify-between rounded-lg border px-4 py-3">
            <div>
              <p className="text-sm font-medium">Weekly digest</p>
              <p className="text-xs text-muted-foreground">
                Sent every Monday with last week's activity.
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </SettingsSection>
    </div>
  )
}

export default NotificationsSettings
