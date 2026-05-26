export type ActivityFile = {
  url: string
  name: string
  type: string
  size: number
}

export type ActivityActor = {
  id: number
  name: string
  email: string
  avatar: string
}

export type ActivityItem =
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

export type CommentItem = Extract<ActivityItem, { type: "comment" }>

export type TaskActivityProps = {
  taskId: string | number
  setChatOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export type FeedMeta = { page: number; limit: number; total: number }
