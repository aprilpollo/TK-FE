import { useState } from "react"
import { toast } from "sonner"
import {
  Copy,
  Dot,
  KeyRound,
  MoreHorizontal,
  Plus,
  Webhook as WebhookIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import SettingsPageHeader from "@/components/project-settings/settings-page-header"
import SettingsSection from "@/components/project-settings/settings-section"
import { cn } from "@/lib/utils"

type Webhook = {
  id: string
  url: string
  events: string[]
  active: boolean
  lastDelivery?: "ok" | "failed" | null
}

type ApiToken = {
  id: string
  name: string
  prefix: string
  createdAt: string
  lastUsedAt?: string
}

const INITIAL_WEBHOOKS: Webhook[] = [
  {
    id: "wh_1",
    url: "https://hooks.slack.com/services/T000/B000/XXXX",
    events: ["task.created", "task.updated"],
    active: true,
    lastDelivery: "ok",
  },
  {
    id: "wh_2",
    url: "https://example.com/projects/webhook",
    events: ["project.updated"],
    active: false,
    lastDelivery: "failed",
  },
]

const INITIAL_TOKENS: ApiToken[] = [
  {
    id: "tok_1",
    name: "CI pipeline",
    prefix: "tk_live_a1b2",
    createdAt: "2025-02-11",
    lastUsedAt: "2026-04-22",
  },
  {
    id: "tok_2",
    name: "Reporting script",
    prefix: "tk_live_c3d4",
    createdAt: "2025-07-30",
  },
]

function IntegrationsSettings() {
  const [webhooks, setWebhooks] = useState<Webhook[]>(INITIAL_WEBHOOKS)
  const [tokens, setTokens] = useState<ApiToken[]>(INITIAL_TOKENS)

  function removeWebhook(id: string) {
    setWebhooks((prev) => prev.filter((w) => w.id !== id))
    toast.success("Webhook removed")
  }

  function toggleWebhook(id: string) {
    setWebhooks((prev) =>
      prev.map((w) => (w.id === id ? { ...w, active: !w.active } : w))
    )
  }

  function revokeToken(id: string) {
    setTokens((prev) => prev.filter((t) => t.id !== id))
    toast.success("Token revoked")
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard")
  }

  return (
    <div className="space-y-6">
      <SettingsPageHeader
        title="Integrations"
        description="Connect this project with external services via webhooks and API tokens."
      />

      {/* Webhooks */}
      <SettingsSection
        title="Webhooks"
        description="POST events to a URL whenever things happen in this project."
        footer={
          <Button size="sm">
            <Plus />
            Add webhook
          </Button>
        }
      >
        {webhooks.length === 0 ? (
          <EmptyState
            icon={<WebhookIcon className="size-5 text-muted-foreground" />}
            title="No webhooks yet"
            description="Send task and project events to tools like Slack or CI."
          />
        ) : (
          <ul className="divide-y rounded-lg border">
            {webhooks.map((w) => (
              <li
                key={w.id}
                className="flex items-center gap-3 px-4 py-3"
              >
                <WebhookIcon className="size-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-mono text-xs text-neutral-800 dark:text-neutral-200">
                    {w.url}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-1">
                    {w.events.map((e) => (
                      <Badge
                        key={e}
                        variant="outline"
                        className="h-5 rounded-sm font-mono text-[10px]"
                      >
                        {e}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="h-5 rounded-sm px-1 text-xs"
                  >
                    <Dot
                      strokeWidth={12}
                      className={cn(
                        w.active && w.lastDelivery === "ok" && "text-emerald-500",
                        w.active && w.lastDelivery === "failed" && "text-destructive",
                        !w.active && "text-muted-foreground"
                      )}
                    />
                    {w.active ? "Active" : "Paused"}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm">
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleWebhook(w.id)}>
                        {w.active ? "Pause" : "Resume"}
                      </DropdownMenuItem>
                      <DropdownMenuItem>Recent deliveries</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => removeWebhook(w.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </li>
            ))}
          </ul>
        )}
      </SettingsSection>

      {/* API tokens */}
      <SettingsSection
        title="API tokens"
        description="Scoped to this project. Treat tokens like passwords."
        footer={
          <Button size="sm">
            <Plus />
            Generate token
          </Button>
        }
      >
        {tokens.length === 0 ? (
          <EmptyState
            icon={<KeyRound className="size-5 text-muted-foreground" />}
            title="No tokens yet"
            description="Generate a token to call the API on behalf of this project."
          />
        ) : (
          <ul className="divide-y rounded-lg border">
            {tokens.map((t) => (
              <li
                key={t.id}
                className="flex items-center gap-3 px-4 py-3"
              >
                <KeyRound className="size-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                    {t.name}
                  </p>
                  <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                    {t.prefix}••••••••
                  </p>
                </div>
                <div className="hidden text-xs text-muted-foreground sm:block">
                  {t.lastUsedAt
                    ? `Last used ${t.lastUsedAt}`
                    : "Never used"}
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => copy(t.prefix)}
                  aria-label="Copy prefix"
                >
                  <Copy />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => revokeToken(t.id)}
                >
                  Revoke
                </Button>
              </li>
            ))}
          </ul>
        )}
      </SettingsSection>
    </div>
  )
}

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed px-4 py-10 text-center">
      <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-muted">
        {icon}
      </div>
      <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
        {title}
      </p>
      <p className="mt-0.5 max-w-xs text-xs text-muted-foreground">
        {description}
      </p>
    </div>
  )
}

export default IntegrationsSettings
