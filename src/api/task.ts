import apiFetch from "@/utils/apiFetch"

export async function fetchPriorities(): Promise<Response> {
  return apiFetch("/api/v1/tasks/priorities", {
    method: "GET",
  })
}

export async function fetchTaskStatuses(
  project_id: string | number
): Promise<Response> {
  return apiFetch(
    `/api/v1/tasks/statuses/${project_id}?_sort=position&_order=asc`,
    {
      method: "GET",
    }
  )
}

export async function fetchTasks(
  project_id: string | number,
  status_id: string | number,
  query?: string
): Promise<Response> {
  return apiFetch(
    `/api/v1/tasks/${project_id}/${status_id}${query ? `?${query}` : ""}`,
    {
      method: "GET",
    }
  )
}

export async function createTaskStatus({
  project_id,
  name,
  description,
  color,
}: {
  project_id: string | number
  name: string
  description: string
  color: string
}): Promise<Response> {
  return apiFetch("/api/v1/tasks/statuses", {
    method: "POST",
    body: JSON.stringify({ project_id, name, description, color }),
  })
}

export async function reorderStatus({
  project_id,
  updates,
}: {
  project_id: string | number
  updates: { id: number | string; position: number }[]
}): Promise<Response> {
  return apiFetch(`/api/v1/tasks/statuses/reorder/${project_id}`, {
    method: "PUT",
    body: JSON.stringify({ updates }),
  })
}

export async function createTask({
  project_id,
  status_id,
  title,
  description,
  start_date,
  end_date,
  all_day,
  priority_id,
  assignees,
}: {
  project_id: string | number
  status_id: string | number
  title: string
  description?: string
  start_date?: Date | string
  end_date?: Date | string
  all_day?: boolean
  priority_id?: string | number
  assignees?: number[]
}): Promise<Response> {
  return apiFetch(`/api/v1/tasks`, {
    method: "POST",
    body: JSON.stringify({
      project_id,
      status_id,
      title,
      description,
      start_date: start_date ? new Date(start_date).getTime() : undefined,
      end_date: end_date ? new Date(end_date).getTime() : undefined,
      all_day,
      priority_id,
      assignee_ids: assignees,
    }),
  })
}

export async function updateTask(
  task_id: string | number,
  payload: {
    title?: string
    description?: string
    priority_id?: string | number | null
    start_date?: Date | string | null
    end_date?: Date | string | null
    all_day?: boolean
    assignees_ids?: number[]
  }
): Promise<Response> {
  return apiFetch(`/api/v1/tasks/${task_id}`, {
    method: "PUT",
    body: JSON.stringify({
      ...payload,
      start_date: payload.start_date
        ? new Date(payload.start_date).getTime()
        : null,
      end_date: payload.end_date ? new Date(payload.end_date).getTime() : null,
    }),
  })
}

export async function updateTaskStatus(
  status_id: string | number,
  payload: { name?: string; color?: string }
): Promise<Response> {
  return apiFetch(`/api/v1/tasks/statuses/${status_id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  })
}

export async function deleteTaskStatus(
  status_id: string | number
): Promise<Response> {
  return apiFetch(`/api/v1/tasks/statuses/${status_id}`, {
    method: "DELETE",
  })
}

export async function deleteTask(task_id: string | number): Promise<Response> {
  return apiFetch(`/api/v1/tasks/${task_id}`, {
    method: "DELETE",
  })
}

export async function reorderTasks({
  project_id,
  updates,
}: {
  project_id: string | number
  updates: {
    id: number | string
    status_id: number | string
    position: number
  }[]
}): Promise<Response> {
  return apiFetch(`/api/v1/tasks/reorder/${project_id}`, {
    method: "PUT",
    body: JSON.stringify({ updates }),
  })
}
