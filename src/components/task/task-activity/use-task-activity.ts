import { useState, useRef, useEffect } from "react"
import { fetchTaskComments, createTaskComments, createTaskCommentsFiles } from "@/api/task"
import { globalHeaders, getApiBaseUrl } from "@/utils/apiFetch"
import type { ActivityItem, FeedMeta } from "./types"

export function useTaskActivity(taskId: string | number) {
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
    const base =
      window.__ENV__?.WS_BASE_URL ??
      (getApiBaseUrl() ?? "").replace(/^https/, "wss").replace(/^http/, "ws")
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
        pagination: { count: number; limit: number; page: number; total: number }
        payload: ActivityItem[]
      }
      const { page: currentPage, limit, total } = data.pagination
      setMeta({ page: currentPage, limit, total })
      const ordered = [...(data.payload ?? [])].reverse()
      setActivities((prev) => (prepend ? [...ordered, ...prev] : ordered))
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
    if (feed) feed.scrollTop = feed.scrollHeight - prevScrollHeight
  }

  const comments = activities.filter((a) => a.type === "comment") as Extract<
    ActivityItem,
    { type: "comment" }
  >[]

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
        const res = await createTaskCommentsFiles({ task_id: taskId, files: filesToSend })
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
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragging(false)
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

  return {
    activities,
    loadingMore,
    isAtBottom,
    newMsgCount,
    isSending,
    isDragging,
    pendingFiles,
    comment,
    setComment,
    feedRef,
    fileInputRef,
    hasMore,
    comments,
    scrollToBottom,
    handleFeedScroll,
    handleLoadMore,
    handlePickFiles,
    removeFile,
    handleSend,
    handleKeyDown,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handlePaste,
  }
}
