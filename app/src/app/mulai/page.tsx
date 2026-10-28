import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { relatif } from "@/lib/relatif";
import { Pengungkap } from "@/components/Pengungkap";
import { TombolTema } from "@/components/Tema";

export const metadata: Metadata = {
  title: { absolute: "Forum Peternak Unggas Indonesia — unggas.net" },
  description: "Forum peternak unggas Indonesia. Baca tanpa akun.",
  alternates: { canonical: "https://unggas.net/mulai" },
};

const FITUR = [
  {
    judul: "Cari",
    isi: "Semua isi diskusi bisa dicari, termasuk balasan.",
  },
  {
    judul: "Wilayah",
    isi: "Tandai provinsi supaya saran pakan dan harga sesuai daerahmu.",
  },
  {
    judul: "Tautan",
    isi: "Tiap diskusi punya tautan sendiri untuk dibagikan.",
  },
];

const FAQ = [
  {
    tanya: "Apa bedanya dengan grup chat?",
    jawab:
      "Pertanyaan di grup cepat tenggelam; di sini punya halaman sendiri.",
  },
  {
    tanya: "Apakah gratis?",
    jawab: "Gratis. Pilih username dan password, akun langsung aktif.",
  },
  {
    tanya: "Boleh jualan?",
    jawab: "Belum.",
  },
];

const tunda = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export default async function Mulai() {
  const diskusi = await prisma.discussion.findMany({
    where: {
      isHidden: false,
      tags: { none: { tag: { isRestricted: true } } },
    },
    orderBy: [{ isPinned: "desc" }, { lastPostAt: "desc" }],
    take: 6,
    include: {
      tags: { include: { tag: true } },
      _count: { select: { posts: { where: { isHidden: false } } } },
    },
  });

  return (
    <main id="konten" tabIndex={-1} className="mx-auto w-full max-w-[1600px] bg-ground">
      <Pengungkap />

      {/* Satu layar, hanya kata. Tidak ada navigasi batang: dua tautan kecil
          di sudut, satu pernyataan besar, satu aksi. */}
      <section
        aria-labelledby="judul-mulai"
        className="flex min-h-[100svh] flex-col justify-between px-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-6 md:px-12 md:pb-[calc(2rem+env(safe-area-inset-bottom))]"
      >
        <header className="flex items-center justify-between gap-6 text-[14px]">
          <Link href="/" className="font-semibold tracking-tight text-ink-strong">
            unggas<span className="text-ink-faint">.net</span>
          </Link>
          <nav aria-label="Navigasi halaman" className="flex items-center gap-4 text-ink-soft sm:gap-5">
            <Link href="/" className="text-[14px] transition-colors hover:text-ink-strong">
              Diskusi
            </Link>
            <Link href="/masuk" className="transition-colors hover:text-ink-strong">
              Masuk
            </Link>
            <TombolTema />
          </nav>
        </header>

        <h1
          id="judul-mulai"
          className="py-[8vh] font-display text-[clamp(3.5rem,15vw,12.5rem)] font-semibold leading-[0.86] tracking-[-0.05em] text-ink-strong"
        >
          <span className="lp-mask block">
            <span className="lp-naik" style={{ animationDelay: "100ms" }}>
              Pertanyaan
            </span>
          </span>
          <span className="lp-mask block text-left md:text-right">
            <span className="lp-naik" style={{ animationDelay: "200ms" }}>
              tetap ada.
            </span>
          </span>
        </h1>

        <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between md:gap-12">
          <p className="max-w-[44ch] text-balance text-[22px] leading-[1.4] text-ink-soft">
            Forum peternak unggas Indonesia. Baca tanpa akun.
          </p>
          <Link
            href="/daftar"
            className="inline-flex min-h-[52px] w-full shrink-0 items-center justify-center whitespace-nowrap bg-invert px-7 text-[14px] font-semibold text-on-invert transition-colors hover:bg-accent hover:text-on-accent md:w-auto"
          >
            Buat akun
          </Link>
        </div>
      </section>

      <section aria-labelledby="isinya" className="px-6 py-20 md:px-12 md:py-24">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-6">
          <h2
            id="isinya"
            className="text-[22px] font-semibold tracking-[-0.03em] text-ink-strong md:text-[36px] lg:col-span-3"
          >
            Isinya
          </h2>

          <ul className="lg:col-span-8 lg:col-start-5">
            {FITUR.map((f, i) => (
              <li
                key={f.judul}
                className="flex flex-col gap-2 py-5 lg:flex-row lg:items-baseline lg:gap-10 lg:py-6"
              >
                <h3
                  data-reveal
                  style={tunda(i * 70)}
                  className="shrink-0 font-display text-[clamp(2rem,5vw,4rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-ink-strong"
                >
                  {f.judul}
                </h3>
                <p
                  data-reveal
                  style={tunda(i * 70 + 60)}
                  className="max-w-[58ch] text-[17px] leading-[1.55] text-ink-soft"
                >
                  {f.isi}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="ramai" className="px-6 py-20 md:px-12 md:py-24">
        <h2
          id="ramai"
          className="max-w-[16ch] text-[clamp(2rem,5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-ink-strong"
        >
          Yang sedang dibicarakan
        </h2>
        <p data-reveal className="mt-4 text-[17px] leading-[1.6] text-ink-soft">
          Untuk sekarang baru Puyuh dan Lobby.
        </p>

        <ul className="mt-8 md:mt-12">
          {diskusi.map((d, i) => {
            const topik = d.tags.find((t) => t.tag.kind === "topik")?.tag.name ?? "Diskusi";
            const balasan = Math.max(0, d._count.posts - 1);

            return (
              <li key={d.id}>
                <Link
                  href={`/t/${d.id}`}
                  data-reveal
                  style={tunda(i * 60)}
                  className="group -mx-3 block px-3 py-5 transition-colors hover:bg-wash md:grid md:grid-cols-12 md:items-baseline md:gap-6"
                >
                  <h3 className="text-[17px] font-semibold leading-snug tracking-[-0.01em] text-ink-strong transition-colors group-hover:text-accent-ink md:col-span-8 md:text-[22px]">
                    {d.title}
                  </h3>
                  <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[14px] text-ink-faint md:col-span-4 md:mt-0 md:justify-end">
                    {d.isPinned && <span>Disematkan</span>}
                    <span>{topik}</span>
                    <span>{balasan} balasan</span>
                    <span>{relatif(d.lastPostAt)}</span>
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>

        <Link
          href="/"
          className="mt-8 inline-block text-[14px] font-semibold text-ink-strong underline decoration-ink-faint underline-offset-4 transition-colors hover:text-accent-ink hover:decoration-accent"
        >
          Semua diskusi
        </Link>
      </section>

      <section aria-labelledby="aturan" className="bg-accent px-6 py-20 text-on-accent md:px-12 md:py-24">
        <div className="grid gap-8 md:grid-cols-12 md:gap-6">
          <h2 id="aturan" className="text-[17px] font-semibold leading-snug md:col-span-3">
            Aturan main
          </h2>
          <div className="md:col-span-8 md:col-start-5">
            <blockquote
              data-reveal
              className="max-w-[28ch] font-display text-[clamp(1.375rem,3vw,2.25rem)] font-medium leading-[1.2] tracking-[-0.02em]"
            >
              “Sopan dan saling bantu. Jual-beli nanti punya tempatnya sendiri.”
            </blockquote>
            <p data-reveal style={tunda(100)} className="mt-6 text-[14px]">
              <Link
                href="/t/20"
                className="underline decoration-white/50 underline-offset-4 transition-colors hover:decoration-white"
              >
                Dari sambutan di forum
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="tanya" className="px-6 py-20 md:px-12 md:py-24">
        <div className="grid gap-10 md:grid-cols-12 md:gap-6">
          <h2
            id="tanya"
            className="text-[clamp(2rem,5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-ink-strong md:col-span-5"
          >
            Yang sering ditanya
          </h2>

          <dl className="space-y-8 md:col-span-6 md:col-start-7">
            {FAQ.map((f, i) => (
              <div key={f.tanya} data-reveal style={tunda(i * 50)}>
                <dt className="text-[17px] font-semibold text-ink-strong">{f.tanya}</dt>
                <dd className="mt-2 max-w-[58ch] text-[17px] leading-[1.65] text-ink-soft">
                  {f.jawab}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section
        aria-labelledby="ajakan"
        className="flex flex-col bg-invert px-6 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-20 text-on-invert md:px-12 md:pb-24 md:pt-28"
      >
        <h2
          id="ajakan"
          data-reveal
          className="font-display text-[clamp(3.5rem,15vw,12.5rem)] font-semibold leading-[0.9] tracking-[-0.05em]"
        >
          Ada yang
          <br />
          mau ditanya?
        </h2>

        <div className="mt-14 flex flex-col gap-7 md:flex-row md:items-end md:justify-end md:gap-12">
          <div className="flex shrink-0 flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
            <Link
              href="/daftar"
              className="inline-flex min-h-[52px] items-center justify-center whitespace-nowrap bg-on-invert px-7 text-[14px] font-semibold text-invert transition-colors hover:bg-accent hover:text-on-accent"
            >
              Buat akun
            </Link>
            <Link
              href="/"
              className="whitespace-nowrap text-[14px] font-semibold text-on-invert underline decoration-on-invert/40 underline-offset-4 transition-colors hover:decoration-on-invert"
            >
              Baca diskusi
            </Link>
          </div>
        </div>
      </section>

      <footer className="px-6 pb-[calc(2.5rem+env(safe-area-inset-bottom))] pt-16 md:px-12 md:pt-28">
        <p className="font-display text-[clamp(3.5rem,15vw,12.5rem)] font-semibold leading-none tracking-[-0.05em] text-ink-strong">
          unggas<span className="text-ink-faint">.net</span>
        </p>

        <div className="mt-10 flex flex-col gap-6 text-[14px] md:flex-row md:items-center md:justify-between">
          <nav aria-label="Tautan footer" className="flex flex-wrap gap-x-6 gap-y-2 text-ink-soft">
            <Link href="/" className="transition-colors hover:text-accent-ink">
              Diskusi
            </Link>
            <Link href="/daftar" className="transition-colors hover:text-accent-ink">
              Buat akun
            </Link>
            <Link href="/masuk" className="transition-colors hover:text-accent-ink">
              Masuk
            </Link>
          </nav>
          <p className="text-ink-faint">© 2026 unggas.net</p>
        </div>
      </footer>
    </main>
  );
}
