import { NextResponse } from "next/server";
import { getEffectiveHostShopCheckoutUrl, getEffectivePackageTypeRef } from "@/lib/hosting-plan-bindings";
import { HOSTING_PLANS, HOSTING_PLAN_SLUGS } from "@/lib/hosting-plans";

export const dynamic = "force-dynamic";

export async function GET() {
  const plans = await Promise.all(HOSTING_PLAN_SLUGS.map(async (slug) => {
    const plan = HOSTING_PLANS[slug];
    const [checkoutUrl, packageTypeRef] = await Promise.all([
      getEffectiveHostShopCheckoutUrl(slug),
      getEffectivePackageTypeRef(slug),
    ]);

    return {
      slug,
      name: plan.name,
      code: plan.code,
      monthlyPrice: plan.monthlyPrice,
      resources: {
        websites: plan.websites,
        webspaceGb: plan.webspaceGb,
        bandwidth: plan.bandwidth,
        mailboxes: plan.mailboxes,
        mailboxStorageGb: plan.mailboxStorageGb,
        databases: plan.databases,
        ssh: true,
        git: true,
      },
      checkoutConfigured: Boolean(checkoutUrl),
      packageTypeConfigured: Boolean(packageTypeRef),
      operational: Boolean(checkoutUrl && packageTypeRef),
    };
  }));

  return NextResponse.json({
    billingModel: "monthly",
    priceLock: true,
    plans,
  }, { headers: { "cache-control": "no-store" } });
}
