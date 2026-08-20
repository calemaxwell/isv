"use client";

import { Plus } from "lucide-react";
import { AppShell } from "@/components/features/app-shell";
import { AskIsv } from "@/components/features/ask-isv";
import { Field, SectionHeader, Wrap } from "@/components/layout";
import {
  EmptyState,
  FileIcon,
  IndexList,
  Tile,
  TileBody,
  TileGrid,
  TileHeading,
  TileLink,
  TilePill,
} from "@/components/patterns";
import {
  AppLink,
  Eyebrow,
  LinkButton,
  Text,
} from "@/components/primitives";
import { resources } from "@/data/content";
import { employmentResourceIds, hiringTemplates } from "@/data/jobs";
import { useMember } from "@/lib/member-context";
import { formatDate, relativeUpcoming } from "@/lib/selectors";

/**
 * Employment and HR.
 *
 * The only area of the portal where a member does work rather than finds
 * things. Everything else answers "where is it"; this answers "what is
 * waiting on me", which is why it opens with applicants rather than with a
 * search field.
 *
 * Three things in one place, in the order a Business Manager needs them:
 * what is open, who has applied, and the paperwork. Those live in three
 * different systems in most schools, and putting them on one screen is the
 * whole argument.
 */
export default function EmploymentPage() {
  const { jobs, applicants, applicantsFor, school } = useMember();

  const open = jobs.filter((job) => job.status === "open");
  const closed = jobs.filter((job) => job.status === "closed");
  const toReview = applicants.filter(
    (a) => a.status === "new" && open.some((job) => job.id === a.jobId),
  );
  const shortlisted = applicants.filter((a) => a.status === "shortlisted");

  const isvResources = resources.filter((r) =>
    employmentResourceIds.includes(r.id),
  );

  return (
    <AppShell>
      {/* ---------------- Masthead ---------------- */}
      <Field wash tight>
        <Wrap>
          <div className="masthead-row">
            <div className="masthead-lead">
              <Eyebrow className="mb-3.5">
                {school.name} · Employment and HR
              </Eyebrow>
              <Text as="h1" size="mega">
                Hiring
              </Text>
              <Text
                size="lede"
                tone="secondary"
                measure="reading"
                className="mt-4"
              >
                {open.length} {open.length === 1 ? "role" : "roles"} open,{" "}
                {toReview.length}{" "}
                {toReview.length === 1 ? "application" : "applications"} waiting
                on you, and every template you need to run the process.
              </Text>
            </div>

            <LinkButton href="/employment/jobs/new">
              <span className="btn-icon">
                <Plus className="size-4" strokeWidth={2} aria-hidden />
                Post a job ad
              </span>
            </LinkButton>
          </div>
        </Wrap>
      </Field>

      {/* ---------------- Waiting on you ---------------- */}
      <Field tone="sand" tight>
        <Wrap>
          <SectionHeader heading="Waiting on you" />
          {toReview.length === 0 ? (
            <EmptyState
              heading="Nothing to review"
              body="New applications appear here as they arrive."
            />
          ) : (
            <div className="request-panel">
              {toReview.slice(0, 5).map((applicant) => {
                const job = jobs.find((j) => j.id === applicant.jobId);
                return (
                  <AppLink
                    key={applicant.id}
                    href={`/employment/jobs/${applicant.jobId}`}
                    className="applicant-row"
                  >
                    <span className="min-w-0">
                      <Text as="span" size="h3" className="block">
                        {applicant.name}
                      </Text>
                      <Text
                        as="span"
                        size="micro"
                        tone="tertiary"
                        className="mt-1 block"
                      >
                        {applicant.current}
                      </Text>
                    </span>
                    <Text as="span" size="small" tone="secondary">
                      {job?.title}
                    </Text>
                    <Text as="span" size="micro" tone="tertiary">
                      Applied {formatDate(applicant.appliedIso)}
                    </Text>
                  </AppLink>
                );
              })}
            </div>
          )}
        </Wrap>
      </Field>

      {/* ---------------- Open roles ---------------- */}
      <Field>
        <Wrap>
          <SectionHeader
            heading="Open roles"
            moreLabel={closed.length > 0 ? `${closed.length} closed` : undefined}
            moreHref="#closed"
          />

          {open.length === 0 ? (
            <EmptyState
              heading="No roles open"
              body="Post an ad and it will appear here with its applications."
            />
          ) : (
            <TileGrid>
              {open.map((job, i) => {
                const list = applicantsFor(job.id);
                const fresh = list.filter((a) => a.status === "new").length;
                const short = list.filter(
                  (a) => a.status === "shortlisted",
                ).length;
                const tone = (["forest", "ochre", "mist", "sand"] as const)[
                  i % 4
                ];

                return (
                  <Tile key={job.id} tone={tone} span={2} rows={2}>
                    <span className="mb-4">
                      <TilePill tone={tone}>
                        Closes {relativeUpcoming(job.closesIso)}
                      </TilePill>
                    </span>
                    <TileHeading serif>
                      <AppLink
                        href={`/employment/jobs/${job.id}`}
                        className="tile-title-link"
                      >
                        {job.title}
                      </AppLink>
                    </TileHeading>
                    <TileBody tone={tone}>{job.summary}</TileBody>

                    <span className="mt-auto pt-7 block">
                      <Text
                        as="span"
                        size="micro"
                        tone={tone === "forest" ? "inverseFaint" : "tertiary"}
                        className="block"
                      >
                        {job.employmentType} · {job.department}
                      </Text>
                      <span className="applicant-tally">
                        <span className="tally-figure">{list.length}</span>
                        <Text
                          as="span"
                          size="micro"
                          tone={tone === "forest" ? "inverseSoft" : "secondary"}
                        >
                          {list.length === 1 ? "application" : "applications"}
                          {fresh > 0 ? ` · ${fresh} new` : ""}
                          {short > 0 ? ` · ${short} shortlisted` : ""}
                        </Text>
                      </span>
                      <TileLink>Review applicants</TileLink>
                    </span>
                  </Tile>
                );
              })}
            </TileGrid>
          )}
        </Wrap>
      </Field>

      {/* ---------------- Shortlisted ---------------- */}
      {shortlisted.length > 0 ? (
        <Field tone="warm" tight>
          <Wrap>
            <SectionHeader heading="Shortlisted" />
            <ul className="listing">
              {shortlisted.map((applicant) => {
                const job = jobs.find((j) => j.id === applicant.jobId);
                return (
                  <li key={applicant.id}>
                    <div className="listing-row">
                      <span className="listing-lead">
                        <Text as="span" size="small" className="font-semibold">
                          {applicant.name}
                        </Text>
                        <Text as="span" size="micro" tone="tertiary">
                          {applicant.years === 0
                            ? "Graduate"
                            : `${applicant.years} years`}
                        </Text>
                      </span>
                      <span className="listing-body">
                        <Text as="span" size="small" className="block">
                          {applicant.current}
                        </Text>
                        <Text
                          as="span"
                          size="micro"
                          tone="tertiary"
                          className="mt-1 block"
                        >
                          {job?.title}
                        </Text>
                      </span>
                      <LinkButton
                        variant="secondary"
                        size="sm"
                        href={`/employment/jobs/${applicant.jobId}`}
                        className="listing-action"
                      >
                        Open
                      </LinkButton>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Wrap>
        </Field>
      ) : null}

      {/* ---------------- Templates ---------------- */}
      <Field id="templates">
        <Wrap>
          <SectionHeader heading="Templates" />
          <Text size="small" tone="secondary" measure="reading" className="mb-8">
            Published by ISV for member schools, and written to be adapted to
            your own school rather than used unchanged.
          </Text>

          <div className="template-grid">
            {hiringTemplates.map((template) => (
              <AppLink
                key={template.id}
                href="/resources"
                className="template-row"
              >
                <FileIcon kind="doc" />
                <span className="min-w-0">
                  <Text as="span" size="small" className="block font-semibold">
                    {template.title}
                  </Text>
                  <Text as="span" size="micro" tone="tertiary" className="block">
                    {template.note}
                  </Text>
                </span>
              </AppLink>
            ))}
          </div>
        </Wrap>
      </Field>

      {/* ---------------- ISV guidance ---------------- */}
      <Field tone="warm">
        <Wrap>
          <SectionHeader
            heading="Guidance from ISV"
            moreLabel="Resource library"
            moreHref="/resources"
          />
          <IndexList
            items={isvResources}
            hrefFor={(item) => `/resources/${item.id}`}
          />
          <Text size="micro" tone="tertiary" measure="reading" className="mt-8">
            For a question specific to your school, ISV&rsquo;s employment
            relations support is included in your membership.{" "}
            <AppLink
              href="/services/employment-relations-support"
              className="underline underline-offset-4"
            >
              Request support
            </AppLink>
          </Text>
        </Wrap>
      </Field>

      {/* ---------------- Closed ---------------- */}
      {closed.length > 0 ? (
        <Field id="closed" tight>
          <Wrap>
            <SectionHeader heading="Closed" />
            <ul className="listing">
              {closed.map((job) => (
                <li key={job.id}>
                  <div className="listing-row">
                    <span className="listing-lead">
                      <Text as="span" size="small" className="font-semibold">
                        Closed
                      </Text>
                      <Text as="span" size="micro" tone="tertiary">
                        {formatDate(job.closedIso ?? job.closesIso)}
                      </Text>
                    </span>
                    <span className="listing-body">
                      <Text as="span" size="h3" className="block">
                        <AppLink
                          href={`/employment/jobs/${job.id}`}
                          className="tile-title-link"
                        >
                          {job.title}
                        </AppLink>
                      </Text>
                      <Text
                        as="span"
                        size="micro"
                        tone="tertiary"
                        className="mt-1 block"
                      >
                        {job.employmentType} · {applicantsFor(job.id).length}{" "}
                        applications
                      </Text>
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </Wrap>
        </Field>
      ) : null}

      <AskIsv />
    </AppShell>
  );
}
