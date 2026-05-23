import { useState, useRef, useEffect } from "react"
import {
  Search,
  Bell,
  SlidersHorizontal,
  Plus,
  Paintbrush,
  Smile,
  Paperclip,
  AtSign,
  Laugh,
  Video,
  Mic,
  CheckSquare,
  Share2,
  Camera,
  ArrowRight,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ActivityItem =
  | {
      type: "event"
      id: string
      actor: string
      action: string
      timestamp: string
    }
  | {
      type: "comment"
      id: string
      actor: string
      text: string
      timestamp: string
    }

const CURRENT_USER = "April P."

const MOCK_ACTIVITIES: ActivityItem[] = [
  {
    type: "event",
    id: "1",
    actor: "Kritapas Poungmalai",
    action: "created this task",
    timestamp: "Aug 4, 10:13",
  },
  {
    type: "comment",
    id: "2",
    actor: "Kritapas Poungmalai",
    text: "ช่วย review spec ก่อนได้เลยนะครับ ขอบคุณ",
    timestamp: "Aug 6, 14:05",
  },
  {
    type: "comment",
    id: "3",
    actor: "Kritapas Poungmalai",
    text: "ถ้ามีคำถามอะไรทักมาได้เลยครับ",
    timestamp: "Aug 6, 14:06",
  },
  {
    type: "comment",
    id: "4",
    actor: CURRENT_USER,
    text: "รับทราบครับ จะดูให้วันนี้",
    timestamp: "Aug 6, 14:30",
  },
  {
    type: "comment",
    id: "5",
    actor: CURRENT_USER,
    text: "review เสร็จแล้วครับ มีบางส่วนขอ clarify เพิ่มเติมนะครับ",
    timestamp: "Aug 6, 15:00",
  },
  {
    type: "event",
    id: "6",
    actor: "Kritapas Poungmalai",
    action: "changed status to In Progress",
    timestamp: "Mar 23, 19:02",
  },
  {
    type: "comment",
    id: "7",
    actor: "Kritapas Poungmalai",
    text: "ok ครับ รอสักครู่",
    timestamp: "Mar 23, 19:10",
  },
]

const TOOLBAR_ICONS = [
  { icon: Plus, label: "More" },
  { icon: Paintbrush, label: "Format" },
  { icon: Smile, label: "Emoji" },
  { icon: Paperclip, label: "Attach" },
  { icon: AtSign, label: "Mention" },
  { icon: Laugh, label: "GIF" },
  { icon: Video, label: "Video" },
  { icon: Mic, label: "Audio" },
  { icon: CheckSquare, label: "Task" },
  { icon: Share2, label: "Share" },
  { icon: Camera, label: "Screenshot" },
]

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

function getAvatarColor(name: string) {
  const colors = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-green-500",
    "bg-orange-500",
    "bg-pink-500",
    "bg-teal-500",
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i)
  return colors[hash % colors.length]
}

type TaskActivityProps = {
  taskId: string
}

export function TaskActivity({ taskId: _ }: TaskActivityProps) {
  const [activities, setActivities] = useState<ActivityItem[]>(MOCK_ACTIVITIES)
  const [comment, setComment] = useState("")
  const feedRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight
    }
  }, [activities])

  const comments = activities.filter((a) => a.type === "comment") as Extract<
    ActivityItem,
    { type: "comment" }
  >[]

  function isFirstInGroup(index: number) {
    if (index === 0) return true
    const prev = comments[index - 1]
    const curr = comments[index]
    return prev.actor !== curr.actor
  }

  function isLastInGroup(index: number) {
    if (index === comments.length - 1) return true
    const next = comments[index + 1]
    const curr = comments[index]
    return next.actor !== curr.actor
  }

  function handleSend() {
    const text = comment.trim()
    if (!text) return
    const now = new Date()
    const timestamp = now.toLocaleString("th-TH", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
    setActivities((prev) => [
      ...prev,
      {
        type: "comment",
        id: String(Date.now()),
        actor: CURRENT_USER,
        text,
        timestamp,
      },
    ])
    setComment("")
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-2.5">
        <span className="text-sm font-medium">Activity</span>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="size-7">
            <Search className="size-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="relative size-7">
            <Bell className="size-3.5" />
            <span className="absolute -right-0.5 -top-0.5 flex size-3.5 items-center justify-center rounded-full bg-muted text-[9px] font-semibold text-muted-foreground">
              0
            </span>
          </Button>
          <Button variant="ghost" size="icon" className="size-7">
            <SlidersHorizontal className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* Feed */}
      <div ref={feedRef} className="flex-1 overflow-y-auto px-4 py-4">
        <div className="flex flex-col gap-0.5">
          {activities.map((item) => {
            if (item.type === "event") {
              return (
                <div key={item.id} className="my-3 flex items-center gap-2">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-center text-[11px] text-muted-foreground">
                    <span className="font-medium">{item.actor}</span> {item.action} · {item.timestamp}
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>
              )
            }

            const commentIdx = comments.findIndex((c) => c.id === item.id)
            const isMine = item.actor === CURRENT_USER
            const showAvatar = !isMine && isLastInGroup(commentIdx)
            const showName = !isMine && isFirstInGroup(commentIdx)
            const isFirst = isFirstInGroup(commentIdx)
            const isLast = isLastInGroup(commentIdx)

            return (
              <div
                key={item.id}
                className={cn(
                  "flex items-end gap-2",
                  isMine ? "flex-row-reverse" : "flex-row",
                  !isLast && "mb-0.5"
                )}
              >
                {/* Avatar placeholder to maintain spacing */}
                {!isMine && (
                  <div className="size-7 shrink-0">
                    {showAvatar && (
                      <div
                        className={cn(
                          "flex size-7 items-center justify-center rounded-full text-[10px] font-semibold text-white",
                          getAvatarColor(item.actor)
                        )}
                      >
                        {getInitials(item.actor)}
                      </div>
                    )}
                  </div>
                )}

                <div className={cn("flex max-w-[72%] flex-col gap-0.5", isMine && "items-end")}>
                  {showName && (
                    <span className="px-1 text-[11px] text-muted-foreground">{item.actor}</span>
                  )}
                  <div
                    className={cn(
                      "px-3 py-2 text-sm",
                      isMine
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground",
                      // bubble shape — round except corner where grouped messages meet
                      isFirst && isLast && "rounded-2xl",
                      isFirst && !isLast && isMine && "rounded-2xl rounded-br-md",
                      isFirst && !isLast && !isMine && "rounded-2xl rounded-bl-md",
                      !isFirst && !isLast && isMine && "rounded-2xl rounded-r-md",
                      !isFirst && !isLast && !isMine && "rounded-2xl rounded-l-md",
                      !isFirst && isLast && isMine && "rounded-2xl rounded-tr-md",
                      !isFirst && isLast && !isMine && "rounded-2xl rounded-tl-md"
                    )}
                  >
                    {item.text}
                  </div>
                  {isLast && (
                    <span className="px-1 text-[10px] text-muted-foreground">{item.timestamp}</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Comment Input */}
      <div className="border-t">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write a comment..."
          rows={2}
          className="w-full resize-none bg-transparent px-4 pt-3 text-sm outline-none placeholder:text-muted-foreground"
        />
        <div className="flex items-center justify-between px-3 pb-2.5 pt-1">
          <div className="flex items-center gap-0.5">
            {TOOLBAR_ICONS.map(({ icon: Icon, label }) => (
              <Button
                key={label}
                variant="ghost"
                size="icon"
                className="size-7 text-muted-foreground hover:text-foreground"
                aria-label={label}
              >
                <Icon className="size-3.5" />
              </Button>
            ))}
          </div>
          <div className="flex items-center">
            <Button
              size="icon"
              className="size-7 rounded-r-none"
              disabled={!comment.trim()}
              onClick={handleSend}
              aria-label="Send comment"
            >
              <ArrowRight className="size-3.5" />
            </Button>
            <Button
              size="icon"
              className="size-7 rounded-l-none border-l border-primary-foreground/20"
              disabled={!comment.trim()}
              aria-label="Send options"
            >
              <ChevronDown className="size-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
