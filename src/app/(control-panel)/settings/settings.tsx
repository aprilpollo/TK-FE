import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import {
  User,
  Building2,
  Bell,
  Plug,
  CreditCard,
  Camera,
  AlertTriangle,
} from "lucide-react"

type SettingsTab = "Profile" | "Workspace" | "Notifications" | "Integrations" | "Billing"

const tabs: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
  { id: "Profile", label: "Profile", icon: User },
  { id: "Workspace", label: "Workspace", icon: Building2 },
  { id: "Notifications", label: "Notifications", icon: Bell },
  { id: "Integrations", label: "Integrations", icon: Plug },
  { id: "Billing", label: "Billing", icon: CreditCard },
]

function ProfileTab() {
  return (
    <div className="flex flex-col gap-8">
      {/* Profile section */}
      <div>
        <h2 className="text-lg font-semibold">Profile</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your personal information and preferences.
        </p>
        <Separator className="mt-4" />
      </div>

      {/* Avatar upload */}
      <div className="flex items-center gap-5">
        <div className="relative">
          <Avatar className="size-20">
            <AvatarFallback className="text-xl font-semibold text-white bg-purple-500">
              JD
            </AvatarFallback>
          </Avatar>
          <button className="absolute -bottom-1 -right-1 size-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors">
            <Camera className="size-3.5" />
          </button>
        </div>
        <div>
          <p className="text-sm font-medium">Profile photo</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            JPG, GIF or PNG. Max size 2MB.
          </p>
          <div className="flex gap-2 mt-2">
            <Button variant="outline" size="sm" className="text-xs h-7">
              Upload photo
            </Button>
            <Button variant="ghost" size="sm" className="text-xs h-7 text-muted-foreground">
              Remove
            </Button>
          </div>
        </div>
      </div>

      {/* Form fields */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 max-w-xl">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="firstName">First name</Label>
          <Input id="firstName" defaultValue="John" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="lastName">Last name</Label>
          <Input id="lastName" defaultValue="Doe" />
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="email">Email address</Label>
          <Input id="email" type="email" defaultValue="john.doe@acmeinc.com" />
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="title">Job title</Label>
          <Input id="title" defaultValue="Senior Engineer" />
        </div>
      </div>

      <div className="flex items-center gap-3 max-w-xl">
        <Button>Save changes</Button>
        <Button variant="ghost">Cancel</Button>
      </div>

      {/* Danger Zone */}
      <div className="max-w-xl">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="size-4 text-red-500" />
          <h3 className="text-sm font-semibold text-red-600">Danger Zone</h3>
        </div>
        <div className="rounded-lg border border-red-200 dark:border-red-900/50 p-4 bg-red-50/50 dark:bg-red-950/20">
          <p className="text-sm font-medium">Delete account</p>
          <p className="text-xs text-muted-foreground mt-1 mb-3">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:hover:bg-red-950"
          >
            Delete my account
          </Button>
        </div>
      </div>
    </div>
  )
}

function WorkspaceTab() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold">Workspace</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configure your workspace settings and preferences.
        </p>
        <Separator className="mt-4" />
      </div>
      <div className="max-w-xl flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <Label>Workspace name</Label>
          <Skeleton className="h-9 w-full" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Workspace URL</Label>
          <Skeleton className="h-9 w-full" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Default timezone</Label>
          <Skeleton className="h-9 w-full" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>
    </div>
  )
}

function NotificationsTab() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold">Notifications</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Choose how and when you receive notifications.
        </p>
        <Separator className="mt-4" />
      </div>
      <div className="max-w-xl flex flex-col gap-5">
        {[
          "Email notifications",
          "Task assignments",
          "@Mentions",
          "Task completions",
          "Weekly digest",
        ].map((item) => (
          <div key={item} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{item}</p>
              <p className="text-xs text-muted-foreground">
                Receive updates when this event occurs
              </p>
            </div>
            <Switch defaultChecked={item !== "Weekly digest"} />
          </div>
        ))}
      </div>
    </div>
  )
}

function IntegrationsTab() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold">Integrations</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Connect your tools and services.
        </p>
        <Separator className="mt-4" />
      </div>
      <div className="max-w-xl flex flex-col gap-3">
        {["GitHub", "Slack", "Google Drive", "Figma"].map((tool) => (
          <div
            key={tool}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="size-8 rounded-lg" />
              <div>
                <p className="text-sm font-medium">{tool}</p>
                <p className="text-xs text-muted-foreground">Not connected</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Connect
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

function BillingTab() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold">Billing</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your subscription and payment methods.
        </p>
        <Separator className="mt-4" />
      </div>
      <div className="max-w-xl flex flex-col gap-4">
        <div className="rounded-lg border p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Pro Plan</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                $29 / month · Renews May 5, 2026
              </p>
            </div>
            <Button variant="outline" size="sm">
              Manage
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">Payment method</p>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-10 rounded" />
              <span className="text-sm">•••• •••• •••• 4242</span>
            </div>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
              Update
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("Profile")

  const renderContent = () => {
    switch (activeTab) {
      case "Profile":
        return <ProfileTab />
      case "Workspace":
        return <WorkspaceTab />
      case "Notifications":
        return <NotificationsTab />
      case "Integrations":
        return <IntegrationsTab />
      case "Billing":
        return <BillingTab />
    }
  }

  return (
    <div className="flex flex-col gap-0 h-full">
      {/* Page header */}
      <div className="px-6 py-5 border-b">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage your account and workspace settings
        </p>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Left nav */}
        <nav className="w-52 shrink-0 border-r p-3 flex flex-col gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2.5 w-full rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-left",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <tab.icon className="size-4 shrink-0" />
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">{renderContent()}</div>
      </div>
    </div>
  )
}

export default Settings
