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
        const isAuthenticated = authState?.isAuthenticated ?? false;
        const rawRole = authState?.user?.role as User["role"];

        // Backend อาจไม่ส่ง role กลับมา — ถ้า login แล้วแต่ไม่มี role ให้ default เป็น ["user"]
        // เพื่อให้ Authorization รู้ว่าเป็น member ไม่ใช่ guest
        const userRole: User["role"] = isAuthenticated
          ? (rawRole ?? ["user"])
          : (rawRole ?? []);

        return <Authorization userRole={userRole}>{children}</Authorization>;
      }}
    </AuthProvider>
  );
}

export default Authentication;
