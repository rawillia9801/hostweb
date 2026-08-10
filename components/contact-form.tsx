"use client";

import { FormEvent, useState } from "react";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "@/lib/supabase-public";

type Status = "idle" | "sending" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    setMessage("");

    const payload = {
      full_name: String(data.get("full_name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      company: String(data.get("company") || "").trim() || null,
      interest: String(data.get("interest") || "general"),
      message: String(data.get("message") || "").trim() || null,
      source: "hostmyweb.co",
    };

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/hostmyweb_leads`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("We could not save your request right now.");
      form.reset();
      setStatus("success");
      setMessage("Thanks — your request is in. We’ll use the details you sent to follow up about the right setup.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <form className="lead-form" onSubmit={submit}>
      <div className="form-row">
        <label>
          <span>Your name</span>
          <input name="full_name" autoComplete="name" minLength={2} maxLength={120} required placeholder="Your name" />
        </label>
        <label>
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" required placeholder="you@yourbrand.com" />
        </label>
      </div>
      <div className="form-row">
        <label>
          <span>Business / brand</span>
          <input name="company" autoComplete="organization" maxLength={160} placeholder="Your business or brand" />
        </label>
        <label>
          <span>What do you need?</span>
          <select name="interest" defaultValue="general">
            <option value="general">Help me choose</option>
            <option value="hosting">Managed hosting</option>
            <option value="domains">Domains &amp; DNS</option>
            <option value="email">Business email</option>
            <option value="websites">Website hosting / publishing</option>
            <option value="migration">Website migration</option>
            <option value="agency">Agency / multi-site hosting</option>
            <option value="breeder">Breeder business infrastructure</option>
          </select>
        </label>
      </div>
      <label>
        <span>Tell us what you’re building</span>
        <textarea name="message" maxLength={2000} rows={5} placeholder="Current website, domains, email, number of sites, or anything else that would help us understand the setup." />
      </label>
      <button type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Start your setup"}<span>→</span></button>
      {message && <p className={`form-status ${status}`} role="status">{message}</p>}
    </form>
  );
}
