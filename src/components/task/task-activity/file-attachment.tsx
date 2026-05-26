import { FileText, FileCode, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatBytes } from "@/hooks/use-file-upload"
import type { ActivityFile } from "./types"

export function FileAttachment({ file }: { file: ActivityFile }) {
  const isPdf = file.type === "application/pdf"
  const Icon = isPdf ? FileText : FileCode

  return (
    <div className="flex items-center justify-between gap-2 rounded-lg border bg-background p-2 pe-3 w-73.75">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="flex aspect-square size-10 shrink-0 items-center justify-center rounded border">
          <Icon />
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
