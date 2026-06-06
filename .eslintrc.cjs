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
    // 현재 autofocus 사용처는 전부 모달/오버레이/단일목적 폼의 첫 입력 — 다이얼로그에
    // 포커스를 들여보내는 건 WCAG(2.4.3) 부합 동작이라 의도적으로 허용한다.
    // 페이지 첫 로드 시점의 autofocus 를 새로 추가할 땐 개별 검토할 것.
    "jsx-a11y/no-autofocus": "off",
  },
};
