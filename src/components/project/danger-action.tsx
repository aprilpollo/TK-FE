function DangerAction({
  title,
  description,
  action,
  isLast = false,
}: {
  title: string
  description: string
  action: React.ReactNode
  isLast?: boolean
}) {
  return (
    <div
      className={
        "flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between" +
        (!isLast ? " border-b" : "")
      }
    >
      <div className="min-w-0 pr-4">
        <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
          {title}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="shrink-0">{action}</div>
    </div>
  )
}

export default DangerAction
