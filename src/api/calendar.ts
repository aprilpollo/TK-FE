import apiFetch from "@/utils/apiFetch"

export async function fetchCalendarEvents(
  project_id: string | number,
  query?: string
): Promise<Response> {
  return apiFetch(`/api/v1/calendar/${project_id}${query ? `?${query}` : ""}`, {
    method: "GET",
  })
}

export async function fetchCalendarEventsStatus(
  project_id: string | number,
  query?: string
): Promise<Response> {
  return apiFetch(
    `/api/v1/calendar/statuses/${project_id}${query ? `?${query}` : ""}`,
    {
      method: "GET",
    }
  )
}

export async function fetchCalendarEventsPriorities(): Promise<Response> {
  return apiFetch("/api/v1/calendar/priorities", {
    method: "GET",
  })
}
