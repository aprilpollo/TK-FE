import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import {getContrastColor} from "@/utils/color"
import type { StatusTemplate } from "./types"

export function TemplateCard({
  template,
  onApply,
}: {
  template: StatusTemplate
  onApply: () => void
}) {
  return (
    <Card className="rounded-md flex flex-col">
      <CardHeader>
        <CardTitle className="text-md line-clamp-1 flex justify-between">
          {template.name}
          <Badge variant="secondary" className="text-xs">
            {template.statuses.length} statuses
          </Badge>
        </CardTitle>
        <CardDescription className="line-clamp-2 text-xs">
          {template.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-1 flex-1 content-start">
        {template.statuses.map((s) => (
          <Badge
            key={s.name}
            variant="ghost"
            style={{ backgroundColor: s.color, color: getContrastColor(s.color) }}
            className="text-xs rounded-sm"
          >
            {s.name}
          </Badge>
        ))}
      </CardContent>
      <CardFooter className="p-2 bg-transparent">
        <Button size="sm" variant="secondary" onClick={onApply} className="ml-auto">
          Apply template
        </Button>
      </CardFooter>
    </Card>
  )
}
