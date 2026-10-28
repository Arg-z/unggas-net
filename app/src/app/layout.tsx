import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { getSessionUser } from "@/lib/session";
import { getTags } from "@/lib/forum";
import { prisma } from "@/lib/db";
import { NotifikasiBadge } from "@/components/NotifikasiBadge";
import { Avatar } from "@/components/Avatar";
import { Wordmark } from "@/components/Wordmark";
import { NavSamping } from "@/components/NavSamping";
import { BilahCari } from "@/components/BilahCari";
import { KartuTamu } from "@/components/KartuTamu";
import { MenuPonsel } from "@/components/MenuPonsel";
import { TombolTulis } from "@/components/TombolTulis";
import { PemilihKomunitas } from "@/components/PemilihKomunitas";
import { IkonKeluar } from "@/components/Ikon";
import { Bingkai } from "@/components/Bingkai";
import { SkripTema, TombolTema } from "@/components/Tema";
import { keluar } from "./actions/auth";

/* Serif untuk identitas & permukaan baca, sans humanist untuk UI.
   Fraunces punya optical sizing (opsz) — tajam besar di judul, nyaman kecil di prosa.
   Plus Jakarta Sans (Tokotype, Indonesia) untuk semua teks UI.
   Keduanya self-hosted via next/font, tanpa request runtime. */
const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-fraunces",
  display: "swap",
});
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Forum Peternak Unggas", template: "%s — Forum Peternak Unggas" },
  description:
    "Satu akun untuk semua komunitas peternak unggas Indonesia: puyuh, ayam, bebek, dan lainnya.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1210" },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  const tags = await getTags(user);
  const topik = tags
    .filter((t) => t.kind === "topik")
    .map((t) => ({ slug: t.slug, name: t.name, jumlah: t._count.discussions }));

  // Satu hitungan untuk dua tempat: lencana di bilah ponsel dan angka di
  // baris nav sidebar. Jangan biarkan keduanya membaca angka yang berbeda.
  const belumDibaca = user
    ? await prisma.notification.count({ where: { userId: user.id, readAt: null } })
    : 0;

  const isiMenu = (
    <div className="space-y-5">
      <Suspense fallback={<div className="h-9 rounded-lg bg-sunken" />}>
        <BilahCari penuh />
      </Suspense>

      <div className="rounded-xl border border-border px-3 py-2.5">
        <p className="px-1 text-[11.5px] font-medium text-ink-faint">Komunitas</p>
        <div className="mt-0.5">
          <Suspense fallback={<div className="h-8" />}>
            <PemilihKomunitas topik={topik} lebar="w-full" lembut />
          </Suspense>
        </div>
      </div>

      <Suspense fallback={<div className="h-44" />}>
        <NavSamping isAdmin={Boolean(user?.isAdmin)} belumDibaca={belumDibaca} ponsel />
      </Suspense>

      {user ? (
        <div className="flex items-center gap-3 border-t border-border pt-4">
          <Avatar username={user.username} size="md" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-semibold leading-tight text-ink-strong">
              {user.username}
            </p>
            <p className="truncate text-[12px] leading-tight text-ink-faint">
              {user.isAdmin ? "Admin" : "Anggota"}
            </p>
          </div>
          <form action={keluar}>
            <button type="submit" className="btn btn-quiet btn-sm">
              <IkonKeluar />
              Keluar
            </button>
          </form>
        </div>
      ) : (
        <div className="border-t border-border pt-4">
          <KartuTamu />
        </div>
      )}
    </div>
  );

  // Bidang terbuka: sidebar menyatu dengan tanah halaman, satu garis rambut
  // memisahkannya dari kanvas. Tidak ada bilah atas di desktop; kartu putih
  // duduk langsung di atas tanah.
  const samping = (
    <aside className="sticky top-0 hidden h-screen w-[240px] shrink-0 flex-col border-r border-border bg-surface px-3 lg:flex">
      <div className="flex h-14 shrink-0 items-center justify-between px-1">
        <Wordmark />
        <TombolTema />
      </div>

      <div className="shrink-0">
        <p className="mb-1.5 px-1 text-[11.5px] font-medium text-ink-faint">Komunitas</p>
        <Suspense fallback={<div className="h-9" />}>
          <PemilihKomunitas topik={topik} lebar="w-full" kotak />
        </Suspense>
      </div>

      <div className="mt-4 shrink-0">
        <Suspense fallback={<div className="h-9 rounded-lg bg-sunken" />}>
          <BilahCari penuh />
        </Suspense>
      </div>

      <div className="mt-6 min-h-0 flex-1 overflow-y-auto">
        <Suspense fallback={<div className="h-[200px]" />}>
          <NavSamping isAdmin={Boolean(user?.isAdmin)} belumDibaca={belumDibaca} />
        </Suspense>
      </div>

      <div className="shrink-0 border-t border-border py-3">
        {user ? (
          <div className="flex items-center gap-2 px-1 py-1">
            <Avatar username={user.username} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold leading-tight text-ink-strong">
                {user.username}
              </p>
              <p className="truncate text-[11.5px] leading-tight text-ink-faint">
                {user.isAdmin ? "Admin" : "Anggota"}
              </p>
            </div>
            <form action={keluar}>
              <button
                type="submit"
                aria-label="Keluar"
                title="Keluar"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-faint transition-colors hover:bg-wash hover:text-ink-strong"
              >
                <IkonKeluar className="h-4 w-4" />
              </button>
            </form>
          </div>
        ) : (
          <KartuTamu />
        )}
      </div>
    </aside>
  );

  // Bilah ponsel 48px: merek, satu aksi tulis, notifikasi, menu.
  // Tidak ada bilah bawah — keputusan pemilik 28 Okt.
  const bilah = (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-2 border-b border-border bg-surface/95 px-4 backdrop-blur lg:hidden">
      <Wordmark />
      <div className="flex items-center gap-1">
        {user && <NotifikasiBadge userId={user.id} jumlah={belumDibaca} />}
        {user && <TombolTulis />}
        <TombolTema ukuran="besar" />
        <MenuPonsel>{isiMenu}</MenuPonsel>
      </div>
    </header>
  );

  const kaki = (
    <footer className="mt-12 border-t border-border pt-5">
      <div className="flex flex-col gap-2 text-[12.5px] text-ink-faint sm:flex-row sm:items-center sm:justify-between">
        <p>unggas.net · Forum peternak unggas Indonesia.</p>
        <nav aria-label="Tautan footer" className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <Link href="/" className="hover:text-accent-ink">
            Semua diskusi
          </Link>
          {topik.map((t) => (
            <Link key={t.slug} href={`/?tag=${t.slug}`} className="hover:text-accent-ink">
              {t.name}
            </Link>
          ))}
          <Link href="/baru" className="hover:text-accent-ink">
            Tulis
          </Link>
        </nav>
      </div>
    </footer>
  );

  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`h-full antialiased ${fraunces.variable} ${jakarta.variable}`}
    >
      <body className="min-h-full bg-ground font-body text-ink">
        <SkripTema />
        <a href="#konten" className="lewati-nav">
          Langsung ke konten
        </a>

        <Bingkai samping={samping} bilah={bilah} kaki={kaki}>
          {children}
        </Bingkai>
      </body>
    </html>
  );
}
