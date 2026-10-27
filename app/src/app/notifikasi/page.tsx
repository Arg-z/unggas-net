import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { relatif } from "@/lib/relatif";
import { Avatar } from "@/components/Avatar";
import { bukaNotifikasi, tandaiSemuaDibaca } from "@/app/actions/notifikasi";

export const dynamic = "force-dynamic";
export const metadata = { title: "Notifikasi" };

export default async function NotifikasiPage() {
  const user = await getSessionUser();
  if (!user) redirect("/masuk");

  const daftar = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      actor: { select: { username: true } },
      discussion: { select: { title: true } },
    },
  });

  const belumDibaca = daftar.filter((n) => !n.readAt).length;

  return (
    <main id="konten" tabIndex={-1} className="max-w-[820px]">
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
        <div className="min-w-0">
          <h1 className="font-display text-[26px] font-semibold leading-tight tracking-tight text-ink-strong">
            Notifikasi
          </h1>
          <p className="mt-1 text-[13px] text-ink-faint">
            Setiap balasan baru pada diskusimu muncul di sini.
          </p>
        </div>
        {belumDibaca > 0 && (
          <form action={tandaiSemuaDibaca} className="shrink-0">
            <button type="submit" className="btn btn-outline btn-sm">
              Tandai semua dibaca
            </button>
          </form>
        )}
      </div>

      <div className="mt-5 flex items-baseline justify-between gap-4 border-b border-border pb-2.5">
        <span className="text-[12px] font-medium text-ink-faint">Balasan terbaru</span>
        <span className="tabular text-[12.5px] text-ink-faint">
          {belumDibaca > 0 ? `${belumDibaca} belum dibaca` : `${daftar.length} notifikasi`}
        </span>
      </div>

      {daftar.length === 0 ? (
        <div className="mt-4 rounded-2xl bg-wash/70 px-6 py-10 text-center">
          <p className="mx-auto max-w-[28ch] font-display text-[21px] font-semibold leading-tight tracking-tight text-ink-strong">
            Belum ada notifikasi.
          </p>
          <p className="mx-auto mt-2 max-w-[46ch] text-[14px] leading-relaxed text-ink-soft">
            Setiap balasan baru pada diskusimu akan muncul di sini, beserta tautan langsung ke
            balasannya.
          </p>
          <div className="mt-5 flex justify-center">
            <Link href="/" className="btn btn-outline">
              Lihat semua diskusi
            </Link>
          </div>
        </div>
      ) : (
        <ul className="divide-y divide-rule border-b border-rule">
          {daftar.map((n) => (
            <li key={n.id}>
              <form action={bukaNotifikasi}>
                <input type="hidden" name="id" value={n.id} />
                <input type="hidden" name="discussionId" value={n.discussionId} />
                <input type="hidden" name="postNumber" value={n.postNumber} />
                <button
                  type="submit"
                  className={`flex w-full items-start gap-3 px-2 py-4 text-left transition-colors hover:bg-wash/60 ${
                    n.readAt ? "" : "bg-wash/40"
                  }`}
                >
                  <Avatar username={n.actor.username} size="sm" />
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-x-1.5 text-[12.5px] text-ink-faint">
                      <span className="font-medium text-ink-soft">{n.actor.username}</span>
                      <span>membalas</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular">{relatif(n.createdAt)}</span>
                    </span>
                    <span
                      className={`mt-1 line-clamp-2 block font-display text-[16.5px] font-semibold leading-snug tracking-[-0.01em] ${
                        n.readAt ? "text-ink-soft" : "text-ink-strong"
                      }`}
                    >
                      {n.discussion.title}
                    </span>
                    <span className="mt-1.5 inline-flex items-center gap-1.5 text-[12px] text-ink-faint">
                      <span className="tabular">Balasan #{n.postNumber}</span>
                      {!n.readAt && (
                        <span className="rounded-[4px] bg-accent-soft px-1.5 py-0.5 text-[11px] font-semibold text-accent-ink">
                          Baru
                        </span>
                      )}
                    </span>
                  </span>
                  {!n.readAt && (
                    <span className="mt-2 flex shrink-0 items-center">
                      <span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent" />
                      <span className="sr-only">Belum dibaca</span>
                    </span>
                  )}
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
