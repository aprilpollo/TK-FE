import apiFetch from "@/utils/apiFetch"

export async function fetchProjects(query?: string): Promise<Response> {
  return apiFetch(`/api/v1/projects${query ? `?${query}` : ""}`, {
    method: "GET",
  })
}

export async function fetchProjectStatuses(): Promise<Response> {
  return apiFetch("/api/v1/projects/statuses", {
    method: "GET",
  })
}

export async function fetchProjectByKey(key: string): Promise<Response> {
  return apiFetch(`/api/v1/projects/key/${key}`, {
    method: "GET",
  })
}

export async function createProject(data: {
  name: string
  description?: string
  due_date?: string
}): Promise<Response> {
  return apiFetch("/api/v1/projects", {
    method: "POST",
    body: JSON.stringify(data),
  })
}
