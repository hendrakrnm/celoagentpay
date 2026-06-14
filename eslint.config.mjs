import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Local tooling and generated/vendor artifacts:
    ".agents/**",
    ".claude/**",
    ".gemini/**",
    ".kiro/**",
    ".impeccable/**",
    ".qoder/**",
    "contracts/lib/**",
    "contracts/cache/**",
    "contracts/out/**",
    "contracts/broadcast/**",
    "cache/**",
  ]),
]);

export default eslintConfig;
