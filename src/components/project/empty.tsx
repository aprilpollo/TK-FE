import { FolderGit2 } from "lucide-react"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export function EmptyProject({
  onAction,
  message,
}: {
  onAction?: React.ReactNode
  message?: string
}) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderGit2 />
        </EmptyMedia>
        <EmptyTitle>No Projects</EmptyTitle>
        <EmptyDescription>
          {message ||
            "You haven&apos;t created any projects yet. Get started by creating your first project."}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        {onAction}
      </EmptyContent>
    </Empty>
  )
}
