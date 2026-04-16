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

// ProjectID   int64  `json:"project_id"`
// Name        string `json:"name"`
// Description string `json:"description"`
// Color       string `json:"color"`

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
