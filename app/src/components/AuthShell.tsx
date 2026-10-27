/** Bingkai halaman masuk, daftar, lupa password, dan verifikasi.
 *
 *  Satu kolom di tengah, tanpa kolom wajah di samping: keputusan pemilik
 *  28 Okt menghapus kolom kanan halaman auth supaya form menjadi satu-satunya
 *  hal yang dikerjakan. Arah v6 memberi kartu itu satu bidang tint daun di
 *  kepalanya — bidang aksen yang memikul judul, bukan hiasan. */
export function AuthShell({
  judul,
  sub,
  children,
}: {
  judul: string;
  sub: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-[440px]">
      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="bg-accent-soft px-5 py-5 sm:px-6 sm:py-6">
          <h1 className="font-display text-[26px] font-semibold leading-tight tracking-tight text-ink-strong">
            {judul}
          </h1>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">{sub}</p>
        </div>
        <section className="px-5 py-5 sm:px-6 sm:py-6">{children}</section>
      </div>
    </div>
  );
}
