import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { CornerDownLeft, Plus } from "lucide-react"
import { createTaskStatus } from "@/api/task"
import { ColorSectionPopover } from "@/components/color-section"
import useProject from "@/hooks/useProject"
import useTask from "@/hooks/useTask"

export function AddGroup() {
  const { project } = useProject()
  const { FetchTaskStatuses } = useTask()
  const [open, setOpen] = useState(false)
  const [statusName, setStatusName] = useState("")
  const [selectedColor, setSelectedColor] = useState("#005BC4")

  if (!project) {
    return <div>Loading...</div>
  }

  const handleSave = async () => {
    await createTaskStatus({
      project_id: project.id,
      name: statusName,
      description: "",
      color: selectedColor,
    })
    await FetchTaskStatuses()
    setOpen(false)
    setStatusName("")
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="cursor-pointer rounded-sm">
          <Plus />
          Add Status
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="bg-background p-0 shadow-none">
        <div className="flex items-center p-1">
          <ColorSectionPopover color={selectedColor} setColor={setSelectedColor} />
          <Input
            type="text"
            placeholder="STATUS NAME"
            value={statusName}
            onChange={(e) => setStatusName(e.target.value)}
            className="h-auto border-0 bg-background p-0 px-2 font-medium shadow-none placeholder:text-muted-foreground focus-visible:ring-0"
          />
          <Button
            className="h-6 cursor-pointer rounded-md text-xs"
            disabled={statusName.trim().length < 3}
            onClick={handleSave}
          >
            Save
            <CornerDownLeft />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
