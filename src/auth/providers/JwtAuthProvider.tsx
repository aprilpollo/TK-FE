import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useImperativeHandle,
  forwardRef,
} from "react"
import type { PartialDeep } from "type-fest"
import {
  type AuthProviderComponentProps,
  type AuthProviderState,
  type AuthProviderMethods,
} from "../types/AuthTypes"
import { type User, type Organization } from "@/auth/user"
import { isTokenValid } from "../utils/jwtUtils"
import {
  authRefreshToken,
  authSignIn,
  authSignInWithGoogle,
  authProfile,
  authOrganization,
  authSignUp,
  authUpdateDbUser,
} from "../api/authApi"
import { removeGlobalHeaders, setGlobalHeaders } from "@/utils/apiFetch"
import AuthContext, { type AuthContextType } from "../context/JwtAuthContext"

import useLocalStorage from "@/hooks/useLocalStorage"

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

  /**
   * Watch for changes in the auth state
   * and pass them to the FuseAuthProvider
   */
  useEffect(() => {
    if (onAuthStateChanged) {
      onAuthStateChanged(authState)
    }
  }, [authState, onAuthStateChanged])

  /**
   * Attempt to auto login with the stored token
   */
  useEffect(() => {
    const attemptAutoLogin = async () => {
      const accessToken = tokenStorageValue

      if (isTokenValid(accessToken)) {
        try {

          const result = await Promise.all([
            authProfile(accessToken),
            authOrganization(accessToken),
          ])

          const [responseProfile, responseOrganization] = await Promise.all([
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
          ])

          const userData = {
              ...responseProfile.payload,
              organization: responseOrganization.payload,
            }
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
          removeGlobalHeaders(["Authorization"])
          setAuthState({
            authStatus: "unauthenticated",
            isAuthenticated: false,
            user: null,
          })
        }
      })
    }
    // eslint-disable-next-line
  }, [authState.isAuthenticated])

  /**
   * Sign in
   */
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

      const [responseProfile, responseOrganization] = await Promise.all([
        authProfile(sessionSignIn.payload.token),
        authOrganization(sessionSignIn.payload.token),
      ])

      const [sessionProfile, _] = await Promise.all([
        responseProfile.json() as Promise<{
          code: number
          error: string | null
          message: string
          payload: User
        }>,
        responseOrganization.json() as Promise<{
          code: number
          error: string | null
          message: string
          payload: Organization[]
        }>,
      ])

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

  /**
   * Sign in with Google
   */

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

  /**
   * Sign up
   */
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

  /**
   * Sign out
   */
  const signOut: AuthContextType["signOut"] = useCallback(() => {
    removeTokenStorageValue()
    removeGlobalHeaders(["Authorization"])
    setAuthState({
      authStatus: "unauthenticated",
      isAuthenticated: false,
      user: null,
    })
  }, [removeTokenStorageValue])

  /**
   * Update user
   */
  const updateUser = useCallback(async (_user: PartialDeep<User>) => {
    try {
      return await authUpdateDbUser(_user)
    } catch (error) {
      console.error("Error updating user:", error)
      return Promise.reject(error)
    }
  }, [])

  /**
   * Set user (update auth state with new user data)
   */
  const setUser = useCallback((newUser: User) => {
    setAuthState((prev) => ({
      ...prev,
      user: newUser,
    }))
  }, [])

  /**
   * Refresh access token
   */
  const refreshToken: AuthContextType["refreshToken"] =
    useCallback(async () => {
      const response = await authRefreshToken()

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`)

      return response
    }, [])

  /**
   * Auth Context Value
   */
  const authContextValue = useMemo(
    () =>
      ({
        ...authState,
        signIn,
        signInWithGoogle,
        signUp,
        signOut,
        updateUser,
        setUser,
        refreshToken,
      }) as AuthContextType,
    [
      authState,
      signIn,
      signInWithGoogle,
      signUp,
      signOut,
      updateUser,
      setUser,
      refreshToken,
    ]
  )

  /**
   * Expose methods to the FuseAuthProvider
   */
  useImperativeHandle(ref, () => ({
    signOut,
    updateUser,
  }))

  /**
   * Intercept fetch requests to refresh the access token
   */
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
