import React from "react";
import { type AuthProviderType } from "./types/AuthTypes";
import { type User } from "@/auth/user";
import AuthProvider from "./providers/AuthProvider";
import Authorization from "@/providers/Authorization";
import JwtAuthProvider from "./providers/JwtAuthProvider";

const authProviders: AuthProviderType[] = [
  {
    name: "jwt",
    Provider: JwtAuthProvider,
  },
];

type AuthenticationProps = {
  children: React.ReactNode;
};

function Authentication(props: AuthenticationProps) {
  const { children } = props;

  return (
    <AuthProvider providers={authProviders}>
      {(authState) => {
        const user = authState?.user as User | null;
        const rawRole = user?.permissions?.role_name;
        const userRole: User["permissions"]["role_name"] = rawRole ?? [];

        return <Authorization userRole={userRole}>{children}</Authorization>;
      }}
    </AuthProvider>
  );
}

export default Authentication;
