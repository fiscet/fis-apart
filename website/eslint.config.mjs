import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import importPlugin from "eslint-plugin-import";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      // Ensure exactly one blank line after the last import block
      "import/newline-after-import": ["error", { count: 1 }],
      // Collapse multiple empty lines throughout the file
      "no-multiple-empty-lines": ["error", { max: 1, maxBOF: 1, maxEOF: 1 }],
    },
  },
];

export default eslintConfig;
