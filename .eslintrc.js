module.exports = {
    "root": true,
    "env": {
        "node": true,
    },
    "globals": {
        "ErrorUtils": true,
        "window": true,
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": 2019,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true,
        },
        "jsx": true,
        "project": "tsconfig.json",
    },
    "plugins": [
        "wix-editor",
        "unicorn",
        "@typescript-eslint",
    ],
    "extends": [
        "eslint:recommended",
        "plugin:unicorn/recommended",
        "eslint:recommended",
    ],
    "rules": {
        "quotes": [1, "single", {
            "allowTemplateLiterals": true
        }],
        "semi": [1, "never"],
        "comma-dangle": [1, "always-multiline"],
        "no-unused-vars": 0,
        "function-name": 0,
        "no-shadow": 1,
        "no-console": 0,
        // wix-editor
        "wix-editor/no-instanceof-array": 1,
        "wix-editor/no-not-not": 1,
        "wix-editor/no-unneeded-match": 1,
        "wix-editor/prefer-filter": 1,
        "wix-editor/prefer-ternary": 1,
        "wix-editor/return-boolean": 1,
        "wix-editor/simplify-boolean-expression": 1,
        // unicorn
        "unicorn/import-index": 0,
        "unicorn/catch-error-name": 0,
        "unicorn/prevent-abbreviations": [1, {
            "replacements": {
                "doc": false,
                "docs": false,
            }
        }],
        "unicorn/filename-case": 0,
        "unicorn/no-unreadable-array-destructuring": 0,
        // typescript
        "@typescript-eslint/restrict-plus-operands": 1,
        "@typescript-eslint/explicit-function-return-type": 0,
        "@typescript-eslint/explicit-member-accessibility": [1, {
            accessibility: "no-public"
        }],
    }
};
