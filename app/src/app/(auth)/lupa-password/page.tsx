import Link from "next/link";
import { emailAktif } from "@/lib/fitur";
import { LupaForm } from "@/app/actions/EmailForm";

export const metadata = { title: "Lupa password" };
export const dynamic = "force-dynamic";

export default function LupaPasswordPage() {
  if (!emailAktif()) {
    return (
      <main id="konten" tabIndex={-1} className="mx-auto max-w-[392px] py-4 sm:py-10">
        <h1 className="text-[22px] font-semibold leading-8 tracking-tight text-ink-strong">
          Lupa password
        </h1>
        <p className="mt-1 text-[13.5px] leading-relaxed text-ink-faint">
          Reset lewat email sedang dimatikan sementara.
        </p>

        <div className="panel mt-5 px-4 py-5 sm:px-5">
          <p className="text-[13.5px] leading-relaxed text-ink-soft">
            Kamu tetap bisa masuk dengan username dan password seperti biasa. Kalau password lupa,
            hubungi admin untuk mengatur ulang.
          </p>
          <Link href="/masuk" className="btn btn-primary mt-4 w-full">
            Kembali ke halaman masuk
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main id="konten" tabIndex={-1} className="mx-auto max-w-[392px] py-4 sm:py-10">
      <h1 className="text-[22px] font-semibold leading-8 tracking-tight text-ink-strong">
        Lupa password
      </h1>
      <p className="mt-1 text-[13.5px] leading-relaxed text-ink-faint">
        Masukkan email akunmu. Kami kirim tautan untuk membuat password baru. Tautannya berlaku satu
        jam.
      </p>

      <div className="panel mt-5 px-4 py-5 sm:px-5">
        <LupaForm />
      </div>

      <p className="mt-4 text-[13px] text-ink-faint">
        Ingat password?{" "}
        <Link href="/masuk" className="link">
          Masuk
        </Link>
      </p>
    </main>
  );
}
