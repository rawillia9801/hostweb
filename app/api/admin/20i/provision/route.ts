import { NextRequest, NextResponse } from "next/server";
import { requireHostMyWebAdmin } from "@/lib/hostmyweb-admin";
import { HOSTING_PLANS, inferHostingPlanSlug, isHostingPlanSlug } from "@/lib/hosting-plans";
import { supabaseRpc } from "@/lib/supabase-rpc";
import { provisionConfiguredTwentyIHosting } from "@/lib/twentyi-plan-automation";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type ProvisionBody = {
  plan?: string;
  domain?: string;
  customerEmail?: string;
  stackUser?: string;
};

export async function POST(request: NextRequest) {
  const admin = await requireHostMyWebAdmin(request);
  if (!admin) return NextResponse.json({ error: "Administrator access required." }, { status: 403 });

  const body = (await request.json().catch(() => null)) as ProvisionBody | null;
  const plan = body?.plan?.trim().toLowerCase();
  const domain = body?.domain?.trim();
  const customerEmail = body?.customerEmail?.trim().toLowerCase();
  const stackUser = body?.stackUser?.trim() || null;

  if (!isHostingPlanSlug(plan)) {
    return NextResponse.json({ error: "Plan must be starter, business, pro, or agency." }, { status: 400 });
  }
  if (!domain) return NextResponse.json({ error: "Domain is required." }, { status: 400 });
  if (!customerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
    return NextResponse.json({ error: "A valid customer email is required so the service can be linked to the HostMyWeb account." }, { status: 400 });
  }

  try {
    const provisioned = await provisionConfiguredTwentyIHosting({ plan, domain, stackUser });
    const existingPlan = inferHostingPlanSlug(provisioned.packageTypeName, provisioned.packageTypeRef);
    if (!provisioned.created && existingPlan && existingPlan !== plan) {
      return NextResponse.json({
        error: `A 20i hosting package already exists for ${provisioned.domain} and appears to use the ${HOSTING_PLANS[existingPlan].name} plan. No duplicate was created.`,
        existingPackageId: provisioned.packageId,
        existingPlan,
      }, { status: 409 });
    }

    let registration: unknown = null;
    let warning: string | null = null;
    try {
      registration = await supabaseRpc<unknown>("admin_register_hostmyweb_external_service", {
        p_email: customerEmail,
        p_service_type: "web_hosting",
        p_plan_slug: plan,
        p_plan_name: HOSTING_PLANS[plan].name,
        p_domain_name: provisioned.domain,
        p_provider_ref: provisioned.packageId,
        p_package_type_ref: provisioned.packageTypeRef,
        p_metadata: {
          source: "hostmyweb_admin_api",
          package_type_name: provisioned.packageTypeName,
          created_by_admin: admin.user.id,
        },
      }, admin.token);
    } catch (error) {
      warning = error instanceof Error ? error.message : "Hosting was provisioned but the HostMyWeb account record could not be synchronized.";
    }

    return NextResponse.json({
      ok: true,
      created: provisioned.created,
      plan,
      planName: HOSTING_PLANS[plan].name,
      domain: provisioned.domain,
      packageId: provisioned.packageId,
      packageTypeRef: provisioned.packageTypeRef,
      packageTypeName: provisioned.packageTypeName,
      customerEmail,
      registration,
      warning,
    }, { status: provisioned.created ? 201 : 200 });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "20i hosting could not be provisioned.",
    }, { status: 502 });
  }
}
