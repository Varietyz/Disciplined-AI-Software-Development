import type { Declaration, Root } from "postcss";
import stylelint, { type PostcssResult, type Rule } from "stylelint";
import type { GovlabStylelintMeta } from "#types/stylelint.types";
import { withRuleId } from "#core/formatters/stylelint.formatter";

const { createPlugin, utils } = stylelint;
const ruleName = "govlab/no-magic-z-index";
const ruleId = "no_magic_z_index";

export const RULE_META: GovlabStylelintMeta = {
    meta: {
        canonical: ["design-tokens", "css-architecture"],
        description:
            "A stacking level is a declared token or a neutral keyword — never a bare integer or a calc() offset",
        fixable: false,
    },
    ruleId,
    ruleName,
};

const ALLOWED_KEYWORDS = new Set(["auto", "0", "inherit", "initial", "unset"]);

const messages = utils.ruleMessages(ruleName, {
    magic: (value: string, tokensFile: string, prefix: string): string =>
        withRuleId(
            `z-index '${value}' is a stacking level named at the point of use rather than in the one place stacking order is declared. Reference a '${prefix}' token; a level that does not exist yet is added to ${tokensFile} by name, never derived with calc() from a neighboring one.`,
            ruleId,
        ),
});

const rule: Rule = Object.assign(
    (primary: unknown, secondaryOptions: unknown) =>
        (root: Root, result: PostcssResult): void => {
            const opts = (secondaryOptions ?? {}) as { zTokenPrefix?: string; tokensFile?: string };
            const zTokenPrefix =
                typeof opts.zTokenPrefix === "string" && opts.zTokenPrefix.length > 0 ? opts.zTokenPrefix : "";
            if (primary !== true || zTokenPrefix === "") {
                return;
            }
            const tokensFile = typeof opts.tokensFile === "string" ? opts.tokensFile : "the tokens file";
            root.walkDecls((decl: Declaration) => {
                if (decl.prop.toLowerCase() !== "z-index") {
                    return;
                }
                const value = decl.value.trim();
                if (ALLOWED_KEYWORDS.has(value)) {
                    return;
                }
                if (value.startsWith(zTokenPrefix) && !value.includes("calc")) {
                    return;
                }
                const message = messages.magic(value, tokensFile, zTokenPrefix);
                utils.report({ message, node: decl, result, ruleName, word: value });
            });
        },
    { messages, ruleName },
);

export default createPlugin(ruleName, rule);
