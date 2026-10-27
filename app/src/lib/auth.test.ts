import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "./password";
import { validateSignup, parseId } from "./validate";

describe("password", () => {
  it("hash dan verify cocok", async () => {
    const h = await hashPassword("T3sP3t3rnak!2026");
    expect(h).not.toContain("T3sP3t3rnak");
    expect(await verifyPassword("T3sP3t3rnak!2026", h)).toBe(true);
    expect(await verifyPassword("salah", h)).toBe(false);
  });
});

describe("validateSignup", () => {
  it("menerima pendaftaran valid", () => {
    const r = validateSignup({
      username: "arga",
      email: "arga@unggas.net",
      password: "T3sP3t3rnak!2026",
      honeypot: "",
    });
    expect(r.ok).toBe(true);
  });

  it("menolak honeypot terisi (bot)", () => {
    const r = validateSignup({
      username: "bot",
      email: "bot@spam.com",
      password: "T3sP3t3rnak!2026",
      honeypot: "http://spam.com",
    });
    expect(r.ok).toBe(false);
  });

  it("menolak username invalid: panjang, karakter, reserved", () => {
    expect(validateSignup({ username: "ab", email: "a@b.co", password: "T3sP3t3rnak!2026", honeypot: "" }).ok).toBe(false);
    expect(validateSignup({ username: "a".repeat(33), email: "a@b.co", password: "T3sP3t3rnak!2026", honeypot: "" }).ok).toBe(false);
    expect(validateSignup({ username: "admin", email: "a@b.co", password: "T3sP3t3rnak!2026", honeypot: "" }).ok).toBe(false);
    expect(validateSignup({ username: "spasi in", email: "a@b.co", password: "T3sP3t3rnak!2026", honeypot: "" }).ok).toBe(false);
  });

  it("menolak password pendek (<8)", () => {
    expect(validateSignup({ username: "arga", email: "a@b.co", password: "pendek", honeypot: "" }).ok).toBe(false);
  });

  it("menolak email invalid", () => {
    expect(validateSignup({ username: "arga", email: "bukan-email", password: "T3sP3t3rnak!2026", honeypot: "" }).ok).toBe(false);
  });
});

describe("parseId", () => {
  it("menerima id numerik positif", () => {
    expect(parseId("1")).toBe(1);
    expect(parseId("42")).toBe(42);
    expect(parseId("0012")).toBe(12);
  });

  it("menolak segmen URL yang bukan id", () => {
    for (const raw of ["abc", "1abc", "1.5", "-1", "0", " ", "1e3", "99999999999999999999"]) {
      expect(parseId(raw), raw).toBeNull();
    }
  });
});
