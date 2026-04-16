import apiFetch from "@/utils/apiFetch"

export async function fetchPriorities(): Promise<Response> {
  return apiFetch("/api/v1/tasks/priorities", {
    method: "GET",
  })
}

export async function fetchTaskStatuses(
  project_id: string | number
): Promise<Response> {
  return apiFetch(`/api/v1/tasks/statuses/${project_id}`, {
    method: "GET",
  })
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
    body: JSON.stringify({updates}),
  })
}


export async function reorderTasks({
  project_id,
  updates,
}: {
  project_id: string | number
  updates: { id: number | string; status_id: number | string; position: number }[]
}): Promise<Response> {
  return apiFetch(`/api/v1/tasks/reorder/${project_id}`, {
    method: "PUT",
    body: JSON.stringify({updates}),
  })
}