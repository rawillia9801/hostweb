import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "@/lib/supabase-public";

export type HostMyWebAdminUser = { id: string; email?: string };

export function requestBearerToken(request: Request): string | null {
  const authorization = request.headers.get("authorization") || "";
  if (!authorization.toLowerCase().startsWith("bearer ")) return null;
  return authorization.slice(7).trim() || null;
}

export async function requireHostMyWebAdmin(request: Request): Promise<{ user: HostMyWebAdminUser; token: string } | null> {
  const token = requestBearerToken(request);
  if (!token) return null;

  const userResponse = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    cache: "no-store",
    headers: { apikey: SUPABASE_PUBLISHABLE_KEY, Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(12000),
  });
  if (!userResponse.ok) return null;

  const user = (await userResponse.json()) as HostMyWebAdminUser;
  if (!user.id) return null;

  const adminResponse = await fetch(`${SUPABASE_URL}/rest/v1/rpc/is_hostmyweb_admin`, {
    method: "POST",
    cache: "no-store",
    headers: {
      apikey: SUPABASE_PUBLISHABLE_KEY,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: "{}",
    signal: AbortSignal.timeout(12000),
  });
  if (!adminResponse.ok || (await adminResponse.json()) !== true) return null;

  return { user, token };
}
