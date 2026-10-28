import Image from "next/image";
import Link from "next/link";

/** Merek produk: kepala ayam putih di kotak hijau, aset yang sama dengan
 *  ikon tab, supaya tanda di situs dan favicon tidak lagi berbeda. */
export function Wordmark() {
  return (
    <Link
      href="/"
      aria-label="unggas.net, beranda"
      className="inline-flex min-h-11 items-center gap-2.5"
    >
      <Image
        src="/ayam.png"
        alt=""
        width={32}
        height={32}
        unoptimized
        loading="eager"
        className="h-8 w-8 shrink-0 rounded-[8px]"
      />
      <span className="max-[359px]:hidden font-display text-[18.5px] font-semibold leading-none tracking-tight text-ink-strong">
        unggas<span className="text-ink-faint">.net</span>
      </span>
    </Link>
  );
}
