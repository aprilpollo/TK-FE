import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChevronsDown } from "lucide-react"
import { ImageGrid } from "./image-grid"
import { FileAttachment } from "./file-attachment"
import {
  formatTimestamp,
  getAvatarColor,
  getInitials,
  isFirstInGroup,
  isLastInGroup,
} from "./utils"
import type { ActivityItem, CommentItem } from "./types"

type ActivityFeedProps = {
  feedRef: React.RefObject<HTMLDivElement>
  activities: ActivityItem[]
  comments: CommentItem[]
  loadingMore: boolean
  hasMore: boolean
  isAtBottom: boolean
  newMsgCount: number
  currentUserId: number | undefined
  onScroll: () => void
  onLoadMore: () => void
  onScrollToBottom: () => void
}

export function ActivityFeed({
  feedRef,
  activities,
  comments,
  loadingMore,
  hasMore,
  isAtBottom,
  newMsgCount,
  currentUserId,
  onScroll,
  onLoadMore,
  onScrollToBottom,
}: ActivityFeedProps) {
  return (
    <div className="relative min-h-0 flex-1">
      {!isAtBottom && (
        <Button
          onClick={onScrollToBottom}
          className={cn(
            "absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium shadow-md transition-colors",
            newMsgCount > 0
              ? "bg-primary text-primary-foreground hover:bg-primary/90 border-primary"
              : "bg-background text-muted-foreground hover:text-foreground"
          )}
        >
          <ChevronsDown className="size-3.5" />
          {newMsgCount > 0
            ? `${newMsgCount} new message${newMsgCount > 1 ? "s" : ""}`
            : "Last message"}
        </Button>
      )}
      <div
        ref={feedRef}
        onScroll={onScroll}
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
                onClick={onLoadMore}
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
            const isMine = item.actor.id === currentUserId
            const showAvatar = !isMine && isLastInGroup(comments, commentIdx)
            const showName = !isMine && isFirstInGroup(comments, commentIdx)
            const isFirst = isFirstInGroup(comments, commentIdx)
            const isLast = isLastInGroup(comments, commentIdx)
            const images = (item.files ?? []).filter((f) => f.type.startsWith("image/"))
            const otherFiles = (item.files ?? []).filter((f) => !f.type.startsWith("image/"))

            return (
              <div
                key={item.id}
                className={cn(
                  "flex items-end gap-2",
                  isMine ? "flex-row-reverse" : "flex-row",
                  !isLast && "mb-0.5"
                )}
              >
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

                <div className={cn("flex max-w-[72%] flex-col gap-1", isMine && "items-end")}>
                  {showName && (
                    <span className="px-1 text-[11px] text-muted-foreground">
                      {item.actor.name}
                    </span>
                  )}

                  {(images.length > 0 || otherFiles.length > 0) && (
                    <div className="flex flex-col gap-1">
                      {images.length > 0 && <ImageGrid images={images} />}
                      {otherFiles.map((file, i) => (
                        <FileAttachment key={i} file={file} />
                      ))}
                    </div>
                  )}

                  {!!item.text && (
                    <div
                      className={cn(
                        "px-3 py-2 text-sm border w-max",
                        isMine
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground",
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
  )
}
