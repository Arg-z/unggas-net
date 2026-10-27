const USERNAME_RE = /^[a-zA-Z0-9_]+$/;
const RESERVED = new Set(["admin", "administrator", "moderator", "root", "unggas", "support", "staff"]);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** ID numerik positif dari segmen URL; null kalau tidak valid (mis. "abc", "0", "-1"). */
export function parseId(raw: string): number | null {
  if (!/^[0-9]+$/.test(raw)) return null;
  const n = Number(raw);
  return Number.isSafeInteger(n) && n > 0 ? n : null;
}

export type SignupInput = {
  username: string;
  email: string;
  password: string;
  honeypot: string;
};

export type Validated = { ok: true; username: string; email: string; password: string };

/** Server-side pendaftaran: honeypot kosong, username 3-32 alnum/underscore, password ≥8. */
export function validateSignup(input: SignupInput): Validated | { ok: false; alasan: string } {
  if (input.honeypot !== "") return { ok: false, alasan: "Pendaftaran gagal" };
  const username = input.username.trim();
  if (username.length < 3 || username.length > 32 || !USERNAME_RE.test(username)) {
    return { ok: false, alasan: "Username 3-32 karakter, huruf/angka/underscore" };
  }
  if (RESERVED.has(username.toLowerCase())) return { ok: false, alasan: "Username tidak tersedia" };
  const email = input.email.trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 255) return { ok: false, alasan: "Email tidak valid" };
  if (input.password.length < 8) return { ok: false, alasan: "Password minimal 8 karakter" };
  return { ok: true, username, email, password: input.password };
}
