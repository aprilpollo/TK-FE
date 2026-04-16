import { useState } from "react"
import { format, parseISO } from "date-fns"
import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type Props = {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  disabled,
}: Props = {}) {
  const [open, setOpen] = useState(false)

  const selected = value ? parseISO(value) : undefined

  function handleSelect(date: Date | undefined) {
    if (date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, "0")
      const day = String(date.getDate()).padStart(2, "0")
      onChange?.(`${year}-${month}-${day}`)
    } else {
      onChange?.("")
    }
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          data-empty={!selected}
          className="w-53 justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
        >
          {selected ? format(selected, "PPP") : <span>{placeholder}</span>}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={handleSelect}
          defaultMonth={selected}
        />
      </PopoverContent>
    </Popover>
  )
}
