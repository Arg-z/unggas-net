import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getSessionUser } from "@/lib/session";
import {
  listDiscussions,
  getTags,
  parseSaringan,
  parseUrutan,
  type DaftarDiskusi,
} from "@/lib/forum";
import { relatif } from "@/lib/relatif";
import { TagPill } from "@/components/TagPill";
import { Avatar } from "@/components/Avatar";
import { IkonCari, IkonSematkan } from "@/components/Ikon";
import { PemilihKomunitas } from "@/components/PemilihKomunitas";

export const dynamic = "force-dynamic";

type BarisDiskusi = DaftarDiskusi["rows"][number];

export default async function Beranda({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; page?: string; saring?: string; urut?: string; q?: string }>;
}) {
  const params = await searchParams;
  const user = await getSessionUser();
  const saring = parseSaringan(params.saring);
  const urut = parseUrutan(params.urut);
  const q = (params.q ?? "").trim().slice(0, 80);
  const page = Math.max(1, Number(params.page) || 1);

  const [{ rows, tag, hasNext, total }, tags] = await Promise.all([
    listDiscussions({ tagSlug: params.tag, page, user, saring, urut, q }),
    getTags(user),
  ]);

  // Tag yang tidak ada jangan jatuh diam-diam ke "semua diskusi": URL-nya menjanjikan
  // filter, halamannya menampilkan hal lain. 404 yang jujur lebih baik.
  if (params.tag && !tag) notFound();

  const topik = tags
    .filter((t) => t.kind === "topik")
    .map((t) => ({ slug: t.slug, name: t.name }));

  // Filter dan urutan tetap hidup di URL untuk tautan lama, tetapi tidak lagi
  // punya baris tab atau dropdown sendiri — keputusan pemilik 28 Okt.
  const dasar = new URLSearchParams();
  if (params.tag) dasar.set("tag", params.tag);
  if (q) dasar.set("q", q);
  if (urut !== "terbaru") dasar.set("urut", urut);
  if (saring !== "semua") dasar.set("saring", saring);
  const tautan = (ubah: Record<string, string | undefined> = {}) => {
    const sp = new URLSearchParams(dasar);
    for (const [k, v] of Object.entries(ubah)) {
      if (v) sp.set(k, v);
      else sp.delete(k);
    }
    const s = sp.toString();
    return s ? `/?${s}` : "/";
  };

  const subline = (() => {
    if (q) return `${total} hasil untuk “${q}”`;
    if (saring === "belum-dijawab")
      return total === 0 ? "Tidak ada pertanyaan yang menunggu" : `${total} pertanyaan menunggu jawaban`;
    if (saring === "disematkan") return `${total} diskusi disematkan`;
    return null;
  })();

  // Satu baris pengantar saat tidak ada keterangan hasil. Fungsinya memberi
  // nada, bukan menjelaskan antarmuka.
  const pengantar =
    subline ?? "Pertanyaan, pengalaman, dan angka dari peternak lain.";

  // Label di atas daftar menggantikan baris kepala tabel: satu penanda kecil,
  // bukan kolom angka yang membuat halaman terasa seperti spreadsheet.
  const labelDaftar = q
    ? "Hasil pencarian"
    : saring === "disematkan"
      ? "Diskusi disematkan"
      : saring === "belum-dijawab"
        ? "Menunggu jawaban"
        : urut === "terlama"
          ? "Diskusi terlama"
          : urut === "dibalas"
            ? "Paling banyak dibalas"
            : "Diskusi terbaru";

  const kosong = (() => {
    if (q) {
      return {
        judul: `Tidak ada hasil untuk “${q}”.`,
        isi: "Coba kata lain, atau kembali ke seluruh diskusi.",
        aksi: { href: tautan({ q: undefined }), label: "Hapus pencarian" },
      };
    }
    if (saring === "disematkan") {
      return {
        judul: "Belum ada diskusi yang disematkan.",
        isi: "Sematan dipakai untuk diskusi yang perlu dibaca lebih dulu: panduan, aturan komunitas, atau kabar penting.",
        aksi: { href: tautan({ saring: undefined }), label: "Lihat semua diskusi" },
      };
    }
    if (saring === "belum-dijawab") {
      return {
        judul: "Semua diskusi sudah dibalas.",
        isi: "Tidak ada pertanyaan yang menunggu jawaban saat ini.",
        aksi: { href: tautan({ saring: undefined }), label: "Lihat semua diskusi" },
      };
    }
    if (tag) {
      return {
        judul: `Komunitas ${tag.name} belum punya diskusi.`,
        isi: "Pertanyaan yang terdengar sepele sering jadi yang paling berguna untuk peternak lain.",
        aksi: { href: "/baru", label: "Tulis diskusi pertama" },
      };
    }
    return {
      judul: "Belum ada diskusi.",
      isi: "Forum ini baru dibuka. Diskusi pertama akan menentukan isinya.",
      aksi: { href: "/baru", label: "Tulis diskusi pertama" },
    };
  })();

  // Diskusi tersemat dipindahkan ke papan pengumuman hanya di tampilan utama.
  // Di hasil pencarian, halaman kedua, dan filter lain, sematan tetap duduk di
  // daftar agar hasilnya tidak terbelah atau menyalahi filter.
  const papan = page === 1 && !q && saring === "semua" ? rows.filter((d) => d.isPinned) : [];
  const daftar = rows.filter((d) => !papan.some((p) => p.id === d.id));

  return (
    <main id="konten" tabIndex={-1} className="w-full">
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
        <div className="min-w-0">
          <h1 className="truncate font-display text-[26px] font-semibold leading-tight tracking-tight text-ink-strong sm:text-[28px]">
            {tag
              ? tag.name
              : saring === "disematkan"
                ? "Disematkan"
                : saring === "belum-dijawab"
                  ? "Belum dijawab"
                  : "Semua diskusi"}
          </h1>
          <p className="mt-1.5 max-w-[54ch] text-[13px] leading-relaxed text-ink-soft">
            {pengantar}
          </p>
        </div>
        <div className="shrink-0 lg:hidden">
          <Suspense fallback={<span className="block h-9 w-[172px]" />}>
            <PemilihKomunitas topik={topik} lebar="w-[172px]" kotak />
          </Suspense>
        </div>
      </div>

      {/* Ponsel: pencarian tinggal satu baris. Di 1024px ke atas ia pindah ke
          sidebar. Tidak ada urutan atau jumlah di sampingnya. */}
      <div className="mt-3 lg:hidden">
        <form action="/" role="search" className="relative">
          {params.tag && <input type="hidden" name="tag" value={params.tag} />}
          {saring !== "semua" && <input type="hidden" name="saring" value={saring} />}
          {urut !== "terbaru" && <input type="hidden" name="urut" value={urut} />}
          <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-faint">
            <IkonCari className="h-[15px] w-[15px]" />
          </span>
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Cari judul atau isi"
            aria-label="Cari diskusi"
            className="h-10 w-full rounded-lg border border-control bg-surface pl-8 pr-2.5 text-[13.5px] text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none focus:ring-[3px] focus:ring-accent/15"
          />
        </form>
      </div>

      <div className="mt-5">
        {papan.length > 0 && (
          <section aria-label="Papan komunitas" className="mb-4 grid gap-3">
            {papan.map((d) => (
              <PapanDiskusi key={d.id} d={d} />
            ))}
          </section>
        )}

        {rows.length === 0 ? (
          <div className="rounded-xl border border-border bg-surface px-6 py-12 text-center">
            <p className="mx-auto max-w-[30ch] font-display text-[20px] font-semibold leading-tight tracking-tight text-ink-strong sm:text-[22px]">
              {kosong.judul}
            </p>
            <p className="mx-auto mt-2 max-w-[48ch] text-[14px] leading-relaxed text-ink-soft">
              {kosong.isi}
            </p>
            <div className="mt-5 flex justify-center">
              <Link
                href={kosong.aksi.href}
                className={kosong.aksi.href === "/baru" ? "btn btn-primary" : "btn btn-outline"}
              >
                {kosong.aksi.label}
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-baseline justify-between gap-4 border-b border-border pb-2.5">
              <h2 className="text-[12.5px] font-medium text-ink-faint">{labelDaftar}</h2>
            </div>

            {daftar.length > 0 && (
              <ul>
                {daftar.map((d) => (
                  <BarisDaftar key={d.id} d={d} />
                ))}
              </ul>
            )}
          </div>
        )}

        {(page > 1 || hasNext) && (
          <nav
            aria-label="Halaman"
            className="mt-6 flex items-center justify-between border-t border-rule pt-4 text-[13px]"
          >
            {page > 1 ? (
              <Link href={tautan({ page: String(page - 1) })} className="link">
                ← Sebelumnya
              </Link>
            ) : (
              <span />
            )}
            <span className="tabular text-ink-faint">Halaman {page}</span>
            {hasNext ? (
              <Link href={tautan({ page: String(page + 1) })} className="link">
                Berikutnya →
              </Link>
            ) : (
              <span />
            )}
          </nav>
        )}
      </div>
    </main>
  );
}

function PapanDiskusi({ d }: { d: BarisDiskusi }) {
  const balasan = Math.max(0, d._count.posts - 1);
  const isi = (d.posts[0]?.content ?? "").replace(/\s+/g, " ").trim();

  return (
    <article className="relative overflow-hidden rounded-xl border border-border bg-surface">
      <span aria-hidden="true" className="absolute inset-y-0 left-0 w-[3px] bg-accent" />
      <div className="px-5 py-5 sm:px-6 sm:py-6">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
          <span className="label-aksen inline-flex items-center gap-1.5">
            <IkonSematkan className="h-3.5 w-3.5" />
            Papan komunitas
          </span>
          <span aria-hidden="true" className="text-[11px] text-ink-faint">
            ·
          </span>
          {d.tags.slice(0, 2).map(({ tag: t }) => (
            <TagPill key={t.id} slug={t.slug} withDot={t.kind === "wilayah"}>
              {t.name}
            </TagPill>
          ))}
        </div>

        <h2 className="mt-2.5 font-display text-[18px] font-semibold leading-[1.3] tracking-tight text-ink-strong sm:max-w-[34ch] sm:text-[22px]">
          <Link href={`/t/${d.id}`} className="transition-colors hover:text-accent-ink">
            {d.title}
          </Link>
        </h2>

        {isi && (
          <p className="mt-2 line-clamp-2 max-w-[66ch] text-[13.8px] leading-[1.65] text-ink-soft sm:text-[14.5px]">
            {isi}
          </p>
        )}

        <div className="mt-3.5 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[12.5px] text-ink-faint">
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <Avatar username={d.user.username} size="sm" />
            <span className="font-medium text-ink-soft">{d.user.username}</span>
            {d.user.isAdmin && <span className="text-[11.5px]">admin</span>}
          </span>
          <span aria-hidden="true">·</span>
          <span className="tabular whitespace-nowrap">
            {balasan} balasan · {relatif(d.lastPostAt)}
          </span>
          <Link
            href={`/t/${d.id}`}
            className="ml-auto whitespace-nowrap text-[12.5px] font-semibold text-accent-deep hover:underline"
          >
            Baca pengumuman
          </Link>
        </div>
      </div>
    </article>
  );
}

function BarisDaftar({ d }: { d: BarisDiskusi }) {
  const balasan = Math.max(0, d._count.posts - 1);
  const isi = (d.posts[0]?.content ?? "").replace(/\s+/g, " ").trim();

  return (
    <li className="group relative border-b border-rule last:border-0">
      <div className="-mx-3 px-3 py-4 transition-colors group-hover:bg-wash sm:py-5">
        <h2 className="font-display text-[16.5px] font-semibold leading-[1.4] tracking-[-0.01em] text-ink-strong sm:text-[18px]">
          {d.isPinned && (
            <span
              className="mr-1.5 inline-block translate-y-[2px] text-accent"
              title="Disematkan"
            >
              <IkonSematkan className="h-3.5 w-3.5" />
              <span className="sr-only">Disematkan</span>
            </span>
          )}
          <Link
            href={`/t/${d.id}`}
            className="line-clamp-2 transition-colors after:absolute after:inset-0 after:content-[''] group-hover:text-accent-ink"
          >
            {d.title}
          </Link>
        </h2>

        {isi && (
          <p className="mt-1.5 line-clamp-2 max-w-[70ch] text-[13.5px] leading-[1.6] text-ink-soft sm:text-[14px]">
            {isi}
          </p>
        )}

        <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[12.5px] text-ink-faint">
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <Avatar username={d.user.username} size="xs" />
            <span className="font-medium text-ink-soft">{d.user.username}</span>
            {d.user.isAdmin && <span className="text-[11.5px]">admin</span>}
          </span>
          <span aria-hidden="true">·</span>
          <span className="tabular whitespace-nowrap">{relatif(d.lastPostAt)}</span>
          <span aria-hidden="true">·</span>
          <span
            className={
              balasan === 0
                ? "whitespace-nowrap text-ink-faint"
                : "whitespace-nowrap font-medium text-ink-soft"
            }
          >
            {balasan} balasan
          </span>
          {d.tags.length > 0 && (
            <>
              <span aria-hidden="true" className="hidden sm:inline">
                ·
              </span>
              <span className="flex flex-wrap items-center gap-1.5">
                {d.tags.slice(0, 2).map(({ tag: t }) => (
                  <TagPill key={t.id} slug={t.slug} withDot={t.kind === "wilayah"}>
                    {t.name}
                  </TagPill>
                ))}
              </span>
            </>
          )}
        </div>
      </div>
    </li>
  );
}
