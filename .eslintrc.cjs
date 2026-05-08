module.exports = {
  root: true,
  env: { browser: true, es2022: true, node: true },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: { jsx: true },
  },
  plugins: [
    "@typescript-eslint",
    "react",
    "react-hooks",
    "jsx-a11y",
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
  ],
  settings: { react: { version: "19.0" } },
  ignorePatterns: ["dist", "node_modules", "WLD (4)", "archive", ".next", "*.cjs"],
  rules: {
    // @ts-nocheck 신규 추가 금지 (Phase 5 마지막에 전수 회복 완료, 2026-05-09).
    "@typescript-eslint/ban-ts-comment": [
      "error",
      {
        "ts-nocheck": true,
        "ts-expect-error": "allow-with-description",
        "ts-ignore": true,
        "ts-check": false,
      },
    ],
    // 시안 기반 코드 — 점진 정리 중. TS 도입 후 단계적 강화.
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
    "@typescript-eslint/no-explicit-any": "off",
    "react/prop-types": "off",
    "react/no-unescaped-entities": "off",
    "jsx-a11y/click-events-have-key-events": "warn",
    "jsx-a11y/no-static-element-interactions": "warn",
    "jsx-a11y/no-noninteractive-element-interactions": "warn",
  },
};
