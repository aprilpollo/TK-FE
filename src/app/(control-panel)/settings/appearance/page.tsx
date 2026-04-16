import { toast } from "sonner"
import { Monitor, Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import useSettings from "@/settings/hooks/useSettings"
import type { PaletteType } from "@/settings/context/SettingsContext"

type ThemeMode = "light" | "dark" | "system"

type ThemeOption = {
  value: ThemeMode
  label: string
  icon: React.ElementType
  description: string
}

const themeOptions: ThemeOption[] = [
  {
    value: "light",
    label: "Light",
    icon: Sun,
    description: "Clean and bright interface",
  },
  {
    value: "dark",
    label: "Dark",
    icon: Moon,
    description: "Easy on the eyes at night",
  },
  {
    value: "system",
    label: "System",
    icon: Monitor,
    description: "Follows your device settings",
  },
]

function getActiveMode(mode?: PaletteType["mode"]): ThemeMode {
  if (!mode) return "system"
  return mode
}

function Appearance() {
  const { data: settings, setSettings } = useSettings()
  const currentMode = getActiveMode(settings.theme?.main?.palette?.mode)

  function handleThemeChange(mode: ThemeMode) {
    const paletteMode = mode === "system" ? undefined : mode
    setSettings({
      theme: {
        main: { palette: { mode: paletteMode } },
        navbar: { palette: { mode: paletteMode } },
        toolbar: { palette: { mode: paletteMode } },
        footer: { palette: { mode: paletteMode } },
      },
    })
    toast.success(`Theme set to ${mode}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Appearance</h2>
        <p className="text-sm text-muted-foreground">
          Customize how the interface looks and feels.
        </p>
      </div>

      <Separator />

      {/* Theme */}
      <div className="space-y-4">
        <div className="space-y-0.5">
          <h3 className="text-base font-medium">Theme</h3>
          <p className="text-sm text-muted-foreground">
            Select a color theme for your workspace.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {themeOptions.map(({ value, label, icon: Icon, description }) => {
            const isActive = currentMode === value
            return (
              <button
                key={value}
                type="button"
                onClick={() => handleThemeChange(value)}
                className={cn(
                  "flex flex-col items-center gap-3 rounded-lg border-2 p-4 text-center transition-all hover:bg-muted/50",
                  isActive
                    ? "border-primary bg-primary/5"
                    : "border-border bg-transparent"
                )}
              >
                <div
                  className={cn(
                    "flex size-10 items-center justify-center rounded-full",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <Icon className="size-5" />
                </div>
                <div className="space-y-0.5">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      isActive && "text-primary"
                    )}
                  >
                    {label}
                  </p>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <Separator />

      {/* Sidebar */}
      <div className="space-y-4">
        <div className="space-y-0.5">
          <h3 className="text-base font-medium">Sidebar</h3>
          <p className="text-sm text-muted-foreground">
            Adjust the sidebar display settings.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              label: "Compact mode",
              description: "Reduce sidebar padding and icon sizes.",
            },
            {
              label: "Show labels",
              description: "Show text labels next to sidebar icons.",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-lg border px-4 py-3"
            >
              <div className="space-y-0.5">
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => toast.info("Coming soon")}
              >
                Soon
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Appearance
