import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";

export type LoginCredentials = {
  email: string;
  password: string;
};

type AuthContextValue = {
  session: LoginCredentials | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

import { loginUser } from "@/api/authApi";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<LoginCredentials | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const value = useMemo(
    () => ({
      session,
      loading,
      error,
      login: async (credentials: LoginCredentials) => {
        setLoading(true);
        setError(null);
        try {
          await loginUser(credentials);
          // Assuming successful login returns some user data or token,
          // but for now we just store the credentials as session to maintain existing behavior
          // or if the API returns a token we should store that.
          // The task says "response will be 200 or 401", so 200 means success.
          setSession(credentials);
        } catch (err: any) {
          console.error("Login failed", err);
          if (err.response && err.response.status === 401) {
            setError("Invalid email or password");
          } else {
            setError("Something went wrong. Please try again.");
          }
        } finally {
          setLoading(false);
        }
      },
      logout: () => {
        setSession(null);
        setError(null);
      },
    }),
    [session, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
