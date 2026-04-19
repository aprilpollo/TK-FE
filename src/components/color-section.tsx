import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const PRESET_COLORS = [
  {
    name: "Blue",
    hex: "#005BC4",
  },
  {
    name: "Purple",
    hex: "#6020A0",
  },
  {
    name: "Green",
    hex: "#12A150",
  },
  {
    name: "Red",
    hex: "#C20E4D",
  },
  {
    name: "Pink",
    hex: "#CC3EA4",
  },
  {
    name: "Orange",
    hex: "#C4841D",
  },
  {
    name: "Cyan",
    hex: "#06B7DB",
  },
  {
    name: "Gray",
    hex: "#52525B",
  },
]

function hsvToHex(h: number, s: number, v: number): string {
  const c = v * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = v - c
  let r = 0,
    g = 0,
    b = 0
  if (h < 60) {
    r = c
    g = x
  } else if (h < 120) {
    r = x
    g = c
  } else if (h < 180) {
    g = c
    b = x
  } else if (h < 240) {
    g = x
    b = c
  } else if (h < 300) {
    r = x
    b = c
  } else {
    r = c
    b = x
  }
  const toHex = (n: number) =>
    Math.round((n + m) * 255)
      .toString(16)
      .padStart(2, "0")
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

function hexToHsv(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b),
    d = max - min
  const v = max
  const s = max === 0 ? 0 : d / max
  let h = 0
  if (d !== 0) {
    if (max === r) h = 60 * (((g - b) / d) % 6)
    else if (max === g) h = 60 * ((b - r) / d + 2)
    else h = 60 * ((r - g) / d + 4)
  }
  return [h < 0 ? h + 360 : h, s, v]
}

export function ColorSectionPopover({
  color,
  setColor,
}: {
  color: string
  setColor: (color: string) => void
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon-sm"
          className="h-6 w-6 rounded-md"
          style={{ backgroundColor: color }}
        />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={10}
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="absolute -left-1 shadow-none"
      >
        <PopoverHeader className="">
          <PopoverTitle>Color</PopoverTitle>
          <PopoverDescription>Choose a color for the status</PopoverDescription>
        </PopoverHeader>
        <div className="flex flex-wrap gap-1">
          {PRESET_COLORS.map((c) => (
            <Tooltip key={c.name}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setColor(c.hex)}
                  className={cn(
                    "size-7.5 cursor-pointer rounded-sm transition-transform hover:scale-110"
                    //color === c.hex && "ring-2 ring-ring ring-offset-1"
                  )}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>{c.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
        {/* <div className="h-px bg-border" /> */}
        <CustomColorPicker color={color} onChange={setColor} />
      </PopoverContent>
    </Popover>
  )
}

export function ColorSection({
  color,
  setColor,
  onCancel,
  ...props
}: React.ComponentProps<"button"> & {
  color: string
  setColor: (color: string) => void
  onCancel?: () => void
}) {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Color</CardTitle>
        <CardDescription>Choose a color for the status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex flex-wrap gap-1">
          {PRESET_COLORS.map((c) => (
            <Tooltip key={c.name}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setColor(c.hex)}
                  className={cn(
                    "size-7.5 cursor-pointer rounded-sm transition-transform hover:scale-110"
                    //color === c.hex && "ring-2 ring-ring ring-offset-1"
                  )}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>{c.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
        <CustomColorPicker color={color} onChange={setColor} />
      </CardContent>
      <CardFooter className="flex justify-end gap-1 rounded-none border-none bg-card pt-0">
        <Button size="sm" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button {...props} size="sm">
          Save
        </Button>
      </CardFooter>
    </Card>
  )
}

function CustomColorPicker({
  color,
  onChange,
}: {
  color: string
  onChange: (c: string) => void
}) {
  const init = /^#[0-9a-f]{6}$/i.test(color)
    ? hexToHsv(color)
    : ([0, 1, 1] as [number, number, number])
  const [hsv, setHsv] = useState<[number, number, number]>(init)
  const [hexInput, setHexInput] = useState(color)

  const svRef = useRef<HTMLDivElement>(null)
  const hueRef = useRef<HTMLDivElement>(null)
  const hsvRef = useRef<[number, number, number]>(init)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  const apply = (nh: number, ns: number, nv: number) => {
    hsvRef.current = [nh, ns, nv]
    setHsv([nh, ns, nv])
    const hex = hsvToHex(nh, ns, nv)
    setHexInput(hex)
    onChangeRef.current(hex)
  }
  const applyRef = useRef(apply)
  applyRef.current = apply

  // Sync picker when parent changes color (e.g. preset clicked) — do NOT call onChange back
  useEffect(() => {
    if (/^#[0-9a-f]{6}$/i.test(color)) {
      const parsed = hexToHsv(color)
      hsvRef.current = parsed
      setHsv(parsed)
      setHexInput(color)
    }
  }, [color])

  useEffect(() => {
    const el = svRef.current
    if (!el) return
    let dragging = false
    const compute = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      applyRef.current(
        hsvRef.current[0],
        Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)),
        Math.max(0, Math.min(1, 1 - (e.clientY - rect.top) / rect.height))
      )
    }
    const down = (e: MouseEvent) => {
      dragging = true
      compute(e)
    }
    const move = (e: MouseEvent) => {
      if (dragging) compute(e)
    }
    const up = () => {
      dragging = false
    }
    el.addEventListener("mousedown", down)
    document.addEventListener("mousemove", move)
    document.addEventListener("mouseup", up)
    return () => {
      el.removeEventListener("mousedown", down)
      document.removeEventListener("mousemove", move)
      document.removeEventListener("mouseup", up)
    }
  }, [])

  useEffect(() => {
    const el = hueRef.current
    if (!el) return
    let dragging = false
    const compute = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      applyRef.current(
        Math.max(
          0,
          Math.min(360, ((e.clientX - rect.left) / rect.width) * 360)
        ),
        hsvRef.current[1],
        hsvRef.current[2]
      )
    }
    const down = (e: MouseEvent) => {
      dragging = true
      compute(e)
    }
    const move = (e: MouseEvent) => {
      if (dragging) compute(e)
    }
    const up = () => {
      dragging = false
    }
    el.addEventListener("mousedown", down)
    document.addEventListener("mousemove", move)
    document.addEventListener("mouseup", up)
    return () => {
      el.removeEventListener("mousedown", down)
      document.removeEventListener("mousemove", move)
      document.removeEventListener("mouseup", up)
    }
  }, [])

  const [h, s, v] = hsv
  const hueColor = hsvToHex(h, 1, 1)

  return (
    <div className="space-y-2">
      {/* Saturation / Value gradient */}
      <div
        ref={svRef}
        className="relative h-28 w-full cursor-crosshair overflow-hidden rounded-sm border select-none"
        style={{
          background: `linear-gradient(to bottom, transparent, #000), linear-gradient(to right, #fff, ${hueColor})`,
        }}
      >
        <div
          className="pointer-events-none absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow"
          style={{ left: `${s * 100}%`, top: `${(1 - v) * 100}%` }}
        />
      </div>

      {/* Hue slider */}
      <div
        ref={hueRef}
        className="relative h-3 w-full cursor-pointer rounded-[3px] select-none"
        style={{
          background:
            "linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)",
        }}
      >
        <div
          className="pointer-events-none absolute top-1/2 h-4 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded border-2 border-white shadow"
          style={{ left: `${(h / 360) * 100}%`, backgroundColor: hueColor }}
        />
      </div>

      {/* Hex input */}
      <div className="flex items-center gap-1.5">
        <div
          className="size-7 shrink-0 rounded-sm border"
          style={{ backgroundColor: hexInput }}
        />
        <Input
          value={hexInput.toUpperCase()}
          onChange={(e) => {
            const val = e.target.value
            setHexInput(val)
            if (/^#[0-9a-f]{6}$/i.test(val)) {
              const [nh, ns, nv] = hexToHsv(val)
              applyRef.current(nh, ns, nv)
            }
          }}
          className="h-7 rounded-sm font-mono text-xs"
          placeholder="#000000"
        />
      </div>
    </div>
  )
}
