import { type SettingsConfigType } from "@/settings/context/SettingsContext"
import { type AuthUser } from "../types/AuthUser"
import type { PartialDeep } from "type-fest"

export type Organization = {
  id: number
  slug: string
  name: string
  description?: string
  is_active: boolean
  logo_url?: string
  joined_at?: Date
  is_owner?: boolean
}

export type PagePermissions = {
  id: number
  page_id: string
  role_id: number
  is_view: boolean
  is_edit: boolean
  is_delete: boolean
}

export type Permissions = {
  role_name: string[] | string | null
  organization_id: number | null
  page_permissions: PagePermissions[]
}

export type User = AuthUser & {
  id: number
  display_name: string
  first_name: string
  last_name: string
  avatar?: string
  email?: string
  bio?: string
  shortcuts?: string[]
  organization: Organization[]
  permissions: Permissions
  settings?: PartialDeep<SettingsConfigType>
  loginRedirectUrl?: string // The URL to redirect to after login.
}
