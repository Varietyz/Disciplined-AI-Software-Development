import type { Plugin, PostcssResult, Rule, RuleContext } from "stylelint";
import { LOCAL_STYLELINT_RULES } from "../../shared/generated/stylelint-index.generated.ts";
import type { Root } from "postcss";
import { isGovernedFile } from "../../shared/resolvers/anchor.resolver.ts";
import stylelint from "stylelint";
import { stylesheetRuleUnnamed } from "../../shared/strings/rule.strings.ts";

const RULE_NAMESPACE = "local/";

const isRecord = function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
};

const isPlugin = function isPlugin(value: unknown): value is Plugin & { ruleName: string; rule: Rule } {
    return isRecord(value) && typeof value["ruleName"] === "string" && typeof value["rule"] === "function";
};

const scopeToProject = function scopeToProject(label: string, plugin: unknown): Plugin {
    const ruleName = RULE_NAMESPACE + label;
    if (!isPlugin(plugin) || plugin.ruleName !== ruleName) {
        throw new Error(stylesheetRuleUnnamed(label, ruleName));
    }
    const inner = plugin.rule;
    const scoped: Rule = Object.assign(
        (primary: unknown, secondary: unknown, context: RuleContext) =>
            (root: Root, result: PostcssResult): void => {
                const file = root.source?.input.file;
                if (file !== undefined && isGovernedFile(file)) {
                    void inner(primary, secondary, context)(root, result);
                }
            },
        { messages: inner.messages, ruleName, ...(inner.meta === undefined ? {} : { meta: inner.meta }) },
    );
    return stylelint.createPlugin(ruleName, scoped);
};

const stylesheetPlugins = Object.entries(LOCAL_STYLELINT_RULES).map(([label, plugin]) =>
    scopeToProject(label, plugin),
);

export default { plugins: stylesheetPlugins, tool: "stylelint" };
