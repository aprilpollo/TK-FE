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
  SendHorizontal,
  X,
  ChevronsDown,
  FileText,
  FileImage,
  File,
  Download,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { fetchTaskComments, createTaskComments, createTaskCommentsFiles } from "@/api/task"
import useUser from "@/auth/hooks/useUser"

type ActivityFile = {
  url: string
  name: string
  type: string
}

type ActivityActor = {
  id: number
  name: string
  email: string
  avatar: string
}

type ActivityItem =
  | {
      type: "event"
      id: string
      actor: ActivityActor
      action: string
      timestamp: number
      files?: ActivityFile[]
    }
  | {
      type: "comment"
      id: string
      actor: ActivityActor
      text?: string
      timestamp: number
      files?: ActivityFile[]
    }

const TOOLBAR_ICONS = [
  { icon: Plus, label: "More" },
  { icon: Paintbrush, label: "Format" },
  { icon: Smile, label: "Emoji" },
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

function formatTimestamp(unix: number) {
  return new Date(unix * 1000).toLocaleString("th-TH", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function FileAttachment({
  file,
  isMine,
}: {
  file: ActivityFile
  isMine: boolean
}) {
  const isImage = file.type.startsWith("image/")
  const isPdf = file.type === "application/pdf"

  if (isImage) {
    return (
      <a
        href={file.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block overflow-hidden rounded-xl"
      >
        <img
          src={file.url}
          alt={file.name}
          className="max-h-48 w-full max-w-55 object-cover transition-opacity group-hover:opacity-90"
        />
        <div className="absolute inset-0 flex items-end justify-end p-2 opacity-0 transition-opacity group-hover:opacity-100">
          <span className="flex items-center gap-1 rounded-lg bg-black/60 px-2 py-1 text-[10px] text-white">
            <Download className="size-3" />
            {file.name}
          </span>
        </div>
      </a>
    )
  }

  const Icon = isPdf
    ? FileText
    : file.type.startsWith("image/")
      ? FileImage
      : File

  return (
    <a
      href={file.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex items-center gap-2 rounded-xl px-3 py-2.5 transition-opacity hover:opacity-80",
        isMine ? "bg-primary-foreground/10" : "bg-background/60"
      )}
    >
      <Icon className="size-4 shrink-0" />
      <span className="max-w-35 truncate text-xs font-medium">{file.name}</span>
      <Download className="ml-auto size-3.5 shrink-0 opacity-60" />
    </a>
  )
}

type TaskActivityProps = {
  taskId: string | number
  setChatOpen: React.Dispatch<React.SetStateAction<boolean>>
}

type FeedMeta = { page: number; limit: number; total: number }

export function TaskActivity({ taskId, setChatOpen }: TaskActivityProps) {
  const { data: currentUser } = useUser()
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [meta, setMeta] = useState<FeedMeta>({ page: 1, limit: 20, total: 0 })
  const [loadingMore, setLoadingMore] = useState(false)
  const [isAtBottom, setIsAtBottom] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const [comment, setComment] = useState("")
  const feedRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isInitialLoad = useRef(true)

  function scrollToBottom() {
    if (feedRef.current)
      feedRef.current.scrollTop = feedRef.current.scrollHeight
  }

  function handleFeedScroll() {
    const el = feedRef.current
    if (!el) return
    setIsAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight < 80)
  }

  const hasMore = activities.length < meta.total

  const fetchPage = async (page: number, prepend = false) => {
    try {
      const response = await fetchTaskComments(taskId, page, meta.limit)
      if (!response.ok) throw new Error("Failed to fetch comments")
      const data = (await response.json()) as {
        code: number
        error: string | null
        message: string
        pagination: {
          count: number
          limit: number
          page: number
          total: number
        }
        payload: ActivityItem[]
      }
      const { page: currentPage, limit, total } = data.pagination
      setMeta({ page: currentPage, limit, total })
      setActivities((prev) =>
        prepend ? [...(data.payload ?? []), ...prev] : (data.payload ?? [])
      )
    } catch (error) {
      console.error("Error fetching comments:", error)
    }
  }

  useEffect(() => {
    isInitialLoad.current = true
    setActivities([])
    setMeta({ page: 1, limit: 20, total: 0 })
    fetchPage(1)
  }, [taskId])

  // scroll to bottom only on initial load and after sending
  useEffect(() => {
    if (isInitialLoad.current && feedRef.current) {
      scrollToBottom()
      isInitialLoad.current = false
    }
  }, [activities])

  async function handleLoadMore() {
    if (loadingMore || !hasMore) return
    const feed = feedRef.current
    const prevScrollHeight = feed?.scrollHeight ?? 0
    setLoadingMore(true)
    await fetchPage(meta.page + 1, true)
    setLoadingMore(false)
    // restore scroll position so user stays at the same message
    if (feed) {
      feed.scrollTop = feed.scrollHeight - prevScrollHeight
    }
  }

  const comments = activities.filter((a) => a.type === "comment") as Extract<
    ActivityItem,
    { type: "comment" }
  >[]

  function isFirstInGroup(index: number) {
    if (index === 0) return true
    const prev = comments[index - 1]
    const curr = comments[index]
    return prev.actor.id !== curr.actor.id
  }

  function isLastInGroup(index: number) {
    if (index === comments.length - 1) return true
    const next = comments[index + 1]
    const curr = comments[index]
    return next.actor.id !== curr.actor.id
  }

  function handlePickFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? [])
    if (!picked.length) return
    e.target.value = ""
    setPendingFiles((prev) => [...prev, ...picked])
  }

  function removeFile(index: number) {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSend() {
    const text = comment.trim()
    if (!text && !pendingFiles.length) return
    const filesToSend = pendingFiles
    setComment("")
    setPendingFiles([])
    setIsSending(true)
    try {
      if (filesToSend.length > 0) {
        const res = await createTaskCommentsFiles({
          task_id: taskId,
          files: filesToSend,
        })
        if (!res.ok) throw new Error("Failed to upload files")
      }
      if (text) {
        const res = await createTaskComments({ task_id: taskId, text })
        if (!res.ok) throw new Error("Failed to send comment")
      }
      isInitialLoad.current = true
      await fetchPage(1)
    } catch (error) {
      console.error("Error sending:", error)
    } finally {
      setIsSending(false)
    }
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
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            className="sm:hidden"
            onClick={() => setChatOpen(false)}
          >
            <X />
          </Button>
          <span className="text-sm font-medium">Chat</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="size-7">
            <Search className="size-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="relative size-7">
            <Bell className="size-3.5" />
            <span className="absolute -top-0.5 -right-0.5 flex size-3.5 items-center justify-center rounded-full bg-muted text-[9px] font-semibold text-muted-foreground">
              0
            </span>
          </Button>
          <Button variant="ghost" size="icon" className="size-7">
            <SlidersHorizontal className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* Feed */}
      <div className="relative min-h-0 flex-1">
        {!isAtBottom && (
          <Button
            onClick={scrollToBottom}
            className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 cursor-pointer items-center gap-1.5 rounded-full border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-md transition-colors hover:text-foreground"
          >
            <ChevronsDown className="size-3.5" />
            Last message
          </Button>
        )}
        <div
          ref={feedRef}
          onScroll={handleFeedScroll}
          className="h-full overflow-y-auto px-4 py-4"
        >
          <div className="flex flex-col gap-0.5">
            {hasMore && (
              <div className="mb-3 flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="cursor-pointer text-xs text-muted-foreground"
                  disabled={loadingMore}
                  onClick={handleLoadMore}
                >
                  {loadingMore ? "Loading..." : "Load more"}
                </Button>
              </div>
            )}
            {activities.map((item) => {
              if (item.type === "event") {
                return (
                  <div key={item.id} className="my-3 flex items-center gap-2">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-center text-[11px] text-muted-foreground">
                      <span className="font-medium">{item.actor.name}</span>{" "}
                      {item.action} · {formatTimestamp(item.timestamp)}
                    </span>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                )
              }

              const commentIdx = comments.findIndex((c) => c.id === item.id)
              const isMine = item.actor.id === currentUser?.id
              const showAvatar = !isMine && isLastInGroup(commentIdx)
              const showName = !isMine && isFirstInGroup(commentIdx)
              const isFirst = isFirstInGroup(commentIdx)
              const isLast = isLastInGroup(commentIdx)

              const hasFiles = item.files && item.files.length > 0
              const hasText = !!item.text

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
                        <Avatar className="size-7">
                          <AvatarImage src={item.actor.avatar} />
                          <AvatarFallback
                            className={cn(
                              "text-[10px] font-semibold text-white",
                              getAvatarColor(item.actor.name)
                            )}
                          >
                            {getInitials(item.actor.name)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  )}

                  <div
                    className={cn(
                      "flex max-w-[72%] flex-col gap-1",
                      isMine && "items-end"
                    )}
                  >
                    {showName && (
                      <span className="px-1 text-[11px] text-muted-foreground">
                        {item.actor.name}
                      </span>
                    )}

                    {/* Files rendered above text bubble */}
                    {hasFiles && (
                      <div className="flex flex-col gap-1">
                        {item.files!.map((file, i) => (
                          <FileAttachment key={i} file={file} isMine={isMine} />
                        ))}
                      </div>
                    )}

                    {hasText && (
                      <div
                        className={cn(
                          "px-3 py-2 text-sm",
                          isMine
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground",
                          // bubble shape — round except corner where grouped messages meet
                          isFirst && isLast && "rounded-2xl",
                          isFirst &&
                            !isLast &&
                            isMine &&
                            "rounded-2xl rounded-br-md",
                          isFirst &&
                            !isLast &&
                            !isMine &&
                            "rounded-2xl rounded-bl-md",
                          !isFirst &&
                            !isLast &&
                            isMine &&
                            "rounded-2xl rounded-r-md",
                          !isFirst &&
                            !isLast &&
                            !isMine &&
                            "rounded-2xl rounded-l-md",
                          !isFirst &&
                            isLast &&
                            isMine &&
                            "rounded-2xl rounded-tr-md",
                          !isFirst &&
                            isLast &&
                            !isMine &&
                            "rounded-2xl rounded-tl-md"
                        )}
                      >
                        {item.text}
                      </div>
                    )}

                    {isLast && (
                      <span className="px-1 text-[10px] text-muted-foreground">
                        {formatTimestamp(item.timestamp)}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Comment Input */}
      <div className="border-t">
        {/* File preview strip */}
        {pendingFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 px-4 pt-3">
            {pendingFiles.map((file, i) => {
              const isImage = file.type.startsWith("image/")
              const previewUrl = isImage ? URL.createObjectURL(file) : null
              return (
                <div key={i} className="group relative">
                  {isImage ? (
                    <img
                      src={previewUrl!}
                      alt={file.name}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-32 items-center gap-2 rounded-lg bg-muted px-2">
                      <FileText className="size-5 shrink-0 text-muted-foreground" />
                      <span className="truncate text-[11px] text-muted-foreground">
                        {file.name}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => removeFile(i)}
                    className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full bg-foreground text-background opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X className="size-2.5" />
                  </button>
                </div>
              )
            })}
          </div>
        )}
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write a comment..."
          rows={2}
          className="w-full resize-none bg-transparent px-4 pt-3 text-sm outline-none placeholder:text-muted-foreground"
        />
        <div className="flex items-center justify-between px-3 pt-1 pb-2.5">
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
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handlePickFiles}
            />
            <Button
              variant="ghost"
              size="icon"
              className="size-7 text-muted-foreground hover:text-foreground"
              aria-label="Attach"
              disabled={isSending}
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="size-3.5" />
            </Button>
          </div>
          <Button
            size="icon-sm"
            className="w-9"
            disabled={isSending || (!comment.trim() && !pendingFiles.length)}
            onClick={handleSend}
            aria-label="Send comment"
          >
            <SendHorizontal />
          </Button>
        </div>
      </div>
    </div>
  )
}
