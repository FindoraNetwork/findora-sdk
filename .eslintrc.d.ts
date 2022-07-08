export declare namespace env {
    const es6: boolean;
    const jasmine: boolean;
    const node: boolean;
    const worker: boolean;
}
export declare const parser: string;
export declare namespace parserOptions {
    const ecmaVersion: number;
    const project: string[];
    const tsconfigRootDir: string;
    const sourceType: string;
}
export declare const plugins: string[];
declare const _extends: string[];
export { _extends as extends };
export declare const rules: {
    curly: string[];
    'no-bitwise': string;
    'no-console': (string | {
        allow: string[];
    })[];
    'no-param-reassign': string;
    'no-shadow': string;
    'no-unused-vars': string;
    'prefer-const': string;
    radix: string[];
    'spaced-comment': (string | {
        line: {
            markers: string[];
        };
    })[];
    'import/no-cycle': string;
    'simple-import-sort/sort': string;
    '@typescript-eslint/array-type': (string | {
        default: string;
    })[];
    '@typescript-eslint/await-thenable': string;
    '@typescript-eslint/no-var-requires': string;
    '@typescript-eslint/ban-types': string;
    '@typescript-eslint/explicit-function-return-type': (string | {
        allowExpressions: boolean;
    })[];
    '@typescript-eslint/explicit-member-accessibility': string;
    '@typescript-eslint/naming-convention': (string | {
        selector: string;
        format: string[];
        leadingUnderscore?: undefined;
    } | {
        selector: string;
        format: string[];
        leadingUnderscore: string;
    })[];
    '@typescript-eslint/no-dynamic-delete': string;
    '@typescript-eslint/no-empty-function': string;
    '@typescript-eslint/no-empty-interface': string;
    '@typescript-eslint/no-explicit-any': string;
    '@typescript-eslint/no-floating-promises': string;
    '@typescript-eslint/no-parameter-properties': string;
    '@typescript-eslint/no-shadow': string;
    '@typescript-eslint/no-unused-vars': (string | {
        argsIgnorePattern: string;
        varsIgnorePattern: string;
    })[];
    '@typescript-eslint/no-unnecessary-type-assertion': string;
    '@typescript-eslint/no-use-before-define': string;
    '@typescript-eslint/prefer-readonly': string;
};
export declare const overrides: ({
    files: string;
    rules: {
        '@typescript-eslint/no-var-requires': string;
        '@typescript-eslint/explicit-function-return-type': string;
        '@typescript-eslint/explicit-member-accessibility': string;
        '@typescript-eslint/no-non-null-assertion'?: undefined;
    };
} | {
    files: string;
    rules: {
        '@typescript-eslint/no-non-null-assertion': string;
        '@typescript-eslint/no-var-requires'?: undefined;
        '@typescript-eslint/explicit-function-return-type'?: undefined;
        '@typescript-eslint/explicit-member-accessibility'?: undefined;
    };
})[];
