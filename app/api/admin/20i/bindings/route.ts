import { NextRequest, NextResponse } from "next/server";
import { requireHostMyWebAdmin } from "@/lib/hostmyweb-admin";
import { getTwentyIPlanBinding } from "@/lib/hosting-plan-bindings";
import { HOSTING_PLANS, HOSTING_PLAN_SLUGS, isHostingPlanSlug } from "@/lib/hosting-plans";
import { supabaseRpc } from "@/lib/supabase-rpc";
import { getTwentyIPackageTypes, packageTypesFrom } from "@/lib/twentyi-server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type BindingBody = {
  plan?: string;
  packageTypeRef?: string | null;
  checkoutUrl?: string | null;
  active?: boolean;
};

export async function GET(request: NextRequest) {
  const admin = await requireHostMyWebAdmin(request);
  if (!admin) return NextResponse.json({ error: "Administrator access required." }, { status: 403 });

  try {
    const [typesPayload, bindingEntries] = await Promise.all([
      getTwentyIPackageTypes(),
      Promise.all(HOSTING_PLAN_SLUGS.map(async (slug) => [slug, await getTwentyIPlanBinding(slug)] as const)),
    ]);
    const packageTypes = packageTypesFrom(typesPayload);
    const bindings = bindingEntries.map(([slug, binding]) => ({
      plan: slug,
      planName: HOSTING_PLANS[slug].name,
      monthlyPrice: HOSTING_PLANS[slug].monthlyPrice,
      packageTypeRef: binding?.package_type_ref || null,
      packageTypeName: binding?.package_type_name || null,
      checkoutUrl: binding?.checkout_url || null,
      active: binding?.active !== false,
    }));

    return NextResponse.json({ packageTypes, bindings }, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load 20i plan bindings." }, { status: 502 });
  }
}

export async function POST(request: NextRequest) {
  const admin = await requireHostMyWebAdmin(request);
  if (!admin) return NextResponse.json({ error: "Administrator access required." }, { status: 403 });

  const body = (await request.json().catch(() => null)) as BindingBody | null;
  const plan = body?.plan?.trim().toLowerCase();
  if (!isHostingPlanSlug(plan)) {
    return NextResponse.json({ error: "Plan must be starter, business, pro, or agency." }, { status: 400 });
  }

  const packageTypeRef = body?.packageTypeRef?.trim() || null;
  const checkoutUrl = body?.checkoutUrl?.trim() || null;
  if (checkoutUrl && !/^https:\/\/[^\s]+$/i.test(checkoutUrl)) {
    return NextResponse.json({ error: "Checkout URL must be a valid HTTPS URL." }, { status: 400 });
  }

  try {
    const packageTypes = packageTypesFrom(await getTwentyIPackageTypes());
    const packageType = packageTypeRef ? packageTypes.find((item) => item.id === packageTypeRef) : null;
    if (packageTypeRef && !packageType) {
      return NextResponse.json({ error: "The selected 20i package type is not currently available." }, { status: 400 });
    }

    const saved = await supabaseRpc<unknown>("admin_set_hostmyweb_provider_plan_binding", {
      p_provider: "20i",
      p_plan_slug: plan,
      p_package_type_ref: packageType?.id || null,
      p_package_type_name: packageType?.name || null,
      p_checkout_url: checkoutUrl,
      p_active: body?.active !== false,
    }, admin.token);

    return NextResponse.json({ ok: true, binding: saved });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to save 20i plan binding." }, { status: 502 });
  }
}
