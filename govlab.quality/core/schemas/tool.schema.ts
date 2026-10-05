import {
    MUST_BE_OBJECT,
    booleanFieldError,
    isObject,
    requireObjectField,
    stringArrayFieldError,
    stringFieldErrors,
    validateBlockExclusions,
} from "#core/validators/section.validator";
import type { ConfigSection } from "#types/config.types";
import { defineConfigSection } from "#core/registries/section.registry";

const objectWithStringFields = (key: string, fields: string[]): ConfigSection =>
    defineConfigSection({
        key,
        validate: (value) => (isObject(value) ? stringFieldErrors(value, fields) : [MUST_BE_OBJECT]),
    });

const objectWithExtras = (key: string, extras: (value: Record<string, unknown>) => string[]): ConfigSection =>
    defineConfigSection({ key, validate: (value) => (isObject(value) ? extras(value) : [MUST_BE_OBJECT]) });

export const stylelintSection = objectWithExtras("stylelint", (value) => [
    ...requireObjectField(value, "base"),
    ...requireObjectField(value, "rules"),
    ...stringArrayFieldError(value, "exclude", "exclude must be an array of strings"),
]);

export const prettierSection = objectWithExtras("prettier", (value) => [
    ...requireObjectField(value, "base"),
    ...stringArrayFieldError(value, "ignore", "ignore must be an array of strings"),
]);

export const htmlhintSection = objectWithExtras("htmlhint", (value) => [
    ...requireObjectField(value, "rules"),
    ...stringArrayFieldError(value, "ignore", "ignore must be an array of strings"),
]);

export const yamllintSection = objectWithExtras("yamllint", (value) => [
    ...stringFieldErrors(value, ["command", "extends"]),
    ...requireObjectField(value, "rules"),
    ...stringArrayFieldError(value, "ignore", "ignore must be an array of strings"),
]);

export const knipSection = objectWithExtras("knip", () => []);

export const jscpdSection = objectWithExtras("jscpd", (value) => [
    ...["threshold", "minTokens", "minLines"]
        .filter((key) => value[key] !== undefined && typeof value[key] !== "number")
        .map((key) => `${key} must be a number`),
    ...stringArrayFieldError(value, "ignore", "ignore must be an array of globs"),
    ...stringArrayFieldError(value, "format", "format must be an array of jscpd format ids"),
]);

export const oxlintSection = objectWithExtras("oxlint", (value) => [
    ...stringArrayFieldError(value, "plugins", "plugins must be an array of strings"),
    ...requireObjectField(value, "categories"),
    ...requireObjectField(value, "rules"),
    ...requireObjectField(value, "env"),
    ...requireObjectField(value, "globals"),
    ...stringArrayFieldError(value, "ignorePatterns", "ignorePatterns must be an array of strings"),
    ...stringArrayFieldError(value, "reportOnly", "reportOnly must be an array of rule ids"),
    ...validateBlockExclusions(value["blockExclusions"]),
]);

export const sqlfluffSection = objectWithStringFields("sqlfluff", ["command", "dialect"]);
export const banditSection = objectWithStringFields("bandit", ["command"]);
export const clangTidySection = objectWithStringFields("clang-tidy", ["checks"]);
export const checkstyleSection = objectWithStringFields("checkstyle", ["command", "config"]);
export const pmdSection = objectWithStringFields("pmd", ["command", "ruleset"]);
export const swiftlintSection = objectWithStringFields("swiftlint", ["command"]);
export const kicsSection = objectWithStringFields("kics", ["command", "queries", "libraries"]);
export const credoSection = objectWithStringFields("credo", ["command"]);
export const lintrSection = objectWithStringFields("lintr", ["command"]);
export const perlcriticSection = objectWithStringFields("perlcritic", ["command", "severity"]);
export const semgrepSection = objectWithStringFields("semgrep", ["command", "config"]);
export const slitherSection = objectWithStringFields("slither", ["command", "solc"]);
export const cljKondoSection = objectWithStringFields("clj-kondo", ["command", "config"]);
export const scalastyleSection = objectWithStringFields("scalastyle", ["command", "config"]);
export const detektSection = objectWithStringFields("detekt", ["command", "config"]);
export const checkovSection = objectWithStringFields("checkov", ["command"]);

export const styluaSection = objectWithExtras("stylua", () => []);

export const phpcsSection = defineConfigSection({
    key: "phpcs",
    validate(value) {
        return isObject(value) && (!Object.hasOwn(value, "standard") || typeof value["standard"] === "string")
            ? []
            : ["must be an object with an optional string `standard`"];
    },
});

export const phpmdSection = objectWithExtras("phpmd", (value) =>
    stringArrayFieldError(
        value,
        "rulesets",
        "rulesets must be an array of strings (phpmd rule-set names or ruleset.xml paths)",
    ),
);

export const hadolintSection = objectWithExtras("hadolint", (value) => [
    ...(Object.hasOwn(value, "failureThreshold") && typeof value["failureThreshold"] !== "string"
        ? ["failureThreshold must be a string (error | warning | info | style)"]
        : []),
    ...stringArrayFieldError(value, "ignore", "ignore must be an array of strings (DL rule ids)"),
]);

export const shellcheckSection = objectWithExtras("shellcheck", (value) => [
    ...(Object.hasOwn(value, "severity") && typeof value["severity"] !== "string"
        ? ["severity must be a string (error | warning | info | style)"]
        : []),
    ...booleanFieldError(value, "enableAll", "enableAll must be a boolean"),
    ...stringArrayFieldError(value, "exclude", "exclude must be an array of strings"),
]);
