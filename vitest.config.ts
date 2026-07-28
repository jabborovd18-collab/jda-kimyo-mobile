import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const ildiz = dirname(fileURLToPath(import.meta.url));

// Testlar ilova kodidagi "@/..." importlarini ham o'qishi kerak —
// Metro'dagi alias shu yerda takrorlanadi.
export default defineConfig({
  resolve: {
    alias: {
      "@shared": join(ildiz, "shared"),
      "@": ildiz,
    },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
