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

type PlanSlug = "starter" | "business" | "pro" | "agency";
type PlanBinding = {
  plan: PlanSlug;
  planName: string;
  monthlyPrice: number;
  packageTypeRef: string | null;
  packageTypeName: string | null;
  checkoutUrl: string | null;
  active: boolean;
};
type BindingResponse = { packageTypes: PackageType[]; bindings: PlanBinding[]; error?: string };
type BindingDraft = { packageTypeRef: string; checkoutUrl: string };

type ReconcileResponse = {
  ok?: boolean;
  inventoryCount?: number;
  synchronized?: number;
  failed?: number;
  awaitingCustomerAccount?: number;
  error?: string;
};

type ProvisionResponse = {
  ok?: boolean;
  created?: boolean;
  planName?: string;
  domain?: string;
  packageId?: string;
  packageTypeName?: string;
  warning?: string | null;
  error?: string;
};

const STORAGE_KEY = "hostmyweb_session";
const PLAN_ORDER: PlanSlug[] = ["starter", "business", "pro", "agency"];

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

function apiHeaders(token: string, json = false): Record<string, string> {
  const headers: Record<string, string> = { Authorization: `Bearer ${token}` };
  if (json) headers["Content-Type"] = "application/json";
  return headers;
}

export function TwentyISetup() {
  const [session, setSession] = useState<Session | null>(null);
  const [admin, setAdmin] = useState<boolean | null>(null);
  const [claimCode, setClaimCode] = useState("");
  const [status, setStatus] = useState<SetupStatus | null>(null);
  const [selectedType, setSelectedType] = useState("");
  const [packageTypes, setPackageTypes] = useState<PackageType[]>([]);
  const [bindings, setBindings] = useState<PlanBinding[]>([]);
  const [bindingDrafts, setBindingDrafts] = useState<Record<string, BindingDraft>>({});
  const [provisionPlan, setProvisionPlan] = useState<PlanSlug>("starter");
  const [provisionDomain, setProvisionDomain] = useState("");
  const [provisionEmail, setProvisionEmail] = useState("");
  const [provisionStackUser, setProvisionStackUser] = useState("");
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

  async function loadAutomation(token = session?.access_token) {
    if (!token) return;
    setBusy(true);
    setError("");
    try {
      const [statusResponse, bindingsResponse] = await Promise.all([
        fetch("/api/admin/20i", { cache: "no-store", headers: apiHeaders(token) }),
        fetch("/api/admin/20i/bindings", { cache: "no-store", headers: apiHeaders(token) }),
      ]);
      const statusData = (await statusResponse.json()) as SetupStatus & { error?: string };
      const bindingData = (await bindingsResponse.json()) as BindingResponse;
      if (!statusResponse.ok) throw new Error(statusData.error || "Unable to read the 20i account.");
      if (!bindingsResponse.ok) throw new Error(bindingData.error || "Unable to read the plan bindings.");

      setStatus(statusData);
      const types = bindingData.packageTypes.length ? bindingData.packageTypes : statusData.packageTypes;
      setPackageTypes(types);
      setBindings(bindingData.bindings);
      setBindingDrafts(Object.fromEntries(bindingData.bindings.map((binding) => [binding.plan, {
        packageTypeRef: binding.packageTypeRef || "",
        checkoutUrl: binding.checkoutUrl || "",
      }])));

      const recommended = types.find((type) => /linux/i.test(`${type.name} ${type.platform}`) && !/wordpress/i.test(`${type.name} ${type.platform}`));
      setSelectedType((value) => value || recommended?.id || types[0]?.id || "");
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to read the 20i account.");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (admin && session?.access_token) void loadAutomation(session.access_token);
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
        headers: apiHeaders(session.access_token, true),
        body: JSON.stringify({ action: "ensure_brand_reference", packageTypeId: selectedType }),
      });
      const data = (await response.json()) as { ok?: boolean; message?: string; error?: string };
      if (!response.ok) throw new Error(data.error || "The HostMyWeb domain reference could not be created.");
      setMessage(data.message || "The HostMyWeb domain reference is ready.");
      await loadAutomation();
    } catch (setupError) {
      setError(setupError instanceof Error ? setupError.message : "The HostMyWeb domain reference could not be created.");
    } finally {
      setBusy(false);
    }
  }

  function updateBindingDraft(plan: PlanSlug, patch: Partial<BindingDraft>) {
    setBindingDrafts((current) => ({
      ...current,
      [plan]: { packageTypeRef: "", checkoutUrl: "", ...(current[plan] || {}), ...patch },
    }));
  }

  async function saveBinding(plan: PlanSlug) {
    if (!session?.access_token) return;
    const draft = bindingDrafts[plan] || { packageTypeRef: "", checkoutUrl: "" };
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/admin/20i/bindings", {
        method: "POST",
        headers: apiHeaders(session.access_token, true),
        body: JSON.stringify({
          plan,
          packageTypeRef: draft.packageTypeRef || null,
          checkoutUrl: draft.checkoutUrl || null,
          active: true,
        }),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok) throw new Error(data.error || `Unable to save the ${plan} plan binding.`);
      setMessage(`${plan[0].toUpperCase()}${plan.slice(1)} is now bound to its 20i package and checkout configuration.`);
      await loadAutomation();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save the plan binding.");
    } finally {
      setBusy(false);
    }
  }

  async function reconcileNow() {
    if (!session?.access_token) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/admin/20i/reconcile", {
        method: "POST",
        headers: apiHeaders(session.access_token),
      });
      const data = (await response.json()) as ReconcileResponse;
      if (!response.ok && response.status !== 207) throw new Error(data.error || "Unable to reconcile 20i services.");
      setMessage(`20i reconciliation complete: ${data.synchronized ?? 0} synchronized, ${data.awaitingCustomerAccount ?? 0} waiting for a matching HostMyWeb account, ${data.failed ?? 0} failed.`);
    } catch (syncError) {
      setError(syncError instanceof Error ? syncError.message : "Unable to reconcile 20i services.");
    } finally {
      setBusy(false);
    }
  }

  async function provisionService(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session?.access_token) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/admin/20i/provision", {
        method: "POST",
        headers: apiHeaders(session.access_token, true),
        body: JSON.stringify({
          plan: provisionPlan,
          domain: provisionDomain,
          customerEmail: provisionEmail,
          stackUser: provisionStackUser || undefined,
        }),
      });
      const data = (await response.json()) as ProvisionResponse;
      if (!response.ok) throw new Error(data.error || "Unable to provision hosting.");
      setMessage(`${data.created ? "Provisioned" : "Found existing"} ${data.planName || provisionPlan} hosting for ${data.domain || provisionDomain}. 20i package: ${data.packageId || "created"}.${data.warning ? ` Account sync warning: ${data.warning}` : ""}`);
      setProvisionDomain("");
      setProvisionEmail("");
      setProvisionStackUser("");
      await loadAutomation();
    } catch (provisionError) {
      setError(provisionError instanceof Error ? provisionError.message : "Unable to provision hosting.");
    } finally {
      setBusy(false);
    }
  }

  const chosenType = useMemo(() => packageTypes.find((type) => type.id === selectedType), [packageTypes, selectedType]);

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
          <div><span className={styles.kicker}>PRIVATE INFRASTRUCTURE CONSOLE</span><h1>20i hosting automation</h1><p>Bind the public HostMyWeb plans to their real 20i packages and HostShop products, reconcile provisioned services, and create hosting through the API when an administrator needs to.</p></div>
          <div className={styles.headerActions}><button onClick={() => void loadAutomation()} disabled={busy}>Refresh</button><a href="/account">Customer account</a></div>
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
            <span className={styles.step}>STEP 1 · WHITE LABEL REFERENCE</span>
            <h2>Make sure the HostMyWeb brand domain exists in 20i.</h2>
            <p>The existing brand-domain reference is kept separate from customer packages. This step only needs to be completed once.</p>
          </div>

          {status?.brandReferenceExists ? (
            <div className={styles.readyBox}><b>✓ hostmyweb.co is already present in 20i.</b><span>The white-label domain reference is ready.</span></div>
          ) : (
            <div className={styles.controls}>
              <label><span>20i package type for the domain reference</span><select value={selectedType} onChange={(event) => setSelectedType(event.target.value)} disabled={busy || !packageTypes.length}><option value="">Choose a package type</option>{packageTypes.map((type) => <option key={type.id} value={type.id}>{type.name} — {type.platform} ({type.id})</option>)}</select></label>
              {chosenType && <p className={styles.selection}>Selected: <b>{chosenType.name}</b> · {chosenType.platform}</p>}
              <button className={styles.primaryButton} onClick={ensureBrandReference} disabled={busy || !selectedType}>{busy ? "Working…" : "Create hostmyweb.co reference through 20i"}</button>
            </div>
          )}
        </section>

        <section className={styles.setupBlock}>
          <span className={styles.step}>STEP 2 · PLAN BINDINGS</span>
          <h2>Connect each public plan to the package 20i should actually provision.</h2>
          <p>These mappings live in HostMyWeb&apos;s database, so changing a package reference or HostShop checkout link does not require another code deployment.</p>
          <div className={styles.bindingGrid}>
            {PLAN_ORDER.map((plan) => {
              const binding = bindings.find((item) => item.plan === plan);
              const draft = bindingDrafts[plan] || { packageTypeRef: "", checkoutUrl: "" };
              return (
                <article className={styles.bindingCard} key={plan}>
                  <div className={styles.bindingHead}><div><small>{plan.toUpperCase()}</small><b>{binding?.planName || plan}</b></div><strong>${binding?.monthlyPrice?.toFixed(2) || "—"}/mo</strong></div>
                  <label><span>20i Hosting Package Type</span><select value={draft.packageTypeRef} onChange={(event) => updateBindingDraft(plan, { packageTypeRef: event.target.value })}><option value="">Not bound</option>{packageTypes.map((type) => <option key={type.id} value={type.id}>{type.name} — {type.platform} ({type.id})</option>)}</select></label>
                  <label><span>HostShop checkout URL</span><input value={draft.checkoutUrl} onChange={(event) => updateBindingDraft(plan, { checkoutUrl: event.target.value })} placeholder="https://cp.hostmyweb.co/domain-required?..." /></label>
                  <div className={styles.bindingState}><span>Package: <b>{draft.packageTypeRef ? "BOUND" : "NEEDS BINDING"}</b></span><span>Checkout: <b>{draft.checkoutUrl ? "READY" : "NOT CONFIGURED"}</b></span></div>
                  <button className={styles.primaryButton} type="button" onClick={() => void saveBinding(plan)} disabled={busy}>Save {binding?.planName || plan}</button>
                </article>
              );
            })}
          </div>
        </section>

        <section className={styles.setupBlock}>
          <span className={styles.step}>STEP 3 · WEBHOOK + RECONCILIATION</span>
          <h2>Keep HostShop provisioning and the HostMyWeb customer account synchronized.</h2>
          <p>Point 20i Webhook Notifications at the endpoint below using the private webhook secret. Each authenticated notification is logged once, then HostMyWeb pulls the current 20i package inventory and reconciles it against customer accounts by email.</p>
          <div className={styles.webhookBox}><small>WEBHOOK TARGET</small><code>https://hostmyweb.co/api/webhooks/20i?key=&lt;private-secret&gt;</code><span>The secret itself is not stored in this page or source control.</span></div>
          <div className={styles.automationActions}><button className={styles.primaryButton} type="button" onClick={() => void reconcileNow()} disabled={busy}>{busy ? "Working…" : "Reconcile 20i inventory now"}</button><span>Use this after changing package mappings or to backfill services created before the webhook was enabled.</span></div>
        </section>

        <section className={styles.setupBlock}>
          <span className={styles.step}>ADMIN TOOL · DIRECT PROVISIONING</span>
          <h2>Create a bound HostMyWeb plan through the 20i API.</h2>
          <p>This is an administrative provisioning tool, not the public payment path. Normal customer purchases still go through the plan&apos;s HostShop checkout so billing happens before provisioning.</p>
          <form className={styles.provisionForm} onSubmit={provisionService}>
            <label><span>HostMyWeb plan</span><select value={provisionPlan} onChange={(event) => setProvisionPlan(event.target.value as PlanSlug)}>{PLAN_ORDER.map((plan) => <option key={plan} value={plan}>{bindings.find((item) => item.plan === plan)?.planName || plan}</option>)}</select></label>
            <label><span>Domain</span><input value={provisionDomain} onChange={(event) => setProvisionDomain(event.target.value)} placeholder="example.com" required /></label>
            <label><span>Customer email</span><input type="email" value={provisionEmail} onChange={(event) => setProvisionEmail(event.target.value)} placeholder="owner@example.com" required /></label>
            <label><span>Existing 20i StackCP user ref (optional)</span><input value={provisionStackUser} onChange={(event) => setProvisionStackUser(event.target.value)} placeholder="stack-user reference" /></label>
            <button className={styles.primaryButton} disabled={busy}>{busy ? "Provisioning…" : "Provision hosting"}</button>
          </form>
        </section>

        <section className={styles.nextBlock}>
          <span className={styles.step}>ONE-TIME WHITE-LABEL SETTINGS</span>
          <h2>Finish the reseller-brand fields in My20i.</h2>
          <div className={styles.fieldGrid}><span><b>Brand Domain</b> hostmyweb.co</span><span><b>Control Panel</b> cp</span><span><b>FTP</b> ftp</span><span><b>phpMyAdmin</b> db</span><span><b>Web Builder</b> builder</span><span><b>Company</b> HostMyWeb</span></div>
          <p>Use HTTPS and block search-engine indexing for the control panel. These branding fields remain in My20i because the current public 20i API does not provide the write operation used by this integration.</p>
        </section>
      </section>
    </main>
  );
}
