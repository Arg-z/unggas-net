import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { MasukForm } from "@/app/actions/AuthForm";

export const metadata = { title: "Masuk" };

const PESAN: Record<string, string> = {
  verified: "Akun sudah aktif. Silakan masuk.",
  reset: "Password sudah diganti. Silakan masuk dengan password baru.",
};

export default async function MasukPage({
  searchParams,
}: {
  searchParams: Promise<{ verified?: string; reset?: string }>;
}) {
  const user = await getSessionUser();
  if (user) redirect("/");

  const { verified, reset } = await searchParams;
  const pesan = verified ? PESAN.verified : reset ? PESAN.reset : null;

  return (
    <main id="konten" tabIndex={-1} className="grid content-center mx-auto max-w-[392px] py-2 sm:py-8 lg:min-h-[calc(100svh-12rem)]">
      <div>
        <h1 className="text-[22px] font-semibold leading-8 tracking-tight text-ink-strong">Masuk</h1>
        <p className="mt-1 text-[13.5px] leading-relaxed text-ink-faint">
          Satu akun untuk semua komunitas unggas.net.
        </p>

        <div className="panel mt-5 px-4 py-5 sm:px-5">
          {pesan && (
            <p role="status" className="alert-ok mb-4">
              {pesan}
            </p>
          )}
          <MasukForm />
        </div>

        <div className="mt-4 flex items-center justify-between text-[13px] text-ink-faint">
          <Link href="/lupa-password" className="link">
            Lupa password?
          </Link>
          <span>
            Belum punya akun?{" "}
            <Link href="/daftar" className="link">
              Daftar
            </Link>
          </span>
        </div>
      </div>

    </main>
  );
}
