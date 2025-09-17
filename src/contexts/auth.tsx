import { createContext, type ReactNode, useContext, useMemo, useState } from "react"

export type LoginCredentials = {
  email: string
  password: string
}

type AuthContextValue = {
  session: LoginCredentials | null
  login: (credentials: LoginCredentials) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<LoginCredentials | null>(null)

  const value = useMemo(
    () => ({
      session,
      login: (credentials: LoginCredentials) => setSession(credentials),
      logout: () => setSession(null),
    }),
    [session],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
