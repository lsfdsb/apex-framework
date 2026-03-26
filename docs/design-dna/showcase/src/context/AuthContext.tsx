/**
 * AuthContext — Supabase Auth provider for the APEX OPS HUB.
 *
 * When Supabase is configured (VITE_SUPABASE_URL + VITE_SUPABASE_PUBLISHABLE_KEY):
 *   - Manages user session via Supabase Auth
 *   - Provides signIn, signUp, signOut methods
 *   - Persists session across page reloads
 *
 * When Supabase is NOT configured:
 *   - Falls back to "demo mode" — no auth required
 *   - All routes are accessible without login
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  getSupabaseClient,
  isSupabaseConfigured,
} from "../lib/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  isDemoMode: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const client = getSupabaseClient();
    if (!client) {
      setLoading(false);
      return;
    }

    // Get initial session
    client.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = useCallback(
    async (email: string, password: string): Promise<{ error: string | null }> => {
      const client = getSupabaseClient();
      if (!client) return { error: "Supabase not configured" };

      const { error } = await client.auth.signInWithPassword({ email, password });
      return { error: error?.message ?? null };
    },
    [],
  );

  const signUp = useCallback(
    async (email: string, password: string): Promise<{ error: string | null }> => {
      const client = getSupabaseClient();
      if (!client) return { error: "Supabase not configured" };

      const { error } = await client.auth.signUp({ email, password });
      return { error: error?.message ?? null };
    },
    [],
  );

  const signOut = useCallback(async () => {
    const client = getSupabaseClient();
    if (client) await client.auth.signOut();
    setUser(null);
    setSession(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isAuthenticated: !!user,
        isDemoMode: !isSupabaseConfigured,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
