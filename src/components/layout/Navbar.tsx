"use client";

/**
 * Top navigation — fixed, glassy, present on every route.
 *
 * Two jobs:
 *  1. Move between the app's surfaces (Chat / Arena / Profile / Leaderboard).
 *  2. Carry the narrative via the Shadow status pill. Today it reads "Dormant";
 *     once the emergence engine lands (Phase 3) the same pill flips to "Awake"
 *     and starts glowing violet. Seeding it now makes that flip feel earned.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  MessageSquare,
  Swords,
  Dna,
  Trophy,
  Ghost,
  Menu,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import styles from "./Navbar.module.css";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/chat", label: "Chat", icon: MessageSquare },
  { href: "/arena", label: "Arena", icon: Swords },
  { href: "/profile", label: "Profile", icon: Dna },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

/** Will become a live, prop-driven state once the Shadow can awaken. */
type ShadowStatus = "dormant" | "awake";

export function Navbar({ shadowStatus = "dormant" }: { shadowStatus?: ShadowStatus }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className={styles.nav}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} aria-label="Shadow Pundit home">
          <span className={styles.brandMark} aria-hidden>
            <span className={styles.brandYou}>S</span>
            <span className={styles.brandShadow}>P</span>
          </span>
          <span className={styles.brandText}>
            Shadow<span className={styles.brandTextAccent}>Pundit</span>
          </span>
        </Link>

        <nav className={styles.links} aria-label="Primary">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`${styles.link} ${isActive(href) ? styles.linkActive : ""}`}
              aria-current={isActive(href) ? "page" : undefined}
            >
              <Icon size={16} strokeWidth={2} aria-hidden />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className={styles.right}>
          <ShadowPill status={shadowStatus} />
          <button
            className={styles.menuBtn}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <nav
        className={`${styles.mobileMenu} ${mobileOpen ? styles.mobileOpen : ""}`}
        aria-label="Mobile"
      >
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`${styles.mobileLink} ${isActive(href) ? styles.linkActive : ""}`}
            onClick={() => setMobileOpen(false)}
          >
            <Icon size={18} aria-hidden />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </header>
  );
}

function ShadowPill({ status }: { status: ShadowStatus }) {
  const awake = status === "awake";
  return (
    <span
      className={`${styles.pill} ${awake ? styles.pillAwake : ""}`}
      title={
        awake
          ? "Your Shadow has awakened."
          : "Your Shadow is still gathering data on you."
      }
    >
      <Ghost size={14} aria-hidden />
      <span className={styles.pillDot} />
      <span className={styles.pillText}>
        Shadow · {awake ? "Awake" : "Dormant"}
      </span>
    </span>
  );
}
