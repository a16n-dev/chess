module.exports = {
  extends: ['easyrent/react'],
  parserOptions: {
    project: './tsconfig.json'
  },
  rules: {
    "no-empty-function": ["error", { "allow": ["constructors", "asyncFunctions", "asyncMethods", "arrowFunctions"] }],
  },
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"]
    },
    "import/resolver": {
      "typescript": {
        "alwaysTryTypes": true,
      }
    }
  }
}