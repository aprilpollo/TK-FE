import { Search, Bell, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import useUser from "@/auth/hooks/useUser"
import { useTaskActivity } from "./use-task-activity"
import { ActivityFeed } from "./activity-feed"
import { CommentInput } from "./comment-input"
import type { TaskActivityProps } from "./types"

export function TaskActivity({ taskId, setChatOpen }: TaskActivityProps) {
  const { data: currentUser } = useUser()
  const {
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
  } = useTaskActivity(taskId)

  return (
    <div className="flex h-full flex-col">
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
        </div>
      </div>

      <ActivityFeed
        feedRef={feedRef}
        activities={activities}
        comments={comments}
        loadingMore={loadingMore}
        hasMore={hasMore}
        isAtBottom={isAtBottom}
        newMsgCount={newMsgCount}
        currentUserId={currentUser?.id}
        onScroll={handleFeedScroll}
        onLoadMore={handleLoadMore}
        onScrollToBottom={() => {
          scrollToBottom()
          // newMsgCount is reset inside scrollToBottom already
        }}
      />

      <CommentInput
        comment={comment}
        setComment={setComment}
        pendingFiles={pendingFiles}
        isDragging={isDragging}
        isSending={isSending}
        fileInputRef={fileInputRef}
        onRemoveFile={removeFile}
        onPickFiles={handlePickFiles}
        onSend={handleSend}
        onKeyDown={handleKeyDown}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onPaste={handlePaste}
      />
    </div>
  )
}
