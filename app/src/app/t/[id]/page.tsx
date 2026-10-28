import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { getThread } from "@/lib/forum";
import { prisma } from "@/lib/db";
import { relatif } from "@/lib/relatif";
import { Avatar } from "@/components/Avatar";
import { BadgeSematkan } from "@/components/BadgeSematkan";
import { IkonPanah } from "@/components/Ikon";
import { parseId } from "@/lib/validate";
import { BalasForm } from "../../BalasForm";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const threadId = parseId(id);
  if (threadId === null) return {};

  const diskusi = await prisma.discussion.findUnique({
    where: { id: threadId },
    select: {
      title: true,
      isHidden: true,
      posts: { where: { number: 1 }, select: { content: true }, take: 1 },
    },
  });
  if (!diskusi || diskusi.isHidden) return {};

  const ringkas = (diskusi.posts[0]?.content ?? "").replace(/\s+/g, " ").trim().slice(0, 155);
  return {
    title: diskusi.title,
    description: ringkas || undefined,
    openGraph: { title: diskusi.title, description: ringkas || undefined, type: "article" },
  };
}

export default async function ThreadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const threadId = parseId(id);
  if (threadId === null) notFound();

  const user = await getSessionUser();
  const thread = await getThread(threadId, user);
  if (!thread) notFound();

  const [pembuka, ...balasan] = thread.posts;

  const dibuka = thread.createdAt.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main id="konten" tabIndex={-1} className="w-full">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-soft transition-colors hover:text-accent-ink"
      >
        <IkonPanah className="h-3.5 w-3.5 text-accent" />
        Semua diskusi
      </Link>

      <div className="mt-3 grid gap-x-8 gap-y-6 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0">
          {/* Kepala thread adalah garis bawah, bukan kartu: label, judul sans,
              meta, lalu prosa serif di lebar baca. */}
          <article
            id="post-1"
            className="scroll-mt-20 border-b border-border pb-8"
          >
            <div>
              {/* Label dan aksi di baris pertama; judul lalu meta memakai
                  lebar penuh kartu supaya tidak terdesak tombol di ponsel. */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-wrap items-center gap-1.5">
                  {thread.isPinned && <BadgeSematkan />}
                </div>
                <div className="shrink-0">
                  <a href="#balas" className="btn btn-primary">
                    Balas
                  </a>
                </div>
              </div>

              <h1 className="mt-3 text-balance font-display text-[25px] font-semibold leading-[1.28] tracking-tight text-ink-strong sm:text-[30px]">
                {thread.title}
              </h1>

              <p className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-ink-faint">
                <span className="flex items-center gap-1.5 whitespace-nowrap">
                  <Avatar username="anonim" size="xs" />
                  <span className="font-medium text-ink-soft">anonim</span>
                </span>
                <span aria-hidden="true">·</span>
                <span className="whitespace-nowrap">{relatif(thread.createdAt)}</span>
                <span aria-hidden="true">·</span>
                <span className="tabular whitespace-nowrap">{balasan.length} balasan</span>
              </p>
            </div>

            {pembuka && (
              <div className="mt-6">
                <div className="prosa max-w-[68ch] whitespace-pre-wrap break-words text-ink">
                  {pembuka.content}
                </div>
              </div>
            )}
          </article>

          {/* Balasan: baris bergaris, tanpa kartu pembungkus. */}
          <section aria-labelledby="judul-balasan" className="mt-8">
            <div className="flex items-baseline justify-between gap-3 border-b border-border pb-2.5">
              <h2 id="judul-balasan" className="text-[13px] font-semibold text-ink-strong">
                Balasan
              </h2>
              <span className="tabular text-[12.5px] text-ink-faint">{balasan.length}</span>
            </div>

            {balasan.length > 0 ? (
              <ol>
                {balasan.map((p) => {
                  const adalahPenulis = p.userId === thread.userId;
                  return (
                    <li
                      key={p.id}
                      id={`post-${p.number}`}
                      className="scroll-mt-20 border-b border-rule py-5"
                    >
                      <div className="flex flex-wrap items-center gap-x-1 gap-y-1 text-[13px] text-ink-faint">
                        <span className="flex items-center gap-1.5 whitespace-nowrap after:ml-1 after:content-['·']">
                          <Avatar username="anonim" size="xs" />
                          <span className="font-semibold text-ink-strong">anonim</span>
                          {adalahPenulis && (
                            <span className="text-[11.5px] font-medium text-accent-ink">
                              penulis
                            </span>
                          )}
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
              <div className="py-6">
                <p className="max-w-[62ch] text-[14px] leading-relaxed text-ink-soft">
                  Belum ada yang menanggapi. Pengalaman sekecil apa pun berguna di sini, pemula
                  lain pasti terbantu.
                </p>
                <a href="#balas" className="link mt-2 text-[13px]">
                  Jadi yang pertama membalas
                </a>
              </div>
            )}
          </section>

          <div id="balas" className="mt-6 scroll-mt-20">
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

        {/* Kolom kanan: fakta diskusi dan diskusi lain di topik yang sama. */}
        <aside className="hidden xl:block">
          <div className="sticky top-8 space-y-8">
            <div className="border-t border-border pt-4">
              <h2 className="text-[12px] font-medium text-ink-faint">Tentang diskusi</h2>
              <dl className="mt-2 text-[13px]">
                <div className="flex items-baseline justify-between gap-3 border-b border-rule py-2">
                  <dt className="text-ink-faint">Dibuka</dt>
                  <dd className="text-right font-medium text-ink-strong">{dibuka}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-3 border-b border-rule py-2">
                  <dt className="text-ink-faint">Balasan</dt>
                  <dd className="tabular font-medium text-ink-strong">{balasan.length}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-3 py-2">
                  <dt className="text-ink-faint">Penulis</dt>
                  <dd className="truncate font-medium text-ink-strong">anonim</dd>
                </div>
              </dl>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
