"use client";

import { useRouter, useSearchParams } from "next/navigation";

/**
 * Pemilih komunitas. Di bilah atas ia duduk di ujung kanan di balik garis
 * pemisah penuh; di dalam halaman (ponsel) ia menjadi kontrol bergaris supaya
 * terbaca sebagai pilihan, bukan teks.
 */
export function PemilihKomunitas({
  topik,
  lebar = "w-[152px]",
  denganLabel = false,
  kotak = false,
}: {
  topik: { slug: string; name: string }[];
  lebar?: string;
  denganLabel?: boolean;
  kotak?: boolean;
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
        className={`input h-9 min-h-0 cursor-pointer py-0 pl-2 pr-7 text-[13px] font-semibold text-ink-strong focus:bg-surface ${lebar} ${
          kotak ? "border-control bg-surface" : "border-transparent bg-transparent hover:bg-sunken"
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
