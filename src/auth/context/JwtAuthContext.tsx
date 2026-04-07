import { type AuthProviderState } from "../types/AuthTypes";
import { type User } from "@/auth/user";
import { createContext } from "react";
import { type SignInPayload, type SignUpPayload } from "../providers/JwtAuthProvider";

export type AuthContextType = AuthProviderState<User> & {
  updateUser: (U: User) => Promise<Response>;
  setUser: (user: User) => void;
  signIn: (credentials: SignInPayload) => Promise<Response>;
  signInWithGoogle: (idToken: string, nonce: string) => Promise<Response>;
  signUp: (U: SignUpPayload) => Promise<Response>;
  signOut: () => void;
  refreshToken: () => Promise<string | Response>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;
