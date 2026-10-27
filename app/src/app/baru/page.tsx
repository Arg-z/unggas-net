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
    <main
      id="konten"
      tabIndex={-1}
      className="grid gap-8 xl:max-w-[1028px] xl:grid-cols-[minmax(0,1fr)_280px] xl:items-start xl:gap-7"
    >
      <div className="min-w-0">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-soft transition-colors hover:text-ink-strong"
        >
          <IkonPanah className="h-3.5 w-3.5" />
          Semua diskusi
        </Link>

        <h1 className="mt-3 font-display text-[26px] font-semibold leading-tight tracking-tight text-ink-strong">
          Tulis diskusi
        </h1>
        <p className="mt-1 max-w-[60ch] text-[13px] leading-relaxed text-ink-faint">
          Pilih komunitas, tambahkan wilayah kalau menyangkut lokasi kandang, lalu tulis pertanyaan
          atau pengalamanmu selengkap mungkin.
        </p>

        <div className="panel mt-5 p-4 sm:p-6">
          <BuatDiskusiForm
            topik={tags.filter((t) => t.kind === "topik").map((t) => ({ id: t.id, name: t.name }))}
            wilayah={tags
              .filter((t) => t.kind === "wilayah")
              .map((t) => ({ id: t.id, name: t.name }))}
          />
        </div>
      </div>

      {/* Rel kanan: hal yang membuat pertanyaan mudah dijawab, ditulis sebelum
          orang mengetik — bukan aturan yang muncul setelah ia menekan terbit. */}
      <aside className="hidden xl:block" aria-label="Panduan menulis">
        <div className="sticky top-16 space-y-6">
          <section aria-labelledby="judul-sebelum">
            <h2 id="judul-sebelum" className="text-[12px] font-medium text-ink-faint">
              Sebelum menulis
            </h2>
            <ul className="mt-2 space-y-2.5 border-t border-rule pt-3 text-[13px] leading-relaxed text-ink-soft">
              <li>
                <span className="font-semibold text-ink-strong">Sebutkan jumlah dan umur ternak.</span>{" "}
                Jawaban untuk 50 puyuh umur 3 minggu berbeda dari 500 ekor umur 8 minggu.
              </li>
              <li>
                <span className="font-semibold text-ink-strong">Tulis angka apa adanya.</span> Suhu
                kandang, komposisi pakan, harga, atau produksi telur.
              </li>
              <li>
                <span className="font-semibold text-ink-strong">Sebutkan yang sudah dicoba.</span>{" "}
                Obat, perubahan ventilasi, atau pergantian pakan.
              </li>
            </ul>
          </section>

          <section aria-labelledby="judul-contoh">
            <h2 id="judul-contoh" className="text-[12px] font-medium text-ink-faint">
              Judul yang jelas
            </h2>
            <div className="mt-2 border-t border-rule pt-3">
              <p className="text-[12.5px] leading-relaxed text-ink-faint">Kurang jelas</p>
              <p className="mt-0.5 text-[13.5px] leading-relaxed text-ink-soft">Mohon bantuan.</p>
              <p className="mt-3 text-[12.5px] leading-relaxed text-ink-faint">Lebih jelas</p>
              <p className="mt-0.5 text-[13.5px] font-medium leading-relaxed text-ink-strong">
                Kandang puyuh panas saat siang, ventilasi seperti apa yang pas?
              </p>
            </div>
          </section>

          <section className="well p-4" aria-labelledby="judul-satu">
            <h2 id="judul-satu" className="eyebrow">
              Satu pertanyaan
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
              Satu diskusi untuk satu pertanyaan membuat jawabannya fokus dan mudah ditemukan
              peternak lain.
            </p>
          </section>
        </div>
      </aside>
    </main>
  );
}
