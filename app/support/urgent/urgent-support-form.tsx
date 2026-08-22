"use client";

import { FormEvent, useEffect, useState } from "react";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "@/lib/supabase-public";
import styles from "./urgent-support.module.css";

type Session = {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  expires_at?: number;
  user?: { id?: string; email?: string };
};

type State = "checking" | "ready" | "signed_out" | "sending" | "success" | "error";

const STORAGE_KEY = "hostmyweb_session";

function normalizeSession(payload: Session): Session {
  return {
    ...payload,
    expires_at: payload.expires_at || (payload.expires_in ? Date.now() + payload.expires_in * 1000 : undefined),
  };
}

async function currentSession(): Promise<Session | null> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const stored = JSON.parse(raw) as Session;
    if (!stored.refresh_token || !stored.expires_at || stored.expires_at > Date.now() + 60_000) return stored;

    const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
      method: "POST",
      headers: { apikey: SUPABASE_PUBLISHABLE_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: stored.refresh_token }),
    });
    if (!response.ok) return null;
    const refreshed = normalizeSession((await response.json()) as Session);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(refreshed));
    return refreshed;
  } catch {
    return null;
  }
}

export function UrgentSupportForm() {
  const [session, setSession] = useState<Session | null>(null);
  const [state, setState] = useState<State>("checking");
  const [message, setMessage] = useState("");

  useEffect(() => {
    void (async () => {
      const found = await currentSession();
      setSession(found);
      setState(found?.access_token && found.user?.id ? "ready" : "signed_out");
    })();
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session?.access_token || !session.user?.id) {
      setState("signed_out");
      return;
    }
    const form = event.currentTarget;
    const data = new FormData(form);
    const affected = String(data.get("affected_service") || "").trim();
    const issueType = String(data.get("issue_type") || "outage");
    const summary = String(data.get("summary") || "").trim();
    const details = String(data.get("details") || "").trim();
    setState("sending");
    setMessage("");

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/hostmyweb_support_tickets`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          user_id: session.user.id,
          category: "urgent_technical",
          subject: `[URGENT] ${summary}`,
          message: `Affected service/domain: ${affected}\nIssue type: ${issueType}\n\n${details}`,
          priority: "urgent",
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.message || "We could not submit the urgent incident.");
      }

      form.reset();
      setState("success");
      setMessage("Urgent incident submitted. It is marked priority: urgent and tied to your HostMyWeb account.");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "We could not submit the urgent incident.");
    }
  }

  if (state === "checking") {
    return <div className={styles.statusCard}><i /> Checking your HostMyWeb session…</div>;
  }

  if (state === "signed_out") {
    return (
      <div className={styles.signInCard}>
        <span className={styles.alertMark}>!</span>
        <div>
          <small>ACCOUNT REQUIRED</small>
          <h2>Sign in before submitting an urgent incident.</h2>
          <p>Urgent incidents are tied to a customer account so the request can be matched to the affected service and its support history.</p>
          <div className={styles.actions}>
            <a className={styles.primary} href="/account">Sign in to HostMyWeb</a>
            <a href="/account#support">Use normal support</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <div className={styles.formHead}>
        <div><i /><span>PRIORITY INCIDENT INTAKE</span></div>
        <em>URGENT ROUTE</em>
      </div>
      <div className={styles.notice}>
        <b>Use this route for service-impacting incidents.</b>
        <span>Examples: website down, DNS failure, SSL failure, email outage, or another active service disruption. Billing and routine account questions should use normal support.</span>
      </div>
      <div className={styles.grid}>
        <label>
          <span>Affected domain or service</span>
          <input name="affected_service" required maxLength={200} placeholder="example.com or Business Hosting" />
        </label>
        <label>
          <span>Issue type</span>
          <select name="issue_type" defaultValue="website_down">
            <option value="website_down">Website down</option>
            <option value="dns_failure">DNS failure</option>
            <option value="ssl_failure">SSL / certificate failure</option>
            <option value="email_outage">Email outage</option>
            <option value="server_issue">Server / application issue</option>
            <option value="other_service_impact">Other service-impacting issue</option>
          </select>
        </label>
      </div>
      <label>
        <span>Short summary</span>
        <input name="summary" required maxLength={140} placeholder="Site returns an error for all visitors" />
      </label>
      <label>
        <span>What is happening?</span>
        <textarea name="details" required rows={7} maxLength={4000} placeholder="When it started, what visitors see, recent changes, error messages, affected pages or services, and anything already tried." />
      </label>
      <div className={styles.submitRow}>
        <div>{message && <p className={state === "error" ? styles.error : styles.success} role="status">{message}</p>}</div>
        <button type="submit" disabled={state === "sending"}>{state === "sending" ? "Submitting…" : "Submit urgent incident →"}</button>
      </div>
      <p className={styles.accountNote}>Signed in as {session?.user?.email || "HostMyWeb customer"}. This form marks the ticket priority as urgent.</p>
    </form>
  );
}
