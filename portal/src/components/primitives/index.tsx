import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import clsx from "clsx";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ElementType,
  HTMLAttributes,
  ReactNode,
} from "react";

/* ============================================================
   Text
   ============================================================ */
const text = cva("", {
  variants: {
    size: {
      mega: "font-serif text-mega font-normal",
      display: "font-serif text-display font-normal",
      h2: "font-serif text-h2 font-normal",
      h3: "text-h3 font-semibold",
      lede: "text-lede",
      body: "text-body",
      small: "text-small",
      micro: "text-micro",
    },
    tone: {
      primary: "text-primary",
      secondary: "text-secondary",
      tertiary: "text-tertiary",
      inverse: "text-inverse",
      inverseSoft: "text-inverse-soft",
      inverseFaint: "text-inverse-faint",
      action: "text-action",
      success: "text-success",
      error: "text-error",
    },
    measure: {
      none: "",
      reading: "max-w-reading",
      narrow: "max-w-measure",
    },
    mono: { true: "font-mono", false: "" },
  },
  defaultVariants: {
    size: "body",
    tone: "primary",
    measure: "none",
    mono: false,
  },
});

type TextProps = VariantProps<typeof text> & {
  as?: ElementType;
  className?: string;
  children: ReactNode;
} & Omit<HTMLAttributes<HTMLElement>, "color">;

export function Text({
  as: Tag = "p",
  size,
  tone,
  measure,
  mono,
  className,
  children,
  ...rest
}: TextProps) {
  return (
    <Tag
      className={clsx(text({ size, tone, measure, mono }), className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* ============================================================
   Eyebrow — small caps label used throughout the editorial system
   ============================================================ */
export function Eyebrow({
  children,
  inverse = false,
  className,
  id,
}: {
  children: ReactNode;
  inverse?: boolean;
  className?: string;
  id?: string;
}) {
  return (
    <p
      id={id}
      className={clsx(
        "text-micro font-semibold uppercase tracking-eyebrow",
        inverse ? "text-inverse-faint" : "text-tertiary",
        className,
      )}
    >
      {children}
    </p>
  );
}

/* ============================================================
   Button
   ============================================================ */
const button = cva(
  "inline-flex items-center justify-center gap-2 rounded-md border text-small font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "border-transparent bg-action text-inverse hover:bg-action-hover",
        secondary:
          "border-line-firm bg-transparent text-primary hover:border-primary",
        onInverse:
          "border-transparent bg-inverse text-primary hover:bg-surface",
        ghostInverse:
          "border-line-inverse-firm bg-transparent text-inverse-soft hover:border-inverse hover:text-inverse",
        quiet:
          "h-auto rounded-none border-0 border-b border-line-firm px-0 text-action hover:border-action",
      },
      size: {
        base: "h-control px-5",
        sm: "h-control-sm px-3",
        none: "",
      },
      block: { true: "w-full", false: "" },
    },
    defaultVariants: { variant: "primary", size: "base", block: false },
  },
);

type ButtonProps = VariantProps<typeof button> &
  ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  variant,
  size,
  block,
  className,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={clsx(button({ variant, size, block }), className)}
      {...rest}
    />
  );
}

/**
 * Every link in the product goes through here.
 *
 * A route gets next/link, which navigates on the client: no white flash, no
 * re-download, scroll position preserved, and the destination prefetched
 * while the link is on screen. Everything else — an anchor, a tel:, a
 * mailto:, another site — stays a plain <a>, because Link would do nothing
 * useful for those and would warn.
 *
 * One decision in one place. Scattered through the components it was made
 * inconsistently, which is how the whole prototype ended up doing full page
 * loads between screens.
 */
export function AppLink({
  href,
  children,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  const internal = href.startsWith("/");

  if (internal) {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
}

type LinkButtonProps = VariantProps<typeof button> &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export function LinkButton({
  variant,
  size,
  block,
  className,
  ...rest
}: LinkButtonProps) {
  return (
    <AppLink
      className={clsx(button({ variant, size, block }), className)}
      {...rest}
    />
  );
}

/* ============================================================
   Badge and inclusion marker
   ============================================================ */
export function Badge({
  children,
  inverse = false,
}: {
  children: ReactNode;
  inverse?: boolean;
}) {
  return (
    <span
      className={clsx(
        "inline-block rounded-sm px-2.5 py-1.5 text-micro font-semibold uppercase tracking-badge",
        inverse
          ? "border border-line-inverse-firm text-inverse"
          : "bg-action-quiet text-action",
      )}
    >
      {children}
    </span>
  );
}

export function InclusionMark({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-micro font-medium text-success">
      <span className="size-1.5 rounded-pill bg-current" aria-hidden />
      {children}
    </span>
  );
}

/* ============================================================
   Avatar
   ============================================================ */
export function Avatar({ initials }: { initials: string }) {
  return (
    <span
      className="grid size-8 place-items-center rounded-pill bg-action text-micro font-semibold text-inverse"
      aria-hidden
    >
      {initials}
    </span>
  );
}

/* ============================================================
   Divider
   ============================================================ */
export function Divider({ inverse = false }: { inverse?: boolean }) {
  return (
    <hr
      className={clsx(
        "border-0 border-t",
        inverse ? "border-line-inverse" : "border-line",
      )}
    />
  );
}

/* ============================================================
   Icons — inline, currentColor, no icon dependency
   ============================================================ */
export function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={clsx("size-4", className)}
      aria-hidden
    >
      <circle cx="7" cy="7" r="4.6" />
      <path d="M10.4 10.4 14 14" strokeLinecap="round" />
    </svg>
  );
}

export function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={clsx("size-3", className)}
      aria-hidden
    >
      <path d="m3 4.5 3 3 3-3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={clsx("size-3.5", className)}
      aria-hidden
    >
      <path d="M2.5 7h9M8 3.5 11.5 7 8 10.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function InfoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      className={clsx("size-3", className)}
      aria-hidden
    >
      <circle cx="6" cy="6" r="5" />
      <path d="M6 3.4v3.2M6 8.4v.2" strokeLinecap="round" />
    </svg>
  );
}

export function AlertIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={clsx("size-3", className)}
      aria-hidden
    >
      <path d="M6 1.5 11 10.5H1z" strokeLinejoin="round" />
      <path d="M6 5v2.2M6 8.8v.2" strokeLinecap="round" />
    </svg>
  );
}

export function BellIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      className={clsx("size-4", className)}
      aria-hidden
    >
      <path d="M4.5 7.2a4.5 4.5 0 0 1 9 0c0 3 1 4.3 1.5 4.8h-12c.5-.5 1.5-1.8 1.5-4.8Z" strokeLinejoin="round" />
      <path d="M7.3 14.2a1.9 1.9 0 0 0 3.4 0" strokeLinecap="round" />
    </svg>
  );
}

export function MailIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      className={clsx("size-4", className)}
      aria-hidden
    >
      <path d="M2.5 4.5h13v9h-13z" />
      <path d="m2.5 5 6.5 4.5L15.5 5" strokeLinejoin="round" />
    </svg>
  );
}

export function ThinkingDots() {
  return (
    <span className="inline-flex items-center gap-1" aria-label="Generating answer">
      <span className="thinking-dot size-1.5 rounded-pill bg-current" />
      <span className="thinking-dot size-1.5 rounded-pill bg-current" />
      <span className="thinking-dot size-1.5 rounded-pill bg-current" />
    </span>
  );
}
