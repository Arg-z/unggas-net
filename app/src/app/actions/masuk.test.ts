import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from "vitest";
import { randomBytes } from "crypto";

vi.mock("next/headers", () => ({
  headers: async () => ({ get: () => null }),
  cookies: async () => ({ get: () => undefined, set: () => {}, delete: () => {} }),
}));

vi.mock("@/lib/session", () => ({
  getSessionUser: async () => null,
  createSession: async () => {},
  destroySession: async () => {},
}));

import { _resetBuckets } from "@/lib/ratelimit";
import { masuk } from "./auth";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/password";

const TERLALU_BANYAK = "Terlalu banyak percobaan masuk. Tunggu sebentar lalu coba lagi.";
const SALAH = "Username atau password salah";

function fd(data: Record<string, string>): FormData {
  const f = new FormData();
  for (const [k, v] of Object.entries(data)) f.append(k, v);
  return f;
}

const suffix = randomBytes(4).toString("hex");
const uname = `masuk${suffix}`;
const PASS = "T3sP3t3rnak!2026";

beforeAll(async () => {
  await prisma.user.create({
    data: { username: uname, email: `${uname}@example.com`, passwordHash: await hashPassword(PASS) },
  });
});

beforeEach(() => {
  _resetBuckets();
});

// Bersihkan user uji dari DB (server ini memakai database produksi).
afterAll(async () => {
  const ids = (await prisma.user.findMany({ where: { username: uname }, select: { id: true } })).map((u) => u.id);
  if (ids.length === 0) return;
  await prisma.post.deleteMany({ where: { userId: { in: ids } } });
  await prisma.discussion.deleteMany({ where: { userId: { in: ids } } });
  await prisma.session.deleteMany({ where: { userId: { in: ids } } });
  await prisma.user.deleteMany({ where: { id: { in: ids } } });
});

describe("masuk — pembatasan percobaan", () => {
  it("5 percobaan salah lolos sebagai 'salah', percobaan ke-6 diblokir walau password benar", async () => {
    for (let i = 0; i < 5; i++) {
      const r = await masuk(null, fd({ identitas: uname, password: "password-salah" }));
      expect(r).toEqual({ ok: false, alasan: SALAH });
    }

    const diblokir = await masuk(null, fd({ identitas: uname, password: PASS }));
    expect(diblokir).toEqual({ ok: false, alasan: TERLALU_BANYAK });
    // Password benar tidak dievaluasi: tidak ada sesi yang dibuat.
    expect(await prisma.session.count({ where: { user: { username: uname } } })).toBe(0);
  });

  it("batas per identitas tidak tergantung huruf besar/kecil", async () => {
    for (let i = 0; i < 5; i++) {
      await masuk(null, fd({ identitas: uname.toUpperCase(), password: "salah" }));
    }
    const r = await masuk(null, fd({ identitas: uname, password: PASS }));
    expect(r).toEqual({ ok: false, alasan: TERLALU_BANYAK });
  });

  it("batas per IP: percobaan ke-21 dari IP yang sama diblokir", async () => {
    for (let i = 0; i < 20; i++) {
      const r = await masuk(null, fd({ identitas: `hantu${suffix}${i}`, password: "salah" }));
      expect(r).toEqual({ ok: false, alasan: SALAH });
    }
    const r = await masuk(null, fd({ identitas: `hantu${suffix}lain`, password: "salah" }));
    expect(r).toEqual({ ok: false, alasan: TERLALU_BANYAK });
  });

  it("username tak terdaftar tetap kena batas per identitas", async () => {
    const nyasar = `nyasar${suffix}`;
    for (let i = 0; i < 5; i++) {
      const r = await masuk(null, fd({ identitas: nyasar, password: "apa-saja" }));
      expect(r).toEqual({ ok: false, alasan: SALAH });
    }
    const r = await masuk(null, fd({ identitas: nyasar, password: "apa-saja" }));
    expect(r).toEqual({ ok: false, alasan: TERLALU_BANYAK });
  });
});
