import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { getTags } from "@/lib/forum";
import { IkonPanah } from "@/components/Ikon";
import { BuatDiskusiForm } from "./BuatDiskusiForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Tulis diskusi" };

export default async function BaruPage() {
  const user = await getSessionUser();
  if (!user) redirect("/masuk");
  const tags = await getTags(user);

  return (
    <main id="konten" tabIndex={-1} className="max-w-[720px]">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-soft transition-colors hover:text-ink-strong"
      >
        <IkonPanah className="h-3.5 w-3.5" />
        Semua diskusi
      </Link>

      <h1 className="mt-3 text-[22px] font-semibold leading-8 tracking-tight text-ink-strong">
        Tulis diskusi
      </h1>
      <p className="mt-1 max-w-[60ch] text-[13.5px] leading-relaxed text-ink-faint">
        Pilih komunitas, tambahkan wilayah kalau menyangkut lokasi kandang, lalu tulis pertanyaan
        atau pengalamanmu selengkap mungkin.
      </p>

      <div className="panel mt-5 px-4 py-5 sm:px-6 sm:py-6">
        <BuatDiskusiForm
          topik={tags.filter((t) => t.kind === "topik").map((t) => ({ id: t.id, name: t.name }))}
          wilayah={tags.filter((t) => t.kind === "wilayah").map((t) => ({ id: t.id, name: t.name }))}
        />
      </div>
    </main>
  );
}
