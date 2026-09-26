"use client";

import { FormEvent, useState } from "react";

type SearchState = "idle" | "searching" | "available" | "registered" | "error";

type DomainOffer = {
  domain: string;
  available: boolean;
  price?: number;
  renewalPrice?: number;
  transferPrice?: number;
  currency?: string;
  checkoutUrl: string;
  source?: "reseller" | "registry";
};

type DomainResult = DomainOffer & {
  suggestions?: DomainOffer[];
};

const popularTlds = [".com", ".net", ".org", ".us", ".co", ".io"];

function priceLabel(offer: DomainOffer) {
  if (typeof offer.price !== "number") return "Price confirmed in checkout";
  const renewal = offer.renewalPrice ?? offer.price;
  return `$${offer.price.toFixed(2)}/yr · renews at $${renewal.toFixed(2)}/yr`;
}

export function DomainSearch() {
  const [query, setQuery] = useState("");
  const [state, setState] = useState<SearchState>("idle");
  const [result, setResult] = useState<DomainResult | null>(null);
  const [error, setError] = useState("");

  async function runSearch(value: string) {
    const normalized = value.trim().toLowerCase();
    if (!normalized) return;
    setState("searching");
    setError("");
    setResult(null);

    try {
      const response = await fetch(`/api/domains/search?domain=${encodeURIComponent(normalized)}`, { cache: "no-store" });
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

  async function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await runSearch(query);
  }

  function applyTld(tld: string) {
    const base = query.trim().toLowerCase().replace(/\.[a-z0-9-]+$/i, "");
    const next = `${base || "yourbrand"}${tld}`;
    setQuery(next);
    setState("idle");
    setResult(null);
    setError("");
  }

  return (
    <div className="domain-search-card">
      <div className="domain-search-heading">
        <span className="domain-search-icon">◎</span>
        <div>
          <strong>Find your domain</strong>
          <span>Live availability with registration pricing and alternatives.</span>
        </div>
      </div>

      <form className="domain-search-form" onSubmit={search}>
        <div className="domain-input-wrap">
          <span>www.</span>
          <input
            aria-label="Domain name"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setState("idle");
              setResult(null);
              setError("");
            }}
            placeholder="yourbrand.com"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            required
          />
        </div>
        <button type="submit" disabled={state === "searching"}>
          {state === "searching" ? "Checking availability…" : "Search domain"}
        </button>
      </form>

      <div className="tld-row" aria-label="Popular domain extensions">
        <span>Popular:</span>
        {popularTlds.map((tld) => (
          <button key={tld} type="button" onClick={() => applyTld(tld)}>{tld}</button>
        ))}
      </div>

      {result && state === "available" && (
        <div className="domain-result available" role="status">
          <div>
            <b>✓ {result.domain} is available</b>
            <span>{priceLabel(result)}</span>
          </div>
          <a href={result.checkoutUrl}>Register domain →</a>
        </div>
      )}

      {result && state === "registered" && (
        <div className="domain-result registered" role="status">
          <div>
            <b>{result.domain}</b>
            <span>is already registered. You can transfer it to HostMyWeb or choose an available alternative below.</span>
          </div>
          <a href={result.checkoutUrl}>Transfer / manage →</a>
        </div>
      )}

      {!!result?.suggestions?.length && (
        <div className="domain-suggestions" aria-label="Available domain suggestions">
          <div className="domain-suggestions-title">
            <strong>Available alternatives</strong>
            <span>Checked live</span>
          </div>
          <div className="domain-suggestions-grid">
            {result.suggestions.map((suggestion) => (
              <div className="domain-suggestion" key={suggestion.domain}>
                <div>
                  <b>{suggestion.domain}</b>
                  <span>{priceLabel(suggestion)}</span>
                </div>
                <a href={suggestion.checkoutUrl}>Register →</a>
              </div>
            ))}
          </div>
        </div>
      )}

      {state === "error" && <p className="domain-search-error" role="status">{error}</p>}

      <small className="domain-search-note">
        Searches do not reserve domains. Final availability and any registry-specific fees are confirmed in HostMyWeb checkout before purchase.
      </small>
    </div>
  );
}
