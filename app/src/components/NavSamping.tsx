"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { IkonAdmin, IkonIndeks, IkonNotifikasi, IkonTulis } from "./Ikon";

/* Navigasi bilah samping di bingkai. Grup Komunitas tidak ada di sini —
   pemilih komunitas tinggal di bilah atas (desktop) dan baris judul beranda
   (ponsel), keputusan pemilik 28 Okt. Baris aktif adalah tab putih dengan garis
   2px aksen di tepi bawahnya: satu-satunya warna merek di chrome. */
export function NavSamping({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Navigasi utama" className="flex flex-col gap-5">
      <div>
        <p className="px-2.5 pb-1.5 text-[12px] font-medium text-ink-faint">Forum</p>
        <Baris href="/" aktif={pathname === "/"} ikon={<IkonIndeks />}>
          Semua diskusi
        </Baris>
        <Baris href="/notifikasi" aktif={pathname === "/notifikasi"} ikon={<IkonNotifikasi />}>
          Notifikasi
        </Baris>
        <Baris href="/baru" aktif={pathname === "/baru"} ikon={<IkonTulis />}>
          Tulis diskusi
        </Baris>
        {isAdmin && (
          <Baris href="/admin" aktif={pathname === "/admin"} ikon={<IkonAdmin />}>
            Panel admin
          </Baris>
        )}
      </div>
    </nav>
  );
}

function Baris({
  href,
  aktif,
  ikon,
  children,
}: {
  href: string;
  aktif: boolean;
  ikon: ReactNode;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={aktif ? "page" : undefined}
      className={`relative flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-[13.5px] transition-colors ${
        aktif
          ? "bg-surface font-semibold text-ink-strong after:absolute after:inset-x-2.5 after:bottom-0 after:h-[2px] after:bg-accent"
          : "font-medium text-ink-soft hover:bg-sunken/70 hover:text-ink-strong"
      }`}
    >
      <span className={`shrink-0 ${aktif ? "text-ink" : "text-ink-faint"}`}>{ikon}</span>
      <span className="truncate">{children}</span>
    </Link>
  );
}
