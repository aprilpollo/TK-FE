import type { CommentItem } from "./types"

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export function getAvatarColor(name: string) {
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

export function formatTimestamp(unix: number) {
  return new Date(unix * 1000).toLocaleString("th-TH", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function isFirstInGroup(comments: CommentItem[], index: number) {
  if (index === 0) return true
  return comments[index - 1].actor.id !== comments[index].actor.id
}

export function isLastInGroup(comments: CommentItem[], index: number) {
  if (index === comments.length - 1) return true
  return comments[index + 1].actor.id !== comments[index].actor.id
}
