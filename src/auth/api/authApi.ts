import { type User } from "@/auth/user";
import UserModel from "@/auth/user/models/UserModel";
import type { PartialDeep } from "type-fest";
import apiFetch from "@/utils/apiFetch";

/**
 * Refreshes the access token
 */
export async function authRefreshToken(): Promise<Response> {
  return apiFetch("/api/mock/auth/refresh", { method: "POST" });
}

/**
 * Sign in with token
 */
export async function authSignInWithToken(
  accessToken: string
): Promise<Response> {
  return apiFetch("/api/v1/users/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export async function authProfile(
  accessToken: string
): Promise<Response> {
  return apiFetch("/api/v1/users/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export async function authOrganization(
  accessToken: string
): Promise<Response> {
  return apiFetch("/api/v1/organizations", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

/**
 * Sign in
 */
export async function authSignIn(credentials: {
  email: string;
  password: string;
}): Promise<Response> {
  return apiFetch("/api/v1/auth/basiclogin", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

/**
 * Sign up
 */
export async function authSignUp(data: {
  displayName: string;
  email: string;
  password: string;
}): Promise<Response> {
  return apiFetch("/api/mock/auth/sign-up", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Get user by id
 */
export async function authGetDbUser(userId: string): Promise<Response> {
  return apiFetch(`/api/mock/auth/user/${userId}`);
}

/**
 * Get user by email
 */
export async function authGetDbUserByEmail(email: string): Promise<Response> {
  return apiFetch(`/api/mock/auth/user-by-email/${email}`);
}

/**
 * Update user
 */
export function authUpdateDbUser(user: PartialDeep<User>) {
  return apiFetch(`/api/mock/auth/user/${user.id}`, {
    method: "PUT",
    body: JSON.stringify(UserModel(user)),
  });
}

/**
 * Create user
 */
export async function authCreateDbUser(user: PartialDeep<User>) {
  return apiFetch("/api/mock/users", {
    method: "POST",
    body: JSON.stringify(UserModel(user)),
  });
}

/**
 * Sign in with Google OAuth
 */
export async function authSignInWithGoogle(
  provider: string,
  token: string,
  nonce: string
): Promise<Response> {
  return apiFetch("/api/oauth/social", {
    method: "POST",
    body: JSON.stringify({ provider, token, nonce }),
  });
}
