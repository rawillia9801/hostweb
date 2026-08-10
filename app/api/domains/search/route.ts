import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function normalizeDomain(input: string) {
  let value = input.trim().toLowerCase();
  value = value.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
  if (!value.includes(".")) value = `${value}.com`;
  return value;
}

function isValidDomain(domain: string) {
  if (domain.length < 3 || domain.length > 253) return false;
  if (!/^[a-z0-9.-]+$/.test(domain)) return false;
  const labels = domain.split(".");
  if (labels.length < 2) return false;
  return labels.every((label) => label.length > 0 && label.length <= 63 && !label.startsWith("-") && !label.endsWith("-"));
}

export async function GET(request: NextRequest) {
  const input = request.nextUrl.searchParams.get("domain") || "";
  const domain = normalizeDomain(input);

  if (!isValidDomain(domain)) {
    return NextResponse.json({ error: "Enter a valid domain name, such as yourbrand.com." }, { status: 400 });
  }

  try {
    const response = await fetch(`https://rdap.org/domain/${encodeURIComponent(domain)}`, {
      cache: "no-store",
      redirect: "follow",
      headers: { Accept: "application/rdap+json, application/json" },
      signal: AbortSignal.timeout(7000),
    });

    if (response.status === 404) {
      return NextResponse.json({ domain, available: true }, { headers: { "cache-control": "no-store" } });
    }

    if (response.ok) {
      return NextResponse.json({ domain, available: false }, { headers: { "cache-control": "no-store" } });
    }

    return NextResponse.json({ error: "The registry did not return a usable availability result. Please try again." }, { status: 503 });
  } catch {
    return NextResponse.json({ error: "Domain search is temporarily unavailable. Please try again shortly." }, { status: 503 });
  }
}
