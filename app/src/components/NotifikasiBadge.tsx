import Link from "next/link";
import { prisma } from "@/lib/db";
import { IkonNotifikasi } from "./Ikon";

/** Bel notifikasi dengan jumlah belum dibaca. Angka ikut dihitung server,
 *  jadi tidak ada kedipan angka palsu saat halaman dibuka. */
export async function NotifikasiBadge({
  userId,
  jumlah,
}: {
  userId: number;
  jumlah?: number;
}) {
  const belumDibaca =
    jumlah ??
    (await prisma.notification.count({
      where: { userId, readAt: null },
    }));

  return (
    <Link
      href="/notifikasi"
      className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl text-ink-soft transition-colors hover:bg-sunken hover:text-ink-strong active:bg-sunken"
      aria-label={belumDibaca > 0 ? `Notifikasi, ${belumDibaca} belum dibaca` : "Notifikasi"}
      title="Notifikasi"
    >
      <IkonNotifikasi className="h-[19px] w-[19px]" />
      {belumDibaca > 0 && (
        <span className="tabular absolute right-0.5 top-0.5 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-accent px-1 text-[9.5px] font-bold leading-none text-white ring-2 ring-ground">
          {belumDibaca > 9 ? "9+" : belumDibaca}
        </span>
      )}
    </Link>
  );
}
