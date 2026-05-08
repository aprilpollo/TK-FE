import { useLocation } from "react-router"
import {
  AlertTriangle,
  Bell,
  GitMerge,
  Menu,
  Plug,
  SlidersHorizontal,
  Users,
  type LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  { to: "status", label: "Statuses", icon: GitMerge, group: "workflow" },
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

const Grouped = NAV_ITEMS.reduce<Record<string, NavItem[]>>((acc, item) => {
  const key = item.group ?? "_"
  acc[key] ??= []
  acc[key].push(item)
  return acc
}, {})

const Order = ["_", "access", "workflow", "danger"] as const

export function SettingsNav({ basePath }: { basePath: string }) {
  const location = useLocation()

  return (
    <nav className="">
      {Order.map((key) => {
        const items = Grouped[key]
        if (!items?.length) return null

        return (
          <div key={key}>
            {key !== "_" && (
              <p className="mt-2 mb-1 px-3 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
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
                    <Button
                      variant="ghost"
                      disabled={item.to === "integrations"}
                      className={cn("w-full cursor-pointer justify-start", {
                        "bg-muted dark:bg-muted/50": active,
                        "bg-destructive/10 dark:bg-destructive/50":
                          active && isDanger,
                        "text-destructive hover:bg-destructive/10 hover:text-destructive":
                          isDanger,
                      })}
                    >
                      <Link
                        to={href}
                        className="flex w-full items-center gap-1"
                      >
                        {item.icon && <item.icon className="size-4" />}
                        {item.label}
                      </Link>
                    </Button>
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

export function SettingsNavDropdown({ basePath }: { basePath: string }) {
  let location = useLocation()
  let currentLabel = NAV_ITEMS.find((item) =>
    location.pathname.split("/").pop()?.includes(item.to)
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="">
        <Button variant="ghost">
          {currentLabel ? (
            <>
              {currentLabel.icon && <currentLabel.icon className="size-4" />}
              {currentLabel.label}
            </>
          ) : (
            <>
              <Menu className="size-4" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        {Order.map((key) => {
          const items = Grouped[key]
          if (!items?.length) return null

          return (
            <DropdownMenuGroup key={key}>
              {key !== "_" && (
                <DropdownMenuLabel>
                  {GROUP_LABELS[key as keyof typeof GROUP_LABELS]}
                </DropdownMenuLabel>
              )}
              {items.map((item) => {
                const href = `${basePath}/${item.to}`
                const active = location.pathname === href
                const isDanger = item.group === "danger"
                return (
                  <Link key={item.to} to={href}>
                    <DropdownMenuItem
                      variant={isDanger ? "destructive" : "default"}
                      className={cn({
                        "bg-muted dark:bg-muted/50": active,
                        "bg-destructive/10 dark:bg-destructive/50":
                          active && isDanger,
                      })}
                    >
                      {item.icon && <item.icon className="me-2 size-4" />}
                      {item.label}
                    </DropdownMenuItem>
                  </Link>
                )
              })}
            </DropdownMenuGroup>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
