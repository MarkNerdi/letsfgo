module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
    plugins: ["svelte3", "@typescript-eslint"],
    ignorePatterns: ["*.cjs"],
    overrides: [{ files: ["*.svelte"], processor: "svelte3/svelte3" }],
    settings: {
        "svelte3/typescript": () => require("typescript"),
    },
    parserOptions: {
        sourceType: "module",
        ecmaVersion: 2020,
    },
    env: {
        browser: true,
        es2017: true,
        node: true,
    },
    rules: {
        "array-element-newline": ["error", "consistent"],
        "brace-style": ["error", "1tbs"],
        "comma-dangle": [
            "error",
            {
                arrays: "always-multiline",
                objects: "always-multiline",
                imports: "never",
                exports: "never",
                functions: "never",
            },
        ],
        "eol-last": ["error", "always"],
        indent: ["error", 4],
        "no-multiple-empty-lines": ["error", { max: 2 }],
        "object-curly-spacing": ["error", "always"],
        quotes: ["error", "single"],
        semi: ["error", "always"],
        camelcase: "error",
        eqeqeq: ["error", "always"],
        "no-confusing-arrow": "error",
        "no-return-await": "error",
        "no-unneeded-ternary": "error",
        "object-shorthand": "error",
        "quote-props": ["error", "as-needed"],
        "spaced-comment": ["error", "always"],
        yoda: "error",
    },
};
