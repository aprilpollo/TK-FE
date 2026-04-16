import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useImperativeHandle,
  forwardRef,
} from "react"
import {
  type AuthProviderComponentProps,
  type AuthProviderState,
  type AuthProviderMethods,
} from "../types/AuthTypes"
import type { User, Organization, Permissions } from "@/auth/user"
import { isTokenValid } from "../utils/jwtUtils"
import {
  authSignIn,
  authSignUp,
  authSignInWithGoogle,
  authProfile,
  authOrganization,
  authOrganizationPermissions,
  authUpdatePrimaryOrganization,
} from "../api/authApi"
import { removeGlobalHeaders, setGlobalHeaders } from "@/utils/apiFetch"
import AuthContext, { type AuthContextType } from "../context/JwtAuthContext"
import useLocalStorage from "@/hooks/useLocalStorage"
import Storage from "@/utils/storage"

export type SignInPayload = {
  email: string
  password: string
}

export type SignUpPayload = {
  displayName: string
  email: string
  password: string
}

const JwtAuthProvider = forwardRef<
  AuthProviderMethods<User>,
  AuthProviderComponentProps
>((props, ref) => {
  const { children, onAuthStateChanged } = props
  const {
    value: tokenStorageValue,
    setValue: setTokenStorageValue,
    removeValue: removeTokenStorageValue,
  } = useLocalStorage<string>("access_token")

  const [authState, setAuthState] = useState<AuthProviderState<User>>({
    authStatus: "configuring",
    isAuthenticated: false,
    user: null,
  })

  useEffect(() => {
    if (onAuthStateChanged) {
      onAuthStateChanged(authState)
    }
  }, [authState, onAuthStateChanged])

  useEffect(() => {
    const attemptAutoLogin = async () => {
      const accessToken = tokenStorageValue

      if (isTokenValid(accessToken)) {
        try {
          const result = await Promise.all([
            authProfile(accessToken),
            authOrganization(accessToken),
            authOrganizationPermissions(accessToken),
          ])

          const [
            responseProfile,
            responseOrganization,
            responseOrganizationPermissions,
          ] = await Promise.all([
            result[0].json() as Promise<{
              code: number
              error: string | null
              message: string
              payload: User
            }>,
            result[1].json() as Promise<{
              code: number
              error: string | null
              message: string
              payload: Organization[]
            }>,
            result[2].json() as Promise<{
              code: number
              error: string | null
              message: string
              payload: Permissions
            }>,
          ])

          const userData = {
            ...responseProfile.payload,
            organization: responseOrganization.payload,
            permissions: responseOrganizationPermissions.payload,
          }

          setGlobalHeaders({
            Authorization: `Bearer ${accessToken}`,
            "Organization-ID": userData.permissions.organization_id?.toString() ?? "",
          })

          return userData
        } catch (error) {
          return false
        }
      }

      return false
    }

    if (!authState.isAuthenticated) {
      attemptAutoLogin().then((userData) => {
        if (userData) {
          setAuthState({
            authStatus: "authenticated",
            isAuthenticated: true,
            user: userData,
          })
        } else {
          removeTokenStorageValue()
          removeGlobalHeaders(["Authorization", "Organization-ID"])
          setAuthState({
            authStatus: "unauthenticated",
            isAuthenticated: false,
            user: null,
          })
        }
      })
    }
  }, [authState.isAuthenticated])

  const signIn = useCallback(
    async (credentials: SignInPayload) => {
      const responseSignIn = await authSignIn(credentials)

      const sessionSignIn = (await responseSignIn.json()) as {
        code: number
        error: string | null
        message: string
        payload: {
          token: string
        }
      }

      const result = await Promise.all([
        authProfile(sessionSignIn.payload.token),
        authOrganization(sessionSignIn.payload.token),
        authOrganizationPermissions(sessionSignIn.payload.token),
      ])

      const [
        responseProfile,
        responseOrganization,
        responseOrganizationPermissions,
      ] = await Promise.all([
        result[0].json() as Promise<{
          code: number
          error: string | null
          message: string
          payload: User
        }>,
        result[1].json() as Promise<{
          code: number
          error: string | null
          message: string
          payload: Organization[]
        }>,
        result[2].json() as Promise<{
          code: number
          error: string | null
          message: string
          payload: Permissions
        }>,
      ])

      const userData = {
        ...responseProfile.payload,
        organization: responseOrganization.payload,
        permissions: responseOrganizationPermissions.payload,
      }

      if (sessionSignIn && userData) {
        setAuthState({
          authStatus: "authenticated",
          isAuthenticated: true,
          user: userData,
        })

        setTokenStorageValue(sessionSignIn.payload.token)
        setGlobalHeaders({
          Authorization: `Bearer ${sessionSignIn.payload.token}`,
          "Organization-ID": userData.permissions.organization_id?.toString() ?? "",
        })
      }

      return responseSignIn
    },
    [setTokenStorageValue]
  )

  const signInWithGoogle = useCallback(
    async (idToken: string, nonce: string) => {
      const responseSignIn = await authSignInWithGoogle(
        "google",
        idToken,
        nonce
      )

      const sessionSignIn = (await responseSignIn.json()) as {
        code: number
        error: string | null
        message: string
        payload: {
          token: string
        }
      }

      const responseProfile = await authProfile(sessionSignIn.payload.token)

      const sessionProfile = (await responseProfile.json()) as {
        code: number
        error: string | null
        message: string
        payload: User
      }

      if (sessionSignIn && sessionProfile) {
        setAuthState({
          authStatus: "authenticated",
          isAuthenticated: true,
          user: sessionProfile.payload,
        })
        setTokenStorageValue(sessionSignIn.payload.token)
        setGlobalHeaders({
          Authorization: `Bearer ${sessionSignIn.payload.token}`,
        })
      }

      return responseSignIn
    },
    [setTokenStorageValue]
  )

  const refreshPermissions = useCallback(
    async (organizationId: number) => {
      setAuthState((prev) => ({
        ...prev,
        authStatus: "configuring",
      }))

      const accessToken = tokenStorageValue
      try {
        await authUpdatePrimaryOrganization(accessToken ?? "", organizationId)
        const response = await authOrganizationPermissions(accessToken ?? "")
        const session = (await response.json()) as {
          code: number
          error: string | null
          message: string
          payload: Permissions
        }

        setAuthState((prev) => ({
          ...prev,
          authStatus: prev.isAuthenticated
            ? "authenticated"
            : "unauthenticated",
          user: {
            ...prev?.user,
            permissions: session.payload,
          } as User,
        }))
        Storage.set(
          "organization_id",
          session.payload.organization_id?.toString() ?? ""
        )
      } catch (error) {
        setAuthState((prev) => ({
          ...prev,
          authStatus: prev.isAuthenticated
            ? "authenticated"
            : "unauthenticated",
        }))
        throw error
      }
    },
    [tokenStorageValue]
  )

  const signUp = useCallback(
    async (data: SignUpPayload) => {
      const response = await authSignUp(data)

      const session = (await response.json()) as {
        user: User
        access_token: string
      }

      if (session) {
        setAuthState({
          authStatus: "authenticated",
          isAuthenticated: true,
          user: session.user,
        })
        setTokenStorageValue(session.access_token)
        setGlobalHeaders({ Authorization: `Bearer ${session.access_token}` })
      }

      return response
    },
    [setTokenStorageValue]
  )

  const signOut: AuthContextType["signOut"] = useCallback(() => {
    removeTokenStorageValue()
    removeGlobalHeaders(["Authorization"])
    setAuthState({
      authStatus: "unauthenticated",
      isAuthenticated: false,
      user: null,
    })
  }, [removeTokenStorageValue])

  useImperativeHandle(
    ref,
    () => ({
      signOut,
      updateUser: async () => {
        throw new Error("updateUser is not implemented for JwtAuthProvider")
      },
      refreshPermissions,
    }),
    [signOut, refreshPermissions]
  )

  const setUser = useCallback((newUser: User) => {
    setAuthState((prev) => ({
      ...prev,
      user: newUser,
    }))
  }, [])

  const authContextValue = useMemo(
    () =>
      ({
        ...authState,
        signIn,
        signInWithGoogle,
        signUp,
        refreshPermissions,
        signOut,
        setUser,
      }) as AuthContextType,
    [
      authState,
      signIn,
      signInWithGoogle,
      signUp,
      refreshPermissions,
      signOut,
      setUser,
    ]
  )

  const interceptFetch = useCallback(() => {
    const { fetch: originalFetch } = window

    window.fetch = async (...args) => {
      const [resource, config] = args
      const response = await originalFetch(resource, config)
      const newAccessToken = response.headers.get("New-Access-Token")

      if (newAccessToken) {
        setGlobalHeaders({ Authorization: `Bearer ${newAccessToken}` })
        setTokenStorageValue(newAccessToken)
      }

      if (response.status === 401) {
        signOut()

        console.error("Unauthorized request. User was signed out.")
      }

      return response
    }
  }, [setTokenStorageValue, signOut])

  useEffect(() => {
    if (authState.isAuthenticated) {
      interceptFetch()
    }
  }, [authState.isAuthenticated, interceptFetch])

  return <AuthContext value={authContextValue}>{children}</AuthContext>
})

export default JwtAuthProvider
