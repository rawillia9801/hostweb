import type { Metadata } from "next";
import { UrgentSupportForm } from "./urgent-support-form";
import styles from "./urgent-support.module.css";

export const metadata: Metadata = {
  title: "Urgent Hosting Support",
  description: "Submit an urgent HostMyWeb service-impacting hosting incident.",
  robots: { index: false, follow: false },
};

export default function UrgentSupportPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <a className={styles.brand} href="/"><span>H</span><div><b>HostMyWeb</b><small>SUPPORT OPERATIONS</small></div></a>
        <a href="/account#support">Normal support</a>
      </header>
      <section className={styles.hero}>
        <div className={styles.kicker}><i /> SERVICE-IMPACTING INCIDENT</div>
        <h1>Urgent hosting support.</h1>
        <p>This route is separated from routine support so active outages and service-impacting technical incidents are clearly marked and tied to the customer account from the start.</p>
        <div className={styles.telemetry}><span><b>PRIORITY</b> URGENT</span><span><b>ROUTE</b> TECHNICAL</span><span><b>ACCOUNT</b> REQUIRED</span></div>
      </section>
      <section className={styles.content}><UrgentSupportForm /></section>
      <footer className={styles.footer}><span>HostMyWeb Support Operations</span><a href="/">Return to HostMyWeb.co</a></footer>
    </main>
  );
}
