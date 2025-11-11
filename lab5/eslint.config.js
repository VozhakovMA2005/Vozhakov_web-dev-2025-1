import js from "@eslint/js";

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        document: "readonly",
        window: "readonly",
        console: "readonly",
        alert: "readonly"
      }
    },
    rules: {
      ...js.configs.recommended.rules
    }
  }
];
