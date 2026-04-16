import apiFetch from "@/utils/apiFetch"

export async function authSignIn(credentials: {
  email: string
  password: string
}): Promise<Response> {
  return apiFetch("/api/v1/auth/basiclogin", {
    method: "POST",
    body: JSON.stringify(credentials),
  })
}

export async function authSignUp(data: {
  displayName: string
  email: string
  password: string
}): Promise<Response> {
  return apiFetch("/api/mock/auth/sign-up", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function authSignInWithGoogle(
  provider: string,
  token: string,
  nonce: string
): Promise<Response> {
  return apiFetch("/api/oauth/social", {
    method: "POST",
    body: JSON.stringify({ provider, token, nonce }),
  })
}

export async function authProfile(accessToken: string): Promise<Response> {
  return apiFetch("/api/v1/users/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
}

export async function authOrganization(accessToken: string): Promise<Response> {
  return apiFetch("/api/v1/users/me/organizations", {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
}

export async function authOrganizationPermissions(accessToken: string): Promise<Response> {
  return apiFetch("/api/v1/users/me/organizations/permissions", {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
}

export async function authUpdatePrimaryOrganization(accessToken: string, organizationId: number): Promise<Response> {
  return apiFetch(`/api/v1/users/me/organizations/primary/${organizationId}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${accessToken}` },
  })
}

export async function authUpdateAvatar(file: File): Promise<Response> {
  const formData = new FormData()
  formData.append("avatar", file)

  return apiFetch(`/api/v1/users/me/avatar`, {
    method: "POST",
    body: formData,
  })
}