import { About } from "@/components/about";
import { ContactFooter } from "@/components/contact-footer";
import { Hero } from "@/components/hero";
import { HeroImage } from "@/components/hero-image";
import { Insights } from "@/components/insights";
import { Position } from "@/components/position";
import { Practice } from "@/components/practice";
import { ProjectPair } from "@/components/project-pair";
import { SiteHeader } from "@/components/site-header";
import { Stats } from "@/components/stats";
import { Transactions } from "@/components/transactions";
import { getInsights, getTransactions } from "@/lib/content";

export default async function HomePage() {
  const [transactions, insights] = await Promise.all([getTransactions(), getInsights()]);

  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <HeroImage />
        <Position />
        <Practice />
        <Stats />
        <Transactions transactions={transactions} />
        <ProjectPair />
        <Insights insights={insights} />
        <About />
      </main>
      <ContactFooter />
    </>
  );
}
