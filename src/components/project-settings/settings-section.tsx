import { cn } from "@/lib/utils"

function SettingsSection({
  title,
  description,
  footer,
  tone = "default",
  children,
  className,
}: {
  title?: string
  description?: string
  footer?: React.ReactNode
  tone?: "default" | "danger"
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-lg",
        tone === "danger" && "border-destructive/40",
        className
      )}
    >
      {(title || description) && (
        <header
          className={cn(
            "border-b py-4",
            tone === "danger" && "border-destructive/40 bg-destructive/5"
          )}
        >
          {title && (
            <h3
              className={cn(
                "text-sm font-semibold text-neutral-800 dark:text-neutral-200",
                tone === "danger" && "text-destructive"
              )}
            >
              {title}
            </h3>
          )}
          {description && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </header>
      )}
      <div className="py-4">{children}</div>
      {footer && (
        <div className="flex items-center justify-end gap-2 border-t py-3">
          {footer}
        </div>
      )}
    </section>
  )
}

export default SettingsSection
