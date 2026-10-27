import Link from "next/link";
import { redirect } from "next/navigation";
import { tokenMasihBerlaku } from "@/lib/emailtoken";
import { emailAktif } from "@/lib/fitur";
import { VerifikasiForm } from "@/app/actions/EmailForm";

export const metadata = { title: "Verifikasi akun" };
export const dynamic = "force-dynamic";

export default async function VerifikasiPage({ params }: { params: Promise<{ token: string }> }) {
  if (!emailAktif()) redirect("/masuk");

  const { token } = await params;

  if (!(await tokenMasihBerlaku(token, "verifikasi"))) {
    return (
      <main id="konten" tabIndex={-1} className="mx-auto max-w-[392px] py-4 sm:py-10">
        <h1 className="text-[22px] font-semibold leading-8 tracking-tight text-ink-strong">
          Tautan tidak berlaku
        </h1>
        <p className="mt-1 text-[13.5px] leading-relaxed text-ink-faint">
          Tautan verifikasi berlaku 24 jam dan cuma bisa dipakai sekali. Minta tautan baru di halaman
          berikut.
        </p>
        <div className="mt-5">
          <Link href="/cek-email" className="btn btn-primary">
            Kirim ulang verifikasi
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main id="konten" tabIndex={-1} className="mx-auto max-w-[392px] py-4 sm:py-10">
      <h1 className="text-[22px] font-semibold leading-8 tracking-tight text-ink-strong">
        Aktifkan akun
      </h1>
      <p className="mt-1 text-[13.5px] leading-relaxed text-ink-faint">
        Satu klik lagi, lalu akunmu siap dipakai di komunitas unggas.net.
      </p>

      <div className="panel mt-5 px-4 py-5 sm:px-5">
        <VerifikasiForm token={token} />
      </div>
    </main>
  );
}
