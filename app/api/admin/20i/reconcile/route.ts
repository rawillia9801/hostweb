import { NextRequest, NextResponse } from "next/server";
import { requireHostMyWebAdmin } from "@/lib/hostmyweb-admin";
import { HOSTING_PLANS } from "@/lib/hosting-plans";
import { supabaseRpc } from "@/lib/supabase-rpc";
import { applyConfiguredPlanBindings } from "@/lib/twentyi-plan-automation";
import { readTwentyIInventory } from "@/lib/twentyi-server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RegistrationResult = {
  provider_ref?: string;
  user_id?: string | null;
  service_id?: string | null;
};

async function reconcile(request: NextRequest) {
  const admin = await requireHostMyWebAdmin(request);
  if (!admin) return NextResponse.json({ error: "Administrator access required." }, { status: 403 });

  try {
    const inventory = await applyConfiguredPlanBindings(await readTwentyIInventory());
    const results: Array<{
      providerRef: string;
      domain: string | null;
      plan: string | null;
      status: string;
      customerEmail: string | null;
      linkedUserId: string | null;
      serviceId: string | null;
      error?: string;
    }> = [];

    for (const service of inventory) {
      try {
        const registered = await supabaseRpc<RegistrationResult>("admin_sync_hostmyweb_external_service", {
          p_email: service.customer_email,
          p_service_type: service.service_type,
          p_plan_slug: service.plan_slug,
          p_plan_name: service.plan_slug ? HOSTING_PLANS[service.plan_slug].name : service.plan_name,
          p_domain_name: service.domain_name,
          p_provider_ref: service.provider_ref,
          p_package_type_ref: service.package_type_ref,
          p_status: service.status,
          p_metadata: {
            ...service.metadata,
            source: "20i_inventory_reconcile",
            package_type_name: service.package_type_name,
            provider_user_refs: service.provider_user_refs,
            provider_status: service.status,
          },
        }, admin.token);

        results.push({
          providerRef: service.provider_ref,
          domain: service.domain_name,
          plan: service.plan_slug,
          status: service.status,
          customerEmail: service.customer_email,
          linkedUserId: registered.user_id || null,
          serviceId: registered.service_id || null,
        });
      } catch (error) {
        results.push({
          providerRef: service.provider_ref,
          domain: service.domain_name,
          plan: service.plan_slug,
          status: service.status,
          customerEmail: service.customer_email,
          linkedUserId: null,
          serviceId: null,
          error: error instanceof Error ? error.message : "Unable to synchronize service.",
        });
      }
    }

    const failed = results.filter((item) => item.error);
    const unmatched = results.filter((item) => !item.error && !item.linkedUserId);

    return NextResponse.json({
      ok: failed.length === 0,
      inventoryCount: inventory.length,
      synchronized: results.length - failed.length,
      failed: failed.length,
      awaitingCustomerAccount: unmatched.length,
      results,
    }, { status: failed.length ? 207 : 200 });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unable to reconcile 20i inventory.",
    }, { status: 502 });
  }
}

export async function POST(request: NextRequest) {
  return reconcile(request);
}

export async function GET(request: NextRequest) {
  return reconcile(request);
}
