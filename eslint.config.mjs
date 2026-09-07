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
  ]),
  {
    // Deliberate hydration/init effects: several client components call a
    // single setState synchronously inside useEffect to apply mounted-only
    // state (reading cookies, deriving a chart/observer from a saved profile,
    // flipping a hydrated flag) without server render mismatch. These are
    // correct and intentional, so the newer react-hooks heuristic is disabled.
    rules: {
      "react-hooks/set-state-in-effect": "off",
    },
  },
  {
    // Node-only build/test scripts still use CommonJS.
    files: ["**/*.cjs"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
]);

export default eslintConfig;
