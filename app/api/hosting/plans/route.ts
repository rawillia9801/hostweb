import { NextResponse } from "next/server";
import { HOSTING_PLANS, HOSTING_PLAN_SLUGS, hostingPlanOperationalState } from "@/lib/hosting-plans";

export const dynamic = "force-dynamic";

export async function GET() {
  const plans = HOSTING_PLAN_SLUGS.map((slug) => {
    const state = hostingPlanOperationalState(slug);
    const plan = HOSTING_PLANS[slug];
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
      checkoutConfigured: state.checkoutConfigured,
      packageTypeConfigured: state.packageTypeConfigured,
    };
  });

  return NextResponse.json({
    billingModel: "monthly",
    priceLock: true,
    plans,
  }, { headers: { "cache-control": "no-store" } });
}
