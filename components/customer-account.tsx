"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "@/lib/supabase-public";
import styles from "./customer-account.module.css";

type Mode = "login" | "signup";
type AuthUser = {
  id: string;
  email?: string;
  user_metadata?: { full_name?: string; company?: string };
};
type Session = {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  expires_at?: number;
  user: AuthUser;
};
type Profile = {
  id: string;
  full_name: string | null;
  company: string | null;
  phone: string | null;
  billing_email: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state_region: string | null;
  postal_code: string | null;
  country: string | null;
  breeding_program_name: string | null;
  primary_breed: string | null;
  additional_breeds: string | null;
  registries: string | null;
  breeder_website: string | null;
  program_description: string | null;
  created_at?: string;
  updated_at?: string;
};
type Service = {
  id: string;
  service_type: string;
  plan_name: string | null;
  domain_name: string | null;
  status: string;
};
type Domain = {
  id: string;
  domain_name: string;
  registration_status: string;
  expires_at: string | null;
  auto_renew: boolean;
};
type Order = {
  id: string;
  order_type: string;
  status: string;
  amount: number;
  currency: string;
  provider_payment_id: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
};
type Subscription = {
  id: string;
  service_id: string | null;
  product_name: string;
  plan_name: string | null;
  status: string;
  amount: number;
  currency: string;
  billing_interval: string;
  current_period_start: string | null;
  current_period_end: string | null;
  next_billing_at: string | null;
  past_due_amount: number;
  provider_subscription_id: string | null;
  cancel_at_period_end: boolean;
  cancellation_requested_at: string | null;
  canceled_at: string | null;
  created_at: string;
};
type Invoice = {
  id: string;
  invoice_number: string;
  subscription_id: string | null;
  status: string;
  amount_due: number;
  amount_paid: number;
  currency: string;
  due_at: string | null;
  paid_at: string | null;
  period_start: string | null;
  period_end: string | null;
  hosted_invoice_url: string | null;
  receipt_url: string | null;
  created_at: string;
};
type Ticket = {
  id: string;
  category: string;
  subject: string;
  status: string;
  priority: string;
  created_at: string;
};

const STORAGE_KEY = "hostmyweb_session";
const ACTIVE_SUBSCRIPTION_STATUSES = new Set(["trialing", "active", "past_due", "cancel_pending"]);

function normalizeSession(payload: Session): Session {
  return {
    ...payload,
    expires_at:
      payload.expires_at ||
      (payload.expires_in ? Date.now() + payload.expires_in * 1000 : undefined),
  };
}

function saveSession(session: Session) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeSession(session)));
}

function readSession(): Session | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value ? (JSON.parse(value) as Session) : null;
  } catch {
    return null;
  }
}

async function refreshSession(session: Session): Promise<Session | null> {
  if (!session.refresh_token) return session;
  if (!session.expires_at || session.expires_at > Date.now() + 60_000) return session;

  const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_PUBLISHABLE_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh_token: session.refresh_token }),
  });

  if (!response.ok) return null;
  const refreshed = normalizeSession((await response.json()) as Session);
  saveSession(refreshed);
  return refreshed;
}

async function rest<T>(path: string, session: Session, init?: RequestInit): Promise<T> {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: SUPABASE_PUBLISHABLE_KEY,
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    const detail =
      payload && typeof payload === "object" && "message" in payload
        ? String(payload.message)
        : "We could not complete that account request right now.";
    throw new Error(detail);
  }

  if (response.status === 204) return undefined as T;
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

function money(amount: number | string | null | undefined, currency = "USD") {
  const numeric = Number(amount || 0);
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(numeric);
  } catch {
    return `$${numeric.toFixed(2)}`;
  }
}

function shortDate(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function titleCase(value: string | null | undefined) {
  return (value || "")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function statusClass(status: string) {
  if (["active", "paid", "completed", "resolved"].includes(status)) return styles.statusGood;
  if (["past_due", "failed", "suspended", "urgent"].includes(status)) return styles.statusDanger;
  if (["trialing", "pending", "provisioning", "open", "cancel_pending"].includes(status)) {
    return styles.statusWarn;
  }
  return styles.statusNeutral;
}

function emptyProfile(userId: string, user?: AuthUser): Profile {
  return {
    id: userId,
    full_name: user?.user_metadata?.full_name || null,
    company: user?.user_metadata?.company || null,
    phone: null,
    billing_email: user?.email || null,
    address_line1: null,
    address_line2: null,
    city: null,
    state_region: null,
    postal_code: null,
    country: "United States",
    breeding_program_name: user?.user_metadata?.company || null,
    primary_breed: null,
    additional_breeds: null,
    registries: null,
    breeder_website: null,
    program_description: null,
  };
}

export function CustomerAccount({ initialMode = "login" }: { initialMode?: Mode }) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [accountLoading, setAccountLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [accountError, setAccountError] = useState("");
  const [profileMessage, setProfileMessage] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [cancellationMessage, setCancellationMessage] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [cancelingSubscriptionId, setCancelingSubscriptionId] = useState<string | null>(null);

  const selection = useMemo(() => {
    if (typeof window === "undefined") return "";
    const params = new URLSearchParams(window.location.search);
    const plan = params.get("plan");
    const domain = params.get("domain");
    const product = params.get("product");
    if (domain) return `Domain: ${domain}`;
    if (plan) return `Hosting plan: ${titleCase(plan)}`;
    if (product) return `Product: ${titleCase(product)}`;
    return "";
  }, []);

  useEffect(() => {
    void (async () => {
      const stored = readSession();
      if (!stored) {
        setLoading(false);
        return;
      }
      const current = await refreshSession(stored);
      if (!current) {
        localStorage.removeItem(STORAGE_KEY);
        setLoading(false);
        return;
      }
      setSession(current);
      setLoading(false);
    })();
  }, []);

  async function loadAccount(current: Session) {
    setAccountLoading(true);
    setAccountError("");
    try {
      const [profileRows, serviceRows, domainRows, orderRows, subscriptionRows, invoiceRows, ticketRows] =
        await Promise.all([
          rest<Profile[]>("hostmyweb_profiles?select=*&limit=1", current),
          rest<Service[]>(
            "hostmyweb_services?select=id,service_type,plan_name,domain_name,status&order=created_at.desc",
            current,
          ),
          rest<Domain[]>(
            "hostmyweb_domains?select=id,domain_name,registration_status,expires_at,auto_renew&order=created_at.desc",
            current,
          ),
          rest<Order[]>(
            "hostmyweb_orders?select=id,order_type,status,amount,currency,provider_payment_id,details,created_at&order=created_at.desc",
            current,
          ),
          rest<Subscription[]>(
            "hostmyweb_subscriptions?select=id,service_id,product_name,plan_name,status,amount,currency,billing_interval,current_period_start,current_period_end,next_billing_at,past_due_amount,provider_subscription_id,cancel_at_period_end,cancellation_requested_at,canceled_at,created_at&order=created_at.desc",
            current,
          ),
          rest<Invoice[]>(
            "hostmyweb_invoices?select=id,invoice_number,subscription_id,status,amount_due,amount_paid,currency,due_at,paid_at,period_start,period_end,hosted_invoice_url,receipt_url,created_at&order=created_at.desc",
            current,
          ),
          rest<Ticket[]>(
            "hostmyweb_support_tickets?select=id,category,subject,status,priority,created_at&order=created_at.desc",
            current,
          ),
        ]);

      setProfile(profileRows[0] || emptyProfile(current.user.id, current.user));
      setServices(serviceRows);
      setDomains(domainRows);
      setOrders(orderRows);
      setSubscriptions(subscriptionRows);
      setInvoices(invoiceRows);
      setTickets(ticketRows);
    } catch (error) {
      setAccountError(
        error instanceof Error ? error.message : "We could not load your account right now.",
      );
    } finally {
      setAccountLoading(false);
    }
  }

  useEffect(() => {
    if (!session) return;
    void loadAccount(session);
  }, [session]);

  const activeSubscriptions = useMemo(
    () => subscriptions.filter((item) => ACTIVE_SUBSCRIPTION_STATUSES.has(item.status)),
    [subscriptions],
  );

  const monthlyCommitment = useMemo(
    () =>
      activeSubscriptions
        .filter((item) => item.billing_interval === "monthly")
        .reduce((total, item) => total + Number(item.amount || 0), 0),
    [activeSubscriptions],
  );

  const pastDue = useMemo(() => {
    const invoiceBalance = invoices
      .filter((item) => item.status === "past_due")
      .reduce(
        (total, item) => total + Math.max(0, Number(item.amount_due) - Number(item.amount_paid)),
        0,
      );
    if (invoiceBalance > 0) return invoiceBalance;
    return subscriptions.reduce((total, item) => total + Number(item.past_due_amount || 0), 0);
  }, [invoices, subscriptions]);

  const nextBillingDate = useMemo(() => {
    return activeSubscriptions
      .map((item) => item.next_billing_at)
      .filter((value): value is string => Boolean(value))
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())[0];
  }, [activeSubscriptions]);

  async function authenticate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") || "").trim();
    const password = String(data.get("password") || "");
    const fullName = String(data.get("full_name") || "").trim();
    const company = String(data.get("company") || "").trim();
    setAuthMessage("");

    try {
      if (mode === "signup") {
        const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
          method: "POST",
          headers: {
            apikey: SUPABASE_PUBLISHABLE_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password, data: { full_name: fullName, company } }),
        });
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload.msg || payload.message || "We could not create your account.");
        }
        if (payload.access_token) {
          const nextSession = normalizeSession(payload as Session);
          saveSession(nextSession);
          setSession(nextSession);
          return;
        }
        setAuthMessage(
          "Your account was created. Check your email for the confirmation link, then return here to sign in.",
        );
        setMode("login");
        return;
      }

      const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_PUBLISHABLE_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(
          payload.error_description || payload.msg || payload.message || "Email or password was not accepted.",
        );
      }
      const nextSession = normalizeSession(payload as Session);
      saveSession(nextSession);
      setSession(nextSession);
    } catch (error) {
      setAuthMessage(error instanceof Error ? error.message : "We could not complete that request.");
    }
  }

  function setProfileField(field: keyof Profile, value: string) {
    setProfile((current) => (current ? { ...current, [field]: value || null } : current));
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session || !profile) return;
    setSavingProfile(true);
    setProfileMessage("");

    try {
      const payload = {
        ...profile,
        id: session.user.id,
        updated_at: new Date().toISOString(),
      };
      const rows = await rest<Profile[]>("hostmyweb_profiles?on_conflict=id", session, {
        method: "POST",
        headers: { Prefer: "resolution=merge-duplicates,return=representation" },
        body: JSON.stringify(payload),
      });

      const metadataResponse = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        method: "PUT",
        headers: {
          apikey: SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            full_name: payload.full_name,
            company: payload.company,
          },
        }),
      }).catch(() => null);

      if (metadataResponse?.ok) {
        const updatedUser = (await metadataResponse.json()) as AuthUser;
        const nextSession = { ...session, user: updatedUser };
        saveSession(nextSession);
        setSession(nextSession);
      }

      setProfile(rows[0] || payload);
      setProfileMessage("Your account and breeding program information has been updated.");
    } catch (error) {
      setProfileMessage(error instanceof Error ? error.message : "We could not save your changes.");
    } finally {
      setSavingProfile(false);
    }
  }

  async function cancelSubscription(subscription: Subscription) {
    if (!session) return;
    const label = subscription.plan_name || subscription.product_name;
    const confirmed = window.confirm(
      `Cancel ${label}? This will submit a cancellation for this subscription and preserve your billing history.`,
    );
    if (!confirmed) return;

    setCancellationMessage("");
    setCancelingSubscriptionId(subscription.id);
    try {
      await rest<{ subscription_id: string; status: string }>(
        "rpc/request_hostmyweb_subscription_cancellation",
        session,
        {
          method: "POST",
          body: JSON.stringify({ p_subscription_id: subscription.id }),
        },
      );
      setCancellationMessage(
        `${label} is now marked for cancellation. Its status and billing history remain visible here.`,
      );
      await loadAccount(session);
    } catch (error) {
      setCancellationMessage(
        error instanceof Error ? error.message : "We could not submit that cancellation.",
      );
    } finally {
      setCancelingSubscriptionId(null);
    }
  }

  async function createTicket(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    setTicketMessage("");

    try {
      await rest<void>("hostmyweb_support_tickets", session, {
        method: "POST",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({
          user_id: session.user.id,
          category: String(data.get("category") || "other"),
          subject: String(data.get("subject") || "").trim(),
          message: String(data.get("message") || "").trim(),
          priority: "normal",
        }),
      });
      form.reset();
      setTicketMessage("Your support request has been submitted.");
      const ticketRows = await rest<Ticket[]>(
        "hostmyweb_support_tickets?select=id,category,subject,status,priority,created_at&order=created_at.desc",
        session,
      );
      setTickets(ticketRows);
    } catch (error) {
      setTicketMessage(error instanceof Error ? error.message : "We could not submit that request.");
    }
  }

  async function signOut() {
    if (session) {
      await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${session.access_token}`,
        },
      }).catch(() => undefined);
    }
    localStorage.removeItem(STORAGE_KEY);
    setSession(null);
    setProfile(null);
    setServices([]);
    setDomains([]);
    setOrders([]);
    setSubscriptions([]);
    setInvoices([]);
    setTickets([]);
  }

  if (loading) {
    return (
      <div className={styles.loadingScreen}>
        <span className={styles.loadingMark} aria-hidden="true" />
        <p>Loading your HostMyWeb account…</p>
      </div>
    );
  }

  if (!session) {
    return (
      <main className={styles.authShell}>
        <div className={styles.authBackdrop} />
        <a className={styles.brand} href="/" aria-label="HostMyWeb home">
          <span className={styles.brandMark} aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>HostMyWeb</span>
        </a>
        <section className={styles.authCard}>
          <div className={styles.authIntro}>
            <span className={styles.eyebrow}>HOSTMYWEB ACCOUNT</span>
            <h1>{mode === "signup" ? "Create your account." : "Welcome back."}</h1>
            <p>
              {mode === "signup"
                ? "Your account is the control center for hosting, domains, billing, subscriptions, business details, and support."
                : "Sign in to manage your complete HostMyWeb account."}
            </p>
            {selection && <div className={styles.selectionChip}>{selection}</div>}
          </div>
          <div className={styles.authTabs}>
            <button
              type="button"
              className={mode === "login" ? styles.activeTab : ""}
              onClick={() => {
                setMode("login");
                setAuthMessage("");
              }}
            >
              Log In
            </button>
            <button
              type="button"
              className={mode === "signup" ? styles.activeTab : ""}
              onClick={() => {
                setMode("signup");
                setAuthMessage("");
              }}
            >
              Create Account
            </button>
          </div>
          <form className={styles.authForm} onSubmit={authenticate}>
            {mode === "signup" && (
              <div className={styles.twoColumnForm}>
                <label>
                  <span>Your name</span>
                  <input name="full_name" autoComplete="name" required />
                </label>
                <label>
                  <span>Business / brand</span>
                  <input name="company" autoComplete="organization" />
                </label>
              </div>
            )}
            <label>
              <span>Email</span>
              <input name="email" type="email" autoComplete="email" required />
            </label>
            <label>
              <span>Password</span>
              <input
                name="password"
                type="password"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                minLength={8}
                required
              />
            </label>
            <button className={styles.primaryButton} type="submit">
              {mode === "signup" ? "Create account" : "Log in"}
            </button>
            {authMessage && (
              <p className={styles.formMessage} role="status">
                {authMessage}
              </p>
            )}
          </form>
          {mode === "login" && (
            <a className={styles.recoveryLink} href="/recover">
              Forgot your password?
            </a>
          )}
          <a className={styles.backHome} href="/">
            ← Back to HostMyWeb
          </a>
        </section>
      </main>
    );
  }

  const displayName = profile?.full_name || session.user.user_metadata?.full_name || session.user.email || "Customer";
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <main className={styles.dashboardShell}>
      <aside className={styles.sidebar}>
        <a className={styles.brand} href="/" aria-label="HostMyWeb home">
          <span className={styles.brandMark} aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>HostMyWeb</span>
        </a>

        <div className={styles.accountIdentity}>
          <span className={styles.avatar}>{initials || "HW"}</span>
          <div>
            <strong>{displayName}</strong>
            <span>{profile?.company || "Customer account"}</span>
          </div>
        </div>

        <nav className={styles.nav} aria-label="Account navigation">
          <a href="#overview"><span>⌂</span> Overview</a>
          <a href="#profile"><span>◎</span> Account information</a>
          <a href="#breeding-program"><span>◇</span> Breeding program</a>
          <a href="#subscriptions"><span>↻</span> Subscriptions</a>
          <a href="#billing"><span>▤</span> Billing &amp; receipts</a>
          <a href="#domains"><span>◉</span> Domains</a>
          <a href="#support"><span>?</span> Support</a>
        </nav>

        <div className={styles.sidebarFooter}>
          <a href="/#pricing">+ Add a service</a>
          <button type="button" onClick={signOut}>Sign out</button>
        </div>
      </aside>

      <section className={styles.mainColumn} id="overview">
        <header className={styles.topbar}>
          <div>
            <span className={styles.eyebrow}>CUSTOMER ACCOUNT</span>
            <h1>Good to see you, {displayName.split(" ")[0]}.</h1>
            <p>Everything connected to your HostMyWeb account, in one place.</p>
          </div>
          <div className={styles.topbarActions}>
            {accountLoading && <span className={styles.syncing}>Refreshing…</span>}
            <a className={styles.secondaryButton} href="/#pricing">Add service</a>
          </div>
        </header>

        {accountError && <div className={styles.alertDanger}>{accountError}</div>}
        {cancellationMessage && <div className={styles.alertInfo}>{cancellationMessage}</div>}

        <div className={styles.statGrid}>
          <article className={styles.statCard}>
            <span className={styles.statIcon}>↻</span>
            <div><small>ACTIVE SUBSCRIPTIONS</small><strong>{activeSubscriptions.length}</strong></div>
            <em>{subscriptions.length ? `${subscriptions.length} total` : "No subscriptions yet"}</em>
          </article>
          <article className={styles.statCard}>
            <span className={styles.statIcon}>$</span>
            <div><small>MONTHLY SERVICES</small><strong>{money(monthlyCommitment)}</strong></div>
            <em>Current monthly commitment</em>
          </article>
          <article className={`${styles.statCard} ${pastDue > 0 ? styles.pastDueStat : ""}`}>
            <span className={styles.statIcon}>!</span>
            <div><small>PAST DUE</small><strong>{money(pastDue)}</strong></div>
            <em>{pastDue > 0 ? "Action may be required" : "Account is current"}</em>
          </article>
          <article className={styles.statCard}>
            <span className={styles.statIcon}>▣</span>
            <div><small>NEXT BILLING</small><strong className={styles.dateStat}>{shortDate(nextBillingDate)}</strong></div>
            <em>{nextBillingDate ? "Earliest upcoming charge" : "Nothing scheduled"}</em>
          </article>
        </div>

        <section className={styles.panel} id="profile">
          <div className={styles.panelHeader}>
            <div>
              <span className={styles.eyebrow}>PROFILE</span>
              <h2>Account information</h2>
              <p>Keep your owner, business, billing, and contact information current.</p>
            </div>
            <span className={styles.secureBadge}>Private account details</span>
          </div>

          {profile && (
            <form className={styles.profileForm} onSubmit={saveProfile}>
              <div className={styles.formSection}>
                <div className={styles.formSectionHeading}>
                  <span className={styles.sectionNumber}>01</span>
                  <div><h3>Owner &amp; business</h3><p>The primary identity connected to this account.</p></div>
                </div>
                <div className={styles.formGrid}>
                  <label><span>Full name</span><input value={profile.full_name || ""} onChange={(e) => setProfileField("full_name", e.target.value)} autoComplete="name" /></label>
                  <label><span>Business / company</span><input value={profile.company || ""} onChange={(e) => setProfileField("company", e.target.value)} autoComplete="organization" /></label>
                  <label><span>Account email</span><input value={session.user.email || ""} readOnly className={styles.readOnlyInput} /></label>
                  <label><span>Phone</span><input value={profile.phone || ""} onChange={(e) => setProfileField("phone", e.target.value)} autoComplete="tel" /></label>
                  <label className={styles.fullField}><span>Billing email</span><input type="email" value={profile.billing_email || ""} onChange={(e) => setProfileField("billing_email", e.target.value)} autoComplete="email" /></label>
                </div>
              </div>

              <div className={styles.formSection}>
                <div className={styles.formSectionHeading}>
                  <span className={styles.sectionNumber}>02</span>
                  <div><h3>Billing address</h3><p>Used for invoices, account records, and billing correspondence.</p></div>
                </div>
                <div className={styles.formGrid}>
                  <label className={styles.fullField}><span>Address</span><input value={profile.address_line1 || ""} onChange={(e) => setProfileField("address_line1", e.target.value)} autoComplete="address-line1" /></label>
                  <label className={styles.fullField}><span>Address line 2</span><input value={profile.address_line2 || ""} onChange={(e) => setProfileField("address_line2", e.target.value)} autoComplete="address-line2" /></label>
                  <label><span>City</span><input value={profile.city || ""} onChange={(e) => setProfileField("city", e.target.value)} autoComplete="address-level2" /></label>
                  <label><span>State / region</span><input value={profile.state_region || ""} onChange={(e) => setProfileField("state_region", e.target.value)} autoComplete="address-level1" /></label>
                  <label><span>ZIP / postal code</span><input value={profile.postal_code || ""} onChange={(e) => setProfileField("postal_code", e.target.value)} autoComplete="postal-code" /></label>
                  <label><span>Country</span><input value={profile.country || ""} onChange={(e) => setProfileField("country", e.target.value)} autoComplete="country-name" /></label>
                </div>
              </div>

              <div className={styles.formSection} id="breeding-program">
                <div className={styles.formSectionHeading}>
                  <span className={styles.sectionNumber}>03</span>
                  <div><h3>Breeding program</h3><p>Maintain the breeder-facing information associated with your hosted services.</p></div>
                </div>
                <div className={styles.formGrid}>
                  <label><span>Breeding program / kennel name</span><input value={profile.breeding_program_name || ""} onChange={(e) => setProfileField("breeding_program_name", e.target.value)} /></label>
                  <label><span>Primary breed</span><input value={profile.primary_breed || ""} onChange={(e) => setProfileField("primary_breed", e.target.value)} /></label>
                  <label><span>Additional breeds</span><input value={profile.additional_breeds || ""} onChange={(e) => setProfileField("additional_breeds", e.target.value)} placeholder="Separate with commas" /></label>
                  <label><span>Registries</span><input value={profile.registries || ""} onChange={(e) => setProfileField("registries", e.target.value)} placeholder="AKC, CKC, ACA, etc." /></label>
                  <label className={styles.fullField}><span>Breeder website</span><input type="url" value={profile.breeder_website || ""} onChange={(e) => setProfileField("breeder_website", e.target.value)} placeholder="https://" /></label>
                  <label className={styles.fullField}><span>Program description</span><textarea rows={5} value={profile.program_description || ""} onChange={(e) => setProfileField("program_description", e.target.value)} placeholder="Tell us how your breeding program should be represented across your hosted services." /></label>
                </div>
              </div>

              <div className={styles.formActions}>
                <div>{profileMessage && <p className={styles.formMessage}>{profileMessage}</p>}</div>
                <button className={styles.primaryButton} type="submit" disabled={savingProfile}>{savingProfile ? "Saving…" : "Save account changes"}</button>
              </div>
            </form>
          )}
        </section>

        <section className={styles.panel} id="subscriptions">
          <div className={styles.panelHeader}>
            <div><span className={styles.eyebrow}>SUBSCRIPTIONS</span><h2>Your plans &amp; recurring services</h2><p>See status, renewal timing, amount, and cancellation controls for each subscription.</p></div>
            <a className={styles.textLink} href="/#pricing">Add another service →</a>
          </div>

          {subscriptions.length ? (
            <div className={styles.subscriptionGrid}>
              {subscriptions.map((item) => {
                const canCancel = !["canceled", "ended"].includes(item.status) && !item.cancel_at_period_end && item.status !== "cancel_pending";
                return (
                  <article className={styles.subscriptionCard} key={item.id}>
                    <div className={styles.subscriptionTopline}>
                      <div><small>{titleCase(item.product_name)}</small><h3>{item.plan_name || item.product_name}</h3></div>
                      <span className={`${styles.statusPill} ${statusClass(item.status)}`}>{titleCase(item.status)}</span>
                    </div>
                    <div className={styles.subscriptionPrice}><strong>{money(item.amount, item.currency)}</strong><span>{item.billing_interval === "monthly" ? "/ month" : item.billing_interval === "yearly" ? "/ year" : titleCase(item.billing_interval)}</span></div>
                    <dl className={styles.subscriptionMeta}>
                      <div><dt>Current period</dt><dd>{item.current_period_start || item.current_period_end ? `${shortDate(item.current_period_start)} – ${shortDate(item.current_period_end)}` : "—"}</dd></div>
                      <div><dt>Next billing</dt><dd>{shortDate(item.next_billing_at)}</dd></div>
                      <div><dt>Past due</dt><dd className={Number(item.past_due_amount) > 0 ? styles.dangerText : ""}>{money(item.past_due_amount, item.currency)}</dd></div>
                      <div><dt>Subscription ID</dt><dd className={styles.mono}>{item.provider_subscription_id || item.id.slice(0, 8)}</dd></div>
                    </dl>
                    {(item.cancel_at_period_end || item.status === "cancel_pending") && <div className={styles.cancelNotice}>Cancellation requested{item.current_period_end ? ` · Access currently scheduled through ${shortDate(item.current_period_end)}` : ""}.</div>}
                    {item.canceled_at && <div className={styles.cancelNotice}>Canceled {shortDate(item.canceled_at)}.</div>}
                    <div className={styles.subscriptionActions}>
                      {canCancel ? <button type="button" className={styles.cancelButton} onClick={() => cancelSubscription(item)} disabled={cancelingSubscriptionId === item.id}>{cancelingSubscriptionId === item.id ? "Submitting…" : "Cancel subscription"}</button> : <span className={styles.mutedAction}>{item.status === "canceled" ? "Subscription canceled" : "Cancellation on file"}</span>}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className={styles.emptyState}><span>↻</span><div><strong>No recurring subscriptions are attached yet.</strong><p>New HostMyWeb subscriptions will appear here with renewal and cancellation controls.</p></div><a href="/#pricing">Browse services</a></div>
          )}
        </section>

        <section className={styles.panel} id="billing">
          <div className={styles.panelHeader}>
            <div><span className={styles.eyebrow}>BILLING</span><h2>Invoices, receipts &amp; balances</h2><p>A permanent account history of what was billed, what was paid, and what is outstanding.</p></div>
            <div className={styles.balanceBadge}><span>PAST DUE</span><strong>{money(pastDue)}</strong></div>
          </div>

          <div className={styles.billingSplit}>
            <div>
              <div className={styles.subheading}><h3>Invoices</h3><span>{invoices.length} total</span></div>
              {invoices.length ? (
                <div className={styles.tableWrap}>
                  <table className={styles.dataTable}>
                    <thead><tr><th>Invoice</th><th>Date / due</th><th>Amount</th><th>Status</th><th /></tr></thead>
                    <tbody>
                      {invoices.map((invoice) => {
                        const balance = Math.max(0, Number(invoice.amount_due) - Number(invoice.amount_paid));
                        return (
                          <tr key={invoice.id}>
                            <td><strong>{invoice.invoice_number}</strong><span>{invoice.period_start || invoice.period_end ? `${shortDate(invoice.period_start)} – ${shortDate(invoice.period_end)}` : "HostMyWeb billing"}</span></td>
                            <td><strong>{shortDate(invoice.created_at)}</strong><span>{invoice.due_at ? `Due ${shortDate(invoice.due_at)}` : invoice.paid_at ? `Paid ${shortDate(invoice.paid_at)}` : ""}</span></td>
                            <td><strong>{money(invoice.amount_due, invoice.currency)}</strong>{balance > 0 && <span className={styles.dangerText}>{money(balance, invoice.currency)} outstanding</span>}</td>
                            <td><span className={`${styles.statusPill} ${statusClass(invoice.status)}`}>{titleCase(invoice.status)}</span></td>
                            <td className={styles.tableActionCell}>{invoice.hosted_invoice_url ? <a href={invoice.hosted_invoice_url} target="_blank" rel="noreferrer">View</a> : invoice.receipt_url ? <a href={invoice.receipt_url} target="_blank" rel="noreferrer">Receipt</a> : <span>—</span>}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : <div className={styles.compactEmpty}>No invoices have been issued yet.</div>}
            </div>

            <div>
              <div className={styles.subheading}><h3>Receipts &amp; payment history</h3><span>{orders.length} entries</span></div>
              {orders.length ? (
                <div className={styles.receiptList}>
                  {orders.map((order) => (
                    <article key={order.id}>
                      <span className={styles.receiptIcon}>{["paid", "completed"].includes(order.status) ? "✓" : "•"}</span>
                      <div><strong>{titleCase(order.order_type)}</strong><span>{shortDate(order.created_at)}{order.provider_payment_id ? ` · ${order.provider_payment_id}` : ""}</span></div>
                      <div className={styles.receiptAmount}><strong>{money(order.amount, order.currency)}</strong><span className={`${styles.statusPill} ${statusClass(order.status)}`}>{titleCase(order.status)}</span></div>
                    </article>
                  ))}
                </div>
              ) : <div className={styles.compactEmpty}>No payment history is available yet.</div>}
            </div>
          </div>
        </section>

        <section className={styles.panel} id="services">
          <div className={styles.panelHeader}>
            <div><span className={styles.eyebrow}>SERVICES</span><h2>Hosting &amp; products</h2><p>Everything HostMyWeb is currently provisioning or managing for you.</p></div>
            <a className={styles.textLink} href="/#pricing">Shop hosting →</a>
          </div>
          {services.length ? <div className={styles.serviceList}>{services.map((item) => <article key={item.id}><span className={styles.serviceIcon}>H</span><div><strong>{item.plan_name || titleCase(item.service_type)}</strong><span>{item.domain_name || "HostMyWeb service"}</span></div><span className={`${styles.statusPill} ${statusClass(item.status)}`}>{titleCase(item.status)}</span></article>)}</div> : <div className={styles.emptyState}><span>H</span><div><strong>No services yet.</strong><p>Hosting, email, and managed services will appear here automatically.</p></div><a href="/#pricing">Browse hosting plans</a></div>}
        </section>

        <section className={styles.panel} id="domains">
          <div className={styles.panelHeader}>
            <div><span className={styles.eyebrow}>DOMAINS</span><h2>Your domain portfolio</h2><p>Registration status, renewal preference, and expiration timing at a glance.</p></div>
            <a className={styles.textLink} href="/#domains">Search domains →</a>
          </div>
          {domains.length ? <div className={styles.domainGrid}>{domains.map((item) => <article key={item.id}><div className={styles.domainName}><span>●</span><strong>{item.domain_name}</strong></div><dl><div><dt>Status</dt><dd><span className={`${styles.statusPill} ${statusClass(item.registration_status)}`}>{titleCase(item.registration_status)}</span></dd></div><div><dt>Expiration</dt><dd>{shortDate(item.expires_at)}</dd></div><div><dt>Auto-renew</dt><dd>{item.auto_renew ? "On" : "Off"}</dd></div></dl></article>)}</div> : <div className={styles.emptyState}><span>◉</span><div><strong>No domains in this account yet.</strong><p>Registered and transferred domains will be listed here.</p></div><a href="/#domains">Search domains</a></div>}
        </section>

        <section className={`${styles.panel} ${styles.supportPanel}`} id="support">
          <div className={styles.panelHeader}>
            <div><span className={styles.eyebrow}>SUPPORT</span><h2>Account support</h2><p>Send a request and keep the conversation tied to your account.</p></div>
            <span className={styles.secureBadge}>{tickets.filter((item) => !["resolved", "closed"].includes(item.status)).length} open tickets</span>
          </div>
          <div className={styles.supportGrid}>
            <form className={styles.supportForm} onSubmit={createTicket}>
              <div className={styles.twoColumnForm}>
                <label><span>Category</span><select name="category" defaultValue="hosting"><option value="hosting">Hosting</option><option value="domain">Domain</option><option value="dns">DNS</option><option value="email">Email</option><option value="billing">Billing</option><option value="migration">Migration</option><option value="account">Account</option><option value="other">Other</option></select></label>
                <label><span>Subject</span><input name="subject" required maxLength={160} /></label>
              </div>
              <label><span>What do you need help with?</span><textarea name="message" rows={6} required maxLength={3000} /></label>
              <div className={styles.supportSubmit}><div>{ticketMessage && <p className={styles.formMessage}>{ticketMessage}</p>}</div><button className={styles.primaryButton} type="submit">Submit support ticket</button></div>
            </form>
            <div className={styles.recentTickets}>
              <div className={styles.subheading}><h3>Recent tickets</h3><span>{tickets.length} total</span></div>
              {tickets.length ? tickets.slice(0, 8).map((ticket) => <article key={ticket.id}><div><strong>{ticket.subject}</strong><span>{titleCase(ticket.category)} · {shortDate(ticket.created_at)}</span></div><span className={`${styles.statusPill} ${statusClass(ticket.status)}`}>{titleCase(ticket.status)}</span></article>) : <div className={styles.compactEmpty}>No support tickets yet.</div>}
            </div>
          </div>
        </section>

        <footer className={styles.accountFooter}>
          <span>HostMyWeb account center</span>
          <a href="/">Return to HostMyWeb.co</a>
        </footer>
      </section>
    </main>
  );
}
