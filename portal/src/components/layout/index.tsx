import clsx from "clsx";
import type { ReactNode } from "react";
import { Text } from "@/components/primitives";
import type { FieldTone } from "@/types";

/* ============================================================
   Field — the colour field system
   A field carries a whole module, never a single card.
   ============================================================ */
const fieldTone: Record<FieldTone, string> = {
  paper: "bg-page text-primary",
  warm: "bg-field-warm text-primary",
  sand: "bg-field-sand text-primary",
  mist: "bg-field-mist text-primary",
  clay: "bg-field-clay text-primary",
  forest: "bg-field-forest text-inverse",
  ink: "bg-field-ink text-inverse",
};

export function Field({
  tone = "paper",
  tight = false,
  none = false,
  wash = false,
  id,
  className,
  children,
}: {
  tone?: FieldTone;
  tight?: boolean;
  /** No vertical padding. For a hero image that should sit close to its copy. */
  none?: boolean;
  wash?: boolean;
  /** Anchor target, for in-page links from a hero */
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      data-field={tone}
      className={clsx(
        fieldTone[tone],
        none ? "py-0" : tight ? "py-field-tight" : "py-field",
        wash && "wash-masthead",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function isInverseField(tone: FieldTone): boolean {
  return tone === "forest" || tone === "ink";
}

/* ============================================================
   Wrap — page measure
   ============================================================ */
export function Wrap({
  wide = false,
  className,
  children,
}: {
  wide?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={clsx(
        "mx-auto px-gutter",
        wide ? "max-w-wide" : "max-w-page",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ============================================================
   SectionHeader — heading and an optional more link
   ============================================================ */
export function SectionHeader({
  heading,
  moreLabel,
  moreHref = "#portal-navigation",
  inverse = false,
  id,
}: {
  heading: string;
  moreLabel?: string;
  /** The listing this module is a slice of */
  moreHref?: string;
  inverse?: boolean;
  id?: string;
}) {
  return (
    <div className="section-header" data-inverse={inverse || undefined}>
      <Text
        as="h2"
        size="h2"
        tone={inverse ? "inverse" : "primary"}
        id={id}
      >
        {heading}
      </Text>


      {moreLabel ? (
        <a
          href={moreHref}
          className={clsx(
            "ml-auto border-b pb-px text-small transition-colors duration-150",
            inverse
              ? "border-line-inverse-firm text-inverse-soft hover:text-inverse"
              : "border-line-firm text-secondary hover:border-action hover:text-action",
          )}
        >
          {moreLabel}
        </a>
      ) : null}
    </div>
  );
}

/* ============================================================
   Grid — hairline-separated editorial cells
   ============================================================ */
export function CellGrid({
  columns = 3,
  children,
}: {
  columns?: 2 | 3;
  children: ReactNode;
}) {
  return (
    <div
      className={clsx(
        "cell-grid",
        columns === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2",
      )}
    >
      {children}
    </div>
  );
}

export function Cell({
  as: Tag = "div",
  interactive = false,
  className,
  children,
  ...rest
}: {
  as?: "div" | "a" | "article" | "button";
  interactive?: boolean;
  className?: string;
  children: ReactNode;
} & Record<string, unknown>) {
  return (
    <Tag
      className={clsx(
        "bg-page p-cell transition-colors duration-150",
        interactive && "cursor-pointer hover:bg-surface",
        className,
      )}
      data-interactive={interactive || undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}

