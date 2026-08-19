"use client";

import { useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AppShell, RoleSwitcher } from "@/components/features/app-shell";
import { AskIsv } from "@/components/features/ask-isv";
import { ListingScreen } from "@/components/features/listing";
import { PublicShell } from "@/components/features/public-shell";
import { Field, Wrap } from "@/components/layout";
import { Eyebrow, Text } from "@/components/primitives";
import { events, learning, news, resources } from "@/data/content";
import { useMember } from "@/lib/member-context";

/**
 * Features.
 *
 * The assembled pieces that own state: the two shells, the listing screen
 * and Ask ISV. These are where the product argument lives, so they are worth
 * looking at on their own rather than only inside a page.
 */
const meta: Meta = {
  title: "Gallery/Shells and screens",
  tags: ["!autodocs"],
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj;

export const MemberShell: Story = {
  name: "Portal shell",
  render: () => (
    <AppShell>
      <Field wash tight>
        <Wrap>
          <Eyebrow className="mb-3.5">Ashwood Grange School · Camberwell</Eyebrow>
          <Text as="h1" size="mega">
            The authenticated shell
          </Text>
          <Text size="lede" tone="secondary" measure="reading" className="mt-4">
            No navigation bar. A member lands on what matters, and everything
            else is behind the hamburger. Try the bell, the mail icon and the
            avatar — each opens a panel.
          </Text>
        </Wrap>
      </Field>
    </AppShell>
  ),
};

export const Public: Story = {
  name: "Public shell",
  render: () => (
    <PublicShell>
      <Field wash tight>
        <Wrap>
          <Text as="h1" size="mega" measure="narrow">
            The unauthenticated shell
          </Text>
          <Text size="lede" tone="secondary" measure="reading" className="mt-4">
            The opposite argument. A public site shows its whole shape at once,
            because a first-time visitor has no idea what is behind anything.
            Same type, same palette, different structure.
          </Text>
        </Wrap>
      </Field>
    </PublicShell>
  ),
};

export const Roles: Story = {
  name: "Role switcher",
  render: () => {
    function Demo() {
      const { role, setRole, member } = useMember();
      return (
        <Field>
          <Wrap>
            <Eyebrow className="mb-4">
              Client state only. No navigation, no reload, no re-authentication.
            </Eyebrow>
            <RoleSwitcher role={role} onChange={setRole} />
            <Text size="lede" className="mt-8">
              {member.firstName} {member.lastName} · {member.roleLabel}
            </Text>
            <Text size="small" tone="secondary" measure="reading" className="mt-2">
              Switching rebuilds the landing page from a different composition
              — different module order, different headings, different content.
              Not the same page reordered.
            </Text>
          </Wrap>
        </Field>
      );
    }
    return <Demo />;
  },
};

export const Ask: Story = {
  name: "Ask ISV — member",
  render: () => {
    function Demo() {
      const { setAskOpen } = useMember();
      useEffect(() => setAskOpen(true), [setAskOpen]);
      return <AskIsv />;
    }
    return <Demo />;
  },
};

export const AskPublic: Story = {
  name: "Ask ISV — public",
  render: () => {
    function Demo() {
      const { setAskOpen } = useMember();
      useEffect(() => setAskOpen(true), [setAskOpen]);
      return <AskIsv variant="public" />;
    }
    return <Demo />;
  },
};

export const ListingEvents: Story = {
  name: "Listing — events",
  render: () => (
    <ListingScreen
      eyebrow="What's on"
      heading="Events and sessions"
      intro="Everything ISV is running, in date order. Filter by format or topic to find what suits your school."
      items={[...events, ...learning].sort((a, b) =>
        (a.eventIso ?? "").localeCompare(b.eventIso ?? ""),
      )}
      facets={["format", "category", "area"]}
      dated
      hrefFor={(item) => `/events/${item.id}`}
      actionLabel="Register"
      actionHrefFor={(item) => `/events/${item.id}/register`}
      emptyBody="Try widening the format or topic."
    />
  ),
};

export const ListingNews: Story = {
  name: "Listing — news with featured band",
  render: () => (
    <ListingScreen
      eyebrow="From ISV"
      heading="News and updates"
      intro="Articles, sector commentary and updates from across ISV, newest first."
      items={news}
      facets={["category", "area", "recency"]}
      featuredCount={3}
      hrefFor={(item) => `/news/${item.id}`}
      actionLabel="Read"
      actionHrefFor={(item) => `/news/${item.id}`}
      emptyBody="Try a broader topic."
    />
  ),
};

export const ListingResources: Story = {
  name: "Listing — resources with file marks",
  render: () => (
    <ListingScreen
      eyebrow="Resource library"
      heading="Resources"
      intro="Guidance, templates and reference material published by ISV for member schools."
      items={resources}
      facets={["category", "area"]}
      files
      hrefFor={(item) => `/resources/${item.id}`}
      actionLabel="Download"
      actionHrefFor={(item) => `/resources/${item.id}`}
      emptyBody="Try a broader topic."
    />
  ),
};
