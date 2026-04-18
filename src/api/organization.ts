import apiFetch from "@/utils/apiFetch"

export async function fetchMembers(query?: string): Promise<Response> {
  return apiFetch(`/api/v1/organizations/members${query ? `?${query}` : ""}`, {
    method: "GET",
  })
}
