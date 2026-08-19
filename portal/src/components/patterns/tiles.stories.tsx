import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Field, Wrap } from "@/components/layout";
import {
  EventTile,
  LeadEventTile,
  ServiceTile,
  Tile,
  TileBody,
  TileGrid,
  TileHeading,
  TileLink,
  TilePill,
} from "@/components/patterns";
import { Eyebrow, LinkButton, Text } from "@/components/primitives";
import { events, learning } from "@/data/content";
import { services } from "@/data/services";

/**
 * Tiles.
 *
 * The mosaic system. Used for browse modules — services, events, learning,
 * news — where nobody has decided anything yet. Scan modules stay as ruled
 * lists, because a member looking for what changed reads rows faster than
 * tiles.
 *
 * There are no white tiles. A white box on a warm page reads as a component
 * sitting on top of the design rather than part of it, and eight of them in
 * a column is what made the middle of the landing page feel repetitive.
 */
const meta: Meta = {
  title: "Patterns/Tiles",
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj;

const TONES = ["paper", "sand", "mist", "ochre", "clay", "forest"] as const;

export const Tones: Story = {
  render: () => (
    <Field>
      <Wrap>
        <Eyebrow className="mb-5">Every tone, same content</Eyebrow>
        <TileGrid>
          {TONES.map((tone) => (
            <Tile key={tone} tone={tone} span={2}>
              <span className="mb-4">
                <TilePill tone={tone}>Label</TilePill>
              </span>
              <TileHeading className="text-h3">{tone}</TileHeading>
              <TileBody tone={tone}>
                Body copy shifts to an inverse tone automatically on the three
                dark grounds.
              </TileBody>
              <TileLink>Open</TileLink>
            </Tile>
          ))}
        </TileGrid>
      </Wrap>
    </Field>
  ),
};

export const Spans: Story = {
  name: "Spans and rows",
  render: () => (
    <Field>
      <Wrap>
        <Eyebrow className="mb-5">
          Four columns. Every row has to close, or the grid leaves a hole.
        </Eyebrow>
        <TileGrid>
          <Tile tone="forest" span={2} rows={2}>
            <TileHeading serif>span 2 · rows 2</TileHeading>
            <TileBody tone="forest">The lead shape.</TileBody>
          </Tile>
          <Tile tone="sand">
            <TileHeading className="text-h3">span 1</TileHeading>
          </Tile>
          <Tile tone="mist">
            <TileHeading className="text-h3">span 1</TileHeading>
          </Tile>
          <Tile tone="paper" span={2}>
            <TileHeading className="text-h3">span 2</TileHeading>
          </Tile>
          <Tile tone="clay" span={4}>
            <TileHeading className="text-h3">span 4 — full width</TileHeading>
          </Tile>
        </TileGrid>
      </Wrap>
    </Field>
  ),
};

export const Service: Story = {
  name: "Service tile",
  render: () => (
    <Field>
      <Wrap>
        <Eyebrow className="mb-5">
          Pill off in the support module — every pathway is included, so three
          identical pills across a row said nothing and pushed the headings down
        </Eyebrow>
        <div className="support-grid">
          {services.slice(0, 3).map((service, i) => (
            <ServiceTile
              key={service.id}
              service={service}
              href={`/services/${service.slug}`}
              tone={(["forest", "clay", "ochre"] as const)[i]}
              lead
              pill={false}
            />
          ))}
        </div>

        <div className="mt-12">
          <Eyebrow className="mb-5">With the pill on</Eyebrow>
          <TileGrid>
            {services.slice(0, 2).map((service) => (
              <ServiceTile
                key={service.id}
                service={service}
                href={`/services/${service.slug}`}
                tone="sand"
                span={2}
              />
            ))}
          </TileGrid>
        </div>
      </Wrap>
    </Field>
  ),
};

export const Events: Story = {
  name: "Event tiles",
  render: () => {
    const [lead, ...rest] = events;
    return (
      <Field>
        <Wrap>
          <Eyebrow className="mb-5">
            The date carries display weight, because that is what a member
            scans an event list for
          </Eyebrow>
          <TileGrid>
            <LeadEventTile
              item={lead}
              near
              action={
                <LinkButton variant="onInverse" size="sm" href="#">
                  Register
                </LinkButton>
              }
            />
            {rest.slice(0, 2).map((item) => (
              <EventTile key={item.id} item={item} tone="paper" />
            ))}
            {rest.slice(2, 3).map((item) => (
              <EventTile key={item.id} item={item} tone="sand" near span={4} />
            ))}
          </TileGrid>
        </Wrap>
      </Field>
    );
  },
};

export const Learning: Story = {
  name: "Featured learning pair",
  render: () => (
    <Field tone="warm">
      <Wrap>
        <Text as="h2" size="h2" className="section-header">
          Your leadership development
        </Text>
        <TileGrid>
          {learning.slice(0, 2).map((item, i) => (
            <LeadEventTile
              key={item.id}
              item={item}
              tone={(["clay", "forest"] as const)[i]}
              action={
                <LinkButton variant="onInverse" size="sm" href="#">
                  Register
                </LinkButton>
              }
            />
          ))}
        </TileGrid>
      </Wrap>
    </Field>
  ),
};
