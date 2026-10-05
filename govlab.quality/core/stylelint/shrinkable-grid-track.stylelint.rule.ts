import type { Declaration, Root } from "postcss";
import stylelint, { type PostcssResult, type Rule } from "stylelint";
import type { GovlabStylelintMeta } from "#types/stylelint.types";
import valueParser, { type Node } from "postcss-value-parser";
import { withRuleId } from "#core/formatters/stylelint.formatter";

const { createPlugin, utils } = stylelint;
const ruleName = "govlab/shrinkable-grid-track";
const ruleId = "shrinkable_grid_track";

export const RULE_META: GovlabStylelintMeta = {
    meta: {
        canonical: ["responsive-design"],
        description: "Require flexible grid column tracks to be able to shrink below their content",
        fixable: false,
    },
    ruleId,
    ruleName,
};

const TRACK_PROPS = new Set(["grid-template-columns", "grid-auto-columns"]);
const FLEX_UNIT = "fr";
const SHRINKING_FUNCTION = "minmax";

const messages = utils.ruleMessages(ruleName, {
    bareFraction: (track: string): string =>
        withRuleId(
            `The column track '${track}' is a bare fraction, which never shrinks below its content, so one long word or code line pushes the grid wider than a narrow screen. Write the track as minmax(0, ${track}) so it can shrink to the space it is given.`,
            ruleId,
        ),
});

const bareFractions = function bareFractions(nodes: readonly Node[], shrinkable: boolean): string[] {
    return nodes.flatMap((node) => {
        if (node.type === "function") {
            return bareFractions(node.nodes, shrinkable || node.value.toLowerCase() === SHRINKING_FUNCTION);
        }
        if (node.type !== "word" || shrinkable) {
            return [];
        }
        const parsed = valueParser.unit(node.value);
        return parsed !== false && parsed.unit.toLowerCase() === FLEX_UNIT ? [node.value] : [];
    });
};

const rule: Rule = Object.assign(
    (primary: unknown) =>
        (root: Root, result: PostcssResult): void => {
            if (primary !== true) {
                return;
            }
            root.walkDecls((decl: Declaration) => {
                if (!TRACK_PROPS.has(decl.prop.toLowerCase())) {
                    return;
                }
                for (const track of new Set(bareFractions(valueParser(decl.value).nodes, false))) {
                    utils.report({ message: messages.bareFraction(track), node: decl, result, ruleName, word: track });
                }
            });
        },
    { messages, ruleName },
);

export default createPlugin(ruleName, rule);
