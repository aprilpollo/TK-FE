import { useState } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { CircleDotDashed } from "lucide-react"
import type { TaskWeeklyOverview } from "@/types"

function MyWork() {
  const [tasks, _setTasks] = useState<TaskWeeklyOverview[][]>([
    [],
    [],
    [],
    [],
    [],
    [],
    [
      {
        id: 12,
        key: "3a3a9f5d-0d62-4c3e-8283-885afe4fd1a7",
        title: "TEST001",
        start_date: 1778259600000,
        end_date: 1778950740000,
        all_day: true,
        priority: {
          id: 3,
          name: "high",
          color: "#6020A0",
        },
        status: {
          id: 12,
          uuid: "b9e58bcf-85ac-450f-834b-50e5564d26d7",
          name: "In Progress",
          color: "#3b82f6",
          position: 3,
          is_complete: false,
        },

        project_id: 1,
        project_name: "Charlie Brown",
      },
    ],
  ])

  const week_days = [
    {
      name: "Sunday",
      color: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
    },
    {
      name: "Monday",
      color:
        "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
    },
    {
      name: "Tuesday",
      color: "bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-300",
    },
    {
      name: "Wednesday",
      color: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
    },
    {
      name: "Thursday",
      color:
        "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
    },
    {
      name: "Friday",
      color: "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
    },
    {
      name: "Saturday",
      color:
        "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
    },
  ]
  const getStartOfWeek = (date: Date) => {
    const d = new Date(date)
    const day = (d.getDay() + 6) % 7 // shift so Monday=0
    d.setDate(d.getDate() - day)
    d.setHours(0, 0, 0, 0)
    return d
  }
  const startOfWeek = getStartOfWeek(new Date())
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek)
    d.setDate(startOfWeek.getDate() + i)
    return d
  })
  const formatDate = (d: Date) =>
    d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    })

  return (
    <main className="px-3">
      <header className="flex items-center justify-between px-3 py-5">
        <div className="">
          <h1 className="text-2xl font-bold tracking-tight">
            Weekly Tasks Overview
          </h1>
          <span className="text-sm text-muted-foreground">
            Track what needs to be done this week
          </span>
        </div>
        <span className="text-sm text-muted-foreground">
          {formatDate(weekDates[0])} - {formatDate(weekDates[6])}
        </span>
      </header>
      <div>
        <Accordion type="multiple">
          {week_days.map((day, index) => (
            <AccordionItem value={`item-${index + 1}`} key={index}>
              <AccordionTrigger className="cursor-pointer rounded-none">
                <div className="mr-2 flex w-full items-center justify-between">
                  <Badge className={day.color}>
                    <CircleDotDashed className="size-4" />
                    {day.name}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(weekDates[index])}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4">
                {tasks[index].length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No tasks for {day.name.toLowerCase()}
                  </p>
                ) : (
                  tasks[index].map((task) => (
                    <TaskItem key={task.id} task={task} />
                  ))
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </main>
  )
}

export default MyWork

function TaskItem({ task }: { task: TaskWeeklyOverview }) {
  return (
    <div>
      <h3 className="text-sm font-semibold">{task.title}</h3>
      <p className="text-xs text-muted-foreground">{task.project_name}</p>
    </div>
  )
}
