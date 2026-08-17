"use client";

import { useEffect, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { Wrap } from "@/components/layout";
import { Logo } from "@/components/features/app-shell";
import { LinkButton, SearchIcon, Text } from "@/components/primitives";
import { isv, publicNav } from "@/data/public-site";
import { useMember } from "@/lib/member-context";
import { AskIsv } from "@/components/features/ask-isv";

/**
 * Shell for the public site.
 *
 * Deliberately not the portal shell. The portal has no navigation bar
 * because a member lands on what matters; a public site has to show its
 * whole shape at once, because a first-time visitor has no idea what is
 * behind anything. Same type, same colour, different structural argument —
 * and that contrast is worth pointing at in the room.
 */
export function PublicShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { setAskOpen } = useMember();

  // Same shortcut as the portal. A visitor who learns it here keeps it.
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setAskOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setAskOpen]);

  return (
    <>
      <div className="public-utility">
        <Wrap>
          <div className="public-utility-row">
            <a href={`tel:${isv.phone.replace(/\s/g, "")}`} className="utility-link">
              <Phone className="size-3.5" strokeWidth={1.8} aria-hidden />
              {isv.phone}
            </a>
            <span className="hidden sm:inline">{isv.address}</span>
            <span className="ml-auto flex items-center gap-5">
              <a href="/sign-in" className="utility-link font-semibold">
                Member sign in
              </a>
            </span>
          </div>
        </Wrap>
      </div>

      <header className="public-header">
        <Wrap>
          <div className="public-header-row">
            <a href="/" className="no-underline">
              <Logo />
            </a>

            <nav className="public-nav" aria-label="Main">
              {publicNav.map((item) => (
                <a key={item.label} href={item.href}>
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Icon and two words at a fixed width. It does not grow on
                hover — the click opens the full Ask ISV view, and a control
                that changes shape under the cursor before doing anything
                promises an inline search it never delivers. */}
            <button
              type="button"
              onClick={() => setAskOpen(true)}
              className="public-ask"
            >
              <SearchIcon />
              <span>Ask ISV</span>
            </button>

            <button
              type="button"
              className="public-ask-compact"
              onClick={() => setAskOpen(true)}
              aria-label="Ask ISV a question"
            >
              <SearchIcon />
            </button>

            <button
              type="button"
              className="public-menu-toggle"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? (
                <X className="size-5" strokeWidth={1.6} aria-hidden />
              ) : (
                <Menu className="size-5" strokeWidth={1.6} aria-hidden />
              )}
            </button>
          </div>

          {open ? (
            <nav className="public-nav-mobile" aria-label="Main">
              {publicNav.map((item) => (
                <a key={item.label} href={item.href}>
                  {item.longLabel}
                </a>
              ))}
              <a href="/sign-in" className="font-semibold">
                Member sign in
              </a>
            </nav>
          ) : null}
        </Wrap>
      </header>

      <main>{children}</main>

      <AskIsv variant="public" />

      <footer className="public-footer">
        <Wrap>
          <div className="public-footer-grid">
            <div>
              <Logo inverse />
              <Text size="small" tone="inverseSoft" className="mt-4">
                {isv.address}
                <br />
                {isv.country}
              </Text>
              <Text size="small" tone="inverseSoft" className="mt-3">
                {isv.phone}
                <br />
                {isv.email}
              </Text>
              <Text size="micro" tone="inverseFaint" className="mt-3">
                {isv.acn}
              </Text>
            </div>

            <div>
              <Text
                as="h2"
                size="micro"
                tone="inverseFaint"
                className="mb-3 font-semibold uppercase tracking-eyebrow"
              >
                Explore
              </Text>
              <ul className="public-footer-list">
                {publicNav.map((item) => (
                  <li key={item.label}>
                    <a href={item.href}>{item.longLabel}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <Text
                as="h2"
                size="micro"
                tone="inverseFaint"
                className="mb-3 font-semibold uppercase tracking-eyebrow"
              >
                Quicklinks
              </Text>
              <ul className="public-footer-list">
                <li>
                  <a
                    href="https://theparentswebsite.com.au"
                    target="_blank"
                    rel="noreferrer"
                  >
                    The Parents Website
                  </a>
                </li>
                <li>
                  <a
                    href="https://artslearningfestival.com.au"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Arts Learning Festival
                  </a>
                </li>
                <li>
                  <a href="#">Reconciliation Action Plan</a>
                </li>
                <li>
                  <a href="#">Privacy policy</a>
                </li>
                <li>
                  <a href="#">Terms of use</a>
                </li>
              </ul>
            </div>

            <div>
              <Text
                as="h2"
                size="micro"
                tone="inverseFaint"
                className="mb-3 font-semibold uppercase tracking-eyebrow"
              >
                Member schools
              </Text>
              <Text size="small" tone="inverseSoft" className="mb-4">
                Staff of ISV Member Schools sign in for resources, advice and
                professional learning.
              </Text>
              <LinkButton variant="onInverse" size="sm" href="/sign-in">
                Sign in
              </LinkButton>
            </div>
          </div>

          {/* Acknowledgement last and unhurried. It gets its own rule and its
              own width rather than being folded into a legal strip. */}
          <div className="public-acknowledgement">
            <Text size="small" tone="inverseSoft" measure="reading">
              {isv.acknowledgement}
            </Text>
          </div>
        </Wrap>
      </footer>
    </>
  );
}
