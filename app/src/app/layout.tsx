import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { getSessionUser } from "@/lib/session";
import { getTags } from "@/lib/forum";
import { NotifikasiBadge } from "@/components/NotifikasiBadge";
import { Avatar } from "@/components/Avatar";
import { Wordmark } from "@/components/Wordmark";
import { NavSamping } from "@/components/NavSamping";
import { NavBawah } from "@/components/NavBawah";
import { BilahCari } from "@/components/BilahCari";
import { PemilihKomunitas } from "@/components/PemilihKomunitas";
import { IkonKeluar, IkonPlus } from "@/components/Ikon";
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  const tags = await getTags(user);
  const topik = tags
    .filter((t) => t.kind === "topik")
    .map((t) => ({ slug: t.slug, name: t.name, jumlah: t._count.discussions }));

  return (
    <html lang="id" className={`h-full antialiased ${fraunces.variable} ${jakarta.variable}`}>
      <body className="min-h-full bg-ground font-body text-ink">
        <a href="#konten" className="lewati-nav">
          Langsung ke konten
        </a>

        <div className="flex min-h-screen">
          {/* Bilah samping 230px — satu tanah dengan bilah atas, dipisah garis 1px. */}
          <aside className="sticky top-0 hidden h-screen w-[230px] shrink-0 flex-col border-r border-border lg:flex">
            <div className="flex h-16 shrink-0 items-center border-b border-border px-5">
              <Wordmark />
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
              <Suspense fallback={<div className="h-[240px]" />}>
                <NavSamping isAdmin={Boolean(user?.isAdmin)} />
              </Suspense>
            </div>

            <div className="shrink-0 border-t border-border p-3">
              {user ? (
                <div className="flex items-center gap-2 px-1.5 py-1">
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
                      className="flex h-8 w-8 items-center justify-center rounded-md text-ink-faint transition-colors hover:bg-sunken hover:text-ink-strong"
                    >
                      <IkonKeluar className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              ) : (
                <p className="px-1.5 text-[12px] leading-relaxed text-ink-faint">
                  <Link href="/masuk" className="link text-[12px]">
                    Masuk
                  </Link>{" "}
                  untuk ikut berdiskusi.
                </p>
              )}
            </div>
          </aside>

          <div className="flex min-w-0 flex-1 flex-col">
            {/* Bilah atas 64px. Isinya nyata: pencarian, aksi, dan pemilih komunitas. */}
            <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-ground px-4 lg:h-16 lg:px-[29px]">
              <div className="lg:hidden">
                <Wordmark />
              </div>

              <div className="hidden md:block">
                <Suspense fallback={<span className="block h-9 w-[264px]" />}>
                  <BilahCari />
                </Suspense>
              </div>

              <div className="ml-auto flex items-center gap-1.5">
                {user ? (
                  <>
                    <NotifikasiBadge userId={user.id} />
                    <Link href="/baru" aria-label="Tulis diskusi" className="btn btn-primary">
                      <IkonPlus />
                      <span className="hidden sm:inline">Tulis diskusi</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/masuk" className="btn btn-quiet">
                      Masuk
                    </Link>
                    <Link href="/daftar" className="btn btn-primary">
                      Daftar
                    </Link>
                  </>
                )}
              </div>

              <div className="hidden h-16 items-center self-stretch border-l border-border pl-4 lg:flex">
                <Suspense fallback={<span className="w-[152px]" />}>
                  <PemilihKomunitas topik={topik} denganLabel />
                </Suspense>
              </div>
            </header>

            <div className="flex-1 px-4 py-6 lg:px-[29px] lg:py-8">{children}</div>

            <footer className="border-t border-border px-4 pb-24 pt-6 lg:px-[29px] lg:pb-6">
              <div className="flex flex-col gap-2 text-[12.5px] text-ink-faint sm:flex-row sm:items-center sm:justify-between">
                <p>unggas.net · Forum peternak unggas Indonesia.</p>
                <nav aria-label="Tautan footer" className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <Link href="/" className="hover:text-ink-soft">
                    Semua diskusi
                  </Link>
                  <Link href="/?tag=puyuh" className="hover:text-ink-soft">
                    Puyuh
                  </Link>
                  <Link href="/?tag=lobby" className="hover:text-ink-soft">
                    Lobby
                  </Link>
                  <Link href="/baru" className="hover:text-ink-soft">
                    Tulis
                  </Link>
                </nav>
              </div>
            </footer>
          </div>
        </div>

        <Suspense fallback={null}>
          <NavBawah topik={topik} />
        </Suspense>
      </body>
    </html>
  );
}
