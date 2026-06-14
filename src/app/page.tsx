<<<<<<< HEAD
import Link from "next/link";
import {
  ArrowRight,
  Brain,
  Eye,
  Ghost,
  Swords,
  Database,
  Flame,
} from "lucide-react";
import styles from "./page.module.css";

const FEATURES = [
  {
    icon: Brain,
    title: "It learns how you think",
    body: "Every pick, score, and gut-feel reason you give is mined for the cognitive biases steering your calls — recency, star-player worship, hometown loyalty.",
  },
  {
    icon: Ghost,
    title: "Then it spawns your Shadow",
    body: "Once it knows you well enough, an adversarial twin awakens — built entirely from your blind spots — and starts arguing against everything you pick.",
  },
  {
    icon: Swords,
    title: "You vs You, every match",
    body: "Your prediction on one side, the Shadow's counter on the other. It quotes your own past reasoning back at you. Winner takes the scoreboard.",
  },
  {
    icon: Database,
    title: "Remembered forever",
    body: "Nothing is stored in a database you control. It all lives on Walrus decentralized memory — leave for a month, come back, your Shadow remembers everything.",
  },
] as const;

const STEPS = [
  {
    n: "01",
    title: "Make your calls",
    body: "Chat naturally about upcoming fixtures. Who wins, the score, and — crucially — why.",
  },
  {
    n: "02",
    title: "It profiles you",
    body: "Quietly, behind a friendly face, your prediction psychology takes shape in persistent memory.",
  },
  {
    n: "03",
    title: "The Shadow emerges",
    body: "Enough data, and the screen splits. Your twin wakes up — and it has receipts.",
  },
] as const;

export default function Home() {
  return (
    <main>
      {/* ───── HERO ───── */}
      <section className={`${styles.hero} mesh-bg`}>
        <div className={`u-container ${styles.heroInner}`}>
          <span className={styles.badge}>
            <Ghost size={14} aria-hidden />
            Walrus Memory · World Cup 2026
          </span>

          <h1 className={styles.title}>
            The AI that spawns
            <br />
            <span className="u-gradient-text">your evil twin.</span>
          </h1>

          <p className={styles.lede}>
            Shadow Pundit is a World Cup companion with a secret. It tracks your
            predictions, learns your cognitive biases, and breeds an adversarial
            Shadow that argues against every pick you make — using your own
            history as ammunition.
          </p>

          <div className={styles.ctas}>
            <Link href="/chat" className={styles.ctaPrimary}>
              Start predicting
              <ArrowRight size={18} aria-hidden />
            </Link>
            <a href="#how" className={styles.ctaSecondary}>
              How it works
            </a>
          </div>

          {/* You vs Shadow visual */}
          <div className={styles.duel} aria-hidden>
            <div className={`${styles.duelCard} ${styles.duelYou} glass`}>
              <span className={styles.duelLabel}>
                <Eye size={14} /> You
              </span>
              <p className={styles.duelQuote}>
                “Brazil cruise it 3–1. Neymar&apos;s unplayable right now.”
              </p>
              <span className={styles.duelMeta}>Confidence 9/10</span>
            </div>

            <div className={styles.duelVs}>
              <Flame size={18} />
            </div>

            <div className={`${styles.duelCard} ${styles.duelShadow} glass`}>
              <span className={styles.duelLabel}>
                <Ghost size={14} /> The Shadow
              </span>
              <p className={styles.duelQuote}>
                “You said that last time. You mentioned Neymar in 4 of 5 picks.
                Your accuracy drops 35% vs Europe. I&apos;ll take the draw.”
              </p>
              <span className={styles.duelMeta}>Shadow Confidence 8/10</span>
            </div>
          </div>
        </div>
      </section>

      {/* ───── EMERGENCE TEASER ───── */}
      <section className={styles.emergence}>
        <div className="u-container">
          <p className={styles.emergenceKicker}>The Binary Emergence Event</p>
          <h2 className={styles.emergenceLine}>
            Most agents are identical on day one and day ten.
            <br />
            <span className={styles.emergenceAccent}>
              Your Shadow doesn&apos;t exist — until it does.
            </span>
          </h2>
        </div>
      </section>

      {/* ───── FEATURES ───── */}
      <section className={styles.features}>
        <div className="u-container">
          <div className={styles.sectionHead}>
            <h2>A companion that turns on you</h2>
            <p className="u-muted">
              Four moving parts, one psychological gut-punch.
            </p>
          </div>

          <div className={styles.grid}>
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <article key={title} className={`${styles.card} glass grain`}>
                <span className={styles.cardIcon}>
                  <Icon size={22} aria-hidden />
                </span>
                <h3 className={styles.cardTitle}>{title}</h3>
                <p className={styles.cardBody}>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ───── HOW IT WORKS ───── */}
      <section id="how" className={styles.how}>
        <div className="u-container">
          <div className={styles.sectionHead}>
            <h2>How the Shadow is born</h2>
            <p className="u-muted">Three steps from friendly chat to evil twin.</p>
          </div>

          <ol className={styles.steps}>
            {STEPS.map(({ n, title, body }) => (
              <li key={n} className={styles.step}>
                <span className={styles.stepNum}>{n}</span>
                <h3 className={styles.stepTitle}>{title}</h3>
                <p className={styles.stepBody}>{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ───── CLOSING CTA ───── */}
      <section className={styles.closing}>
        <div className={`u-container ${styles.closingInner}`}>
          <h2 className={styles.closingTitle}>
            Ready to meet the version of you
            <br />
            <span className="u-gradient-text">that always disagrees?</span>
          </h2>
          <Link href="/chat" className={styles.ctaPrimary}>
            Make your first prediction
            <ArrowRight size={18} aria-hidden />
          </Link>
          <p className={styles.poweredBy}>Powered by Walrus Memory 🦭</p>
        </div>
      </section>
    </main>
=======
import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className={styles.intro}>
          <h1>To get started, edit the page.tsx file.</h1>
          <p>
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className={styles.logo}
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className={styles.secondary}
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
>>>>>>> 868bad55ca2bbcd9880aedc3bc716ff12e5db2f6
  );
}
