"use client";

import { useSearchParams } from "next/navigation";
import { IkonCari } from "./Ikon";

/** Pencarian di bilah atas: form GET biasa ke beranda, jadi tetap bekerja
 *  tanpa JavaScript dan URL-nya bisa dibagikan. Filter yang sedang aktif ikut
 *  dibawa, supaya mencari dari satu komunitas tidak diam-diam melebar ke semua. */
export function BilahCari() {
  const sp = useSearchParams();
  const q = sp.get("q") ?? "";
  const tag = sp.get("tag");
  const saring = sp.get("saring");
  const urut = sp.get("urut");

  return (
    <form action="/" role="search" className="relative w-[264px]">
      {tag && <input type="hidden" name="tag" value={tag} />}
      {saring && <input type="hidden" name="saring" value={saring} />}
      {urut && <input type="hidden" name="urut" value={urut} />}
      <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-faint">
        <IkonCari className="h-[15px] w-[15px]" />
      </span>
      <input
        key={q}
        type="search"
        name="q"
        defaultValue={q}
        placeholder="Cari diskusi"
        aria-label="Cari diskusi"
        className="h-9 w-full rounded-md border border-control bg-surface pl-8 pr-2.5 text-[13.5px] text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none focus:ring-[3px] focus:ring-accent/15"
      />
    </form>
  );
}
