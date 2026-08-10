"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "@/lib/supabase-public";

type Mode = "login" | "signup";
type AuthUser = { id: string; email?: string; user_metadata?: { full_name?: string; company?: string } };
type Session = { access_token: string; refresh_token?: string; expires_in?: number; expires_at?: number; user: AuthUser };
type Service = { id: string; service_type: string; plan_name: string | null; domain_name: string | null; status: string };
type Domain = { id: string; domain_name: string; registration_status: string; expires_at: string | null; auto_renew: boolean };
type Order = { id: string; order_type: string; status: string; amount: number; currency: string; created_at: string };
type Ticket = { id: string; category: string; subject: string; status: string; priority: string; created_at: string };

const STORAGE_KEY = "hostmyweb_session";

function normalizeSession(payload: Session): Session {
  return { ...payload, expires_at: payload.expires_at || (payload.expires_in ? Date.now() + payload.expires_in * 1000 : undefined) };
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
    headers: { apikey: SUPABASE_PUBLISHABLE_KEY, "Content-Type": "application/json" },
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
  if (!response.ok) throw new Error("We could not load your account right now.");
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export function CustomerAccount({ initialMode = "login" }: { initialMode?: Mode }) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authMessage, setAuthMessage] = useState("");
  const [services, setServices] = useState<Service[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [accountError, setAccountError] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");

  const selection = useMemo(() => {
    if (typeof window === "undefined") return "";
    const params = new URLSearchParams(window.location.search);
    const plan = params.get("plan");
    const domain = params.get("domain");
    const product = params.get("product");
    if (domain) return `Domain: ${domain}`;
    if (plan) return `Hosting plan: ${plan.charAt(0).toUpperCase()}${plan.slice(1)}`;
    if (product) return `Product: ${product.charAt(0).toUpperCase()}${product.slice(1)}`;
    return "";
  }, []);

  useEffect(() => {
    (async () => {
      const stored = readSession();
      if (!stored) { setLoading(false); return; }
      const current = await refreshSession(stored);
      if (!current) { localStorage.removeItem(STORAGE_KEY); setLoading(false); return; }
      setSession(current);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!session) return;
    (async () => {
      try {
        setAccountError("");
        const [serviceRows, domainRows, orderRows, ticketRows] = await Promise.all([
          rest<Service[]>("hostmyweb_services?select=id,service_type,plan_name,domain_name,status&order=created_at.desc", session),
          rest<Domain[]>("hostmyweb_domains?select=id,domain_name,registration_status,expires_at,auto_renew&order=created_at.desc", session),
          rest<Order[]>("hostmyweb_orders?select=id,order_type,status,amount,currency,created_at&order=created_at.desc", session),
          rest<Ticket[]>("hostmyweb_support_tickets?select=id,category,subject,status,priority,created_at&order=created_at.desc", session),
        ]);
        setServices(serviceRows);
        setDomains(domainRows);
        setOrders(orderRows);
        setTickets(ticketRows);
      } catch (error) {
        setAccountError(error instanceof Error ? error.message : "We could not load your account right now.");
      }
    })();
  }, [session]);

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
          headers: { apikey: SUPABASE_PUBLISHABLE_KEY, "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, data: { full_name: fullName, company } }),
        });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.msg || payload.message || "We could not create your account.");
        if (payload.access_token) {
          const nextSession = normalizeSession(payload as Session);
          saveSession(nextSession);
          setSession(nextSession);
          return;
        }
        setAuthMessage("Your account was created. Check your email for the confirmation link, then return here to sign in.");
        setMode("login");
        return;
      }

      const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: "POST",
        headers: { apikey: SUPABASE_PUBLISHABLE_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error_description || payload.msg || payload.message || "Email or password was not accepted.");
      const nextSession = normalizeSession(payload as Session);
      saveSession(nextSession);
      setSession(nextSession);
    } catch (error) {
      setAuthMessage(error instanceof Error ? error.message : "We could not complete that request.");
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
      const ticketRows = await rest<Ticket[]>("hostmyweb_support_tickets?select=id,category,subject,status,priority,created_at&order=created_at.desc", session);
      setTickets(ticketRows);
    } catch (error) {
      setTicketMessage(error instanceof Error ? error.message : "We could not submit that request.");
    }
  }

  async function signOut() {
    if (session) {
      await fetch(`${SUPABASE_URL}/auth/v1/logout`, { method: "POST", headers: { apikey: SUPABASE_PUBLISHABLE_KEY, Authorization: `Bearer ${session.access_token}` } }).catch(() => undefined);
    }
    localStorage.removeItem(STORAGE_KEY);
    setSession(null);
    setServices([]); setDomains([]); setOrders([]); setTickets([]);
  }

  if (loading) return <div className="account-loading">Loading your HostMyWeb account…</div>;

  if (!session) {
    return (
      <main className="account-shell auth-shell">
        <a className="account-brand" href="/"><span className="brand-mark"><i /><i /><i /></span><b>HostMyWeb</b></a>
        <section className="auth-card">
          <div className="auth-copy"><span>HOSTMYWEB ACCOUNT</span><h1>{mode === "signup" ? "Create your account." : "Welcome back."}</h1><p>{mode === "signup" ? "Your account is where hosting, domains, email, billing, renewals, and support live." : "Sign in to manage your HostMyWeb services."}</p>{selection && <div className="selection-chip">{selection}</div>}</div>
          <div className="auth-tabs"><button type="button" className={mode === "login" ? "active" : ""} onClick={() => { setMode("login"); setAuthMessage(""); }}>Log In</button><button type="button" className={mode === "signup" ? "active" : ""} onClick={() => { setMode("signup"); setAuthMessage(""); }}>Create Account</button></div>
          <form className="auth-form" onSubmit={authenticate}>
            {mode === "signup" && <><label><span>Your name</span><input name="full_name" autoComplete="name" required /></label><label><span>Business / brand</span><input name="company" autoComplete="organization" /></label></>}
            <label><span>Email</span><input name="email" type="email" autoComplete="email" required /></label>
            <label><span>Password</span><input name="password" type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} minLength={8} required /></label>
            <button type="submit">{mode === "signup" ? "Create account" : "Log in"}</button>
            {authMessage && <p className="auth-message" role="status">{authMessage}</p>}
          </form>
          <a className="back-home" href="/">← Back to HostMyWeb</a>
        </section>
      </main>
    );
  }

  const name = session.user.user_metadata?.full_name || session.user.email || "Customer";

  return (
    <main className="account-shell dashboard-account-shell">
      <aside className="account-sidebar"><a className="account-brand" href="/"><span className="brand-mark"><i /><i /><i /></span><b>HostMyWeb</b></a><nav><a className="active" href="#overview">Overview</a><a href="#services">Services</a><a href="#domains">Domains</a><a href="#orders">Billing &amp; Orders</a><a href="#support">Support</a></nav><button type="button" onClick={signOut}>Sign out</button></aside>
      <section className="account-main" id="overview">
        <header className="account-topbar"><div><span>YOUR ACCOUNT</span><h1>Welcome, {name}.</h1></div><a href="/#pricing">Add a service</a></header>
        {accountError && <p className="account-alert">{accountError}</p>}
        <div className="account-stat-grid"><article><span>Active services</span><b>{services.filter(item => item.status === "active").length}</b></article><article><span>Domains</span><b>{domains.length}</b></article><article><span>Orders</span><b>{orders.length}</b></article><article><span>Open tickets</span><b>{tickets.filter(item => !["resolved","closed"].includes(item.status)).length}</b></article></div>

        <section className="account-panel" id="services"><header><div><span>SERVICES</span><h2>Your hosting &amp; products</h2></div><a href="/#pricing">Shop hosting →</a></header>{services.length ? <div className="account-table">{services.map(item => <div className="account-row" key={item.id}><div><b>{item.plan_name || item.service_type.replaceAll("_", " ")}</b><span>{item.domain_name || "HostMyWeb service"}</span></div><em>{item.status}</em></div>)}</div> : <div className="empty-state"><b>No services yet.</b><p>When you purchase hosting or another service, it will appear here automatically.</p><a href="/#pricing">Browse hosting plans</a></div>}</section>

        <section className="account-panel" id="domains"><header><div><span>DOMAINS</span><h2>Your domain names</h2></div><a href="/#domains">Search domains →</a></header>{domains.length ? <div className="account-table">{domains.map(item => <div className="account-row" key={item.id}><div><b>{item.domain_name}</b><span>{item.auto_renew ? "Auto-renew on" : "Auto-renew off"}{item.expires_at ? ` · Expires ${new Date(item.expires_at).toLocaleDateString()}` : ""}</span></div><em>{item.registration_status}</em></div>)}</div> : <div className="empty-state"><b>No domains in this account yet.</b><p>Search for a domain and it will be connected to this account when registered.</p><a href="/#domains">Search domains</a></div>}</section>

        <section className="account-panel" id="orders"><header><div><span>BILLING &amp; ORDERS</span><h2>Order history</h2></div></header>{orders.length ? <div className="account-table">{orders.map(item => <div className="account-row" key={item.id}><div><b>{item.order_type.replaceAll("_", " ")}</b><span>{new Intl.NumberFormat("en-US", { style: "currency", currency: item.currency }).format(Number(item.amount))} · {new Date(item.created_at).toLocaleDateString()}</span></div><em>{item.status}</em></div>)}</div> : <div className="empty-state"><b>No orders yet.</b><p>Your hosting, domain, and service orders will be listed here.</p></div>}</section>

        <section className="account-panel support-panel" id="support"><header><div><span>SUPPORT</span><h2>Get help with your account</h2></div></header><div className="support-account-grid"><form onSubmit={createTicket}><label><span>Category</span><select name="category" defaultValue="hosting"><option value="hosting">Hosting</option><option value="domain">Domain</option><option value="dns">DNS</option><option value="email">Email</option><option value="billing">Billing</option><option value="migration">Migration</option><option value="account">Account</option><option value="other">Other</option></select></label><label><span>Subject</span><input name="subject" required maxLength={160} /></label><label><span>What do you need help with?</span><textarea name="message" rows={5} required maxLength={3000} /></label><button type="submit">Submit support ticket</button>{ticketMessage && <p className="ticket-message">{ticketMessage}</p>}</form><div><h3>Recent tickets</h3>{tickets.length ? tickets.slice(0,6).map(ticket => <article className="ticket-row" key={ticket.id}><div><b>{ticket.subject}</b><span>{ticket.category} · {new Date(ticket.created_at).toLocaleDateString()}</span></div><em>{ticket.status.replaceAll("_", " ")}</em></article>) : <div className="empty-state small"><b>No support tickets.</b><p>Your requests and their status will stay organized here.</p></div>}</div></div></section>
      </section>
    </main>
  );
}
