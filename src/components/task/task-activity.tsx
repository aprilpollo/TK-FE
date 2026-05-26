import { useState, useRef, useEffect } from "react"
import {
  Search,
  Bell,
  SlidersHorizontal,
  Smile,
  Paperclip,
  SendHorizontal,
  X,
  ChevronsDown,
  FileText,
  Download,
  FileCode,
} from "lucide-react"
import EmojiPicker, { type EmojiClickData, Theme } from "emoji-picker-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import {
  fetchTaskComments,
  createTaskComments,
  createTaskCommentsFiles,
} from "@/api/task"
import { formatBytes } from "@/hooks/use-file-upload"
import useUser from "@/auth/hooks/useUser"
import { globalHeaders, getApiBaseUrl } from "@/utils/apiFetch"

type ActivityFile = {
  url: string
  name: string
  type: string
  size: number
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

function ImageGrid({ images }: { images: ActivityFile[] }) {
  const count = images.length
  const visible = images.slice(0, 4)
  const extra = count - 4

  const cell = (img: ActivityFile, overlay?: React.ReactNode) => (
    <a
      key={img.url}
      href={img.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block overflow-hidden bg-muted"
    >
      <img
        src={img.url}
        alt={img.name}
        className="h-36 w-36 object-cover transition-opacity group-hover:opacity-90"
      />
      {overlay}
    </a>
  )

  if (count === 1) {
    return (
      <a
        href={images[0].url}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block overflow-hidden rounded-xl bg-muted"
      >
        <img
          src={images[0].url}
          alt={images[0].name}
          className="max-h-52 w-full max-w-55 object-cover transition-opacity group-hover:opacity-90"
        />
      </a>
    )
  }

  if (count === 2) {
    return (
      <div className="grid grid-cols-2 gap-0.5 overflow-hidden rounded-xl">
        {visible.map((img) => (
          <div key={img.url} className="aspect-square">
            {cell(img)}
          </div>
        ))}
      </div>
    )
  }

  if (count === 3) {
    return (
      <div className="grid grid-cols-2 gap-0.5 overflow-hidden rounded-xl">
        <div className="row-span-2 aspect-1/2">{cell(images[0])}</div>
        <div className="aspect-square">{cell(images[1])}</div>
        <div className="aspect-square">{cell(images[2])}</div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-0.5 overflow-hidden rounded-xl">
      {visible.map((img, i) => (
        <div key={img.url} className="aspect-square">
          {cell(
            img,
            i === 3 && extra > 0 ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-lg font-semibold text-white">
                +{extra + 1}
              </div>
            ) : undefined
          )}
        </div>
      ))}
    </div>
  )
}

function FileAttachment({
  file,
}: {
  file: ActivityFile
}) {
  const isPdf = file.type === "application/pdf"
  const Icon = isPdf ? FileText : FileCode

  return (
    <div className="flex items-center justify-between gap-2 rounded-lg border bg-background p-2 pe-3 w-73.75">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="flex aspect-square size-10 shrink-0 items-center justify-center rounded border">
          <Icon className="" />
        </div>
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="truncate text-[13px] font-medium">{file.name}</p>
          <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
        </div>
      </div>
      <Button
        aria-label="Download file"
        className="-me-2 size-8 text-muted-foreground/80 hover:bg-transparent hover:text-foreground cursor-pointer"
        size="icon"
        variant="ghost"
      >
        <Download className="size-4" />
      </Button>
    </div>
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
  const [newMsgCount, setNewMsgCount] = useState(0)
  const [isSending, setIsSending] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const [comment, setComment] = useState("")
  const feedRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isAtBottomRef = useRef(true)
  const wsRef = useRef<WebSocket | null>(null)
  const wsReconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function scrollToBottom() {
    if (!feedRef.current) return
    feedRef.current.scrollTop = feedRef.current.scrollHeight
    isAtBottomRef.current = true
    setIsAtBottom(true)
    setNewMsgCount(0)
  }

  function handleFeedScroll() {
    const el = feedRef.current
    if (!el) return
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80
    isAtBottomRef.current = atBottom
    setIsAtBottom(atBottom)
    if (atBottom) setNewMsgCount(0)
  }

  const hasMore = activities.length < meta.total

  function buildWsUrl(id: string | number) {
    const base = window.__ENV__?.WS_BASE_URL ?? (getApiBaseUrl() ?? "").replace(/^https/, "wss").replace(/^http/, "ws")
    const token = (globalHeaders["Authorization"] ?? "").replace("Bearer ", "")
    const orgId = globalHeaders["Organization-ID"] ?? ""
    return `${base}/api/v1/tasks/${id}/comments/live?token=${encodeURIComponent(token)}&org_id=${encodeURIComponent(orgId)}`
  }

  useEffect(() => {
    let active = true

    function connect() {
      if (!active) return
      const ws = new WebSocket(buildWsUrl(taskId))
      wsRef.current = ws

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data as string)
          if (msg.type === "created" && msg.comment) {
            const incoming: ActivityItem = {
              ...msg.comment,
              id: String(msg.comment.id),
              type: "comment",
            }
            setActivities((prev) => [...prev, incoming])
            setMeta((m) => ({ ...m, total: m.total + 1 }))
            if (isAtBottomRef.current) {
              requestAnimationFrame(scrollToBottom)
            } else {
              setNewMsgCount((n) => n + 1)
            }
          }
        } catch {
          // ignore malformed messages
        }
      }

      ws.onclose = () => {
        if (active) wsReconnectTimer.current = setTimeout(connect, 3000)
      }

      ws.onerror = () => ws.close()
    }

    connect()

    return () => {
      active = false
      if (wsReconnectTimer.current) clearTimeout(wsReconnectTimer.current)
      wsRef.current?.close()
      wsRef.current = null
    }
  }, [taskId])

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
      const ordered = [...(data.payload ?? [])].reverse()
      setActivities((prev) =>
        prepend ? [...ordered, ...prev] : ordered
      )
    } catch (error) {
      console.error("Error fetching comments:", error)
    }
  }

  useEffect(() => {
    setActivities([])
    setMeta({ page: 1, limit: 20, total: 0 })
    fetchPage(1).then(() => requestAnimationFrame(scrollToBottom))
  }, [taskId])

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
      setNewMsgCount(0)
      requestAnimationFrame(scrollToBottom)
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

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave(e: React.DragEvent) {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const dropped = Array.from(e.dataTransfer.files)
    if (dropped.length) setPendingFiles((prev) => [...prev, ...dropped])
  }

  function handlePaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    const files = Array.from(e.clipboardData.files)
    if (files.length) {
      e.preventDefault()
      setPendingFiles((prev) => [...prev, ...files])
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
            onClick={() => { scrollToBottom(); setNewMsgCount(0) }}
            className={cn(
              "absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium shadow-md transition-colors",
              newMsgCount > 0
                ? "bg-primary text-primary-foreground hover:bg-primary/90 border-primary"
                : "bg-background text-muted-foreground hover:text-foreground"
            )}
          >
            <ChevronsDown className="size-3.5" />
            {newMsgCount > 0 ? `${newMsgCount} new message${newMsgCount > 1 ? "s" : ""}` : "Last message"}
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
                    {hasFiles &&
                      (() => {
                        const images = item.files!.filter((f) =>
                          f.type.startsWith("image/")
                        )
                        const others = item.files!.filter(
                          (f) => !f.type.startsWith("image/")
                        )
                        return (
                          <div className="flex flex-col gap-1">
                            {images.length > 0 && <ImageGrid images={images} />}
                            {others.map((file, i) => (
                              <FileAttachment
                                key={i}
                                file={file}
                              />
                            ))}
                          </div>
                        )
                      })()}

                    {hasText && (
                      <div
                        className={cn(
                          "px-3 py-2 text-sm border w-max",
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
      <div
        className={cn("border-t transition-colors", isDragging && "bg-input/50")}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
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
          onPaste={handlePaste}
          placeholder="Write a comment..."
          rows={2}
          className="w-full resize-none bg-transparent px-4 pt-3 text-sm outline-none placeholder:text-muted-foreground"
        />
        <div className="flex items-center justify-between px-3 pt-1 pb-2.5">
          <div className="flex items-center gap-0.5">
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
              className="size-7 text-muted-foreground hover:text-foreground cursor-pointer"
              aria-label="Attach"
              disabled={isSending}
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="size-3.5" />
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 text-muted-foreground hover:text-foreground cursor-pointer"
                  aria-label="Emoji"
                  disabled={isSending}
                >
                  <Smile className="size-3.5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-none shadow-lg" side="top" align="start">
                <EmojiPicker
                  theme={Theme.AUTO}
                  onEmojiClick={(emojiData: EmojiClickData) =>
                    setComment((prev) => prev + emojiData.emoji)
                  }
                  lazyLoadEmojis
                />
              </PopoverContent>
            </Popover>
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
