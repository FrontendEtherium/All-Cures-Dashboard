import { type FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,

  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type LoginCredentials, useAuth } from "@/contexts/auth";

export function LoginPage() {
  const navigate = useNavigate();
  const { login, session, loading, error } = useAuth();
  const [formState, setFormState] = useState<LoginCredentials>({
    email: "",
    password: "",
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formState.email || !formState.password) {
      return;
    }
    await login(formState);
  };

  useEffect(() => {
    if (session) {
      navigate("/dashboard", { replace: true });
    }
  }, [session, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>
            Sign in to access the All Cures dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formState.email}
                onChange={(event) =>
                  setFormState((state) => ({
                    ...state,
                    email: event.target.value,
                  }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formState.password}
                onChange={(event) =>
                  setFormState((state) => ({
                    ...state,
                    password: event.target.value,
                  }))
                }
                required
              />
            </div>
            {error && (
              <div className="text-sm text-red-500 text-center">{error}</div>
            )}
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? (
                "Signing in..."
              ) : (
                <>
                  <LogIn className="size-4 mr-2" />
                  Sign in
                </>
              )}
            </Button>
          </form>
        </CardContent>
     
      </Card>
    </div>
  );
}
