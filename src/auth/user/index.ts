import { type SettingsConfigType } from "@/settings/context/SettingsContext";
import { type AuthUser } from "../types/AuthUser";
import type { PartialDeep } from "type-fest";

/**
 * The type definition for a user object.
 */
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
  organization: {
    id: string;
    slug: string;
    name: string;
    description?: string;
    photoURL?: string;
    can_view: boolean;
    can_create: boolean;
    can_update: boolean;
    can_delete: boolean;
  };
  settings?: PartialDeep<SettingsConfigType>;
  loginRedirectUrl?: string; // The URL to redirect to after login.
};
