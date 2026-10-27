import Link from "next/link";
import { LupaForm } from "@/app/actions/EmailForm";

export const metadata = { title: "Lupa password" };

export default function LupaPasswordPage() {
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
