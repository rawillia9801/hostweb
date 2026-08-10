"use client";

import { FormEvent, useEffect, useState } from "react";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "@/lib/supabase-public";

export function PasswordRecovery() {
  const [mode, setMode] = useState<"request" | "reset">("request");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const accessToken = hash.get("access_token") || "";
    const type = hash.get("type");
    if (accessToken && type === "recovery") {
      setToken(accessToken);
      setMode("reset");
    }
  }, []);

  async function requestReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") || "").trim();
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(`${SUPABASE_URL}/auth/v1/recover?redirect_to=${encodeURIComponent("https://hostmyweb.co/recover")}`, {
        method: "POST",
        headers: { apikey: SUPABASE_PUBLISHABLE_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.msg || payload.message || "We could not send the recovery email.");
      setMessage("If that email belongs to a HostMyWeb account, a password reset link has been sent. Check your inbox and spam folder.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "We could not send the recovery email.");
    } finally {
      setBusy(false);
    }
  }

  async function setNewPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const password = String(data.get("password") || "");
    const confirm = String(data.get("confirm") || "");
    if (password.length < 8) { setMessage("Use a password with at least 8 characters."); return; }
    if (password !== confirm) { setMessage("The passwords do not match."); return; }
    if (!token) { setMessage("This recovery link is missing or expired. Request a new one."); return; }
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        method: "PUT",
        headers: {
          apikey: SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.msg || payload.message || "We could not update the password.");
      window.history.replaceState({}, "", "/recover");
      setMessage("Password updated. You can now sign in to HostMyWeb.");
      setMode("request");
      setToken("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "We could not update the password.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="account-shell auth-shell">
      <a className="account-brand" href="/"><span className="brand-mark"><i /><i /><i /></span><b>HostMyWeb</b></a>
      <section className="auth-card">
        <div className="auth-copy">
          <span>HOSTMYWEB ACCOUNT</span>
          <h1>{mode === "reset" ? "Choose a new password." : "Recover your account."}</h1>
          <p>{mode === "reset" ? "Set a new password for your HostMyWeb account, then return to the customer login." : "Enter the email on your HostMyWeb account and we’ll send a secure password-reset link."}</p>
        </div>
        {mode === "reset" ? (
          <form className="auth-form" onSubmit={setNewPassword}>
            <label><span>New password</span><input name="password" type="password" autoComplete="new-password" minLength={8} required /></label>
            <label><span>Confirm password</span><input name="confirm" type="password" autoComplete="new-password" minLength={8} required /></label>
            <button type="submit" disabled={busy}>{busy ? "Updating…" : "Set new password"}</button>
            {message && <p className="auth-message" role="status">{message}</p>}
          </form>
        ) : (
          <form className="auth-form" onSubmit={requestReset}>
            <label><span>Email</span><input name="email" type="email" autoComplete="email" required /></label>
            <button type="submit" disabled={busy}>{busy ? "Sending…" : "Send reset link"}</button>
            {message && <p className="auth-message" role="status">{message}</p>}
          </form>
        )}
        <a className="back-home" href="/account">← Back to login</a>
      </section>
    </main>
  );
}
