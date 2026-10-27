import { describe, it, expect } from "vitest";
import { slugify } from "./slug";
import { validateTagSelection } from "./tags";

describe("slugify", () => {
  it("mengubah nama tag jadi slug", () => {
    expect(slugify("Jawa Barat")).toBe("jawa-barat");
    expect(slugify("Bebek & Entok")).toBe("bebek-entok");
    expect(slugify("Bali & Nusa Tenggara")).toBe("bali-nusa-tenggara");
  });

  it("membuang karakter aneh dan memotong 60 karakter", () => {
    expect(slugify("Sumatera Utara!!!")).toBe("sumatera-utara");
    const panjang = "a".repeat(80);
    expect(slugify(panjang)).toHaveLength(60);
  });
});

const TAGS = [
  { id: 1, kind: "topik", isRestricted: false },
  { id: 2, kind: "topik", isRestricted: false },
  { id: 3, kind: "topik", isRestricted: true },
  { id: 10, kind: "wilayah", isRestricted: false },
  { id: 11, kind: "wilayah", isRestricted: false },
];

describe("validateTagSelection", () => {
  it("menerima 1 topik + 1 wilayah", () => {
    const r = validateTagSelection([1, 10], TAGS, false);
    expect(r).toEqual({ ok: true, topik: 1, wilayah: 10 });
  });

  it("menerima 1 topik tanpa wilayah", () => {
    const r = validateTagSelection([1], TAGS, false);
    expect(r).toEqual({ ok: true, topik: 1, wilayah: null });
  });

  it("menolak tanpa tag topik", () => {
    expect(validateTagSelection([10], TAGS, false).ok).toBe(false);
  });

  it("menolak dua tag topik", () => {
    expect(validateTagSelection([1, 2], TAGS, false).ok).toBe(false);
  });

  it("menolak dua tag wilayah", () => {
    expect(validateTagSelection([1, 10, 11], TAGS, false).ok).toBe(false);
  });

  it("menolak tag restricted untuk non-admin, terima untuk admin", () => {
    expect(validateTagSelection([3], TAGS, false).ok).toBe(false);
    expect(validateTagSelection([3], TAGS, true)).toEqual({ ok: true, topik: 3, wilayah: null });
  });

  it("menolak tag yang tidak dikenal", () => {
    expect(validateTagSelection([1, 99], TAGS, false).ok).toBe(false);
  });
});
