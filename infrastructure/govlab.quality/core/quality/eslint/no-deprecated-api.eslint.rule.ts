import { DEPRECATED_CTORS, DEPRECATED_GLOBALS, DEPRECATED_MEMBERS } from "#configuration/constants/idiom.constants";
import { asNode, identName } from "#core/selectors/syntax.selector";
import type { DeprecatedApi } from "#types/idiom.types";
import type { Rule } from "eslint";
import { govlabMeta } from "#core/factories/eslint.factory";

const reportEntry = (
    context: Rule.RuleContext,
    node: Rule.Node,
    payload: { entry: DeprecatedApi; name: string },
): void => {
    context.report({
        data: { name: payload.name, reason: payload.entry.reason, replacement: payload.entry.replacement },
        messageId: "deprecated",
        node,
    });
};

const reportCall = function reportCall(context: Rule.RuleContext, node: Rule.Node): void {
    const callee = asNode(node)?.callee;
    const name = callee?.type === "Identifier" ? identName(callee) : null;
    const entry = DEPRECATED_GLOBALS.get(name ?? "");
    if (entry && name !== null) {
        reportEntry(context, node, { entry, name: `${name}()` });
    }
};

const reportMember = function reportMember(context: Rule.RuleContext, node: Rule.Node): void {
    const member = asNode(node);
    const prop = member === null ? null : identName(member.property);
    const entry = DEPRECATED_MEMBERS.get(prop ?? "");
    if (entry && prop !== null) {
        reportEntry(context, node, { entry, name: `.${prop}` });
    }
};

const reportNew = function reportNew(context: Rule.RuleContext, node: Rule.Node): void {
    const callee = asNode(node)?.callee;
    const name = callee?.type === "Identifier" ? identName(callee) : null;
    const entry = DEPRECATED_CTORS.get(name ?? "");
    if (entry && name !== null) {
        reportEntry(context, node, { entry, name: `new ${name}()` });
    }
};

export default {
    create(context: Rule.RuleContext): Rule.RuleListener {
        const handlers: [string, (node: Rule.Node) => void][] = [
            [
                "CallExpression",
                (node): void => {
                    reportCall(context, node);
                },
            ],
            [
                "MemberExpression",
                (node): void => {
                    reportMember(context, node);
                },
            ],
            [
                "NewExpression",
                (node): void => {
                    reportNew(context, node);
                },
            ],
        ];
        return Object.fromEntries(handlers);
    },
    meta: govlabMeta({
        canonical: ["deprecated-api", "idiomatic-preference"],
        description: "Ban deprecated / legacy JavaScript APIs in favor of their modern, supported replacements",
        messages: { deprecated: "'{{name}}' is deprecated — {{reason}}. Use {{replacement}} instead." },
        ruleId: "no_deprecated_api",
    }),
} satisfies Rule.RuleModule;
