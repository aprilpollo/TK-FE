import { Paperclip, Smile, SendHorizontal, X, FileText } from "lucide-react"
import EmojiPicker, { type EmojiClickData, Theme } from "emoji-picker-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

type CommentInputProps = {
  comment: string
  setComment: (v: string) => void
  pendingFiles: File[]
  isDragging: boolean
  isSending: boolean
  fileInputRef: React.RefObject<HTMLInputElement>
  onRemoveFile: (index: number) => void
  onPickFiles: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSend: () => void
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
  onPaste: (e: React.ClipboardEvent<HTMLTextAreaElement>) => void
}

export function CommentInput({
  comment,
  setComment,
  pendingFiles,
  isDragging,
  isSending,
  fileInputRef,
  onRemoveFile,
  onPickFiles,
  onSend,
  onKeyDown,
  onDragOver,
  onDragLeave,
  onDrop,
  onPaste,
}: CommentInputProps) {
  return (
    <div
      className={cn("border-t transition-colors", isDragging && "bg-input/50")}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
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
                  onClick={() => onRemoveFile(i)}
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
        onKeyDown={onKeyDown}
        onPaste={onPaste}
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
            onChange={onPickFiles}
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
            <PopoverContent
              className="w-auto p-0 border-none shadow-lg"
              side="top"
              align="start"
            >
              <EmojiPicker
                theme={Theme.AUTO}
                onEmojiClick={(emojiData: EmojiClickData) =>
                  setComment(comment + emojiData.emoji)
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
          onClick={onSend}
          aria-label="Send comment"
        >
          <SendHorizontal />
        </Button>
      </div>
    </div>
  )
}
