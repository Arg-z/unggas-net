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
import { AksiTamu } from "@/components/AksiTamu";
import { TombolTulis } from "@/components/TombolTulis";
import { PemilihKomunitas } from "@/components/PemilihKomunitas";
import { IkonKeluar } from "@/components/Ikon";
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

        {/* Bingkai: sidebar dan bilah atas satu tanah. Kertas putih duduk di
            dalamnya, masuk 8px dari tepi kanan dan bawah (lembar arah). */}
        <div className="flex min-h-screen">
          <aside className="sticky top-0 hidden h-screen w-[228px] shrink-0 flex-col lg:flex">
            <div className="flex h-12 shrink-0 items-center px-5">
              <Wordmark />
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4 pt-2">
              <Suspense fallback={<div className="h-[280px]" />}>
                <NavSamping isAdmin={Boolean(user?.isAdmin)} />
              </Suspense>
            </div>

            <div className="shrink-0 p-3">
              {user ? (
                <div className="flex items-center gap-2 rounded-xl bg-surface px-2 py-2">
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
                <div className="rounded-xl bg-surface px-3 py-2.5">
                  <p className="text-[12.5px] leading-relaxed text-ink-faint">
                    <Link href="/masuk" className="link text-[12.5px]">
                      Masuk
                    </Link>{" "}
                    untuk ikut berdiskusi.
                  </p>
                </div>
              )}
            </div>
          </aside>

          <div className="flex min-w-0 flex-1 flex-col">
            {/* Bilah atas 48px — tanpa garis pemisah dari sidebar; bingkai
                terbaca dari warna, bukan dari aturan. */}
            <header className="sticky top-0 z-30 flex h-12 shrink-0 items-center gap-3 bg-ground px-4 lg:px-6">
              <div className="lg:hidden">
                <Wordmark />
              </div>

              <div className="hidden md:block">
                <Suspense fallback={<span className="block h-8 w-[300px]" />}>
                  <BilahCari />
                </Suspense>
              </div>

              <div className="ml-2 hidden border-l border-border pl-4 lg:block">
                <PemilihKomunitas topik={topik} denganLabel lebar="w-[124px]" />
              </div>

              <div className="ml-auto flex items-center gap-1.5">
                {user ? (
                  <>
                    <NotifikasiBadge userId={user.id} />
                    <TombolTulis />
                    <form action={keluar} className="lg:hidden">
                      <button
                        type="submit"
                        aria-label="Keluar"
                        title="Keluar"
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-sunken hover:text-ink-strong"
                      >
                        <IkonKeluar className="h-4 w-4" />
                      </button>
                    </form>
                  </>
                ) : (
                  <AksiTamu />
                )}
              </div>
            </header>

            {/* Kertas. Di ponsel ia menjadi layar penuh; di desktop ia masuk
                8px dari tepi kanan dan bawah, radius 16, 1px, tanpa bayangan. */}
            <div className="flex flex-1 flex-col lg:pr-2 lg:pb-2">
              <div className="flex flex-1 flex-col bg-surface lg:rounded-2xl lg:border lg:border-border">
                <div className="flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:px-7 lg:py-7">
                  {children}
                </div>

                <footer className="border-t border-rule px-4 pb-24 pt-5 sm:px-6 lg:px-7 lg:pb-5">
                  <div className="flex flex-col gap-2 text-[12.5px] text-ink-faint sm:flex-row sm:items-center sm:justify-between">
                    <p>unggas.net · Forum peternak unggas Indonesia.</p>
                    <nav
                      aria-label="Tautan footer"
                      className="flex flex-wrap items-center gap-x-4 gap-y-1"
                    >
                      <Link href="/" className="hover:text-ink-soft">
                        Semua diskusi
                      </Link>
                      {topik.map((t) => (
                        <Link
                          key={t.slug}
                          href={`/?tag=${t.slug}`}
                          className="hover:text-ink-soft"
                        >
                          {t.name}
                        </Link>
                      ))}
                      <Link href="/baru" className="hover:text-ink-soft">
                        Tulis
                      </Link>
                    </nav>
                  </div>
                </footer>
              </div>
            </div>
          </div>
        </div>

        <Suspense fallback={null}>
          <NavBawah topik={topik} />
        </Suspense>
      </body>
    </html>
  );
}
