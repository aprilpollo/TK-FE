import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  fetchProjectNotifications,
  updateProjectNotifications,
} from "@/api/project"
import SettingsPageHeader from "@/components/project/settings-page-header"
import SettingsSection from "@/components/project/settings-section"
import useProject from "@/hooks/useProject"

type Channel = "email" | "inApp"

type NotificationPayload = {
  project_id: number
  task_assigned_email: boolean
  task_assigned_inapp: boolean
  task_status_changed_email: boolean
  task_status_changed_inapp: boolean
  mentioned_in_comment_email: boolean
  mentioned_in_comment_inapp: boolean
  due_date_approaching_email: boolean
  due_date_approaching_inapp: boolean
  project_updates_email: boolean
  project_updates_inapp: boolean
  new_member_joined_email: boolean
  new_member_joined_inapp: boolean
  daily_digest: boolean
  weekly_digest: boolean
}

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
  const { project } = useProject()
  if (!project) return null
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
  const [dailyDigest, setDailyDigest] = useState(false)
  const [weeklyDigest, setWeeklyDigest] = useState(true)

  function toggle(id: string, channel: Channel, checked: boolean) {
    setPrefs((prev) => ({
      ...prev,
      [id]: { ...prev[id], [channel]: checked },
    }))
    setIsDirty(true)
  }

  const FetchProjectNotifications = async () => {
    try {
      const res = await fetchProjectNotifications(project.id)
      if (!res.ok) throw new Error("Failed to fetch notifications")
      const data = (await res.json()) as {
        code: number
        error: string | null
        message: string
        payload: NotificationPayload
      }
      const p = data.payload
      setPrefs({
        task_assigned: {
          email: p.task_assigned_email,
          inApp: p.task_assigned_inapp,
        },
        task_status_changed: {
          email: p.task_status_changed_email,
          inApp: p.task_status_changed_inapp,
        },
        mention: {
          email: p.mentioned_in_comment_email,
          inApp: p.mentioned_in_comment_inapp,
        },
        due_soon: {
          email: p.due_date_approaching_email,
          inApp: p.due_date_approaching_inapp,
        },
        project_update: {
          email: p.project_updates_email,
          inApp: p.project_updates_inapp,
        },
        member_activity: {
          email: p.new_member_joined_email,
          inApp: p.new_member_joined_inapp,
        },
      })
      setDailyDigest(p.daily_digest)
      setWeeklyDigest(p.weekly_digest)
    } catch (error) {
      toast.error("Could not load notification preferences")
    }
  }

  useEffect(() => {
    FetchProjectNotifications()
  }, [project.id])

  async function save() {
    if (!project) return
    setIsSaving(true)
    try {
      const res = await updateProjectNotifications(project.id, {
        task_assigned_email: prefs.task_assigned.email,
        task_assigned_inapp: prefs.task_assigned.inApp,
        task_status_changed_email: prefs.task_status_changed.email,
        task_status_changed_inapp: prefs.task_status_changed.inApp,
        mentioned_in_comment_email: prefs.mention.email,
        mentioned_in_comment_inapp: prefs.mention.inApp,
        due_date_approaching_email: prefs.due_soon.email,
        due_date_approaching_inapp: prefs.due_soon.inApp,
        project_updates_email: prefs.project_update.email,
        project_updates_inapp: prefs.project_update.inApp,
        new_member_joined_email: prefs.member_activity.email,
        new_member_joined_inapp: prefs.member_activity.inApp,
        daily_digest: dailyDigest,
        weekly_digest: weeklyDigest,
      })
      if (!res.ok) throw new Error("Failed to save")
      FetchProjectNotifications()
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
                  className="border-b align-top last:border-b-0"
                >
                  <td className="py-3 pr-4">
                    <Label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
                      {item.label}
                    </Label>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </td>
                  <td className="py-3 text-center">
                    <Switch
                      checked={prefs[item.id].email}
                      onCheckedChange={(v) => toggle(item.id, "email", v)}
                      className="cursor-pointer"
                    />
                  </td>
                  <td className="py-3 text-center">
                    <Switch
                      checked={prefs[item.id].inApp}
                      onCheckedChange={(v) => toggle(item.id, "inApp", v)}
                      className="cursor-pointer"
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
            <Switch
              checked={dailyDigest}
              onCheckedChange={(v) => {
                setDailyDigest(v)
                setIsDirty(true)
              }}
              className="cursor-pointer"
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border px-4 py-3">
            <div>
              <p className="text-sm font-medium">Weekly digest</p>
              <p className="text-xs text-muted-foreground">
                Sent every Monday with last week's activity.
              </p>
            </div>
            <Switch
              checked={weeklyDigest}
              onCheckedChange={(v) => {
                setWeeklyDigest(v)
                setIsDirty(true)
              }}
              className="cursor-pointer"
            />
          </div>
        </div>
      </SettingsSection>
      <div className="flex justify-end">
        <Button size="sm" onClick={save} disabled={!isDirty || isSaving} className="cursor-pointer">
          {isSaving ? "Saving..." : "Save preferences"}
        </Button>
      </div>
    </div>
  )
}

export default NotificationsSettings
