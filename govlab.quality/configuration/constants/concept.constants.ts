export const EXPLICIT_CONCEPTS: ReadonlyMap<string, readonly string[]> = new Map([
    ["stylelint:color-hex-length", ["css-hex-length"]],
    ["stylelint:custom-property-pattern", ["css-custom-property-naming"]],
    ["stylelint:declaration-block-no-duplicate-custom-properties", ["css-duplicate-custom-property"]],
    ["stylelint:declaration-no-important", ["css-important"]],
    ["stylelint:font-family-no-duplicate-names", ["css-font-duplicate"]],
    ["stylelint:function-url-quotes", ["css-url-quotes"]],
    ["stylelint:keyframes-name-pattern", ["css-keyframes-naming"]],
    ["stylelint:max-nesting-depth", ["deep-nesting"]],
    ["stylelint:number-max-precision", ["number-precision"]],
    ["stylelint:property-no-vendor-prefix", ["css-property-vendor-prefix"]],
    ["stylelint:selector-class-pattern", ["css-class-naming"]],
    ["stylelint:selector-max-id", ["selector-id-budget"]],
    ["stylelint:selector-max-type", ["selector-type-budget"]],
    ["stylelint:selector-no-qualifying-type", ["css-qualifying-type"]],
    ["stylelint:value-no-vendor-prefix", ["css-value-vendor-prefix"]],
]);

export const DECLARING_TOOL_PREFIX = "govlab";

export const CONCEPT_SAMPLE_MAX = 6;
