"use client";

import { FormEvent, useState } from "react";

type SearchState = "idle" | "searching" | "available" | "registered" | "error";

type DomainResult = {
  domain: string;
  available: boolean;
  price?: number;
  renewalPrice?: number;
  currency?: string;
  message?: string;
};

const suggestions = [".com", ".net", ".org", ".us"];

export function DomainSearch() {
  const [query, setQuery] = useState("");
  const [state, setState] = useState<SearchState>("idle");
  const [result, setResult] = useState<DomainResult | null>(null);
  const [error, setError] = useState("");

  async function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim().toLowerCase();
    if (!value) return;
    setState("searching");
    setError("");
    setResult(null);
    try {
      const response = await fetch(`/api/domains/search?domain=${encodeURIComponent(value)}`, { cache: "no-store" });
      const data = (await response.json()) as DomainResult & { error?: string };
      if (!response.ok) throw new Error(data.error || "Domain search is temporarily unavailable.");
      setResult(data);
      setQuery(data.domain);
      setState(data.available ? "available" : "registered");
    } catch (searchError) {
      setState("error");
      setError(searchError instanceof Error ? searchError.message : "Domain search is temporarily unavailable.");
    }
  }

  function applyTld(tld: string) {
    const base = query.trim().toLowerCase().replace(/\.[a-z0-9-]+$/i, "");
    setQuery(`${base || "yourbrand"}${tld}`);
    setState("idle");
    setResult(null);
    setError("");
  }

  return (
    <div className="domain-search-card">
      <div className="domain-search-heading"><span className="domain-search-icon">◎</span><div><strong>Find your domain</strong><span>Live availability through our domain platform.</span></div></div>
      <form className="domain-search-form" onSubmit={search}>
        <div className="domain-input-wrap"><span>www.</span><input aria-label="Domain name" value={query} onChange={(event) => { setQuery(event.target.value); setState("idle"); setResult(null); setError(""); }} placeholder="yourbrand.com" autoCapitalize="none" autoCorrect="off" spellCheck={false} required /></div>
        <button type="submit" disabled={state === "searching"}>{state === "searching" ? "Searching…" : "Search domain"}</button>
      </form>
      <div className="tld-row" aria-label="Popular domain extensions"><span>Popular:</span>{suggestions.map((tld) => <button key={tld} type="button" onClick={() => applyTld(tld)}>{tld}</button>)}</div>
      {result && state === "available" && <div className="domain-result available" role="status"><div><b>✓ {result.domain}</b><span>{typeof result.price === "number" ? `$${result.price.toFixed(2)}/yr · renews at $${(result.renewalPrice ?? result.price).toFixed(2)}/yr` : "Available — price confirmed before registration"}</span></div><a href={`/signup?domain=${encodeURIComponent(result.domain)}`}>Create account →</a></div>}
      {result && state === "registered" && <div className="domain-result registered" role="status"><div><b>{result.domain}</b><span>is already registered</span></div><button type="button" onClick={() => setQuery("")}>Try another name</button></div>}
      {state === "error" && <p className="domain-search-error" role="status">{error}</p>}
      <small className="domain-search-note">A search does not reserve a domain. Registration is completed after account and checkout details are confirmed.</small>
    </div>
  );
}
