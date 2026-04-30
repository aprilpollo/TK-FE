export type Status = {
  id: string
  name: string
  color: string
}

export type StatusTemplate = {
  id: string
  name: string
  description: string
  statuses: Omit<Status, "id">[]
}

export const STATUS_COLORS = [
  { value: "#94a3b8", label: "Slate" },
  { value: "#ef4444", label: "Red" },
  { value: "#f97316", label: "Orange" },
  { value: "#f59e0b", label: "Amber" },
  { value: "#10b981", label: "Emerald" },
  { value: "#0ea5e9", label: "Sky" },
  { value: "#3b82f6", label: "Blue" },
  { value: "#6366f1", label: "Indigo" },
  { value: "#8b5cf6", label: "Violet" },
  { value: "#ec4899", label: "Pink" },
]

export const STATUS_TEMPLATES: StatusTemplate[] = [
  {
    id: "basic",
    name: "Basic",
    description: "Simple flow for straightforward projects",
    statuses: [
      { name: "Backlog", color: "#94a3b8" },
      { name: "To Do", color: "#0ea5e9" },
      { name: "In Progress", color: "#3b82f6" },
      { name: "Done", color: "#10b981" },
    ],
  },
  {
    id: "software",
    name: "Software Development",
    description: "Full lifecycle for engineering teams with review & testing",
    statuses: [
      { name: "Backlog", color: "#94a3b8" },
      { name: "To Do", color: "#0ea5e9" },
      { name: "In Progress", color: "#3b82f6" },
      { name: "In Review", color: "#8b5cf6" },
      { name: "Testing", color: "#f59e0b" },
      { name: "Done", color: "#10b981" },
      { name: "Cancelled", color: "#ef4444" },
    ],
  },
  {
    id: "scrum",
    name: "Scrum",
    description: "Sprint-based workflow for agile teams",
    statuses: [
      { name: "Product Backlog", color: "#94a3b8" },
      { name: "Sprint Backlog", color: "#6366f1" },
      { name: "In Progress", color: "#3b82f6" },
      { name: "Review", color: "#8b5cf6" },
      { name: "Done", color: "#10b981" },
      { name: "Cancelled", color: "#ef4444" },
    ],
  },
  {
    id: "kanban",
    name: "Kanban",
    description: "Continuous flow for visualizing work across stages",
    statuses: [
      { name: "Backlog", color: "#94a3b8" },
      { name: "Ready", color: "#0ea5e9" },
      { name: "In Progress", color: "#3b82f6" },
      { name: "Review", color: "#8b5cf6" },
      { name: "Done", color: "#10b981" },
    ],
  },
  {
    id: "bug_tracking",
    name: "Bug Tracking",
    description: "Track issues from discovery to resolution",
    statuses: [
      { name: "New", color: "#94a3b8" },
      { name: "Open", color: "#f97316" },
      { name: "In Progress", color: "#3b82f6" },
      { name: "Fixed", color: "#10b981" },
      { name: "Won't Fix", color: "#f59e0b" },
      { name: "Closed", color: "#94a3b8" },
    ],
  },
]

export const INITIAL_STATUSES: Status[] = [
  { id: "1", name: "To Do", color: "#94a3b8" },
  { id: "2", name: "In Progress", color: "#3b82f6" },
  { id: "3", name: "Done", color: "#10b981" },
]
