import { Outlet, useLocation } from "react-router"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  type LucideIcon,
  Palette,
  User,
  Settings as SettingsIcon,
  Bell,
} from "lucide-react"
import { cn } from "@/lib/utils"
import useUser from "@/auth/hooks/useUser"
import Link from "@/shared/Link"


type SettingsTab = {
  title: string
  icon?: LucideIcon
  path: string
}

const settingsTabs: SettingsTab[] = [
  { title: "Profile", icon: User, path: "/settings/profile" },
  { title: "Account", icon: SettingsIcon, path: "/settings/account" },
  // { title: "Organization", icon: Hotel, path: "/settings/organization" },
  { title: "Notifications", icon: Bell, path: "/settings/notification" },
  { title: "Appearance", icon: Palette, path: "/settings/appearance" },
]

function Settings() {
  const { data: user } = useUser()
  const location = useLocation()
  const isActive = (href: string) => location.pathname === href

  return (
    <main className="">
      <header className="container mx-auto max-w-7xl px-4 py-6">
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <Avatar className="size-14">
            <AvatarImage src={user?.avatar} alt={user?.display_name} />
            <AvatarFallback>
              {user?.display_name ? user.display_name.charAt(0) : "A"}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate text-xl font-medium">
              {user?.display_name || "User"}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              Manage your personal information and preferences.
            </span>
          </div>
        </div>
      </header>
      <div className="container mx-auto grid max-w-7xl grid-cols-4 px-4 pb-10">
        <nav className="col-span-1">
          <ul className="space-y-0.5">
            {settingsTabs.map((tab) => (
              <li key={tab.title}>
                <Link to={tab.path}>
                  <Button
                    variant="ghost"
                    className={cn("w-full cursor-pointer justify-start", {
                      "bg-muted dark:bg-muted/50": isActive(tab.path),
                    })}
                  >
                    {tab.icon && (
                      <tab.icon className="size-4 text-muted-foreground" />
                    )}
                    {tab.title}
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="col-span-3 px-10">
          <Outlet />
        </div>
      </div>
    </main>
  )
}

export default Settings
