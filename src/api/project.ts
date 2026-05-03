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
  start_date?: number
  end_date?: number
}): Promise<Response> {
  return apiFetch("/api/v1/projects", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateProject(projectId: string | number, data: {
  name?: string
  description?: string
  start_date?: number
  end_date?: number
  status_id?: string | number
}): Promise<Response> {
  return apiFetch(`/api/v1/projects/${projectId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function updateLogo(projectId: string | number, file: File): Promise<Response> {
  const formData = new FormData()
  formData.append("logo", file)

  return apiFetch(`/api/v1/projects/${projectId}/logo`, {
    method: "POST",
    body: formData,
  })
}