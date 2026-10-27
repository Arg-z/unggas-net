import Link from "next/link";
import { prisma } from "@/lib/db";
import { IkonNotifikasi } from "./Ikon";

/** Bel notifikasi dengan jumlah belum dibaca. Angka ikut dihitung server,
 *  jadi tidak ada kedipan angka palsu saat halaman dibuka. */
export async function NotifikasiBadge({ userId }: { userId: number }) {
  const belumDibaca = await prisma.notification.count({
    where: { userId, readAt: null },
  });

  return (
    <Link
      href="/notifikasi"
      className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-sunken hover:text-ink-strong"
      aria-label={belumDibaca > 0 ? `Notifikasi, ${belumDibaca} belum dibaca` : "Notifikasi"}
      title="Notifikasi"
    >
      <IkonNotifikasi className="h-[17px] w-[17px]" />
      {belumDibaca > 0 && (
        <span className="tabular absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold leading-none text-white ring-2 ring-ground">
          {belumDibaca > 9 ? "9+" : belumDibaca}
        </span>
      )}
    </Link>
  );
}
