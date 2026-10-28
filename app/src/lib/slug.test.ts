import { describe, it, expect } from "vitest";
import { slugify } from "./slug";

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
