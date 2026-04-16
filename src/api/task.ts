import apiFetch from "@/utils/apiFetch"

export async function fetchPriorities(): Promise<Response> {
  return apiFetch("/api/v1/tasks/priorities", {
    method: "GET",
  })
}

export async function fetchTaskStatuses(project_id: string | number): Promise<Response> {
  return apiFetch(`/api/v1/tasks/statuses/${project_id}`, {
    method: "GET",
  })
}

export async function fetchTasks(project_id: string | number, status_id: string | number, query?: string): Promise<Response> {
  return apiFetch(`/api/v1/tasks/${project_id}/${status_id}${query ? `?${query}` : ""}`, {
    method: "GET",
  })
}

