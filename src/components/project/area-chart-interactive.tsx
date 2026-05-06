import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { format } from "date-fns"
import type { ChartDataItem, ChartAreaInteractiveProps } from "@/types"

const chartConfig = {
  completed: {
    label: "Completed",
    color: "var(--chart-1)",
  },
  created: {
    label: "Created",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

function generateFlatData(start: Date, end: Date): ChartDataItem[] {
  const result: ChartDataItem[] = []
  const current = new Date(start)
  while (current <= end) {
    result.push({
      date: current.toISOString().split("T")[0],
      completed: 0,
      created: 0,
    })
    current.setDate(current.getDate() + 1)
  }
  return result
}

function tickLabel(value: string): string {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "2-digit",
  })
}

export function ChartAreaInteractive({
  data,
  start,
  end,
}: ChartAreaInteractiveProps) {
  const scaffold = generateFlatData(start, end)
  const dataMap = new Map(
    data
      .filter((item) => {
        const d = new Date(item.date)
        return d >= start && d <= end
      })
      .map((item) => [item.date, item])
  )
  const chartData = scaffold.map((item) => dataMap.get(item.date) ?? item)

  return (
    <Card className="border pt-0 ring-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Task Velocity</CardTitle>
          <CardDescription className="text-xs">
            {format(start, "MMM d, yyyy")} – {format(end, "MMM d, yyyy")}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-62.5 w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillCompleted" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-completed)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-completed)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillCreated" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-created)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-created)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <YAxis
              hide
              domain={[-1, (dataMax: number) => Math.max(dataMax + 1, 6)]}
            />
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={tickLabel}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => tickLabel(String(value))}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="created"
              type="monotone"
              fill="url(#fillCreated)"
              stroke="var(--color-created)"
              strokeWidth={1}
            />
            <Area
              dataKey="completed"
              type="monotone"
              fill="url(#fillCompleted)"
              stroke="var(--color-completed)"
              strokeWidth={1}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
