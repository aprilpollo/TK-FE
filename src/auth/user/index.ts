import { type SettingsConfigType } from "@/settings/context/SettingsContext";
import { type AuthUser } from "../types/AuthUser";
import type { PartialDeep } from "type-fest";

/**
 * The type definition for a user object.
 */

export type Organization = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  is_active: boolean;
  logo_url?: string;
};

export type User = AuthUser & {
  id: string;
  role: string[] | string | null;
  display_name: string;
  first_name: string;
  last_name: string;
  avatar?: string;
  email?: string;
  bio?: string;
  shortcuts?: string[];
  organization: Organization[];
  settings?: PartialDeep<SettingsConfigType>;
  loginRedirectUrl?: string; // The URL to redirect to after login.
};
