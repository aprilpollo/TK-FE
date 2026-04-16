import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { CheckCheck, AtSign, ClipboardList, MessageSquare, Archive, Check } from "lucide-react"

type TabType = "All" | "Mentions" | "Assignments" | "Comments"

interface Notification {
  id: number
  initials: string
  bg: string
  content: string
  time: string
  read: boolean
  group: "Today" | "Yesterday" | "Earlier"
  type: TabType
}

const notifications: Notification[] = [
  {
    id: 1,
    initials: "JD",
    bg: "bg-purple-500",
    content: "John Doe assigned you to Implement login flow with OAuth",
    time: "2 min ago",
    read: false,
    group: "Today",
    type: "Assignments",
  },
  {
    id: 2,
    initials: "SA",
    bg: "bg-blue-500",
    content: "Sara Ahmed @mentioned you in Fix navigation bug on mobile",
    time: "18 min ago",
    read: false,
    group: "Today",
    type: "Mentions",
  },
  {
    id: 3,
    initials: "MK",
    bg: "bg-pink-500",
    content: "Mike Kim commented on Design system token updates",
    time: "45 min ago",
    read: false,
    group: "Today",
    type: "Comments",
  },
  {
    id: 4,
    initials: "TR",
    bg: "bg-green-500",
    content: "Tina Ray assigned you to API integration for user profiles",
    time: "1 hr ago",
    read: false,
    group: "Today",
    type: "Assignments",
  },
  {
    id: 5,
    initials: "PL",
    bg: "bg-orange-500",
    content: "Paul Lee @mentioned you in Write unit tests for auth module",
    time: "3 hr ago",
    read: true,
    group: "Today",
    type: "Mentions",
  },
  {
    id: 6,
    initials: "JD",
    bg: "bg-purple-500",
    content: "John Doe commented on Implement login flow with OAuth",
    time: "5 hr ago",
    read: true,
    group: "Today",
    type: "Comments",
  },
  {
    id: 7,
    initials: "SA",
    bg: "bg-blue-500",
    content: "Sara Ahmed assigned you to Accessibility audit for components",
    time: "Yesterday",
    read: true,
    group: "Yesterday",
    type: "Assignments",
  },
  {
    id: 8,
    initials: "MK",
    bg: "bg-pink-500",
    content: "Mike Kim @mentioned you in Set up CI/CD pipeline",
    time: "Yesterday",
    read: true,
    group: "Yesterday",
    type: "Mentions",
  },
  {
    id: 9,
    initials: "TR",
    bg: "bg-green-500",
    content: "Tina Ray commented on Database schema design",
    time: "2 days ago",
    read: true,
    group: "Earlier",
    type: "Comments",
  },
  {
    id: 10,
    initials: "PL",
    bg: "bg-orange-500",
    content: "Paul Lee assigned you to Performance profiling and optimization",
    time: "3 days ago",
    read: true,
    group: "Earlier",
    type: "Assignments",
  },
]

const tabs: { id: TabType; label: string; icon: React.ElementType; count?: number }[] = [
  { id: "All", label: "All", icon: CheckCheck, count: 4 },
  { id: "Mentions", label: "Mentions", icon: AtSign, count: 1 },
  { id: "Assignments", label: "Assignments", icon: ClipboardList, count: 2 },
  { id: "Comments", label: "Comments", icon: MessageSquare, count: 1 },
]

function NotificationItem({ item }: { item: Notification }) {
  return (
    <div
      className={cn(
        "group flex items-start gap-3 px-4 py-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer relative",
        !item.read && "bg-blue-50/50 dark:bg-blue-950/20"
      )}
    >
      <Avatar className="size-8 shrink-0 mt-0.5">
        <AvatarFallback className={cn("text-xs font-semibold text-white", item.bg)}>
          {item.initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm", !item.read ? "font-medium" : "text-foreground/80")}>
          {item.content}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">{item.time}</p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {/* Unread dot */}
        {!item.read && <span className="size-2 rounded-full bg-blue-500 shrink-0" />}
        {/* Hover actions */}
        <div className="hidden group-hover:flex items-center gap-1 ml-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-6 text-muted-foreground hover:text-foreground"
            title="Mark as read"
          >
            <Check className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-6 text-muted-foreground hover:text-foreground"
            title="Archive"
          >
            <Archive className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function GroupSection({
  label,
  items,
}: {
  label: string
  items: Notification[]
}) {
  if (items.length === 0) return null
  return (
    <div>
      <div className="flex items-center gap-2 px-4 py-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <Separator className="flex-1" />
      </div>
      {items.map((item) => (
        <NotificationItem key={item.id} item={item} />
      ))}
    </div>
  )
}

function Inbox() {
  const [activeTab, setActiveTab] = useState<TabType>("All")

  const filtered =
    activeTab === "All" ? notifications : notifications.filter((n) => n.type === activeTab)

  const unreadCount = notifications.filter((n) => !n.read).length

  const todayItems = filtered.filter((n) => n.group === "Today")
  const yesterdayItems = filtered.filter((n) => n.group === "Yesterday")
  const earlierItems = filtered.filter((n) => n.group === "Earlier")

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight">Inbox</h1>
          {unreadCount > 0 && (
            <span className="rounded-full bg-blue-500 text-white text-xs font-semibold px-2 py-0.5">
              {unreadCount}
            </span>
          )}
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <CheckCheck className="size-3.5" />
          Mark all read
        </Button>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Left sidebar tabs */}
        <div className="w-52 shrink-0 border-r p-3 flex flex-col gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center justify-between w-full rounded-lg px-3 py-2 text-sm font-medium transition-colors text-left",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-2.5">
                <tab.icon className="size-4" />
                {tab.label}
              </div>
              {tab.count !== undefined && tab.count > 0 && (
                <span
                  className={cn(
                    "rounded-full text-[11px] font-semibold px-1.5 py-0.5",
                    activeTab === tab.id
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Notification list */}
        <div className="flex-1 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 py-16">
              <div className="size-12 rounded-full bg-muted flex items-center justify-center">
                <CheckCheck className="size-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">All caught up!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <GroupSection label="Today" items={todayItems} />
              <GroupSection label="Yesterday" items={yesterdayItems} />
              <GroupSection label="Earlier" items={earlierItems} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Inbox
