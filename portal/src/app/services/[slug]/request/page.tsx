"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/features/app-shell";
import { AskIsv } from "@/components/features/ask-isv";
import { Field, Wrap } from "@/components/layout";
import { PrefillNote } from "@/components/patterns";
import {
  AlertIcon,
  Button,
  Eyebrow,
  Text,
} from "@/components/primitives";
import { useMember } from "@/lib/member-context";
import { fullName, getServiceBySlug } from "@/lib/selectors";
import type { RequestField } from "@/types";

/**
 * Screen 5 — the guided request flow.
 *
 * Pre-filled fields are visibly pre-filled and still editable. That note is
 * the moment Act 3 proves connected member context, so it is deliberately
 * visible rather than silent. It never names Dynamics.
 */
export default function ServiceRequestPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { member, school, submitRequest } = useMember();

  const service = getServiceBySlug(params.slug);
  const fields = useMemo(() => service?.requestFields ?? [], [service]);

  const initialValues = useMemo(() => {
    const values: Record<string, string> = {};
    for (const field of fields) {
      values[field.id] = prefill(field, {
        fullName: fullName(member),
        email: member.email,
        phone: member.phone,
        roleLabel: member.roleLabel,
        schoolName: school.name,
      });
    }
    return values;
  }, [fields, member, school]);

  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Switching role while the form is open is a plausible demo move, since the
  // switcher sits in the header on this screen. Without this the form keeps
  // the previous member's details while the header shows the new one, and the
  // request submits under a mismatched identity.
  useEffect(() => setValues(initialValues), [initialValues]);

  if (!service || !service.requestable) {
    return (
      <AppShell>
        <Field>
          <Wrap>
            <Text as="h1" size="display">
              That service cannot be requested here
            </Text>
            <div className="mt-8">
              <Button onClick={() => router.push("/portal")}>
                Back to portal
              </Button>
            </div>
          </Wrap>
        </Field>
        <AskIsv />
      </AppShell>
    );
  }

  function set(id: string, value: string) {
    setValues((current) => ({ ...current, [id]: value }));
    setErrors((current) => {
      if (!current[id]) return current;
      const next = { ...current };
      delete next[id];
      return next;
    });
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const found: Record<string, string> = {};

    for (const field of fields) {
      if (field.required && !values[field.id]?.trim()) {
        found[field.id] =
          field.type === "textarea"
            ? "Tell us what you need help with so we can route your request"
            : `${field.label} is required`;
      }
    }

    setErrors(found);
    if (Object.keys(found).length > 0) {
      const first = fields.find((f) => found[f.id]);
      if (first) {
        // A fieldset is not focusable, so for a radio group focus the first
        // input rather than silently doing nothing.
        const target =
          first.type === "radio"
            ? document.querySelector<HTMLInputElement>(
                `input[name="${first.id}"]`,
              )
            : document.getElementById(first.id);
        target?.focus();
      }
      return;
    }

    const subject = values.area
      ? `${values.area} enquiry`
      : `${service!.name} request`;
    const created = submitRequest(service!, subject);
    router.push(`/requests/${created.id}`);
  }

  return (
    <AppShell>
      {/* No wash. design-imagery.html: nothing decorative near a
          transactional surface. */}
      <Field>
        <Wrap>
          <Eyebrow className="mb-3.5">{service.name}</Eyebrow>
          <Text as="h1" size="display" className="mb-9">
            Tell us what you need
          </Text>

          <form onSubmit={onSubmit} noValidate className="grid max-w-2xl gap-7">
            {fields.map((field) => (
              <FormField
                key={field.id}
                field={field}
                value={values[field.id] ?? ""}
                error={errors[field.id]}
                onChange={(value) => set(field.id, value)}
              />
            ))}

            <div className="flex flex-wrap gap-3">
              <Button type="submit">Submit request</Button>
              <Button
                variant="secondary"
                onClick={() => router.push(`/services/${service.slug}`)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Wrap>
      </Field>

      <AskIsv />
    </AppShell>
  );
}

/* ============================================================ */

function FormField({
  field,
  value,
  error,
  onChange,
}: {
  field: RequestField;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  const prefilled = Boolean(field.prefillFrom);
  const describedBy =
    [error ? `${field.id}-error` : null, field.helpText ? `${field.id}-hint` : null]
      .filter(Boolean)
      .join(" ") || undefined;

  const requirement = field.required ? "Required" : "Optional";

  const labelContent = (
    <>
      {field.label}
      <span className="ml-2 text-micro font-normal text-tertiary">
        {requirement}
      </span>
      {field.helpText ? (
        <span
          id={`${field.id}-hint`}
          className="ml-1.5 block text-micro font-normal text-tertiary"
        >
          {field.helpText}
        </span>
      ) : null}
    </>
  );

  return (
    <div>
      {field.type !== "radio" ? (
        <label htmlFor={field.id} className="mb-2 block text-small font-semibold">
          {labelContent}
        </label>
      ) : null}

      {field.type === "textarea" ? (
        <textarea
          id={field.id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          aria-required={field.required}
          className="control control-textarea"
        />
      ) : field.type === "select" ? (
        <select
          id={field.id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          aria-required={field.required}
          className="control control-input"
        >
          <option value="">Choose an option</option>
          {field.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : field.type === "radio" ? (
        <fieldset
          aria-describedby={describedBy}
          className="grid overflow-hidden rounded-md border border-line-control"
        >
          {/* The legend is the visible label. A <label for> cannot point at a
              fieldset, so the earlier version had an inert visible label. */}
          <legend className="mb-2 text-small font-semibold">
            {labelContent}
          </legend>
          {field.options?.map((option) => (
            <label
              key={option}
              className="flex cursor-pointer items-center gap-3 border-b border-line bg-surface px-4 py-3.5 text-small last:border-b-0 hover:bg-sunken has-checked:bg-action-quiet"
            >
              <input
                type="radio"
                name={field.id}
                value={option}
                checked={value === option}
                onChange={() => onChange(option)}
                aria-invalid={Boolean(error)}
                className="size-4 accent-action"
              />
              {option}
            </label>
          ))}
        </fieldset>
      ) : (
        <>
          <input
            id={field.id}
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            aria-required={field.required}
            className="control control-input"
            data-prefilled={prefilled}
          />
          {prefilled ? <PrefillNote /> : null}
        </>
      )}

      {error ? (
        <p
          id={`${field.id}-error`}
          role="alert"
          className="mt-2 flex items-center gap-2 rounded-sm bg-error-quiet px-3 py-2.5 text-micro text-error"
        >
          <AlertIcon />
          {error}
        </p>
      ) : null}
    </div>
  );
}

function prefill(
  field: RequestField,
  context: {
    fullName: string;
    email: string;
    phone: string;
    roleLabel: string;
    schoolName: string;
  },
): string {
  switch (field.prefillFrom) {
    case "member.fullName":
      return context.fullName;
    case "member.email":
      return context.email;
    case "member.phone":
      return context.phone;
    case "member.roleLabel":
      return context.roleLabel;
    case "school.name":
      return context.schoolName;
    default:
      return "";
  }
}
