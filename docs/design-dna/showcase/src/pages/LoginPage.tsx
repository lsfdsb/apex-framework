/**
 * LoginPage — Supabase Auth login/signup for APEX OPS HUB.
 * Glassmorphism card with email/password form.
 * Toggle between sign in and sign up modes.
 */

import { useState, type FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import { Shield } from "lucide-react";

export default function LoginPage() {
  const { signIn, signUp, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    const result =
      mode === "signin"
        ? await signIn(email, password)
        : await signUp(email, password);

    setSubmitting(false);

    if (result.error) {
      setError(result.error);
    } else if (mode === "signup") {
      setSuccess("Check your email to confirm your account.");
    }
  };

  if (loading) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 120px)",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          borderRadius: 20,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "32px 32px 0",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: "color-mix(in srgb, var(--accent) 12%, transparent)",
              border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--accent)",
              marginBottom: 20,
            }}
          >
            <Shield size={24} />
          </div>

          <h1
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 24,
              fontWeight: 800,
              color: "var(--text)",
              letterSpacing: "-0.03em",
              marginBottom: 4,
            }}
          >
            APEX
            <span
              style={{
                fontWeight: 300,
                color: "var(--text-muted)",
                marginLeft: 6,
              }}
            >
              OPS
            </span>
          </h1>

          <p
            style={{
              fontSize: 14,
              color: "var(--text-secondary)",
              marginBottom: 24,
              lineHeight: 1.5,
            }}
          >
            {mode === "signin"
              ? "Sign in to access the operations dashboard."
              : "Create an account to get started."}
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{ padding: "0 32px 32px" }}
        >
          {/* Email */}
          <label
            style={{
              display: "block",
              fontSize: 12,
              fontWeight: 600,
              color: "var(--text-secondary)",
              marginBottom: 6,
              letterSpacing: "0.02em",
            }}
          >
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            style={{
              width: "100%",
              padding: "10px 14px",
              fontSize: 14,
              fontFamily: "var(--font-body)",
              color: "var(--text)",
              background: "var(--bg)",
              border: "1px solid var(--border)",
              borderRadius: 10,
              outline: "none",
              marginBottom: 16,
              boxSizing: "border-box",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--accent)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
            }}
          />

          {/* Password */}
          <label
            style={{
              display: "block",
              fontSize: 12,
              fontWeight: 600,
              color: "var(--text-secondary)",
              marginBottom: 6,
              letterSpacing: "0.02em",
            }}
          >
            Password
          </label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min 6 characters"
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            style={{
              width: "100%",
              padding: "10px 14px",
              fontSize: 14,
              fontFamily: "var(--font-body)",
              color: "var(--text)",
              background: "var(--bg)",
              border: "1px solid var(--border)",
              borderRadius: 10,
              outline: "none",
              marginBottom: 20,
              boxSizing: "border-box",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--accent)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
            }}
          />

          {/* Error */}
          {error && (
            <div
              role="alert"
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                background: "color-mix(in srgb, var(--destructive) 10%, transparent)",
                border: "1px solid color-mix(in srgb, var(--destructive) 30%, transparent)",
                color: "var(--destructive)",
                fontSize: 13,
                marginBottom: 16,
                lineHeight: 1.5,
              }}
            >
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div
              role="status"
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                background: "color-mix(in srgb, var(--success) 10%, transparent)",
                border: "1px solid color-mix(in srgb, var(--success) 30%, transparent)",
                color: "var(--success)",
                fontSize: 13,
                marginBottom: 16,
                lineHeight: 1.5,
              }}
            >
              {success}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            style={{
              width: "100%",
              padding: "11px 0",
              fontSize: 14,
              fontWeight: 600,
              fontFamily: "var(--font-body)",
              color: "var(--bg)",
              background: submitting
                ? "color-mix(in srgb, var(--accent) 60%, transparent)"
                : "var(--accent)",
              border: "none",
              borderRadius: 10,
              cursor: submitting ? "wait" : "pointer",
              transition: "opacity 0.2s, background 0.2s",
              letterSpacing: "0.01em",
            }}
          >
            {submitting
              ? "Loading..."
              : mode === "signin"
                ? "Sign In"
                : "Create Account"}
          </button>

          {/* Toggle mode */}
          <p
            style={{
              textAlign: "center",
              fontSize: 13,
              color: "var(--text-muted)",
              marginTop: 20,
              marginBottom: 0,
            }}
          >
            {mode === "signin" ? (
              <>
                No account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setError(null);
                    setSuccess(null);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--accent)",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: 13,
                    fontFamily: "var(--font-body)",
                    padding: 0,
                  }}
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("signin");
                    setError(null);
                    setSuccess(null);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--accent)",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: 13,
                    fontFamily: "var(--font-body)",
                    padding: 0,
                  }}
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}
