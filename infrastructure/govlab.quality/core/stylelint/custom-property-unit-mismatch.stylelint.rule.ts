import type { Declaration, Root } from "postcss";
import stylelint, { type PostcssResult, type Rule } from "stylelint";
import type { GovlabStylelintMeta } from "#types/stylelint.types";
import { customPropertyStartsWith } from "#core/predicates/css.predicate";
import { valueUnits } from "#core/parsers/css.parser";
import { withRuleId } from "#core/formatters/stylelint.formatter";

const { createPlugin, utils } = stylelint;
const ruleName = "govlab/custom-property-unit-mismatch";
const ruleId = "custom_property_unit_mismatch";

export const RULE_META: GovlabStylelintMeta = {
    meta: {
        canonical: ["design-tokens"],
        description: "Require custom-property values to use the unit their name prefix mandates (rem vs px)",
        fixable: false,
    },
    ruleId,
    ruleName,
};

const REM_PREFIXES = [
    "--font-",
    "--width-",
    "--height-",
    "--size-",
    "--touch-target-",
    "--nav-width",
    "--nav-height",
    "--header-width",
    "--header-height",
    "--space-",
    "--radius-",
];
const PX_PREFIXES: readonly { prefix: string; excludes: readonly string[] }[] = [
    { excludes: ["neutral"], prefix: "--border-" },
    { excludes: [], prefix: "--bp-" },
    { excludes: [], prefix: "--cq-" },
    { excludes: [], prefix: "--transform-hover-" },
];

const messages = utils.ruleMessages(ruleName, {
    pxExpected: (name: string): string =>
        withRuleId(
            `Custom property '${name}' matches a px-required pattern but uses rem. Convert the value to px — borders and breakpoints are fixed-pixel by contract.`,
            ruleId,
        ),
    remExpected: (name: string): string =>
        withRuleId(
            `Custom property '${name}' matches a rem-required pattern but uses px. Convert the value to rem (÷16) so it scales with the root font size.`,
            ruleId,
        ),
});

const rule: Rule = Object.assign(
    (primary: unknown) =>
        (root: Root, result: PostcssResult): void => {
            if (primary !== true) {
                return;
            }
            root.walkDecls((decl: Declaration) => {
                const name = decl.prop;
                if (!name.startsWith("--")) {
                    return;
                }
                const units = valueUnits(decl.value);
                const isPx = units.some((token) => token.unit === "px");
                const isRem = units.some((token) => token.unit === "rem");
                if (REM_PREFIXES.some((prefix) => customPropertyStartsWith(name, prefix)) && isPx) {
                    utils.report({ message: messages.remExpected(name), node: decl, result, ruleName });
                    return;
                }
                if (PX_PREFIXES.some((p) => customPropertyStartsWith(name, p.prefix, p.excludes)) && isRem) {
                    utils.report({ message: messages.pxExpected(name), node: decl, result, ruleName });
                }
            });
        },
    { messages, ruleName },
);

export default createPlugin(ruleName, rule);
