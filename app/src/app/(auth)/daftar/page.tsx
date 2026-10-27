import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { DaftarForm } from "@/app/actions/AuthForm";

export const metadata = { title: "Daftar" };

export default async function DaftarPage() {
  const user = await getSessionUser();
  if (user) redirect("/");
  return (
    <main id="konten" tabIndex={-1} className="grid content-center mx-auto max-w-[392px] py-2 sm:py-8 lg:min-h-[calc(100svh-12rem)]">
      <div>
        <h1 className="text-[22px] font-semibold leading-8 tracking-tight text-ink-strong">
          Buat akun
        </h1>
        <p className="mt-1 text-[13.5px] leading-relaxed text-ink-faint">
          Gratis. Setelah daftar, cek email untuk mengaktifkan akun.
        </p>

        <div className="panel mt-5 px-4 py-5 sm:px-5">
          <DaftarForm />
        </div>

        <p className="mt-4 text-[13px] text-ink-faint">
          Sudah punya akun?{" "}
          <Link href="/masuk" className="link">
            Masuk
          </Link>
        </p>
      </div>

    </main>
  );
}
