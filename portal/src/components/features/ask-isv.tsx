"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { noMatchCopy } from "@/data/ask-isv";
import {
  Button,
  Eyebrow,
  SearchIcon,
  Text,
} from "@/components/primitives";
import { useMember } from "@/lib/member-context";
import { followUpsFor, getEntry, matchQuery, suggestedForRole } from "@/lib/matching";
import { areaLabel } from "@/data/areas";
import { getContent, getService, isRelevantTo } from "@/lib/selectors";
import type { AskIsvEntry, ContentItem, Service } from "@/types";

const ISV_PHONE = "03 9825 7200";
const ISV_EMAIL = "enquiries@is.vic.edu.au";

const THINKING_MS = 420;
const STREAM_TOTAL_MS = 1000;

type Phase = "empty" | "thinking" | "answer" | "no-match";

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Split on sentence boundaries so the answer arrives in readable chunks. */
function chunk(text: string): string[] {
  const parts = text.match(/[^.!?]+[.!?]+(\s|$)/g);
  return parts && parts.length > 1 ? parts.map((p) => p.trimEnd()) : [text];
}

export function AskIsv() {
  const router = useRouter();
  const {
    role,
    askOpen,
    setAskOpen,
    lastQuery,
    askEntryId,
    setAskResult,
    setContactOpen,
  } = useMember();

  const [query, setQuery] = useState(lastQuery);
  const [phase, setPhase] = useState<Phase>("empty");
  const [entry, setEntry] = useState<AskIsvEntry | null>(null);
  const [streamed, setStreamed] = useState("");
  const [sourcesVisible, setSourcesVisible] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const suggestions = useMemo(() => suggestedForRole(role), [role]);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const reset = useCallback(() => {
    clearTimers();
    setQuery("");
    setEntry(null);
    setStreamed("");
    setPhase("empty");
    setSourcesVisible(false);
  }, [clearTimers]);

  /** Show a stored result immediately, with no streaming. */
  const restore = useCallback(
    (storedQuery: string, storedEntryId: string | null) => {
      clearTimers();
      setQuery(storedQuery);
      const stored = storedEntryId ? (getEntry(storedEntryId) ?? null) : null;
      setEntry(stored);
      if (stored) {
        setStreamed(stored.answer);
        setSourcesVisible(true);
        setPhase("answer");
      } else {
        setStreamed("");
        setSourcesVisible(false);
        setPhase("no-match");
      }
    },
    [clearTimers],
  );

  /**
   * The overlay is mounted per route, but its state lives in the provider.
   * On mount, rehydrate from that state so navigating to a service and
   * reopening returns the last answer. PRD s10.
   */
  const mounted = useRef(false);
  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;
    if (lastQuery) restore(lastQuery, askEntryId);
  }, [lastQuery, askEntryId, restore]);

  /** Role switch empties lastQuery in the provider, which resets the overlay. */
  useEffect(() => {
    if (lastQuery === "") reset();
  }, [lastQuery, reset]);

  useEffect(() => clearTimers, [clearTimers]);

  const run = useCallback(
    (text: string) => {
      clearTimers();
      setQuery(text);
      setSourcesVisible(false);
      setStreamed("");

      const match = matchQuery(text, role);
      setAskResult(text, match?.id ?? null);

      if (!match) {
        setEntry(null);
        setPhase("thinking");
        timers.current.push(
          setTimeout(() => setPhase("no-match"), THINKING_MS),
        );
        return;
      }

      setEntry(match);
      setPhase("thinking");

      if (prefersReducedMotion()) {
        timers.current.push(
          setTimeout(() => {
            setPhase("answer");
            setStreamed(match.answer);
            setSourcesVisible(true);
          }, THINKING_MS),
        );
        return;
      }

      // Answer arrives in sentence chunks, then sources. The ordering is
      // deliberate: it shows the answer deriving from its sources rather
      // than being decorated with them.
      const chunks = chunk(match.answer);
      const step = STREAM_TOTAL_MS / chunks.length;

      timers.current.push(
        setTimeout(() => {
          setPhase("answer");
          chunks.forEach((_, i) => {
            timers.current.push(
              setTimeout(
                () => setStreamed(chunks.slice(0, i + 1).join(" ")),
                step * i,
              ),
            );
          });
          timers.current.push(
            setTimeout(() => setSourcesVisible(true), STREAM_TOTAL_MS),
          );
        }, THINKING_MS),
      );
    },
    [clearTimers, role, setAskResult],
  );

  function onOpenChange(open: boolean) {
    setAskOpen(open);
    if (!open) clearTimers();
  }

  function goTo(href: string) {
    setAskOpen(false);
    router.push(href);
  }

  return (
    <Dialog.Root open={askOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-field-ink/50" />
        <Dialog.Content
          data-field="ink"
          aria-describedby={undefined}
          className="fixed inset-0 z-50 overflow-y-auto bg-field-ink text-inverse md:inset-6 md:rounded-lg"
        >
          <VisuallyHidden>
            <Dialog.Title>Ask ISV</Dialog.Title>
          </VisuallyHidden>

          <div className="mx-auto max-w-page px-gutter py-field">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                if (query.trim()) run(query);
              }}
            >
              <Eyebrow inverse className="mb-4">
                Ask ISV
              </Eyebrow>
              <div className="flex items-center gap-3 border-b border-line-inverse-firm pb-4">
                <SearchIcon className="size-5 text-inverse-faint" />
                <input
                  autoFocus
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Ask ISV a question"
                  aria-label="Ask ISV a question"
                  className="flex-1 bg-transparent font-serif text-h2 text-inverse outline-none placeholder:text-inverse-faint"
                />
                <Button
                  type="submit"
                  variant="onInverse"
                  size="sm"
                  disabled={!query.trim()}
                >
                  Ask
                </Button>
              </div>
            </form>

            {/* Everything the query produces is announced. Without this the
                whole interaction is silent to a screen reader. */}
            <div role="status" aria-live="polite">
              {phase === "empty" ? (
                <IntroState suggestions={suggestions} onPick={run} />
              ) : null}

              {phase === "thinking" ? (
                <p className="mt-12 text-small text-inverse-soft">
                  Looking through ISV content…
                </p>
              ) : null}

              {phase === "no-match" ? (
                <NoMatch
                  suggestions={suggestions}
                  onPick={run}
                  onContact={() => {
                    setAskOpen(false);
                    setContactOpen(true);
                  }}
                />
              ) : null}

              {phase === "answer" && entry ? (
                <Answer
                  entry={entry}
                  streamed={streamed}
                  sourcesVisible={sourcesVisible}
                  onFollowUp={run}
                  onNavigate={goTo}
                  onContact={() => {
                    setAskOpen(false);
                    setContactOpen(true);
                  }}
                />
              ) : null}
            </div>
          </div>

          <Dialog.Close asChild>
            <button
              type="button"
              aria-label="Close Ask ISV"
              className="fixed right-4 top-4 z-50 flex h-control items-center rounded-md border border-line-inverse-firm px-4 text-micro uppercase tracking-badge text-inverse-soft hover:text-inverse md:right-10 md:top-10"
            >
              Close
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/* ============================================================ */

function IntroState({
  suggestions,
  onPick,
}: {
  suggestions: AskIsvEntry[];
  onPick: (text: string) => void;
}) {
  return (
    <div className="mt-12">
      <Text size="lede" tone="inverseSoft" measure="reading">
        Ask a question in your own words. Answers are drawn from ISV&rsquo;s
        published resources and always show where they came from.
      </Text>
      <Text
        as="h2"
        size="micro"
        tone="inverseFaint"
        className="mt-10 mb-4 font-semibold uppercase tracking-eyebrow"
      >
        Try one of these
      </Text>
      <SuggestionList suggestions={suggestions} onPick={onPick} />
    </div>
  );
}

function NoMatch({
  suggestions,
  onPick,
  onContact,
}: {
  suggestions: AskIsvEntry[];
  onPick: (text: string) => void;
  onContact: () => void;
}) {
  return (
    <div className="answer-stream mt-12">
      {/* Calm, not an error. No warning colour, no error iconography. */}
      <Text as="p" size="display" tone="inverse" measure="narrow">
        {noMatchCopy.headline}
      </Text>
      <Text size="lede" tone="inverseSoft" measure="reading" className="mt-4">
        {noMatchCopy.body}
      </Text>

      <Text
        as="h2"
        size="micro"
        tone="inverseFaint"
        className="mt-10 mb-4 font-semibold uppercase tracking-eyebrow"
      >
        Try one of these
      </Text>
      <SuggestionList suggestions={suggestions} onPick={onPick} />

      <Escalation onContact={onContact} />
    </div>
  );
}

function SuggestionList({
  suggestions,
  onPick,
}: {
  suggestions: AskIsvEntry[];
  onPick: (text: string) => void;
}) {
  return (
    <ul className="flex flex-wrap gap-2.5">
      {suggestions.map((item) => (
        <li key={item.id}>
          <button
            type="button"
            onClick={() => onPick(item.question)}
            className="pill border border-line-inverse-firm text-inverse-soft transition-colors duration-150 hover:border-inverse hover:text-inverse"
          >
            {item.question}
          </button>
        </li>
      ))}
    </ul>
  );
}

function BandHeading({ children }: { children: string }) {
  return (
    <Text
      as="h2"
      size="micro"
      tone="inverseFaint"
      className="mt-10 mb-3 font-semibold uppercase tracking-eyebrow"
    >
      {children}
    </Text>
  );
}

function Answer({
  entry,
  streamed,
  sourcesVisible,
  onFollowUp,
  onNavigate,
  onContact,
}: {
  entry: AskIsvEntry;
  streamed: string;
  sourcesVisible: boolean;
  onFollowUp: (text: string) => void;
  onNavigate: (href: string) => void;
  onContact: () => void;
}) {
  const { role } = useMember();

  // Related bands are persona-filtered. Without this a Principal is shown a
  // Business Manager resource in the middle of a demonstration of role-based
  // targeting.
  const byRole = <T extends { relevantTo: typeof role[] }>(items: T[]) =>
    items.filter((item) => isRelevantTo(item, role));

  const resources = byRole(
    entry.relatedResourceIds
      .map(getContent)
      .filter((c): c is ContentItem => Boolean(c)),
  );

  const learning = byRole(
    entry.relatedLearningIds
      .map(getContent)
      .filter((c): c is ContentItem => Boolean(c)),
  );

  const relatedServices = byRole(
    entry.relatedServiceIds
      .map(getService)
      .filter((s): s is Service => Boolean(s)),
  );

  const followUps = followUpsFor(entry, role);

  return (
    <div className="mt-12">
      <Text size="lede" tone="inverse" measure="reading">
        {streamed}
      </Text>

      {sourcesVisible ? (
        <div className="answer-stream">
          <BandHeading>Sources</BandHeading>
          {/* Content sources are not links. They point at resource areas the
              prototype does not build through, and a control that closes the
              answer to go nowhere is worse than one that plainly does not. */}
          <ul className="border-t border-line-inverse">
            {entry.sources.map((source, i) => {
              const isService = source.refType === "service";
              const meta = isService
                ? "ISV service"
                : `${areaLabel(source.isvSystem ?? "")} · ${source.recencyLabel}`;

              const body = (
                <>
                  <span className="font-mono text-micro text-inverse-faint">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 text-small font-medium text-inverse">
                    {source.title}
                  </span>
                  <span className="whitespace-nowrap text-micro text-inverse-faint">
                    {meta}
                  </span>
                </>
              );

              return (
                <li key={source.refId} className="border-b border-line-inverse">
                  {isService ? (
                    <button
                      type="button"
                      onClick={() =>
                        onNavigate(`/services/${getService(source.refId)?.slug}`)
                      }
                      className="flex w-full items-center gap-4 py-4 text-left"
                    >
                      {body}
                    </button>
                  ) : (
                    <div className="flex items-center gap-4 py-4">{body}</div>
                  )}
                </li>
              );
            })}
          </ul>

          {resources.length > 0 ? (
            <>
              <BandHeading>Related resources</BandHeading>
              <ul className="flex flex-wrap gap-2.5">
                {resources.map((resource) => (
                  <li
                    key={resource.id}
                    className="pill border border-line-inverse text-inverse-soft"
                  >
                    {resource.title}
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          {relatedServices.length > 0 ? (
            <>
              <BandHeading>Related services</BandHeading>
              <div className="flex flex-wrap gap-3">
                {relatedServices.map((service, i) => (
                  <Button
                    key={service.id}
                    variant={i === 0 ? "onInverse" : "ghostInverse"}
                    onClick={() => onNavigate(`/services/${service.slug}`)}
                  >
                    {service.name}
                  </Button>
                ))}
              </div>
            </>
          ) : null}

          {learning.length > 0 ? (
            <>
              <BandHeading>Relevant professional learning</BandHeading>
              <ul className="flex flex-wrap gap-2.5">
                {learning.map((item) => (
                  <li
                    key={item.id}
                    className="pill border border-line-inverse text-inverse-soft"
                  >
                    {item.title}
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          {followUps.length > 0 ? (
            <>
              <BandHeading>Follow up</BandHeading>
              <SuggestionList suggestions={followUps} onPick={onFollowUp} />
            </>
          ) : null}

          <Escalation onContact={onContact} />
        </div>
      ) : null}
    </div>
  );
}

function Escalation({ onContact }: { onContact: () => void }) {
  return (
    <div className="mt-12 flex flex-wrap items-center gap-5 border-t border-line-inverse pt-6">
      <Text size="small" tone="inverseSoft">
        Need something specific to your school?
      </Text>
      <Button variant="ghostInverse" onClick={onContact}>
        Contact ISV
      </Button>
      <Text size="micro" tone="inverseFaint" mono>
        {ISV_PHONE} · {ISV_EMAIL}
      </Text>
    </div>
  );
}
