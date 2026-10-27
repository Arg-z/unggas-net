"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { IkonAdmin, IkonIndeks, IkonNotifikasi, IkonTulis } from "./Ikon";

/* Navigasi bilah samping: pitch 40px, label grup huruf kalimat, keadaan aktif
   berupa tint aksen (bukan batang kiri + tint — itu ditandai sebagai keluar gaya). */
export function NavSamping({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const tag = useSearchParams().get("tag");
  const diIndeks = pathname === "/" && !tag;

  return (
    <nav aria-label="Navigasi utama" className="flex flex-col">
      <p className="px-2.5 pb-1.5 text-[11.5px] font-medium text-ink-faint">Forum</p>
      <Baris href="/" aktif={diIndeks} ikon={<IkonIndeks />}>
        Semua diskusi
      </Baris>
      <Baris href="/baru" aktif={pathname === "/baru"} ikon={<IkonTulis />}>
        Tulis diskusi
      </Baris>
      <Baris href="/notifikasi" aktif={pathname === "/notifikasi"} ikon={<IkonNotifikasi />}>
        Notifikasi
      </Baris>
      {isAdmin && (
        <Baris href="/admin" aktif={pathname === "/admin"} ikon={<IkonAdmin />}>
          Panel admin
        </Baris>
      )}

    </nav>
  );
}

function Baris({
  href,
  aktif,
  ikon,
  jumlah,
  children,
}: {
  href: string;
  aktif: boolean;
  ikon: ReactNode;
  jumlah?: number;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={aktif ? "page" : undefined}
      className={`flex h-10 items-center gap-2.5 rounded-md px-2.5 text-[14px] transition-colors ${
        aktif
          ? "bg-accent-soft font-semibold text-accent-ink"
          : "font-medium text-ink-soft hover:bg-sunken hover:text-ink-strong"
      }`}
    >
      <span className={`shrink-0 ${aktif ? "text-accent" : "text-ink-faint"}`}>{ikon}</span>
      <span className="truncate">{children}</span>
      {jumlah !== undefined && (
        <span
          className={`tabular ml-auto shrink-0 text-[11.5px] ${
            aktif ? "text-accent-ink" : "text-ink-faint"
          }`}
        >
          {jumlah}
        </span>
      )}
    </Link>
  );
}
