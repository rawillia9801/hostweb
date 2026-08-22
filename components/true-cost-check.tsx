"use client";

import { useMemo, useState } from "react";

const HOSTMYWEB_MONTHLY = 7.99;
const HORIZON_MONTHS = 24;
const MAX_TERM_MONTHS = 120;

function money(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

function cleanNumber(value: string, fallback: number) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

function cleanMonths(value: string, fallback: number) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(MAX_TERM_MONTHS, Math.max(1, parsed));
}

export function TrueCostCheck() {
  const [introRate, setIntroRate] = useState("2.99");
  const [promoMonths, setPromoMonths] = useState("12");
  const [renewalRate, setRenewalRate] = useState("9.99");
  const [prepaidMonths, setPrepaidMonths] = useState("12");

  const comparison = useMemo(() => {
    const intro = cleanNumber(introRate, 0);
    const promo = cleanMonths(promoMonths, 12);
    const renewal = cleanNumber(renewalRate, intro);
    const prepaid = cleanMonths(prepaidMonths, 1);

    const promoMonthsInsideWindow = Math.min(promo, HORIZON_MONTHS);
    const competitorTotal = intro * promoMonthsInsideWindow + renewal * Math.max(0, HORIZON_MONTHS - promoMonthsInsideWindow);
    const competitorDueToday = intro * prepaid;
    const hostMyWebTotal = HOSTMYWEB_MONTHLY * HORIZON_MONTHS;
    const difference = competitorTotal - hostMyWebTotal;

    return { competitorTotal, competitorDueToday, hostMyWebTotal, difference };
  }, [introRate, promoMonths, renewalRate, prepaidMonths]);

  return (
    <div className="hmw-true-cost-console" aria-label="24 month hosting cost comparison">
      <div className="hmw-true-cost-head">
        <div><i /><span>TRUE-COST CHECK</span></div>
        <em>24 MONTH TELEMETRY</em>
      </div>

      <div className="hmw-true-cost-title">
        <small>USE THE OTHER HOST&apos; REAL OFFER</small>
        <h3>A lower monthly number isn&apos;t always a lower bill.</h3>
        <p>Enter another host&apos;s advertised terms. The calculator compares hosting cost only, so the result comes from the numbers you provide—not a hard-coded competitor claim.</p>
      </div>

      <div className="hmw-true-cost-inputs">
        <label><span>Promo monthly rate</span><div><b>$</b><input inputMode="decimal" value={introRate} onChange={(event) => setIntroRate(event.target.value)} aria-label="Other host promotional monthly rate" /></div></label>
        <label><span>Promo lasts</span><div><input inputMode="numeric" value={promoMonths} onChange={(event) => setPromoMonths(event.target.value)} aria-label="Promotional period in months" /><b>mo</b></div></label>
        <label><span>Renewal monthly rate</span><div><b>$</b><input inputMode="decimal" value={renewalRate} onChange={(event) => setRenewalRate(event.target.value)} aria-label="Other host renewal monthly rate" /></div></label>
        <label><span>Prepaid at signup</span><div><input inputMode="numeric" value={prepaidMonths} onChange={(event) => setPrepaidMonths(event.target.value)} aria-label="Months prepaid at signup" /><b>mo</b></div></label>
      </div>

      <div className="hmw-true-cost-table">
        <div className="hmw-true-cost-row hmw-true-cost-labels"><span>METRIC</span><b>HOSTMYWEB</b><em>OTHER HOST</em></div>
        <div className="hmw-true-cost-row"><span>Advertised monthly rate</span><b>$7.99</b><em>{money(cleanNumber(introRate, 0))}</em></div>
        <div className="hmw-true-cost-row"><span>Hosting due at signup</span><b>$7.99</b><em>{money(comparison.competitorDueToday)}</em></div>
        <div className="hmw-true-cost-row"><span>Renewal monthly rate</span><b>$7.99 locked</b><em>{money(cleanNumber(renewalRate, 0))}</em></div>
        <div className="hmw-true-cost-row hmw-true-cost-total"><span>24-month hosting total</span><b>{money(comparison.hostMyWebTotal)}</b><em>{money(comparison.competitorTotal)}</em></div>
      </div>

      <div className={comparison.difference >= 0 ? "hmw-true-cost-result positive" : "hmw-true-cost-result neutral"}>
        <small>24-MONTH RESULT</small>
        <strong>
          {Math.abs(comparison.difference) < 0.005
            ? "The hosting totals are effectively the same."
            : comparison.difference > 0
              ? `HostMyWeb is ${money(comparison.difference)} lower over 24 months.`
              : `The other entered offer is ${money(Math.abs(comparison.difference))} lower over 24 months.`}
        </strong>
        <span>Domains, taxes, optional add-ons, and usage charges are excluded so the comparison stays focused on the hosting rate.</span>
      </div>
    </div>
  );
}
