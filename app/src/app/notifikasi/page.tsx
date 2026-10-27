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
        <div className="mt-4 rounded-xl border border-dashed border-control/60 bg-wash/60 px-5 py-8">
          <p className="text-[15px] font-semibold text-ink-strong">Belum ada notifikasi.</p>
          <p className="mt-1.5 max-w-[52ch] text-[14px] leading-relaxed text-ink-soft">
            Setiap balasan baru pada diskusimu akan muncul di sini, beserta tautan langsung ke
            balasannya.
          </p>
          <div className="mt-4">
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
                  className={`flex w-full items-start gap-3 px-2 py-3.5 text-left transition-colors hover:bg-wash/70 ${
                    n.readAt ? "" : "bg-wash/40"
                  }`}
                >
                  <Avatar username={n.actor.username} size="sm" />
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block text-[14px] leading-relaxed ${
                        n.readAt ? "text-ink-soft" : "text-ink-strong"
                      }`}
                    >
                      <span className="font-semibold">{n.actor.username}</span>
                      {" membalas "}
                      <span className={n.readAt ? "" : "font-semibold"}>{n.discussion.title}</span>
                    </span>
                    <span className="tabular mt-0.5 block text-[12.5px] text-ink-faint">
                      Balasan #{n.postNumber} · {relatif(n.createdAt)}
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
