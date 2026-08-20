"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Check, RotateCcw, X } from "lucide-react";
import { AppShell } from "@/components/features/app-shell";
import { AskIsv } from "@/components/features/ask-isv";
import { Field, SectionHeader, Wrap } from "@/components/layout";
import { EmptyState } from "@/components/patterns";
import { Button, Eyebrow, Text } from "@/components/primitives";
import type { ApplicantStatus } from "@/data/jobs";
import { useMember } from "@/lib/member-context";
import { formatDateWithYear, relativeUpcoming } from "@/lib/selectors";

type Filter = "all" | ApplicantStatus;

/**
 * A job ad, and the people who applied to it.
 *
 * Deliberately one screen rather than two. A Business Manager shortlisting
 * is constantly checking the ad against the applicant — did we ask for VIT,
 * did we say full time — and splitting those across pages means holding the
 * requirements in your head while you read a CV.
 *
 * Shortlist and decline are one click and immediately reversible. An
 * applicant list is not a place for confirmation dialogues: you are moving
 * through twenty people quickly, and the cost of a misclick has to be a
 * second click rather than a modal.
 */
export default function JobDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { getJob, applicantsFor, closeJob, reopenJob, setApplicantStatus } =
    useMember();

  const [filter, setFilter] = useState<Filter>("all");
  const job = getJob(params.id);

  if (!job) {
    return (
      <AppShell>
        <Field>
          <Wrap>
            <Text as="h1" size="display">
              We couldn&rsquo;t find that job ad
            </Text>
            <div className="mt-8">
              <Button onClick={() => router.push("/employment")}>
                Back to Employment and HR
              </Button>
            </div>
          </Wrap>
        </Field>
        <AskIsv />
      </AppShell>
    );
  }

  const all = applicantsFor(job.id);
  const counts = {
    all: all.length,
    new: all.filter((a) => a.status === "new").length,
    shortlisted: all.filter((a) => a.status === "shortlisted").length,
    declined: all.filter((a) => a.status === "declined").length,
  };
  const shown = filter === "all" ? all : all.filter((a) => a.status === filter);
  const closedOut = job.status === "closed";

  return (
    <AppShell>
      {/* ---------------- Header ---------------- */}
      <Field wash tight>
        <Wrap>
          <Eyebrow className="mb-3.5">
            Employment and HR · {job.department}
            {closedOut ? " · Closed" : ""}
          </Eyebrow>
          <Text as="h1" size="display" measure="narrow">
            {job.title}
          </Text>
          <Text size="lede" tone="secondary" measure="reading" className="mt-4">
            {job.summary}
          </Text>
        </Wrap>
      </Field>

      <Field>
        <Wrap>
          <div className="split-editorial">
            {/* ---------------- The ad ---------------- */}
            <div>
              <Text as="h2" size="h2" className="section-header">
                About the role
              </Text>
              {job.about.map((paragraph) => (
                <Text key={paragraph} measure="reading" className="mb-4">
                  {paragraph}
                </Text>
              ))}

              <Text as="h3" size="h3" className="mt-9 mb-3">
                What the role involves
              </Text>
              <ul className="event-covers">
                {job.responsibilities.map((line) => (
                  <li key={line}>
                    <Text as="span" size="small">
                      {line}
                    </Text>
                  </li>
                ))}
              </ul>

              <Text as="h3" size="h3" className="mt-9 mb-3">
                What we&rsquo;re looking for
              </Text>
              <ul className="event-covers">
                {job.requirements.map((line) => (
                  <li key={line}>
                    <Text as="span" size="small">
                      {line}
                    </Text>
                  </li>
                ))}
              </ul>

              <div className="mt-9 border-t border-line pt-6">
                <Eyebrow className="mb-1.5">Questions about this role</Eyebrow>
                <Text size="small" tone="secondary">
                  {job.contactName} · {job.contactEmail}
                </Text>
              </div>
            </div>

            {/* ---------------- The controls ---------------- */}
            <aside className="bg-field-sand p-8">
              <Eyebrow className="mb-4">
                {closedOut ? "Closed" : `Closes ${relativeUpcoming(job.closesIso)}`}
              </Eyebrow>

              <Text as="p" size="h3">
                {formatDateWithYear(job.closesIso)}
              </Text>

              <dl className="fact-list mt-5">
                <div>
                  <dt>
                    <Eyebrow>Employment type</Eyebrow>
                  </dt>
                  <dd>
                    <Text as="span" size="small">
                      {job.employmentType}
                    </Text>
                  </dd>
                </div>
                <div>
                  <dt>
                    <Eyebrow>Location</Eyebrow>
                  </dt>
                  <dd>
                    <Text as="span" size="small">
                      {job.location}
                    </Text>
                  </dd>
                </div>
                {job.salary ? (
                  <div>
                    <dt>
                      <Eyebrow>Salary</Eyebrow>
                    </dt>
                    <dd>
                      <Text as="span" size="small">
                        {job.salary}
                      </Text>
                    </dd>
                  </div>
                ) : null}
                <div>
                  <dt>
                    <Eyebrow>Applications</Eyebrow>
                  </dt>
                  <dd>
                    <Text as="span" size="small">
                      {counts.all} received · {counts.shortlisted} shortlisted
                    </Text>
                  </dd>
                </div>
              </dl>

              <div className="mt-7 grid gap-3">
                {closedOut ? (
                  <Button block variant="secondary" onClick={() => reopenJob(job.id)}>
                    <span className="btn-icon">
                      <RotateCcw className="size-4" strokeWidth={1.8} aria-hidden />
                      Reopen this ad
                    </span>
                  </Button>
                ) : (
                  <Button block variant="secondary" onClick={() => closeJob(job.id)}>
                    Close this ad
                  </Button>
                )}
                <Button
                  block
                  variant="quiet"
                  onClick={() => router.push("/employment")}
                >
                  Back to Employment and HR
                </Button>
              </div>

              <Text size="micro" tone="tertiary" className="mt-5">
                {closedOut
                  ? "The ad is no longer listed. Applications already received are kept."
                  : "Closing stops new applications. Everything received is kept, and you can reopen it."}
              </Text>
            </aside>
          </div>
        </Wrap>
      </Field>

      {/* ---------------- Applicants ---------------- */}
      <Field tone="warm">
        <Wrap>
          <SectionHeader heading="Applicants" />

          <div className="filter-count mb-2">
            <span className="segment">
              {(
                [
                  ["all", "All"],
                  ["new", "To review"],
                  ["shortlisted", "Shortlisted"],
                  ["declined", "Not proceeding"],
                ] as [Filter, string][]
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className="segment-option"
                  data-active={filter === value || undefined}
                  onClick={() => setFilter(value)}
                >
                  {label}
                  <span className="segment-count">{counts[value]}</span>
                </button>
              ))}
            </span>
          </div>

          {shown.length === 0 ? (
            <EmptyState
              heading="Nobody here"
              body="Change the filter to see the rest of the applications."
            />
          ) : (
            <ul className="applicant-list">
              {shown.map((applicant) => (
                <li key={applicant.id}>
                  <div className="applicant-card" data-status={applicant.status}>
                    <div className="applicant-head">
                      <span className="min-w-0">
                        <Text as="h3" size="h3" className="block">
                          {applicant.name}
                        </Text>
                        <Text
                          as="span"
                          size="small"
                          tone="secondary"
                          className="mt-0.5 block"
                        >
                          {applicant.current}
                        </Text>
                      </span>

                      {applicant.status !== "new" ? (
                        <span
                          className="applicant-flag"
                          data-status={applicant.status}
                        >
                          {applicant.status === "shortlisted"
                            ? "Shortlisted"
                            : "Not proceeding"}
                        </span>
                      ) : null}
                    </div>

                    <Text
                      size="small"
                      tone="secondary"
                      measure="reading"
                      className="mt-3"
                    >
                      {applicant.summary}
                    </Text>

                    {/* The two things a school checks before anything else.
                        Shown as facts rather than as a warning, because a
                        graduate without VIT yet is normal, not a problem. */}
                    <div className="applicant-facts">
                      <Text as="span" size="micro" tone="tertiary">
                        {applicant.years === 0
                          ? "Graduate"
                          : `${applicant.years} years' experience`}
                      </Text>
                      <Text as="span" size="micro" tone="tertiary">
                        VIT {applicant.vitCurrent ? "current" : "not yet held"}
                      </Text>
                      <Text as="span" size="micro" tone="tertiary">
                        Applied {formatDateWithYear(applicant.appliedIso)}
                      </Text>
                    </div>

                    <div className="applicant-actions">
                      {applicant.status === "shortlisted" ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setApplicantStatus(applicant.id, "new")}
                        >
                          Undo shortlist
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() =>
                            setApplicantStatus(applicant.id, "shortlisted")
                          }
                        >
                          <span className="btn-icon">
                            <Check className="size-4" strokeWidth={2} aria-hidden />
                            Shortlist
                          </span>
                        </Button>
                      )}

                      {applicant.status === "declined" ? (
                        <Button
                          variant="quiet"
                          size="sm"
                          onClick={() => setApplicantStatus(applicant.id, "new")}
                        >
                          Undo
                        </Button>
                      ) : (
                        <Button
                          variant="quiet"
                          size="sm"
                          onClick={() =>
                            setApplicantStatus(applicant.id, "declined")
                          }
                        >
                          <span className="btn-icon">
                            <X className="size-4" strokeWidth={2} aria-hidden />
                            Not proceeding
                          </span>
                        </Button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Wrap>
      </Field>

      <AskIsv />
    </AppShell>
  );
}
