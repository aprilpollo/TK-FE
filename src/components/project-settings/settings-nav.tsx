import { useLocation } from "react-router"
import {
  AlertTriangle,
  Bell,
  Plug,
  SlidersHorizontal,
  Tags,
  Users,
  type LucideIcon,
} from "lucide-react"
import Link from "@/shared/Link"
import { cn } from "@/lib/utils"

type NavItem = {
  to: string
  label: string
  icon: LucideIcon
  group?: "access" | "workflow" | "danger"
}

const NAV_ITEMS: NavItem[] = [
  { to: "general", label: "General", icon: SlidersHorizontal },
  { to: "members", label: "Members", icon: Users, group: "access" },
  { to: "tags", label: "Labels & Tags", icon: Tags, group: "workflow" },
  {
    to: "notifications",
    label: "Notifications",
    icon: Bell,
    group: "workflow",
  },
  { to: "integrations", label: "Integrations", icon: Plug, group: "workflow" },
  { to: "danger", label: "Danger Zone", icon: AlertTriangle, group: "danger" },
]

const GROUP_LABELS: Record<NonNullable<NavItem["group"]>, string> = {
  access: "Access",
  workflow: "Workflow",
  danger: "Advanced",
}

function SettingsNav({ basePath }: { basePath: string }) {
  const location = useLocation()

  const grouped = NAV_ITEMS.reduce<Record<string, NavItem[]>>((acc, item) => {
    const key = item.group ?? "_"
    acc[key] ??= []
    acc[key].push(item)
    return acc
  }, {})

  const order = ["_", "access", "workflow", "danger"] as const

  return (
    <nav className="sticky top-4 space-y-4 text-sm">
      {order.map((key) => {
        const items = grouped[key]
        if (!items?.length) return null

        return (
          <div key={key}>
            {key !== "_" && (
              <p className="mb-1 px-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {GROUP_LABELS[key as keyof typeof GROUP_LABELS]}
              </p>
            )}
            <ul className="space-y-0.5">
              {items.map((item) => {
                const href = `${basePath}/${item.to}`
                const active = location.pathname === href
                const isDanger = item.group === "danger"

                return (
                  <li key={item.to}>
                    <Link
                      to={href}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-3 py-1.5 transition-colors",
                        active
                          ? "bg-muted font-medium text-neutral-900 dark:bg-muted/60 dark:text-neutral-100"
                          : "text-muted-foreground hover:bg-muted/60 hover:text-neutral-800 dark:hover:text-neutral-200",
                        isDanger &&
                          !active &&
                          "hover:bg-destructive/10 hover:text-destructive",
                        isDanger && active && "text-destructive"
                      )}
                    >
                      <item.icon className="size-4" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </nav>
  )
}

export default SettingsNav
