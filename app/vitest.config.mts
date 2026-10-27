import { defineConfig } from "vitest/config";
import path from "node:path";

// Test WAJIB memakai database terpisah (unggas_test) — jangan pernah menyentuh
// database produksi. Datanya di-reset aman kapan pun: DATABASE_URL di sini
// menimpa .env, jadi test tidak tergantung file mana pun.
export default defineConfig({
  test: {
    environment: "node",
    env: {
      DATABASE_URL:
        "postgresql://unggas:3ud3nu668zLUYc3gYabrr47QCZlm@127.0.0.1:5433/unggas_test",
      SESSION_SECRET: "test-secret",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },
});
