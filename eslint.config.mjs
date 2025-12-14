// eslint.config.mjs
import js from "@eslint/js"
import nextPlugin from "@next/eslint-plugin-next"
import reactPlugin from "eslint-plugin-react"
import reactHooksPlugin from "eslint-plugin-react-hooks"
import jsxA11yPlugin from "eslint-plugin-jsx-a11y"
import importPlugin from "eslint-plugin-import"
import tseslint from "@typescript-eslint/eslint-plugin"
import tsParser from "@typescript-eslint/parser"
import prettierConfig from "eslint-config-prettier"

export default [
    js.configs.recommended,
    {
        files: ["**/*.{ts,tsx,js,jsx}"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                ecmaFeatures: { jsx: true },
                project: "./tsconfig.json",
            },
            globals: {
                React: "readonly",
                JSX: "readonly",
                process: "readonly",
            },
        },
        plugins: {
            "@next/next": nextPlugin,
            react: reactPlugin,
            "react-hooks": reactHooksPlugin,
            "jsx-a11y": jsxA11yPlugin,
            import: importPlugin,
            "@typescript-eslint": tseslint,
        },
        settings: {
            react: {
                version: "detect",
            },
            "import/resolver": {
                typescript: {
                    alwaysTryTypes: true,
                    project: "./tsconfig.json",
                },
                node: true,
            },
        },
        rules: {
            // Next.js rules
            ...nextPlugin.configs.recommended.rules,
            ...nextPlugin.configs["core-web-vitals"].rules,

            // React rules (Airbnb style)
            ...reactPlugin.configs.recommended.rules,
            "react/react-in-jsx-scope": "off", // Not needed in Next.js
            "react/prop-types": "off", // Using TypeScript
            "react/jsx-props-no-spreading": [
                "error",
                {
                    html: "enforce",
                    custom: "enforce",
                    exceptions: ["Component"],
                },
            ],
            "react/jsx-filename-extension": [
                "error",
                {
                    extensions: [".jsx", ".tsx"],
                },
            ],
            "react/function-component-definition": [
                "error",
                {
                    namedComponents: "arrow-function",
                    unnamedComponents: "arrow-function",
                },
            ],

            // React Hooks rules
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",

            // JSX Accessibility rules
            ...jsxA11yPlugin.configs.recommended.rules,

            // Import rules (Airbnb style)
            "import/prefer-default-export": "off",
            "import/extensions": [
                "error",
                "ignorePackages",
                {
                    ts: "never",
                    tsx: "never",
                    js: "never",
                    jsx: "never",
                },
            ],
            "import/no-unresolved": "error",
            "import/order": [
                "error",
                {
                    groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
                    "newlines-between": "always",
                    alphabetize: { order: "asc", caseInsensitive: true },
                    // React imports are optional and treated as regular external imports
                    // No special ordering requirement since React doesn't need to be imported in modern React
                },
            ],

            // TypeScript rules
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                },
            ],
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/explicit-module-boundary-types": "off",

            // General JavaScript/TypeScript rules (Airbnb style)
            "no-console": ["warn", { allow: ["warn", "error"] }],
            "no-unused-vars": "off", // Use TypeScript version
            "prefer-const": "error",
            "no-var": "error",
            "object-shorthand": "error",
            "quote-props": ["error", "as-needed"],
            "prefer-template": "error",
            "prefer-arrow-callback": "error",
            "arrow-body-style": ["error", "as-needed"],
            "no-param-reassign": ["error", { props: false }],
            "prefer-destructuring": [
                "error",
                {
                    array: true,
                    object: true,
                },
                {
                    enforceForRenamedProperties: false,
                },
            ],
        },
    },
    // Prettier config to disable conflicting rules
    prettierConfig,
]
