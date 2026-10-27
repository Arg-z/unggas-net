import Link from "next/link";
import { KirimUlangForm } from "@/app/actions/EmailForm";

export const metadata = { title: "Cek email" };

export default function CekEmailPage() {
  return (
    <main id="konten" tabIndex={-1} className="mx-auto max-w-[392px] py-4 sm:py-10">
      <h1 className="text-[22px] font-semibold leading-8 tracking-tight text-ink-strong">
        Cek email kamu
      </h1>
      <p className="mt-1 text-[13.5px] leading-relaxed text-ink-faint">
        Tautan verifikasi sudah dikirim. Buka tautan itu untuk mengaktifkan akun, lalu masuk. Tidak
        ketemu? Cek folder spam dulu, atau kirim ulang di bawah.
      </p>

      <div className="panel mt-5 px-4 py-5 sm:px-5">
        <KirimUlangForm />
      </div>

      <p className="mt-4 text-[13px] text-ink-faint">
        Sudah aktif?{" "}
        <Link href="/masuk" className="link">
          Masuk
        </Link>
      </p>
    </main>
  );
}
