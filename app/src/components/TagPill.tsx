import Link from "next/link";
import type { ReactNode } from "react";

/** Label tag: topik memakai tint aksen (hijau muda, teks hijau tua), wilayah
 *  netral dengan ikon pin. Radius 4px, bukan pil penuh — label melekat pada
 *  barisnya, tidak mengambang seperti tombol. */
export function TagPill({
  slug,
  children,
  withDot = false,
}: {
  slug: string;
  children: ReactNode;
  withDot?: boolean;
}) {
  const dasar =
    "relative z-10 inline-flex items-center gap-1 rounded-[4px] px-1.5 py-0.5 text-[11.5px] leading-[1.5] transition-colors";

  if (withDot) {
    return (
      <Link
        href={`/?tag=${slug}`}
        className={`${dasar} border border-border bg-surface font-medium text-ink-soft hover:border-control hover:text-ink`}
      >
        <PinDot />
        {children}
      </Link>
    );
  }

  return (
    <Link
      href={`/?tag=${slug}`}
      className={`${dasar} border border-accent-track/70 bg-accent-soft font-semibold text-accent-ink hover:border-accent-track hover:bg-accent-track/60`}
    >
      {children}
    </Link>
  );
}

/** Ikon titik lokasi kecil untuk tag wilayah. */
export function PinDot() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M6 1.4c1.8 0 3.2 1.4 3.2 3.2 0 2.1-2.4 4.2-3 4.7a.3.3 0 0 1-.4 0c-.6-.5-3-2.6-3-4.7 0-1.8 1.4-3.2 3.2-3.2Z"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      <circle cx="6" cy="4.6" r="1.1" fill="currentColor" />
    </svg>
  );
}

/** Ikon tiap komunitas topik — benda dari dunia peternak, bukan ikon generik. */
export function TopicIcon({ slug, className = "h-4 w-4" }: { slug: string; className?: string }) {
  switch (slug) {
    case "puyuh":
      return (
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
          <path
            d="M10 2.5C6.8 2.5 4 6.7 4 11.2 4 14.9 6.7 17.5 10 17.5s6-2.6 6-6.3C16 6.7 13.2 2.5 10 2.5Z"
            stroke="currentColor"
            vectorEffect="non-scaling-stroke"
            strokeWidth="1.5"
          />
          <circle cx="8.2" cy="9" r="1" fill="currentColor" />
          <circle cx="11.8" cy="11.2" r="1.2" fill="currentColor" />
          <circle cx="8.5" cy="13.5" r="0.9" fill="currentColor" />
        </svg>
      );
    case "lobby":
      return (
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
          <path
            d="M4 5.5A2.5 2.5 0 0 1 6.5 3h7A2.5 2.5 0 0 1 16 5.5v5a2.5 2.5 0 0 1-2.5 2.5H9l-3.2 2.6a.5.5 0 0 1-.8-.4V13A2.5 2.5 0 0 1 4 10.5v-5Z"
            stroke="currentColor"
            vectorEffect="non-scaling-stroke"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "ayam":
      return (
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
          <path
            d="M6 14.5c0-3.5 2.5-6 6-6 1.5 0 3 .7 3.5 2l1.5.5-1.2 1.2c-.3 2.5-2.3 4.3-5.3 4.3H6v-2Z"
            stroke="currentColor"
            vectorEffect="non-scaling-stroke"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M11 6.5c0-1.2.9-2 2-2 .7 0 1.3.4 1.6 1"
            stroke="currentColor"
            vectorEffect="non-scaling-stroke"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    case "bebek-entok":
      return (
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
          <path
            d="M4 13.5c0-2.2 1.8-3.5 4.2-3.5h2.3c.8 0 1.5-.6 1.5-1.5V7a2.5 2.5 0 0 1 5 0v.5h1.5l-1 1.5H16c0 3.8-2.5 6.5-6.5 6.5H5.5A1.5 1.5 0 0 1 4 14v-.5Z"
            stroke="currentColor"
            vectorEffect="non-scaling-stroke"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
          <path
            d="M3.5 7.5 10 3l6.5 4.5v8a1.5 1.5 0 0 1-1.5 1.5h-10a1.5 1.5 0 0 1-1.5-1.5v-8Z"
            stroke="currentColor"
            vectorEffect="non-scaling-stroke"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}
