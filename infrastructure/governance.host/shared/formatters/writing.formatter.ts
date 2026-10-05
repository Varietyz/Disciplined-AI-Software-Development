import type { CanonCheck, CanonExample, CanonLayer, CanonRule } from "../../types/writing.types.ts";

const LINE = "\n";
const BLANK = "\n\n";
const ITEM = "- ";
const NESTED = "  - ";

const LIST = ", ";
const AND = " and ";
const REVIEW = "review";
const ENFORCED = "enforced in ";
const OFF = "off";

const stateOf = function stateOf(check: CanonCheck): string {
    if (check.detection === REVIEW) {
        return REVIEW;
    }
    return check.enforcedIn.length === 0 ? OFF : ENFORCED + check.enforcedIn.map((id) => `\`${id}\``).join(AND);
};

const itemsOf = function itemsOf(label: string, values: readonly string[]): readonly string[] {
    return values.length === 0 ? [] : [`${ITEM}**${label}:**`, ...values.map((value) => NESTED + value)];
};

const checkLabel = function checkLabel(check: CanonCheck): string {
    return `${check.id} (${stateOf(check)})`;
};

const exampleLines = function exampleLines(example: CanonExample): readonly string[] {
    const repaired = example.repaired === null ? [] : [`${NESTED}Repaired: "${example.repaired}"`];
    return [`${NESTED}Rejected: "${example.rejected}" ${example.why}`, ...repaired];
};

const ruleBlock = function ruleBlock(rule: CanonRule): string {
    const lines = [
        `### ${rule.id}`,
        "",
        rule.rule,
        "",
        `${ITEM}**Why:** ${rule.why}`,
        ...itemsOf("Conditions", rule.conditions),
        ...itemsOf("Banned", rule.bans),
        ...(rule.examples.length === 0 ? [] : [`${ITEM}**Examples:**`, ...rule.examples.flatMap(exampleLines)]),
        `${ITEM}**Held by:** ${rule.gate ?? REVIEW}`,
        ...(rule.checks.length === 0 ? [] : [`${ITEM}**Checks:** ${rule.checks.map(checkLabel).join(LIST)}`]),
    ];
    return lines.join(LINE);
};

const layerBlock = function layerBlock(layer: CanonLayer): string {
    const covers = [`**Covers:**`, "", ...layer.covers.map((entry) => ITEM + entry)].join(LINE);
    const defers =
        layer.defersTo.length === 0
            ? []
            : [
                  [
                      "**Defers to:**",
                      "",
                      ...layer.defersTo.map((home) => `${ITEM}\`${home.path}\`: ${home.covers}`),
                  ].join(LINE),
              ];
    return [`## ${layer.title} (\`${layer.id}\`)`, layer.intro, covers, ...defers, ...layer.rules.map(ruleBlock)].join(
        BLANK,
    );
};

export const canonMarkdown = function canonMarkdown(
    layers: readonly CanonLayer[],
    header: readonly string[],
    precedence: string,
): string {
    const index = [
        "## Layers",
        "",
        ...layers.map((layer) => `${ITEM}\`${layer.id}\`: ${layer.title}, ${String(layer.rules.length)} rule(s)`),
    ].join(LINE);
    const closing = `## Precedence${BLANK}${precedence}`;
    return [...header, index, ...layers.map(layerBlock), closing].join(BLANK) + LINE;
};
