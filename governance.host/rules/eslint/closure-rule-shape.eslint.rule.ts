import type { AstNode, SourceLoc } from "../../types/syntax.types.ts";
import type { LocalRule, RuleContext, RuleFileShape, RuleListener } from "../../types/rule.types.ts";
import { RULE_HOST, normalizePath } from "../../shared/resolvers/anchor.resolver.ts";
import { calleeName, locOf, nodeAt, nodesAt } from "../../shared/selectors/syntax.selector.ts";
import {
    collectRuleFile,
    collectRuleObject,
    declaredIds,
    isNonEmptyString,
    propertyNamed,
    reportedIds,
    textOf,
} from "../../shared/analyzers/rule.analyzer.ts";
import { DECLARING_CALLEE } from "../../shared/analyzers/check.analyzer.ts";
import { defineCheck } from "@govlab/context/check";
import { listener } from "../../shared/factories/listener.factory.ts";

const RULE_TAG = ".eslint.rule.ts";
const REQUIRED_META_KEYS = ["type", "schema", "messages"];
const SEVERITY_KEY = "severity";

const isRuleFile = function isRuleFile(filename: string): boolean {
    const posix = normalizePath(filename);
    return posix.startsWith(normalizePath(RULE_HOST)) && posix.endsWith(RULE_TAG);
};

const reportShapeDefects = function reportShapeDefects(context: RuleContext, shape: RuleFileShape): void {
    for (const offender of shape.anyNodes) {
        context.report({ loc: locOf(offender), messageId: "explicitAny" });
    }
    for (const guard of shape.guards) {
        const payload = { name: textOf(nodeAt(guard, "imported")) };
        context.report({ data: payload, loc: locOf(guard), messageId: "projectGuard" });
    }
};

const EXPRESSION_STATEMENT = "ExpressionStatement";

const declaresAtModule = function declaresAtModule(program: AstNode): boolean {
    return nodesAt(program, "body").some(
        (statement) =>
            statement.type === EXPRESSION_STATEMENT && calleeName(nodeAt(statement, "expression")) === DECLARING_CALLEE,
    );
};

const docsField = function docsField(docs: AstNode | null, key: string): AstNode | null {
    const field = docs === null ? null : propertyNamed(nodeAt(docs, "value"), key);
    return field === null ? null : nodeAt(field, "value");
};

const declaresInDocs = function declaresInDocs(docs: AstNode | null): boolean {
    const declaring = docsField(docs, "checks");
    return declaring !== null && calleeName(declaring) === DECLARING_CALLEE;
};

const reportMetaDefects = function reportMetaDefects(
    context: RuleContext,
    meta: AstNode,
    anchor: SourceLoc,
    declared: boolean,
): void {
    for (const key of REQUIRED_META_KEYS) {
        if (propertyNamed(meta, key) === null) {
            context.report({ data: { key }, loc: anchor, messageId: "missingMetaKey" });
        }
    }
    const docs = propertyNamed(meta, "docs");
    const description = docsField(docs, "description");
    if (description === null || !isNonEmptyString(description)) {
        context.report({ loc: anchor, messageId: "missingDescription" });
    }
    if (!declared && !declaresInDocs(docs)) {
        context.report({ data: { callee: DECLARING_CALLEE }, loc: anchor, messageId: "missingChecks" });
    }
    if (propertyNamed(meta, SEVERITY_KEY) !== null) {
        context.report({ loc: anchor, messageId: "severityDeclared" });
    }
};

const reportMessageDefects = function reportMessageDefects(
    context: RuleContext,
    declared: ReadonlySet<string>,
    reported: ReadonlySet<string>,
    anchor: SourceLoc,
): void {
    if (declared.size === 0) {
        context.report({ loc: anchor, messageId: "missingMessages" });
    }
    for (const id of reported) {
        if (!declared.has(id)) {
            context.report({ data: { id }, loc: anchor, messageId: "unknownMessageId" });
        }
    }
    for (const id of declared) {
        if (!reported.has(id)) {
            context.report({ data: { id }, loc: anchor, messageId: "unusedMessage" });
        }
    }
};

export default {
    create(context: RuleContext): RuleListener {
        if (!isRuleFile(context.filename)) {
            return {};
        }
        return listener({
            program(view, node) {
                const file = collectRuleFile(view);
                reportShapeDefects(context, file);
                if (file.ruleObjects.length === 0) {
                    context.report({ messageId: "missingRuleObject", node });
                    return;
                }
                const [first] = file.ruleObjects;
                const declared = declaresAtModule(view);
                for (const ruleObject of file.ruleObjects) {
                    const shape = collectRuleObject(ruleObject);
                    const anchor = locOf(shape.metaProperty ?? ruleObject);
                    if (shape.meta === null) {
                        context.report({ loc: anchor, messageId: "missingMeta" });
                        continue;
                    }
                    reportMetaDefects(context, shape.meta, anchor, declared);
                }
                if (first !== undefined) {
                    const anchor = locOf(collectRuleObject(first).metaProperty ?? first);
                    reportMessageDefects(context, declaredIds(file.ruleObjects), reportedIds(view), anchor);
                }
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({ detects: [], enforces: ["architecture:policy-as-code"] }),
            description:
                "A rule file declares the whole contract the loader and the generator depend on: a meta block carrying type, schema, messages and a description, plus a create function. Every messageId reported must be declared and every declared message must be reported, so a rule can neither ship a message it never emits nor emit one it never declared. Severity is the generator's to set, scope is the loader's to apply, and an untyped node defeats the typed rule surface — each is refused here rather than left to review.",
            workspaceWide: true,
        },
        messages: {
            explicitAny:
                "`any` in a rule file defeats the typed rule surface. Type the node through the shared rule types, or narrow it where it is read.",
            missingChecks:
                "The rule declares no check: `meta.docs.checks` is missing or not built by `{{ callee }}`, and no module-level `{{ callee }}(...)` statement stands in for it. Declare the ontology records the rule enforces and the anti-patterns it detects, so the ontology can count this rule as their check.",
            missingDescription:
                "`meta.docs.description` is missing or empty. It states the shape the rule enforces, and is the only place that contract is written.",
            missingMessages: "`meta.messages` declares no message. A rule that can report nothing enforces nothing.",
            missingMeta: "This rule declares a `create` function but no `meta` object to describe or register it.",
            missingMetaKey: "`meta.{{ key }}` is missing.",
            missingRuleObject:
                "A rule file must declare at least one object carrying both `meta` and `create`. Neither half enforces anything alone — `meta` with no `create` never runs, and `create` with no `meta` cannot be registered or described.",
            projectGuard:
                "A rule must not import `{{ name }}`. Scope is applied once by the loader, so a guard inside a rule duplicates it and hides the rule from every member the loader would have shown it.",
            severityDeclared:
                "A rule must not declare its own severity. The generator emits it, and every rule registers at error.",
            unknownMessageId: "`{{ id }}` is reported but not declared in `meta.messages`.",
            unusedMessage: "`{{ id }}` is declared in `meta.messages` but never reported.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
