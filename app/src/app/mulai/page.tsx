import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { relatif } from "@/lib/relatif";
import { Pengungkap } from "@/components/Pengungkap";

export const metadata: Metadata = {
  title: { absolute: "Forum Peternak Unggas Indonesia — unggas.net" },
  description: "Forum peternak unggas Indonesia. Baca tanpa akun, tulis setelah masuk.",
  alternates: { canonical: "https://unggas.net/mulai" },
};

const FITUR = [
  {
    judul: "Cari",
    isi: "Pencarian menelusuri seluruh isi diskusi, termasuk balasan.",
  },
  {
    judul: "Wilayah",
    isi: "Tandai provinsi di diskusi supaya saran pakan dan harga sesuai daerahmu.",
  },
  {
    judul: "Tautan",
    isi: "Setiap diskusi punya alamat sendiri, jadi tautannya tetap bisa dibuka saat dikirim ke grup.",
  },
];

const FAQ = [
  {
    tanya: "Apa bedanya dengan grup chat?",
    jawab:
      "Di grup pertanyaan cepat tenggelam, sedangkan di sini tiap diskusi punya halaman sendiri.",
  },
  {
    tanya: "Apakah harus punya ternak?",
    jawab: "Tidak perlu. Kamu bisa baca-baca dulu.",
  },
  {
    tanya: "Apakah gratis?",
    jawab: "Gratis. Pilih username dan password, akun langsung aktif.",
  },
  {
    tanya: "Boleh jualan?",
    jawab: "Belum. Jual-beli nanti punya tempat sendiri.",
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
            Forum peternak unggas Indonesia. Baca tanpa akun, tulis setelah masuk.
          </p>
          <Link
            href="/daftar"
            className="inline-flex min-h-[52px] w-full shrink-0 items-center justify-center whitespace-nowrap bg-ink-strong px-7 text-[14px] font-semibold text-white transition-colors hover:bg-accent-ink md:w-auto"
          >
            Buat akun
          </Link>
        </div>
      </section>

      <section aria-labelledby="isinya" className="px-6 py-20 md:px-12 md:py-24">
        <h2
          id="isinya"
          className="text-[22px] font-semibold tracking-[-0.03em] text-ink-strong md:text-[36px]"
        >
          Isinya
        </h2>

        <ul className="mt-8 md:mt-12">
          {FITUR.map((f, i) => (
            <li
              key={f.judul}
              className="flex flex-col gap-2 py-6 lg:flex-row lg:items-baseline lg:gap-12 lg:py-7"
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
      </section>

      <section aria-labelledby="ramai" className="px-6 py-20 md:px-12 md:py-24">
        <h2
          id="ramai"
          className="max-w-[16ch] text-[clamp(2rem,5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-ink-strong"
        >
          Yang sedang dibicarakan
        </h2>
        <p data-reveal className="mt-4 text-[17px] leading-[1.6] text-ink-soft">
          Untuk sementara, baru Puyuh dan Lobby yang terbuka. Topik lain menyusul.
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

      <section aria-labelledby="aturan" className="bg-accent px-6 py-20 text-white md:px-12 md:py-24">
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
        className="flex min-h-[100svh] flex-col bg-ink-strong px-6 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-[26vh] text-white md:min-h-0 md:px-12 md:pb-24 md:pt-24 lg:min-h-[100svh] lg:pb-[calc(2.5rem+env(safe-area-inset-bottom))] lg:pt-[24vh]"
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

        <div className="mt-auto flex flex-col gap-7 pt-16 md:flex-row md:items-end md:justify-between md:gap-12">
          <p className="max-w-[40ch] text-[17px] leading-[1.55] text-white/80 md:text-[22px]">
            Buat akun gratis, lalu mulai dari satu pertanyaan.
          </p>
          <div className="flex shrink-0 flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
            <Link
              href="/daftar"
              className="inline-flex min-h-[52px] items-center justify-center whitespace-nowrap bg-white px-7 text-[14px] font-semibold text-ink-strong transition-colors hover:bg-accent-soft"
            >
              Buat akun
            </Link>
            <Link
              href="/"
              className="whitespace-nowrap text-[14px] font-semibold text-white underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-white"
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

        <div className="mt-10 grid gap-8 md:grid-cols-12 md:gap-6">
          <p className="text-[17px] text-ink-soft md:col-span-4">
            Forum peternak unggas Indonesia.
          </p>
          <nav
            aria-label="Tautan footer"
            className="flex flex-wrap gap-x-6 gap-y-2 text-[14px] text-ink-soft md:col-span-4 md:col-start-9 md:justify-end"
          >
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
        </div>

        <p className="mt-12 text-[14px] text-ink-faint">© 2026 unggas.net</p>
      </footer>
    </main>
  );
}
