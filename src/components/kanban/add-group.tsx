import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { CornerDownLeft, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { createTaskStatus } from "@/api/task"
import useProject from "@/hooks/useProject"
import useTask from "@/hooks/useTask"

const PRESET_COLORS = [
  "#005BC4",
  "#6020A0",
  "#12A150",
  "#C20E4D",
  "#CC3EA4",
  "#C4841D",
  "#06B7DB",
  "#52525B",
]

export function AddGroup() {
  const { project } = useProject()
  const { FetchTaskStatuses } = useTask()
  const [open, setOpen] = useState(false)
  const [statusName, setStatusName] = useState("")
  const [selectedColor, setSelectedColor] = useState("#005BC4")
  const [customColor, setCustomColor] = useState("#87909e")

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
          <ColorSection
            color={selectedColor}
            setColor={setSelectedColor}
            customColor={customColor}
            setCustomColor={setCustomColor}
          />
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

function ColorSection({
  color,
  setColor,
}: {
  color: string
  customColor: string
  setColor: (color: string) => void
  setCustomColor: (color: string) => void
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon-sm"
          className="h-6 w-6 rounded-md shadow-none"
          style={{ backgroundColor: color }}
        />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={10}
        className="absolute -left-1 space-y-2 bg-background shadow-none"
      >
        <PopoverHeader>
          <PopoverTitle>Color</PopoverTitle>
        </PopoverHeader>
        <div className="grid grid-cols-8 gap-1.5">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => {
                setColor(color)
              }}
              className={cn(
                "h-6 w-6 cursor-pointer rounded-full transition-transform hover:scale-110"
              )}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
