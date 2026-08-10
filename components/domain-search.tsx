"use client";

import { FormEvent, useState } from "react";

type SearchState = "idle" | "searching" | "available" | "registered" | "error";

type DomainResult = {
  domain: string;
  available: boolean;
  message?: string;
};

const suggestions = [".com", ".net", ".org", ".co"];

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
      const response = await fetch(`/api/domains/search?domain=${encodeURIComponent(value)}`, {
        cache: "no-store",
      });
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
      <div className="domain-search-heading">
        <span className="domain-search-icon">◎</span>
        <div>
          <strong>Find your domain</strong>
          <span>Search a name for your brand in seconds.</span>
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
          {state === "searching" ? "Searching…" : "Search domain"}
        </button>
      </form>

      <div className="tld-row" aria-label="Popular domain extensions">
        <span>Popular:</span>
        {suggestions.map((tld) => (
          <button key={tld} type="button" onClick={() => applyTld(tld)}>{tld}</button>
        ))}
      </div>

      {result && state === "available" && (
        <div className="domain-result available" role="status">
          <div><b>✓ {result.domain}</b><span>appears available to register</span></div>
          <a href="#contact">Add to my setup →</a>
        </div>
      )}

      {result && state === "registered" && (
        <div className="domain-result registered" role="status">
          <div><b>{result.domain}</b><span>is already registered</span></div>
          <button type="button" onClick={() => setQuery("")}>Try another name</button>
        </div>
      )}

      {state === "error" && <p className="domain-search-error" role="status">{error}</p>}
      <small className="domain-search-note">Search results are an availability check, not a reservation. Final registration availability is confirmed when the order is placed.</small>
    </div>
  );
}
