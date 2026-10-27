"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { IkonBeranda, IkonNotifikasi, IkonTulis } from "./Ikon";
import { TopicIcon } from "./TagPill";

/** Bilah bawah ponsel: empat tujuan. Komunitas lain tetap terjangkau lewat
 *  pemilih di baris judul beranda. Garis 2px di tepi atas menandai tujuan aktif,
 *  sejalan dengan tab putih di bilah samping desktop. */
export function NavBawah({ topik }: { topik: { slug: string; name: string; jumlah: number }[] }) {
  const pathname = usePathname();
  const tag = useSearchParams().get("tag");
  const diBeranda = pathname === "/";
  const utama = [...topik].sort((a, b) => b.jumlah - a.jumlah).slice(0, 1);

  const tujuan: { href: string; label: string; ikon: ReactNode; aktif: boolean }[] = [
    { href: "/", label: "Beranda", ikon: <IkonBeranda />, aktif: diBeranda && !tag },
    ...utama.map((t) => ({
      href: `/?tag=${t.slug}`,
      label: t.name,
      ikon: <TopicIcon slug={t.slug} className="h-4 w-4" />,
      aktif: diBeranda && tag === t.slug,
    })),
    { href: "/baru", label: "Tulis", ikon: <IkonTulis />, aktif: pathname === "/baru" },
    {
      href: "/notifikasi",
      label: "Notifikasi",
      ikon: <IkonNotifikasi />,
      aktif: pathname === "/notifikasi",
    },
  ];

  return (
    <nav
      aria-label="Navigasi bawah"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <ul className="flex items-stretch px-2">
        {tujuan.map((t) => (
          <li key={t.href} className="relative min-w-0 flex-1">
            {t.aktif && (
              <span
                aria-hidden="true"
                className="absolute inset-x-5 top-0 h-[2px] rounded-full bg-accent"
              />
            )}
            <Link
              href={t.href}
              aria-current={t.aktif ? "page" : undefined}
              className={`flex h-[54px] flex-col items-center justify-center gap-1 text-[11px] font-medium ${
                t.aktif ? "text-ink-strong" : "text-ink-faint"
              }`}
            >
              <span className={t.aktif ? "text-accent" : "text-ink-faint"}>{t.ikon}</span>
              <span className="max-w-full truncate px-1">{t.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
