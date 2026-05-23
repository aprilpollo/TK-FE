import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"

type TaskHeaderProps = {
  projectName: string
  createdAt: string | Date
  onBack: () => void
}

export function TaskHeader({ projectName, createdAt, onBack }: TaskHeaderProps) {
  return (
    <header className="flex h-11 items-center justify-between border-b px-2">
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="size-3.5" />
        </Button>
        <h2 className="text-sm font-medium">{projectName}</h2>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xs text-muted-foreground">
          Created at {format(new Date(createdAt), "MMM d, yyyy")}
        </span>
      </div>
    </header>
  )
}
