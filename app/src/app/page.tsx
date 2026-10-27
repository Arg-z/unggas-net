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
    <main id="konten" tabIndex={-1} className="max-w-[1120px]">
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
          {subline && <p className="mt-1 text-[13px] text-ink-faint">{subline}</p>}
        </div>
        <div className="shrink-0 lg:hidden">
          <Suspense fallback={<span className="block h-9 w-[172px]" />}>
            <PemilihKomunitas topik={topik} lebar="w-[172px]" kotak />
          </Suspense>
        </div>
      </div>

      {/* Ponsel: pencarian tinggal satu baris. Di 768px ke atas ia pindah ke
          bilah atas. Tidak ada urutan atau jumlah di sampingnya. */}
      <div className="mt-3 md:hidden">
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
          <div className="rounded-xl border border-dashed border-control/60 bg-wash/60 px-5 py-8">
            <p className="text-[15px] font-semibold text-ink-strong">{kosong.judul}</p>
            <p className="mt-1.5 max-w-[52ch] text-[14px] leading-relaxed text-ink-soft">
              {kosong.isi}
            </p>
            <div className="mt-4">
              <Link href={kosong.aksi.href} className="btn btn-outline">
                {kosong.aksi.label}
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <div className="hidden grid-cols-[minmax(0,1fr)_56px_100px] gap-x-5 px-2 pb-2 text-[12px] font-medium text-ink-faint sm:grid">
              <span>Diskusi</span>
              <span className="text-right">Balasan</span>
              <span className="text-right">Aktivitas</span>
            </div>

            {daftar.length > 0 && (
              <ul className="divide-y divide-rule border-t border-rule">
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
    <article className="relative overflow-hidden rounded-xl border border-border bg-wash">
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[2px] bg-accent" />
      <div className="px-4 py-4 sm:px-5 sm:py-5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
          <span className="eyebrow inline-flex items-center gap-1.5">
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

        <h2 className="mt-2 font-display text-[20px] font-semibold leading-snug tracking-tight text-ink-strong sm:text-[22px]">
          <Link href={`/t/${d.id}`} className="hover:text-accent-ink">
            {d.title}
          </Link>
        </h2>

        {isi && (
          <p className="mt-1.5 line-clamp-2 max-w-[68ch] text-[13.5px] leading-relaxed text-ink-soft">
            {isi}
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px] text-ink-faint">
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <Avatar username={d.user.username} size="xs" />
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
    <li className="group relative transition-colors hover:bg-wash/70">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-5 px-2 py-3.5 sm:grid-cols-[minmax(0,1fr)_56px_100px] sm:items-center">
        <div className="min-w-0">
          <h2 className="text-[15px] font-semibold leading-6 text-ink-strong">
            {d.isPinned && (
              <span
                className="mr-1.5 inline-block translate-y-[2px] text-warn-ink"
                title="Disematkan"
              >
                <IkonSematkan className="h-3.5 w-3.5" />
                <span className="sr-only">Disematkan</span>
              </span>
            )}
            <Link
              href={`/t/${d.id}`}
              className="line-clamp-2 after:absolute after:inset-0 after:content-[''] group-hover:text-accent-ink group-hover:underline group-hover:underline-offset-2 sm:line-clamp-1"
            >
              {d.title}
            </Link>
          </h2>

          {isi && (
            <p className="mt-0.5 line-clamp-1 max-w-[74ch] text-[13px] leading-5 text-ink-soft">
              {isi}
            </p>
          )}

          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px] text-ink-faint">
            {d.tags.slice(0, 2).map(({ tag: t }) => (
              <TagPill key={t.id} slug={t.slug} withDot={t.kind === "wilayah"}>
                {t.name}
              </TagPill>
            ))}
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <Avatar username={d.user.username} size="xs" />
              <span className="font-medium text-ink-soft">{d.user.username}</span>
              {d.user.isAdmin && <span className="text-[11.5px]">admin</span>}
            </span>
            <span className="whitespace-nowrap sm:hidden">
              <span aria-hidden="true" className="mr-1.5">
                ·
              </span>
              {relatif(d.lastPostAt)}
            </span>
          </div>
        </div>

        <div className="tabular flex items-center justify-end gap-1.5 text-[13px] text-ink-soft sm:text-[14px]">
          <span className={balasan === 0 ? "text-ink-faint" : "font-medium"}>{balasan}</span>
          <span className="text-[12px] text-ink-faint sm:hidden">balasan</span>
        </div>

        <div className="tabular hidden text-right text-[12.5px] text-ink-faint sm:block">
          {relatif(d.lastPostAt)}
        </div>
      </div>
    </li>
  );
}
