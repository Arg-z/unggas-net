"use client";

import { useRouter, useSearchParams } from "next/navigation";

/**
 * Pemilih komunitas. Di sidebar ia duduk di dalam bidang tint daun sebagai
 * sakelar cakupan: latar transparan, teks hijau tua. Di dalam halaman (ponsel)
 * ia menjadi kontrol bergaris supaya terbaca sebagai pilihan, bukan teks.
 */
export function PemilihKomunitas({
  topik,
  lebar = "w-[152px]",
  denganLabel = false,
  kotak = false,
  lembut = false,
}: {
  topik: { slug: string; name: string }[];
  lebar?: string;
  denganLabel?: boolean;
  kotak?: boolean;
  lembut?: boolean;
}) {
  const router = useRouter();
  const tag = useSearchParams().get("tag") ?? "";

  return (
    <label className="flex items-center gap-2">
      {denganLabel && <span className="text-[11.5px] font-medium text-ink-faint">Komunitas</span>}
      <select
        aria-label="Pilih komunitas"
        value={tag}
        onChange={(e) => {
          const v = e.target.value;
          router.push(v ? `/?tag=${encodeURIComponent(v)}` : "/");
        }}
        className={`input min-h-0 cursor-pointer py-0 pr-7 focus:bg-surface ${lebar} ${
          lembut
            ? "h-8 border-transparent bg-transparent pl-1 text-[14px] font-semibold text-accent-ink hover:bg-accent-track/40"
            : kotak
              ? "h-9 border-control bg-surface pl-2 text-[13px] font-semibold text-ink-strong"
              : "h-9 border-transparent bg-transparent pl-2 text-[13px] font-semibold text-ink-strong hover:bg-sunken"
        }`}
      >
        <option value="">{denganLabel ? "Semua" : "Semua komunitas"}</option>
        {topik.map((t) => (
          <option key={t.slug} value={t.slug}>
            {t.name}
          </option>
        ))}
      </select>
    </label>
  );
}
