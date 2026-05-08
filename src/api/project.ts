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

export async function fetchProjectNotifications(projectId: string | number): Promise<Response> {
  return apiFetch(`/api/v1/projects/${projectId}/notification`, {
    method: "GET",
  })
}

export async function updateProjectNotifications(projectId: string | number, data: {
  task_assigned_email?: boolean
  task_assigned_inapp?: boolean
  task_status_changed_email?: boolean
  task_status_changed_inapp?: boolean
  mentioned_in_comment_email?: boolean
  mentioned_in_comment_inapp?: boolean
  due_date_approaching_email?: boolean
  due_date_approaching_inapp?: boolean
  project_updates_email?: boolean
  project_updates_inapp?: boolean
  new_member_joined_email?: boolean
  new_member_joined_inapp?: boolean
  daily_digest?: boolean
  weekly_digest?: boolean
}): Promise<Response> {
  return apiFetch(`/api/v1/projects/${projectId}/notification`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function fetchProjectTaskSummary(projectId: string | number): Promise<Response> {
  return apiFetch(`/api/v1/projects/${projectId}/task_summary`, {
    method: "GET",
  })
}

export async function fetchProjectChart(projectId: string | number): Promise<Response> {
  return apiFetch(`/api/v1/projects/${projectId}/chart`, {
    method: "GET",
  })
}

export async function fetchProjectAssignees(projectId: string | number): Promise<Response> {
  return apiFetch(`/api/v1/projects/${projectId}/members`, {
    method: "GET",
  })
}

export async function fetchProjectTaskDeadlines(projectId: string | number): Promise<Response> {
  return apiFetch(`/api/v1/projects/${projectId}/task_deadlines?_limit=5`, {
    method: "GET",
  })
}