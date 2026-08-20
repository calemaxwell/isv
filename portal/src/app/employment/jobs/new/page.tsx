"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/features/app-shell";
import { AskIsv } from "@/components/features/ask-isv";
import { Field, Wrap } from "@/components/layout";
import { FileIcon } from "@/components/patterns";
import { Button, Eyebrow, Text } from "@/components/primitives";
import type { EmploymentType } from "@/data/jobs";
import { useMember } from "@/lib/member-context";
import { formatDateWithYear } from "@/lib/selectors";

type Step = "role" | "detail" | "review" | "done";

const TYPES: EmploymentType[] = [
  "Full time, ongoing",
  "Full time, fixed term",
  "Part time, ongoing",
  "Part time, fixed term",
  "Casual",
];

/** Empty lines are dropped, so a half-filled list never reaches the ad. */
const lines = (value: string) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

/**
 * Post a job ad.
 *
 * Three steps, in the order a school actually decides things: what the role
 * is, then what the ad says, then a read of the whole thing before it goes
 * live. Splitting it matters because the second step is writing and the
 * first is administration, and mixing them produces ads where somebody has
 * carefully written the responsibilities and left the closing date blank.
 *
 * The list fields take one item per line rather than an add-a-row control.
 * A Business Manager is pasting from a position description they already
 * have, and a repeater turns one paste into eight clicks.
 */
export default function NewJobPage() {
  const router = useRouter();
  const { postJob, school, member } = useMember();

  const [step, setStep] = useState<Step>("role");
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [employmentType, setEmploymentType] = useState<EmploymentType>(
    "Full time, ongoing",
  );
  const [location, setLocation] = useState(school.suburb);
  const [salary, setSalary] = useState("");
  const [closesIso, setClosesIso] = useState("");
  const [summary, setSummary] = useState("");
  const [about, setAbout] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [requirements, setRequirements] = useState("");
  const [contactName, setContactName] = useState(
    `${member.firstName} ${member.lastName}`,
  );
  const [contactEmail, setContactEmail] = useState(member.email);
  const [postedId, setPostedId] = useState<string | null>(null);

  const roleReady = title.trim() && department.trim() && closesIso;
  const detailReady = summary.trim() && responsibilities.trim();

  function publish() {
    const job = postJob({
      title: title.trim(),
      department: department.trim(),
      employmentType,
      location: location.trim(),
      salary: salary.trim() || undefined,
      closesIso,
      summary: summary.trim(),
      about: lines(about),
      responsibilities: lines(responsibilities),
      requirements: lines(requirements),
      contactName: contactName.trim(),
      contactEmail: contactEmail.trim(),
      source: "ILLUSTRATIVE",
      sourceNote: "Posted during the prototype walkthrough.",
    });
    setPostedId(job.id);
    setStep("done");
  }

  return (
    <AppShell>
      <Field wash tight>
        <Wrap>
          <Eyebrow className="mb-3.5">Employment and HR</Eyebrow>
          <Text as="h1" size="display" measure="narrow">
            Post a job ad
          </Text>

          <ol className="step-rail" aria-label="Steps">
            <li data-state={step === "role" ? "current" : "done"}>The role</li>
            <li
              data-state={
                step === "detail"
                  ? "current"
                  : step === "role"
                    ? "ahead"
                    : "done"
              }
            >
              The ad
            </li>
            <li
              data-state={
                step === "review"
                  ? "current"
                  : step === "done"
                    ? "done"
                    : "ahead"
              }
            >
              Review
            </li>
            <li data-state={step === "done" ? "current" : "ahead"}>Posted</li>
          </ol>
        </Wrap>
      </Field>

      {/* ---------------- Step 1 ---------------- */}
      {step === "role" ? (
        <Field>
          <Wrap>
            <div className="split-editorial">
              <div>
                <Text as="h2" size="h2" className="section-header">
                  The role
                </Text>

                <div className="form-grid">
                  <label className="form-row">
                    <Eyebrow>Job title</Eyebrow>
                    <input
                      className="control control-input"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Classroom Teacher, Mathematics"
                    />
                  </label>

                  <label className="form-row">
                    <Eyebrow>Department or faculty</Eyebrow>
                    <input
                      className="control control-input"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="Senior School"
                    />
                  </label>

                  <label className="form-row">
                    <Eyebrow>Employment type</Eyebrow>
                    <select
                      className="control control-input"
                      value={employmentType}
                      onChange={(e) =>
                        setEmploymentType(e.target.value as EmploymentType)
                      }
                    >
                      {TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="form-row">
                    <Eyebrow>Location</Eyebrow>
                    <input
                      className="control control-input"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </label>

                  <label className="form-row">
                    <Eyebrow>Applications close</Eyebrow>
                    <input
                      type="date"
                      className="control control-input"
                      value={closesIso}
                      onChange={(e) => setClosesIso(e.target.value)}
                    />
                  </label>

                  <label className="form-row">
                    <Eyebrow>Salary range, optional</Eyebrow>
                    <input
                      className="control control-input"
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                      placeholder="$88,000 – $118,000"
                    />
                  </label>
                </div>
              </div>

              <aside className="bg-field-sand p-8">
                <Eyebrow className="mb-4">Before you write</Eyebrow>
                <Text size="small" tone="secondary" className="mb-5">
                  ISV publishes a position description template and an
                  interview guide. Schools that start from the template write
                  a faster ad and a more consistent shortlist.
                </Text>
                <div className="file-line">
                  <FileIcon kind="doc" large />
                  <span>
                    <Text as="span" size="small" className="block font-semibold">
                      Position description template
                    </Text>
                    <Text as="span" size="micro" tone="tertiary" className="block">
                      Word template · 148 KB
                    </Text>
                  </span>
                </div>

                <div className="mt-7 grid gap-3">
                  <Button
                    block
                    disabled={!roleReady}
                    onClick={() => setStep("detail")}
                  >
                    Continue
                  </Button>
                  <Button
                    variant="secondary"
                    block
                    onClick={() => router.push("/employment")}
                  >
                    Cancel
                  </Button>
                </div>
              </aside>
            </div>
          </Wrap>
        </Field>
      ) : null}

      {/* ---------------- Step 2 ---------------- */}
      {step === "detail" ? (
        <Field>
          <Wrap>
            <div className="split-editorial">
              <div>
                <Text as="h2" size="h2" className="section-header">
                  The ad
                </Text>

                <div className="form-grid">
                  <label className="form-row">
                    <Eyebrow>One line summary</Eyebrow>
                    <Text size="micro" tone="tertiary" className="mb-1.5">
                      The line that appears in the list. Say what the job is,
                      not how excited the school is about it.
                    </Text>
                    <textarea
                      className="control control-textarea"
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      placeholder="Teaching Mathematics across Years 9 to 12, including VCE Methods, from the start of the 2027 school year."
                    />
                  </label>

                  <label className="form-row">
                    <Eyebrow>About the role and the school</Eyebrow>
                    <Text size="micro" tone="tertiary" className="mb-1.5">
                      One paragraph per line.
                    </Text>
                    <textarea
                      className="control control-textarea"
                      value={about}
                      onChange={(e) => setAbout(e.target.value)}
                    />
                  </label>

                  <label className="form-row">
                    <Eyebrow>What the role involves</Eyebrow>
                    <Text size="micro" tone="tertiary" className="mb-1.5">
                      One per line. Paste straight from your position
                      description.
                    </Text>
                    <textarea
                      className="control control-textarea"
                      value={responsibilities}
                      onChange={(e) => setResponsibilities(e.target.value)}
                    />
                  </label>

                  <label className="form-row">
                    <Eyebrow>What you&rsquo;re looking for</Eyebrow>
                    <Text size="micro" tone="tertiary" className="mb-1.5">
                      One per line.
                    </Text>
                    <textarea
                      className="control control-textarea"
                      value={requirements}
                      onChange={(e) => setRequirements(e.target.value)}
                    />
                  </label>

                  <label className="form-row">
                    <Eyebrow>Who fields questions</Eyebrow>
                    <input
                      className="control control-input"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                    />
                  </label>

                  <label className="form-row">
                    <Eyebrow>Contact email</Eyebrow>
                    <input
                      type="email"
                      className="control control-input"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                    />
                  </label>
                </div>
              </div>

              <aside className="bg-field-sand p-8">
                <Eyebrow className="mb-4">{title || "Untitled role"}</Eyebrow>
                <Text size="small" tone="secondary">
                  {employmentType} · {department || "No department"} ·{" "}
                  {location}
                </Text>
                <Text size="micro" tone="tertiary" className="mt-2">
                  {closesIso
                    ? `Closes ${formatDateWithYear(closesIso)}`
                    : "No closing date"}
                </Text>

                <div className="mt-7 grid gap-3">
                  <Button
                    block
                    disabled={!detailReady}
                    onClick={() => setStep("review")}
                  >
                    Review the ad
                  </Button>
                  <Button
                    variant="secondary"
                    block
                    onClick={() => setStep("role")}
                  >
                    Back
                  </Button>
                </div>
              </aside>
            </div>
          </Wrap>
        </Field>
      ) : null}

      {/* ---------------- Step 3 ---------------- */}
      {step === "review" ? (
        <Field>
          <Wrap>
            <div className="split-editorial">
              <div>
                <Text as="h2" size="h2" className="section-header">
                  How it will read
                </Text>

                <Text as="h3" size="display" measure="narrow">
                  {title}
                </Text>
                <Text size="lede" tone="secondary" measure="reading" className="mt-3">
                  {summary}
                </Text>

                {lines(about).map((p) => (
                  <Text key={p} measure="reading" className="mt-4">
                    {p}
                  </Text>
                ))}

                {lines(responsibilities).length > 0 ? (
                  <>
                    <Text as="h4" size="h3" className="mt-9 mb-3">
                      What the role involves
                    </Text>
                    <ul className="event-covers">
                      {lines(responsibilities).map((l) => (
                        <li key={l}>
                          <Text as="span" size="small">
                            {l}
                          </Text>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}

                {lines(requirements).length > 0 ? (
                  <>
                    <Text as="h4" size="h3" className="mt-9 mb-3">
                      What we&rsquo;re looking for
                    </Text>
                    <ul className="event-covers">
                      {lines(requirements).map((l) => (
                        <li key={l}>
                          <Text as="span" size="small">
                            {l}
                          </Text>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </div>

              <aside className="bg-field-sand p-8">
                <Eyebrow className="mb-4">Ready to post</Eyebrow>
                <dl className="fact-list">
                  <div>
                    <dt>
                      <Eyebrow>Employment type</Eyebrow>
                    </dt>
                    <dd>
                      <Text as="span" size="small">
                        {employmentType}
                      </Text>
                    </dd>
                  </div>
                  <div>
                    <dt>
                      <Eyebrow>Closes</Eyebrow>
                    </dt>
                    <dd>
                      <Text as="span" size="small">
                        {formatDateWithYear(closesIso)}
                      </Text>
                    </dd>
                  </div>
                  <div>
                    <dt>
                      <Eyebrow>Salary</Eyebrow>
                    </dt>
                    <dd>
                      <Text as="span" size="small">
                        {salary || "Not published"}
                      </Text>
                    </dd>
                  </div>
                </dl>

                <div className="mt-7 grid gap-3">
                  <Button block onClick={publish}>
                    Post the ad
                  </Button>
                  <Button
                    variant="secondary"
                    block
                    onClick={() => setStep("detail")}
                  >
                    Keep editing
                  </Button>
                </div>

                <Text size="micro" tone="tertiary" className="mt-5">
                  You can close the ad at any time, and closing keeps every
                  application already received.
                </Text>
              </aside>
            </div>
          </Wrap>
        </Field>
      ) : null}

      {/* ---------------- Done ---------------- */}
      {step === "done" ? (
        <Field>
          <Wrap>
            <div className="split-editorial">
              <div>
                <Text as="h2" size="display" measure="narrow">
                  Posted
                </Text>
                <Text
                  size="lede"
                  tone="secondary"
                  measure="reading"
                  className="mt-4"
                >
                  {title} is live and accepting applications until{" "}
                  {formatDateWithYear(closesIso)}.
                </Text>

                <Text as="h3" size="h3" className="mt-10 mb-3">
                  What happens next
                </Text>
                <ul className="event-covers">
                  <li>
                    <Text as="span" size="small">
                      Applications appear under Employment and HR as they
                      arrive.
                    </Text>
                  </li>
                  <li>
                    <Text as="span" size="small">
                      Shortlist or set aside each one. Both are reversible.
                    </Text>
                  </li>
                  <li>
                    <Text as="span" size="small">
                      Close the ad when you have enough, without losing what
                      has already come in.
                    </Text>
                  </li>
                </ul>
              </div>

              <aside className="bg-field-sand p-8">
                <Eyebrow className="mb-4">{title}</Eyebrow>
                <Text size="small" tone="secondary">
                  {employmentType} · {department} · {location}
                </Text>

                <div className="mt-7 grid gap-3">
                  <Button
                    block
                    onClick={() => router.push(`/employment/jobs/${postedId}`)}
                  >
                    View the ad
                  </Button>
                  <Button
                    variant="secondary"
                    block
                    onClick={() => router.push("/employment")}
                  >
                    Back to Employment and HR
                  </Button>
                </div>
              </aside>
            </div>
          </Wrap>
        </Field>
      ) : null}

      <AskIsv />
    </AppShell>
  );
}
