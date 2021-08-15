module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  env: {
    "browser": true,
    "es2021": true
  },
  plugins: [
    "@typescript-eslint"
  ],
  rules: {
    "quotes": ["error", "double", {"avoidEscape": true, "allowTemplateLiterals": true}],
    "semi": ["error", "never"],
    "linebreak-style": ["error", "unix"],
    // https://github.com/freee/eslint-config-freee-typescript/pull/2
    "@typescript-eslint/no-extra-semi": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-inferrable-types": "off",
    "@typescript-eslint/type-annotation-spacing": [2, {
      "before": true,
      "after": true
    }],
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-var-requires": "off",
    // Covered by TS compiler already:
    "@typescript-eslint/no-unused-vars": [2,
      {"argsIgnorePattern": "^_", "varsIgnorePattern": "^_"}
    ],
  },
  ignorePatterns: ["/dist/", "/ignore/", "*.js"],
}
