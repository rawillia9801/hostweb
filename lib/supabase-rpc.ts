import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "@/lib/supabase-public";

export class SupabaseRpcError extends Error {
  constructor(public functionName: string, public status: number, detail?: string) {
    super(`Supabase RPC ${functionName} failed with status ${status}${detail ? `: ${detail}` : "."}`);
    this.name = "SupabaseRpcError";
  }
}

export async function supabaseRpc<T>(
  functionName: string,
  body: Record<string, unknown>,
  authorizationBearer?: string | null,
): Promise<T> {
  const bearer = authorizationBearer?.trim() || SUPABASE_PUBLISHABLE_KEY;
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${functionName}`, {
    method: "POST",
    cache: "no-store",
    headers: {
      apikey: SUPABASE_PUBLISHABLE_KEY,
      Authorization: `Bearer ${bearer}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    const raw = await response.text().catch(() => "");
    const detail = raw.replace(/\s+/g, " ").trim().slice(0, 320);
    throw new SupabaseRpcError(functionName, response.status, detail || undefined);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
