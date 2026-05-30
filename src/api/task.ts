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

export async function fetchTaskByKey(key: string): Promise<Response> {
  return apiFetch(`/api/v1/tasks/key/${key}`, {
    method: "GET",
  })
}

export async function fetchMyTasksToday(query?: string): Promise<Response> {
  return apiFetch(`/api/v1/tasks/me/today${query ? `?${query}` : ""}`, {
    method: "GET",
  })
}

export async function fetchMyTasksOverdue(query?: string): Promise<Response> {
  return apiFetch(`/api/v1/tasks/me/overdue${query ? `?${query}` : ""}`, {
    method: "GET",
  })
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

export async function createListTaskStatus({
  project_id,
  statuses,
}: {
  project_id: string | number
  statuses: {
    uuid?: string
    name: string
    description?: string
    color: string
    is_complete?: boolean
  }[]
}): Promise<Response> {
  return apiFetch(`/api/v1/tasks/statuses/list/${project_id}`, {
    method: "POST",
    body: JSON.stringify(statuses),
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
  start_date?: number
  end_date?: number
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
      start_date,
      end_date,
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
    start_date?: number | null
    end_date?: number | null
    all_day?: boolean
    assignees_ids?: number[]
  }
): Promise<Response> {
  return apiFetch(`/api/v1/tasks/${task_id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
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

export async function fetchTaskComments(
  task_id: string | number,
  page = 1,
  limit = 20
): Promise<Response> {
  return apiFetch(
    `/api/v1/tasks/${task_id}/comments?_page=${page}&_limit=${limit}&_sort=time_stamp&_order=desc`,
    { method: "GET" }
  )
}

export async function createTaskComments({
  task_id,
  text,
}: {
  task_id: string | number
  text: string
}): Promise<Response> {
  return apiFetch(`/api/v1/tasks/${task_id}/comments`, {
    method: "POST",
    body: JSON.stringify({ type: "comment", text }),
  })
}

export async function createTaskCommentsFiles({
  task_id,
  files,
}: {
  task_id: string | number
  files: File[]
}): Promise<Response> {
  const formData = new FormData()
  files.forEach((file) => formData.append("files", file))

  return apiFetch(`/api/v1/tasks/${task_id}/comments/upload`, {
    method: "POST",
    body: formData,
  })
}

export async function createTaskAttachments({
  task_id,
  files,
}: {
  task_id: string | number
  files: File[]
}): Promise<Response> {
  const formData = new FormData()
  files.forEach((file) => formData.append("files", file))

  return apiFetch(`/api/v1/tasks/${task_id}/attachments`, {
    method: "POST",
    body: formData,
  })
}

export async function createSubtask(
  task_id: string | number,
  payload: {
    name: string
    start_date: number
    end_date: number
    all_day?: boolean
    priority_id?: string | number
    assignee_ids?: number[]
  }
): Promise<Response> {
  return apiFetch(`/api/v1/tasks/${task_id}/subtasks`, {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function fetchSubtask(
  task_id: string | number
): Promise<Response> {
  return apiFetch(`/api/v1/tasks/${task_id}/subtasks`, {
    method: "GET",
  })
}
