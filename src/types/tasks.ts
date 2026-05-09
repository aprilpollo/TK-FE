export interface TaskWeeklyOverview {
  id: string | number
  key: string
  title: string
  description?: string
  start_date: number // timestamp
  end_date: number // timestamp
  all_day: boolean
  priority: {
    id: string | number
    name: string
    color: string
  }
  status: {
    id: string | number
    uuid: string
    name: string
    color: string
    position: number
    is_complete: boolean
  }
  project_id: string | number
  project_name: string
}
