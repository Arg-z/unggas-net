import Link from "next/link";
import { notFound } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { getThread } from "@/lib/forum";
import { prisma } from "@/lib/db";
import { relatif } from "@/lib/relatif";
import { TagPill } from "@/components/TagPill";
import { Avatar } from "@/components/Avatar";
import { BadgeSematkan } from "@/components/BadgeSematkan";
import { IkonPanah } from "@/components/Ikon";
import { parseId } from "@/lib/validate";
import { BalasForm } from "../../BalasForm";

export const dynamic = "force-dynamic";

export default async function ThreadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const threadId = parseId(id);
  if (threadId === null) notFound();

  const user = await getSessionUser();
  const thread = await getThread(threadId, user);
  if (!thread) notFound();

  const [pembuka, ...balasan] = thread.posts;
  const topik = thread.tags.find(({ tag }) => tag.kind === "topik")?.tag;

  // Diskusi lain di komunitas yang sama: jalan keluar nyata setelah membaca,
  // bukan rekomendasi karangan.
  const lain = topik
    ? await prisma.discussion.findMany({
        where: {
          isHidden: false,
          id: { not: thread.id },
          tags: { some: { tag: { slug: topik.slug } } },
        },
        orderBy: { lastPostAt: "desc" },
        take: 3,
        select: { id: true, title: true, lastPostAt: true },
      })
    : [];

  const dibuka = thread.createdAt.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main id="konten" tabIndex={-1}>
      <Link
        href={topik ? `/?tag=${topik.slug}` : "/"}
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-soft transition-colors hover:text-ink-strong"
      >
        <IkonPanah className="h-3.5 w-3.5" />
        {topik ? topik.name : "Semua diskusi"}
      </Link>

      <div className="mt-3 grid gap-x-8 gap-y-8 lg:grid-cols-[minmax(0,1fr)_252px]">
        <div className="min-w-0">
          {/* Kepala thread: satu kartu, judul 20–22px, meta 13px, satu aksi
              bergaris 36px di kanan. Isi pembuka duduk di kartu yang sama. */}
          <article id="post-1" className="panel">
            <div className="px-4 pb-4 pt-4 sm:px-5 sm:pt-5">
              <div className="flex flex-wrap items-start justify-between gap-x-5 gap-y-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {thread.isPinned && <BadgeSematkan />}
                    {thread.tags.map(({ tag: t }) => (
                      <TagPill key={t.id} slug={t.slug} withDot={t.kind === "wilayah"}>
                        {t.name}
                      </TagPill>
                    ))}
                  </div>

                  <h1 className="mt-2.5 text-[20px] font-semibold leading-[1.35] tracking-tight text-ink-strong sm:text-[22px]">
                    {thread.title}
                  </h1>

                  <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-ink-faint">
                    <span className="flex items-center gap-1.5 whitespace-nowrap">
                      <Avatar username={thread.user.username} size="xs" />
                      <span className="font-medium text-ink-soft">{thread.user.username}</span>
                      {thread.user.isAdmin && <span className="text-[11.5px]">admin</span>}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="whitespace-nowrap">{relatif(thread.createdAt)}</span>
                  </p>
                </div>

                <div className="shrink-0">
                  <a href="#balas" className="btn btn-outline">
                    Balas
                  </a>
                </div>
              </div>
            </div>

            {pembuka && (
              <>
                <div className="border-t border-rule" />
                <div className="px-4 py-5 sm:px-5 sm:py-6">
                  <div className="prosa max-w-[68ch] whitespace-pre-wrap break-words text-ink">
                    {pembuka.content}
                  </div>
                </div>
              </>
            )}
          </article>

          {/* Balasan: baris di atas tanah, satu garis rambut per balasan. */}
          <section aria-labelledby="judul-balasan" className="mt-8">
            <div className="flex items-baseline justify-between gap-3 border-b border-border pb-2.5">
              <h2 id="judul-balasan" className="text-[15px] font-semibold text-ink-strong">
                Balasan
              </h2>
              <span className="tabular text-[12.5px] text-ink-faint">{balasan.length}</span>
            </div>

            {balasan.length > 0 ? (
              <ol className="divide-y divide-rule">
                {balasan.map((p) => {
                  const adalahPenulis = p.user.username === thread.user.username;
                  return (
                    <li key={p.id} id={`post-${p.number}`} className="scroll-mt-20 py-5">
                      <div className="flex flex-wrap items-center gap-x-1 gap-y-1 text-[13px] text-ink-faint">
                        <span className="flex items-center gap-1.5 whitespace-nowrap after:ml-1 after:content-['·']">
                          <Avatar username={p.user.username} size="xs" />
                          <span className="font-semibold text-ink-strong">{p.user.username}</span>
                          {adalahPenulis && <span className="text-[11.5px]">penulis</span>}
                          {p.user.isAdmin && <span className="text-[11.5px]">admin</span>}
                        </span>
                        <span className="whitespace-nowrap">{relatif(p.createdAt)}</span>
                        <a
                          href={`#post-${p.number}`}
                          aria-label={`Tautan ke balasan ${p.number}`}
                          className="tabular ml-auto text-[12px] font-medium text-ink-faint hover:text-accent-deep"
                        >
                          #{p.number}
                        </a>
                      </div>

                      <div className="prosa mt-2.5 max-w-[68ch] whitespace-pre-wrap break-words text-ink">
                        {p.content}
                      </div>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <p className="max-w-[62ch] py-6 text-[14px] leading-relaxed text-ink-soft">
                Belum ada yang menanggapi. Pengalaman sekecil apa pun berguna di sini, pemula lain
                pasti terbantu.
              </p>
            )}
          </section>

          <div id="balas" className="mt-8 scroll-mt-20">
            {user ? (
              <BalasForm discussionId={thread.id} />
            ) : (
              <div className="panel flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <p className="text-[14px] text-ink-soft">
                  Masuk untuk menanggapi atau berbagi pengalaman di diskusi ini.
                </p>
                <div className="flex shrink-0 items-center gap-2">
                  <Link href="/masuk" className="btn btn-outline">
                    Masuk
                  </Link>
                  <Link href="/daftar" className="btn btn-primary">
                    Daftar
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Kolom kanan: fakta diskusi dan diskusi lain di komunitas yang sama. */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <h2 className="text-[12px] font-medium text-ink-faint">Tentang diskusi</h2>
            <dl className="mt-2 space-y-2 border-t border-rule pt-3 text-[13px]">
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-ink-faint">Komunitas</dt>
                <dd className="font-medium text-ink-strong">{topik ? topik.name : "—"}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-ink-faint">Dibuka</dt>
                <dd className="text-right font-medium text-ink-strong">{dibuka}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-ink-faint">Balasan</dt>
                <dd className="tabular font-medium text-ink-strong">{balasan.length}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-ink-faint">Penulis</dt>
                <dd className="font-medium text-ink-strong">{thread.user.username}</dd>
              </div>
            </dl>

            <h2 className="mt-7 text-[12px] font-medium text-ink-faint">
              {topik ? `Lainnya di ${topik.name}` : "Diskusi lain"}
            </h2>
            {lain.length > 0 ? (
              <ul className="mt-2 divide-y divide-rule border-t border-rule">
                {lain.map((d) => (
                  <li key={d.id}>
                    <Link href={`/t/${d.id}`} className="block py-2.5">
                      <span className="line-clamp-2 text-[13.5px] font-medium leading-snug text-ink-strong hover:text-accent-ink">
                        {d.title}
                      </span>
                      <span className="mt-1 block text-[12px] text-ink-faint">
                        {relatif(d.lastPostAt)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 border-t border-rule pt-3 text-[13px] leading-relaxed text-ink-faint">
                Ini diskusi satu-satunya di komunitas ini.
              </p>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
