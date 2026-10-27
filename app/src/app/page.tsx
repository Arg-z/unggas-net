import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getSessionUser } from "@/lib/session";
import { listDiscussions, getTags, parseSaringan, parseUrutan } from "@/lib/forum";
import { relatif } from "@/lib/relatif";
import { TagPill } from "@/components/TagPill";
import { Avatar } from "@/components/Avatar";
import { IkonCari, IkonSematkan } from "@/components/Ikon";
import { PemilihKomunitas } from "@/components/PemilihKomunitas";

export const dynamic = "force-dynamic";

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

  const [{ rows, tag, hasNext }, tags] = await Promise.all([
    listDiscussions({ tagSlug: params.tag, page, user, saring, urut, q }),
    getTags(user),
  ]);

  // Tag yang tidak ada jangan jatuh diam-diam ke "semua diskusi": URL-nya menjanjikan
  // filter, halamannya menampilkan hal lain. 404 yang jujur lebih baik.
  if (params.tag && !tag) notFound();

  const topik = tags
    .filter((t) => t.kind === "topik")
    .map((t) => ({ slug: t.slug, name: t.name }));

  // Setiap tautan daftar mempertahankan filter yang sedang aktif; hanya parameter
  // yang diminta yang ditimpa. `page` selalu dibuang saat filter berubah.
  const dasar = new URLSearchParams();
  if (params.tag) dasar.set("tag", params.tag);
  if (q) dasar.set("q", q);
  if (urut !== "terbaru") dasar.set("urut", urut);
  const tautan = (ubah: Record<string, string | undefined> = {}) => {
    const sp = new URLSearchParams(dasar);
    for (const [k, v] of Object.entries(ubah)) {
      if (v) sp.set(k, v);
      else sp.delete(k);
    }
    const s = sp.toString();
    return s ? `/?${s}` : "/";
  };

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

  return (
    <main id="konten" tabIndex={-1} className="max-w-[1120px]">
      {/* Baris judul. Di bawah 1024px bilah atas tidak memuat pemilih komunitas,
          jadi di sini ia muncul sebagai satu kontrol bergaris di kanan judul. */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="min-w-0 truncate text-[22px] font-semibold leading-8 tracking-tight text-ink-strong">
          {tag ? tag.name : "Semua diskusi"}
        </h1>
        <div className="shrink-0 lg:hidden">
          <Suspense fallback={<span className="block h-9 w-[152px]" />}>
            <PemilihKomunitas topik={topik} lebar="w-[152px]" kotak />
          </Suspense>
        </div>
      </div>

      {/* Kotak cari hanya tampil di ponsel — mulai 768px kotak cari tinggal satu, di bilah atas. */}
      <div className="mt-4 md:hidden">
        <form action="/" role="search" className="relative w-full sm:w-[292px] md:hidden">
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
            placeholder="Cari judul atau isi diskusi"
            aria-label="Cari diskusi"
            className="h-9 w-full rounded-md border border-control bg-surface pl-8 pr-2.5 text-[13.5px] text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none focus:ring-[3px] focus:ring-accent/15"
          />
        </form>

      </div>

      {/* Daftar: tabel di atas tanah halaman, tanpa kartu. */}
      {rows.length === 0 ? (
        <div className="mt-4 border-t border-rule px-2 py-9">
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
        <div className="mt-4">
          <div className="hidden grid-cols-[minmax(0,1fr)_64px_112px] gap-x-5 px-2 pb-1.5 text-[12px] font-medium text-ink-faint sm:grid">
            <span>Diskusi</span>
            <span className="text-right">Balasan</span>
            <span className="text-right">Aktivitas</span>
          </div>

          <ul className="divide-y divide-rule">
            {rows.map((d) => {
              const balasan = Math.max(0, d._count.posts - 1);
              return (
                <li
                  key={d.id}
                  className={`group relative transition-colors hover:bg-sunken/50 ${
                    d.isPinned ? "bg-raised" : ""
                  }`}
                >
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-5 px-2 py-3 sm:grid-cols-[minmax(0,1fr)_64px_112px] sm:items-center">
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

                      {d.posts[0] && (
                        <p className="mt-0.5 hidden max-w-[68ch] truncate text-[13px] leading-5 text-ink-soft sm:block">
                          {d.posts[0].content}
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
                      <span className={balasan === 0 ? "text-ink-faint" : "font-medium"}>
                        {balasan}
                      </span>
                      <span className="text-[12px] text-ink-faint sm:hidden">balasan</span>
                    </div>

                    <div className="tabular hidden text-right text-[12.5px] text-ink-faint sm:block">
                      {relatif(d.lastPostAt)}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {(page > 1 || hasNext) && (
        <nav
          aria-label="Halaman"
          className="mt-6 flex items-center justify-between border-t border-border pt-4 text-[13px]"
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
    </main>
  );
}
