import type { User, Organization, Permissions } from "@/auth/user"
import {
  authProfile,
  authOrganization,
  authOrganizationPermissions,
} from "../api/authApi"

type ApiResponse<T> = {
  code: number
  error: string | null
  message: string
  payload: T
}

export async function loadAuthenticatedUser(token: string): Promise<User> {
  const [profileRes, organizationRes, permissionsRes] = await Promise.all([
    authProfile(token),
    authOrganization(token),
    authOrganizationPermissions(token),
  ])

  const [profile, organization, permissions] = await Promise.all([
    profileRes.json() as Promise<ApiResponse<User>>,
    organizationRes.json() as Promise<ApiResponse<Organization[]>>,
    permissionsRes.json() as Promise<ApiResponse<Permissions>>,
  ])

  return {
    ...profile.payload,
    organization: organization.payload,
    permissions: permissions.payload,
  }
}
