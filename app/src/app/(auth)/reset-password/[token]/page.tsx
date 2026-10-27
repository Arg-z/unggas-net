import Link from "next/link";
import { tokenMasihBerlaku } from "@/lib/emailtoken";
import { ResetForm } from "@/app/actions/EmailForm";

export const metadata = { title: "Atur ulang password" };
export const dynamic = "force-dynamic";

export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  if (!(await tokenMasihBerlaku(token, "reset"))) {
    return (
      <main id="konten" tabIndex={-1} className="mx-auto max-w-[392px] py-4 sm:py-10">
        <h1 className="text-[22px] font-semibold leading-8 tracking-tight text-ink-strong">
          Tautan tidak berlaku
        </h1>
        <p className="mt-1 text-[13.5px] leading-relaxed text-ink-faint">
          Tautan reset password hanya berlaku 1 jam dan cuma bisa dipakai sekali.
        </p>
        <div className="mt-5">
          <Link href="/lupa-password" className="btn btn-primary">
            Minta tautan baru
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main id="konten" tabIndex={-1} className="mx-auto max-w-[392px] py-4 sm:py-10">
      <h1 className="text-[22px] font-semibold leading-8 tracking-tight text-ink-strong">
        Password baru
      </h1>
      <p className="mt-1 text-[13.5px] leading-relaxed text-ink-faint">
        Setelah disimpan, semua perangkat yang masih masuk akan dikeluarkan.
      </p>

      <div className="panel mt-5 px-4 py-5 sm:px-5">
        <ResetForm token={token} />
      </div>
    </main>
  );
}
