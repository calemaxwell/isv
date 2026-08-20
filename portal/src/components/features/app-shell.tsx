"use client";

import Image from "next/image";
import clsx from "clsx";
import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useEffect, useState, type ReactNode } from "react";
import { Wrap } from "@/components/layout";
import { Bell, Mail, Menu } from "lucide-react";
import {
  Avatar,
  Button,
  ChevronIcon,
  Eyebrow,
  SearchIcon,
  Text,
} from "@/components/primitives";
import { portalAreas } from "@/data/areas";
import { memberAlerts } from "@/data/alerts";
import { quicklinks } from "@/data/quicklinks";
import { useMember } from "@/lib/member-context";
import { fullName } from "@/lib/selectors";
import type { Role } from "@/types";

const ISV_PHONE = "03 9825 7200";
const ISV_EMAIL = "enquiries@is.vic.edu.au";

const ROLE_OPTIONS: { role: Role; label: string }[] = [
  { role: "principal", label: "Principal" },
  { role: "business-manager", label: "Business Manager" },
];

/**
 * The ISV lockup.
 *
 * The mark is ISV's own artwork, not a redraw. It is a PNG rather than an
 * SVG because that is the file we have; when the vector arrives it drops in
 * at the same path and nothing here changes.
 *
 * One component for every surface — portal header, public header, public
 * footer, sign-in, Storybook — so replacing the brand is replacing a file
 * rather than hunting for markup.
 */
export function Logo({
  inverse = false,
  variant = "lockup",
}: {
  inverse?: boolean;
  /** Mark alone where the name is already on screen or space is tight. */
  variant?: "lockup" | "mark";
}) {
  return (
    <span className={clsx("isv-logo", inverse && "isv-logo-inverse")}>
      <Image
        src={inverse ? "/brand/isv-mark-reversed.png" : "/brand/isv-mark.png"}
        alt={variant === "mark" ? "Independent Schools Victoria" : ""}
        width={1163}
        height={684}
        className="isv-mark"
        priority
      />
      {variant === "lockup" ? (
        <span className="isv-wordmark">
          Independent Schools
          <br />
          Victoria
        </span>
      ) : null}
    </span>
  );
}

/* ============================================================
   AppShell — header on every authenticated screen.
   There is no primary navigation bar. PRD s13.
   ============================================================ */
export function AppShell({ children }: { children: ReactNode }) {
  const {
    member,
    school,
    role,
    setAskOpen,
    profileOpen,
    setProfileOpen,
    contactOpen,
    setContactOpen,
    alertsOpen,
    setAlertsOpen,
  } = useMember();

  const [navOpen, setNavOpen] = useState(false);

  const outstanding = memberAlerts.filter(
    (a) => a.relevantTo.includes(role) && a.outstanding,
  ).length;

  // PRD s10: ⌘K / Ctrl+K opens Ask ISV from any authenticated screen.
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

  const initials = `${member.firstName[0]}${member.lastName[0]}`;

  return (
    <>
      {/* No skip link. Removed by direction so the prototype presents as a
          finished product. This costs WCAG 2.4.1 Bypass Blocks and is logged
          in DECISIONS.md as a deliberate trade for the pitch build. */}
      <header className="sticky top-0 z-40 border-b border-line bg-page">
        <div className="mx-auto flex h-appbar max-w-wide items-center gap-4 px-gutter">
          {/* Every area of the portal lives behind this. The page itself
              stays free of a nav bar, per PRD s13 — the member is meant to
              land on what matters, not on a menu. */}
          <button
            type="button"
            onClick={() => setNavOpen(true)}
            aria-label="Open navigation"
            className="-ml-2 grid size-9 place-items-center rounded-md text-secondary transition-colors duration-150 hover:bg-sunken"
          >
            <Menu className="size-5" strokeWidth={1.6} aria-hidden />
          </button>

          <Logo />

          {/* Ask ISV is the primary way in, so it sits on the page's centre
              line rather than tucked beside the logo. The two flexible
              spacers hold it there whatever the logo and action widths do. */}
          <div className="hidden flex-1 sm:block" />

          <button
            type="button"
            onClick={() => setAskOpen(true)}
            className="ask-field hidden h-control items-center gap-2.5 rounded-md border border-line-firm px-3.5 text-small text-tertiary transition-colors duration-150 hover:border-action hover:bg-surface sm:flex"
          >
            <SearchIcon />
            <span>Ask ISV a question</span>
            <span className="ml-auto font-mono text-micro tracking-kbd">⌘K</span>
          </button>

          <div className="flex-1" />

          {/* The action cluster is one object. Icon buttons sit tight to each
              other and the group keeps its distance from the name. */}
          <div className="flex items-center">
          <button
            type="button"
            onClick={() => setAskOpen(true)}
            aria-label="Ask ISV a question"
            className="grid size-9 place-items-center rounded-md text-secondary hover:bg-sunken sm:hidden"
          >
            <SearchIcon />
          </button>

          <button
            type="button"
            onClick={() => setAlertsOpen(true)}
            aria-label={
              outstanding > 0
                ? `Alerts and messages, ${outstanding} needing attention`
                : "Alerts and messages"
            }
            className="relative grid size-9 place-items-center rounded-md text-secondary transition-colors duration-150 hover:bg-sunken"
          >
            <Bell className="size-4.5" strokeWidth={1.6} aria-hidden />
            {outstanding > 0 ? (
              <span className="alert-dot" aria-hidden>
                {outstanding}
              </span>
            ) : null}
          </button>

          <button
            type="button"
            onClick={() => setContactOpen(true)}
            aria-label="Contact ISV"
            className="grid size-9 place-items-center rounded-md text-secondary transition-colors duration-150 hover:bg-sunken"
          >
            <Mail className="size-4.5" strokeWidth={1.6} aria-hidden />
          </button>

          <button
            type="button"
            onClick={() => setProfileOpen(true)}
            className="ml-3 flex h-11 items-center gap-2.5 rounded-md text-small font-medium"
          >
            <span className="hidden whitespace-nowrap lg:inline">{fullName(member)}</span>
            <Avatar initials={initials} />
            <VisuallyHidden>Open your profile</VisuallyHidden>
          </button>
          </div>
        </div>
      </header>

      <main id="main">{children}</main>

      <footer className="border-t border-line bg-field-warm py-field-tight">
        <Wrap>
          <div className="flex flex-wrap items-end gap-8">
            <div className="flex-1">
              <Logo />
              <Text size="micro" tone="tertiary" className="mt-3">
                {school.name} · {school.membershipStatus}
              </Text>
            </div>
            <Text size="micro" tone="tertiary">
              Prototype. Data is illustrative and no ISV system is connected.
            </Text>
          </div>
        </Wrap>
      </footer>

      <NavPanel open={navOpen} onOpenChange={setNavOpen} />
      <ProfilePanel open={profileOpen} onOpenChange={setProfileOpen} />
      <ContactPanel open={contactOpen} onOpenChange={setContactOpen} />
      <AlertsPanel open={alertsOpen} onOpenChange={setAlertsOpen} />
    </>
  );
}

/* ============================================================
   RoleSwitcher — client state change. No navigation, no reload,
   no re-authentication. PRD s11.
   ============================================================ */
export function RoleSwitcher({
  role,
  onChange,
}: {
  role: Role;
  onChange: (role: Role) => void;
}) {
  const current = ROLE_OPTIONS.find((option) => option.role === role);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label={`View the portal as. Currently ${current?.label}`}
          className="flex h-control items-center gap-2.5 rounded-md border border-line-control px-3.5 text-small font-medium transition-colors duration-150 hover:border-action"
        >
          <span aria-hidden className="hidden sm:inline">
            {current?.label}
          </span>
          <span aria-hidden className="sm:hidden">
            Role
          </span>
          <ChevronIcon className="text-tertiary" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={6}
          className="z-50 min-w-56 rounded-md border border-line bg-surface p-1.5 shadow-raised"
        >
          <DropdownMenu.Label className="px-3 py-2 text-micro font-semibold uppercase tracking-eyebrow text-tertiary">
            View the portal as
          </DropdownMenu.Label>
          {ROLE_OPTIONS.map((option) => (
            <DropdownMenu.Item
              key={option.role}
              onSelect={() => onChange(option.role)}
              className="menu-item"
            >
              {option.label}
              {option.role === role ? (
                <span className="ml-2 text-micro text-tertiary">Current</span>
              ) : null}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

/* ============================================================
   Panels
   ============================================================ */
function PanelShell({
  open,
  onOpenChange,
  title,
  side = "right",
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  side?: "left" | "right";
  children: ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-field-ink/40" />
        <Dialog.Content
          aria-describedby={undefined}
          className={clsx(
            "fixed top-0 z-50 flex h-full w-full max-w-md flex-col overflow-y-auto bg-page p-8 shadow-panel",
            side === "left"
              ? "left-0 border-r border-line"
              : "right-0 border-l border-line",
          )}
        >
          <Dialog.Title asChild>
            <Text as="h2" size="h2" className="mb-6">
              {title}
            </Text>
          </Dialog.Title>
          {children}
          <Dialog.Close asChild>
            <Button variant="secondary" className="panel-close">
              Close
            </Button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/* ============================================================
   NavPanel — the full portal in one place.

   Areas first, as a numbered index rather than a list of links, so it
   reads as a table of contents for the portal. Quicklinks below it,
   which is where role tailoring shows up: a Principal and a Business
   Manager open this and see a different second half.
   ============================================================ */
export function NavPanel({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { role } = useMember();
  const mine = quicklinks.filter((q) => q.relevantTo.includes(role));

  return (
    <PanelShell
      open={open}
      onOpenChange={onOpenChange}
      side="left"
      title="Everything in the portal"
    >
      <Eyebrow className="mb-2">Areas</Eyebrow>
      <nav className="mb-10">
        {portalAreas.map((area, i) => (
          <a key={area.id} href={area.href} className="nav-area">
            <span className="nav-area-index">
              {String(i + 1).padStart(2, "0")}
            </span>
            <Text as="span" size="h3">
              {area.label}
            </Text>
          </a>
        ))}
      </nav>

      <Eyebrow className="mb-2">
        {role === "principal" ? "What principals open most" : "What business managers open most"}
      </Eyebrow>
      <div className="nav-quick">
        {mine.map((link) => (
          <a key={link.id} href={link.href} className="nav-quick-row">
            <Text as="span" size="small" className="font-medium">
              {link.label}
            </Text>
            <Text as="span" size="micro" tone="tertiary">
              {link.note}
            </Text>
          </a>
        ))}
      </div>

    </PanelShell>
  );
}

export function ProfilePanel({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { member, school, role, setRole } = useMember();

  return (
    <PanelShell open={open} onOpenChange={onOpenChange} title="Your profile">
      {/* The role switcher lives here rather than in the header. Switching
          how the portal is composed is a profile setting, not a piece of
          global navigation. Costs one click in the demo, so open the panel
          before the switch rather than during it. */}
      <div className="mb-8 bg-field-mist p-cell">
        <Eyebrow className="mb-3">View the portal as</Eyebrow>
        <RoleSwitcher role={role} onChange={setRole} />
      </div>

      <dl className="border-t border-line">
        {[
          ["Name", fullName(member)],
          ["Role", member.roleLabel],
          ["School", school.name],
          ["Email", member.email],
          ["Phone", member.phone],
          ["Membership", school.membershipStatus],
        ].map(([label, value]) => (
          <div
            key={label}
            className="flex items-baseline gap-4 border-b border-line py-3.5"
          >
            <dt className="w-28 shrink-0 text-micro uppercase tracking-eyebrow text-tertiary">
              {label}
            </dt>
            <dd className="text-small">{value}</dd>
          </div>
        ))}
      </dl>

      <Eyebrow className="mt-8 mb-3">Communication preferences</Eyebrow>
      <ul className="border-t border-line">
        {member.communicationPreferences.map((pref) => (
          <li
            key={pref.channel}
            className="flex items-baseline gap-4 border-b border-line py-3.5"
          >
            <span className="flex-1 text-small">{pref.channel}</span>
            <span className="text-micro text-tertiary">
              {pref.subscribed ? pref.frequency : "Not subscribed"}
            </span>
          </li>
        ))}
      </ul>

    </PanelShell>
  );
}

/**
 * Alerts and messages.
 *
 * The distinction the panel is built on: actions are ISV asking the member
 * for something and they clear when acted on. Messages are ISV telling the
 * member something and they do not. Only actions drive the header count,
 * because a count that never reaches zero stops meaning anything.
 */
export function AlertsPanel({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { role, resolvedAlerts, resolveAlert, setProfileOpen, setContactOpen } =
    useMember();

  const mine = memberAlerts.filter((a) => a.relevantTo.includes(role));
  const actions = mine.filter(
    (a) => a.kind === "action" && !resolvedAlerts.includes(a.id),
  );
  const done = mine.filter(
    (a) => a.kind === "action" && resolvedAlerts.includes(a.id),
  );
  const messages = mine.filter((a) => a.kind === "message");

  function act(alert: (typeof memberAlerts)[number]) {
    resolveAlert(alert.id);
    if (alert.href === "#profile") {
      onOpenChange(false);
      setProfileOpen(true);
    } else if (alert.href === "#contact") {
      onOpenChange(false);
      setContactOpen(true);
    }
  }

  return (
    <PanelShell open={open} onOpenChange={onOpenChange} title="Alerts">
      <Eyebrow className="mb-3">
        {actions.length > 0
          ? `${actions.length} needing your attention`
          : "Nothing needs your attention"}
      </Eyebrow>

      {actions.length === 0 ? (
        <Text size="small" tone="secondary">
          You are up to date. Anything ISV needs from your school will appear
          here.
        </Text>
      ) : (
        <ul>
          {actions.map((alert) => (
            <li key={alert.id} className="row-rule py-4">
              <Text as="p" size="h3">
                {alert.title}
              </Text>
              <Text size="small" tone="secondary" className="mt-1.5">
                {alert.detail}
              </Text>
              <div className="mt-3">
                <Button size="sm" onClick={() => act(alert)}>
                  {alert.actionLabel}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {done.length > 0 ? (
        <>
          <Eyebrow className="mt-8 mb-3">Done just now</Eyebrow>
          <ul>
            {done.map((alert) => (
              <li key={alert.id} className="row-rule py-3">
                <Text size="small" tone="tertiary">
                  {alert.title}
                </Text>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      <Eyebrow className="mt-8 mb-3">Messages</Eyebrow>
      <ul>
        {messages.map((alert) => (
          <li key={alert.id} className="row-rule py-4">
            <Text as="p" size="small" className="font-semibold">
              {alert.title}
            </Text>
            <Text size="small" tone="secondary" className="mt-1">
              {alert.detail}
            </Text>
          </li>
        ))}
      </ul>
    </PanelShell>
  );
}

export function ContactPanel({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { school } = useMember();

  return (
    <PanelShell open={open} onOpenChange={onOpenChange} title="Contact ISV">
      <Text size="small" tone="secondary" measure="narrow">
        We can help with anything you cannot find in the portal.
      </Text>

      <dl className="mt-6 border-t border-line">
        {[
          ["Phone", ISV_PHONE],
          ["Email", ISV_EMAIL],
          ["Your school", school.name],
        ].map(([label, value]) => (
          <div
            key={label}
            className="flex items-baseline gap-4 border-b border-line py-3.5"
          >
            <dt className="w-28 shrink-0 text-micro uppercase tracking-eyebrow text-tertiary">
              {label}
            </dt>
            <dd className="text-small">{value}</dd>
          </div>
        ))}
      </dl>

    </PanelShell>
  );
}
