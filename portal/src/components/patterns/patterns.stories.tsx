import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Field, SectionHeader, Wrap } from "@/components/layout";
import {
  Artwork,
  EmptyState,
  FeaturedBand,
  FileIcon,
  IndexList,
  RequestRow,
  ScheduleList,
  StoryCard,
  StoryGrid,
  UpdateLead,
  categoryLabel,
} from "@/components/patterns";
import { Eyebrow, Text } from "@/components/primitives";
import { events, news, resources, updates } from "@/data/content";
import { fileMeta, resourceFile } from "@/data/files";
import { parentStories } from "@/data/parents";
import { seededRequests } from "@/data/requests";
import { getService } from "@/lib/selectors";

/**
 * Patterns.
 *
 * The composed pieces. Where tiles are for browsing, these are for scanning
 * and reading — ruled rows, indexes, story cards and the editorial furniture
 * that holds a long page together.
 */
const meta: Meta = {
  title: "Gallery/Lists and cards",
  tags: ["!autodocs"],
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj;

export const Index: Story = {
  name: "Index list",
  render: () => (
    <>
      <Field>
        <Wrap>
          <SectionHeader heading="Numbered index" moreLabel="Resource library" moreHref="/resources" />
          <IndexList
            items={resources.slice(0, 4)}
            hrefFor={(item) => `/resources/${item.id}`}
          />
        </Wrap>
      </Field>
      <Field tone="forest">
        <Wrap>
          <SectionHeader heading="On an inverse field" inverse />
          <IndexList items={resources.slice(0, 3)} inverse />
        </Wrap>
      </Field>
    </>
  ),
};

export const Schedule: Story = {
  name: "Schedule list",
  render: () => (
    <>
      <Field>
        <Wrap>
          <SectionHeader heading="Two columns" />
          <ScheduleList items={events.slice(0, 4)} />
        </Wrap>
      </Field>
      <Field tone="warm">
        <Wrap>
          <SectionHeader heading="One column — used under a featured pair" />
          <ScheduleList items={events.slice(0, 3)} columns={1} />
        </Wrap>
      </Field>
    </>
  ),
};

export const Requests: Story = {
  name: "Request rows",
  render: () => (
    <Field tone="sand" tight>
      <Wrap>
        <SectionHeader heading="Open with ISV" />
        <div className="request-panel">
          {seededRequests.map((request) => (
            <RequestRow
              key={request.id}
              request={request}
              serviceName={
                getService(request.serviceId)?.name ?? "ISV support"
              }
              href={`/requests/${request.id}`}
            />
          ))}
        </div>
      </Wrap>
    </Field>
  ),
};

export const Updates: Story = {
  name: "Update lead",
  render: () => (
    <Field tone="warm">
      <Wrap>
        <SectionHeader heading="What's changed" moreLabel="All updates" moreHref="/news" />
        <UpdateLead
          items={updates.slice(0, 5)}
          sinceLabel="Four updates since I last looked"
          contextLine="Mostly governance, people and compliance."
        />
      </Wrap>
    </Field>
  ),
};

export const Cards: Story = {
  name: "Story cards",
  render: () => (
    <Field tone="mist">
      <Wrap>
        <SectionHeader heading="Support for parents" moreLabel="The Parents Website" />
        <StoryGrid>
          {parentStories.slice(0, 3).map((story, i) => (
            <StoryCard
              key={story.id}
              tone={(["image", "clay", "image"] as const)[i]}
              imageUrl={story.imageUrl}
              eyebrow={story.category}
              title={story.title}
              summary={story.summary}
              meta={`${story.readMinutes} min read`}
              href={story.href}
              external
            />
          ))}
        </StoryGrid>

        <div className="mt-12">
          <Eyebrow className="mb-5">Colour-only variants</Eyebrow>
          <StoryGrid>
            {(["navy", "ochre", "sand"] as const).map((tone, i) => (
              <StoryCard
                key={tone}
                tone={tone}
                eyebrow={categoryLabel(news[i].category)}
                title={news[i].title}
                summary={news[i].summary}
                meta={news[i].recencyLabel}
                href={`/news/${news[i].id}`}
                linkLabel="Read the article"
              />
            ))}
          </StoryGrid>
        </div>
      </Wrap>
    </Field>
  ),
};

export const Featured: Story = {
  name: "Featured band",
  render: () => (
    <Field tight>
      <Wrap>
        <FeaturedBand
          lead={{
            eyebrow: categoryLabel(news[0].category),
            title: news[0].title,
            summary: news[0].summary,
            meta: news[0].recencyLabel,
            href: `/news/${news[0].id}`,
          }}
          rest={news.slice(1, 3).map((item) => ({
            id: item.id,
            eyebrow: categoryLabel(item.category),
            title: item.title,
            summary: item.summary,
            meta: item.recencyLabel,
            href: `/news/${item.id}`,
          }))}
        />
      </Wrap>
    </Field>
  ),
};

export const Files: Story = {
  name: "File format marks",
  render: () => (
    <Field>
      <Wrap>
        <SectionHeader heading="File formats" />
        <Text size="small" tone="secondary" measure="reading" className="mb-8">
          Format is the first thing a member checks before downloading, so it
          gets a mark rather than a line of text. A template is a very
          different proposition to a forty page guide.
        </Text>
        <div className="grid gap-5">
          {resources.slice(0, 6).map((item) => (
            <div key={item.id} className="file-line">
              <FileIcon kind={resourceFile(item.id).kind} large />
              <span>
                <Text as="span" size="small" className="block font-semibold">
                  {item.title}
                </Text>
                <Text as="span" size="micro" tone="tertiary" className="block">
                  {fileMeta(item.id)}
                </Text>
              </span>
            </div>
          ))}
        </div>
      </Wrap>
    </Field>
  ),
};

export const Furniture: Story = {
  name: "Artwork and empty state",
  render: () => (
    <>
      <Field>
        <Wrap>
          <SectionHeader heading="Student artwork" />
          <Text size="small" tone="secondary" measure="reading" className="mb-6">
            A stand-in for the isArtworks collection, drawn in CSS. The
            composition sits in a fixed-ratio canvas — positioned as
            percentages of the outer box, the shapes stretched into smears
            whenever the panel was wider than it was tall.
          </Text>
          <div className="grid gap-6 md:grid-cols-2">
            <Artwork variant="a" caption="Ruby N., Year 9 · isArtworks" className="rounded-tile" />
            <Artwork variant="b" caption="Student artwork · isArtworks" className="rounded-tile" />
          </div>
        </Wrap>
      </Field>

      <Field tone="warm">
        <Wrap>
          <SectionHeader heading="Empty state" />
          <EmptyState
            heading="No open requests"
            body="Requests we make through the portal appear here, so we can follow where each one sits."
          />
        </Wrap>
      </Field>
    </>
  ),
};
