/** Bingkai halaman masuk, daftar, lupa password, dan verifikasi.
 *
 *  Satu kolom di tengah, tanpa kolom wajah di samping: keputusan pemilik
 *  28 Okt menghapus kolom kanan halaman auth supaya form menjadi satu-satunya
 *  hal yang dikerjakan. Yang tersisa dari arah v5: judul serif, panel bergaris
 *  rambut, dan lebar baca yang tenang. */
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
    <div className="mx-auto w-full max-w-[420px]">
      <h1 className="font-display text-[26px] font-semibold leading-tight tracking-tight text-ink-strong">
        {judul}
      </h1>
      <p className="mt-1 text-[13.5px] leading-relaxed text-ink-faint">{sub}</p>
      <section className="panel mt-5 p-5 sm:p-6">{children}</section>
    </div>
  );
}
