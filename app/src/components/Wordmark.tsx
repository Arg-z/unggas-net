import Link from "next/link";

/** Merek produk: telur puyuh bergaris + kata. Tanpa kotak berwarna — tanda
 *  merek cukup dari bentuknya sendiri, bukan dari blok hijau di belakangnya. */
export function Wordmark() {
  return (
    <Link
      href="/"
      aria-label="unggas.net, beranda"
      className="inline-flex items-center gap-2"
    >
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="shrink-0 text-accent"
      >
        <path
          d="M12 3.4c-4 0-7.1 5-7.1 10.2 0 4.2 3.1 6.8 7.1 6.8s7.1-2.6 7.1-6.8C19.1 8.4 16 3.4 12 3.4Z"
          stroke="currentColor"
          strokeWidth="1.6"
          vectorEffect="non-scaling-stroke"
        />
        <circle cx="9.6" cy="10.2" r="0.9" fill="currentColor" />
        <circle cx="14.4" cy="10.2" r="0.9" fill="currentColor" />
        <circle cx="12" cy="13.6" r="0.9" fill="currentColor" />
      </svg>
      <span className="font-display text-[19px] font-semibold leading-none tracking-tight text-ink-strong">
        unggas<span className="text-ink-faint">.net</span>
      </span>
    </Link>
  );
}
