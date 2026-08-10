"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "@/lib/supabase-public";
import styles from "./twentyi-setup.module.css";

type Session = {
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
  expires_in?: number;
  user?: { id: string; email?: string };
};

type PackageType = { id: string; name: string; platform: string };
type SetupStatus = {
  connected: boolean;
  brandDomain: string;
  brandReferenceExists: boolean;
  packageTypes: PackageType[];
  packageCount: number | null;
  stackUserCount: number | null;
};

const STORAGE_KEY = "hostmyweb_session";

function readSession(): Session | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

async function refreshSession(session: Session): Promise<Session | null> {
  if (!session.refresh_token) return session;
  const expiresAtMs = session.expires_at ? session.expires_at * 1000 : 0;
  if (expiresAtMs && expiresAtMs > Date.now() + 60_000) return session;

  const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
    method: "POST",
    headers: { apikey: SUPABASE_PUBLISHABLE_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: session.refresh_token }),
  });
  if (!response.ok) return null;
  const refreshed = (await response.json()) as Session;
  const normalized = {
    ...refreshed,
    expires_at: refreshed.expires_at || (refreshed.expires_in ? Math.floor(Date.now() / 1000) + refreshed.expires_in : undefined),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  return normalized;
}

async function rpc<T>(name: string, body: unknown, token: string): Promise<T> {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_PUBLISHABLE_KEY,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error("The administrator check could not be completed.");
  return response.json() as Promise<T>;
}

export function TwentyISetup() {
  const [session, setSession] = useState<Session | null>(null);
  const [admin, setAdmin] = useState<boolean | null>(null);
  const [claimCode, setClaimCode] = useState("");
  const [status, setStatus] = useState<SetupStatus | null>(null);
  const [selectedType, setSelectedType] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      const stored = readSession();
      if (!stored) {
        if (active) setAdmin(false);
        return;
      }
      const current = await refreshSession(stored);
      if (!active) return;
      if (!current?.access_token) {
        setAdmin(false);
        return;
      }
      setSession(current);
      try {
        setAdmin(await rpc<boolean>("is_hostmyweb_admin", {}, current.access_token));
      } catch {
        setAdmin(false);
      }
    })();
    return () => { active = false; };
  }, []);

  async function loadStatus(token = session?.access_token) {
    if (!token) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/20i", {
        cache: "no-store",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = (await response.json()) as SetupStatus & { error?: string };
      if (!response.ok) throw new Error(data.error || "Unable to read the 20i account.");
      setStatus(data);
      const recommended = data.packageTypes.find((type) => /linux/i.test(`${type.name} ${type.platform}`) && !/wordpress/i.test(`${type.name} ${type.platform}`));
      setSelectedType((value) => value || recommended?.id || data.packageTypes[0]?.id || "");
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to read the 20i account.");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (admin && session?.access_token) void loadStatus(session.access_token);
  }, [admin, session?.access_token]);

  async function claimAdmin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session?.access_token || !claimCode.trim()) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const claimed = await rpc<boolean>("claim_hostmyweb_admin", { p_code: claimCode.trim() }, session.access_token);
      if (!claimed) throw new Error("That setup code is invalid, expired, or already used.");
      setAdmin(true);
      setClaimCode("");
      setMessage("Administrator access is active for this HostMyWeb account.");
    } catch (claimError) {
      setError(claimError instanceof Error ? claimError.message : "Unable to activate administrator access.");
    } finally {
      setBusy(false);
    }
  }

  async function ensureBrandReference() {
    if (!session?.access_token || !selectedType) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/admin/20i", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "ensure_brand_reference", packageTypeId: selectedType }),
      });
      const data = (await response.json()) as { ok?: boolean; message?: string; error?: string };
      if (!response.ok) throw new Error(data.error || "The HostMyWeb domain reference could not be created.");
      setMessage(data.message || "The HostMyWeb domain reference is ready.");
      await loadStatus();
    } catch (setupError) {
      setError(setupError instanceof Error ? setupError.message : "The HostMyWeb domain reference could not be created.");
    } finally {
      setBusy(false);
    }
  }

  const chosenType = useMemo(() => status?.packageTypes.find((type) => type.id === selectedType), [status, selectedType]);

  if (admin === null) return <main className={styles.shell}><div className={styles.card}>Checking administrator access…</div></main>;

  if (!session) {
    return (
      <main className={styles.shell}>
        <section className={styles.card}>
          <span className={styles.kicker}>HOSTMYWEB INFRASTRUCTURE</span>
          <h1>Sign in before changing hosting infrastructure.</h1>
          <p>This setup console is private and requires a signed-in HostMyWeb account.</p>
          <div className={styles.actions}><a className={styles.primary} href="/account">Log in</a><a className={styles.secondary} href="/signup">Create account</a></div>
        </section>
      </main>
    );
  }

  if (!admin) {
    return (
      <main className={styles.shell}>
        <section className={styles.card}>
          <span className={styles.kicker}>ONE-TIME ADMIN SETUP</span>
          <h1>Activate infrastructure administrator access.</h1>
          <p>Enter the one-time setup code supplied for the owner account. Ordinary customer accounts cannot access the 20i controls.</p>
          <form className={styles.claimForm} onSubmit={claimAdmin}>
            <input value={claimCode} onChange={(event) => setClaimCode(event.target.value)} placeholder="One-time setup code" autoComplete="off" required />
            <button disabled={busy}>{busy ? "Activating…" : "Activate administrator"}</button>
          </form>
          {error && <p className={styles.error}>{error}</p>}
          <a className={styles.back} href="/account">← Back to customer account</a>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.shell}>
      <section className={styles.wideCard}>
        <header className={styles.header}>
          <div><span className={styles.kicker}>PRIVATE INFRASTRUCTURE CONSOLE</span><h1>20i reseller setup</h1><p>Use the API for repeatable setup work while keeping customer-facing hosting controls separate.</p></div>
          <div className={styles.headerActions}><button onClick={() => void loadStatus()} disabled={busy}>Refresh</button><a href="/account">Customer account</a></div>
        </header>

        {error && <p className={styles.error}>{error}</p>}
        {message && <p className={styles.success}>{message}</p>}

        <div className={styles.statGrid}>
          <article><span>20i API</span><b>{status?.connected ? "Connected" : busy ? "Checking…" : "Unknown"}</b></article>
          <article><span>Brand reference</span><b>{status?.brandReferenceExists ? "Ready" : "Not created"}</b></article>
          <article><span>Hosting packages</span><b>{status?.packageCount ?? "—"}</b></article>
          <article><span>StackCP users</span><b>{status?.stackUserCount ?? "—"}</b></article>
        </div>

        <section className={styles.setupBlock}>
          <div>
            <span className={styles.step}>STEP 1</span>
            <h2>Create the HostMyWeb brand-domain reference</h2>
            <p>20i requires the externally hosted brand domain to exist in the reseller account as a hosting/domain reference before it can be selected for branded StackCP URLs.</p>
          </div>

          {status?.brandReferenceExists ? (
            <div className={styles.readyBox}><b>✓ hostmyweb.co is already present in 20i.</b><span>You can return to Reseller Customisation and select it as the Brand Domain.</span></div>
          ) : (
            <div className={styles.controls}>
              <label><span>20i package type for the domain reference</span><select value={selectedType} onChange={(event) => setSelectedType(event.target.value)} disabled={busy || !status?.packageTypes.length}><option value="">Choose a package type</option>{status?.packageTypes.map((type) => <option key={type.id} value={type.id}>{type.name} — {type.platform} ({type.id})</option>)}</select></label>
              {chosenType && <p className={styles.selection}>Selected: <b>{chosenType.name}</b> · {chosenType.platform}</p>}
              <button className={styles.primaryButton} onClick={ensureBrandReference} disabled={busy || !selectedType}>{busy ? "Working…" : "Create hostmyweb.co reference through 20i"}</button>
            </div>
          )}
        </section>

        <section className={styles.nextBlock}>
          <span className={styles.step}>AFTER THE REFERENCE EXISTS</span>
          <h2>Finish the one-time white-label fields in My20i.</h2>
          <div className={styles.fieldGrid}><span><b>Brand Domain</b> hostmyweb.co</span><span><b>Control Panel</b> cp</span><span><b>FTP</b> ftp</span><span><b>phpMyAdmin</b> db</span><span><b>Web Builder</b> builder</span><span><b>Company</b> HostMyWeb</span></div>
          <p>Use HTTPS and block search-engine indexing for the control panel. These reseller-brand fields are still handled by My20i because 20i does not document a write endpoint for them.</p>
        </section>
      </section>
    </main>
  );
}
