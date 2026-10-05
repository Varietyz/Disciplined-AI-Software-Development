import { asConstructNode, collectLocalConstructs, constructsOf } from "#core/selectors/construct.selector";
import { govlabSettings, normalizedFilename } from "#core/selectors/eslint.selector";
import type { ConstructNode } from "#types/construct.types";
import type { Rule } from "eslint";
import type { Scope } from "#types/coverage.types";
import { govlabMeta } from "#core/factories/eslint.factory";
import { isDefaultConstruct } from "#core/predicates/construct.predicate";
import { isSkippable } from "#core/predicates/coverage.predicate";
import { resolveScope } from "#core/resolvers/coverage.resolver";

type Reporter = (name: string, target: ConstructNode) => void;

interface CoverageEnv {
    context: Rule.RuleContext;
    localConstructs: Set<string>;
    report: Reporter;
    scope: Scope;
}

const isRuleNode = function isRuleNode(value: unknown): value is Rule.Node {
    return typeof value === "object" && value !== null && "type" in value;
};

const resolvedScopeOf = function resolvedScopeOf(context: Rule.RuleContext): Scope | null {
    const file = normalizedFilename(context);
    if (isSkippable(file, govlabSettings(context).exclude ?? [])) {
        return null;
    }
    return resolveScope(file);
};

const reportSpecifiers = function reportSpecifiers(specifiers: ConstructNode[], env: CoverageEnv): void {
    for (const spec of specifiers) {
        const localName = spec.local?.name;
        const exportedName = spec.exported?.name;
        if (typeof localName === "string" && typeof exportedName === "string" && env.localConstructs.has(localName)) {
            env.report(exportedName, spec);
        }
    }
};

const exportNamed = function exportNamed(node: ConstructNode | null, env: CoverageEnv): void {
    if (node === null) {
        return;
    }
    if (node.declaration) {
        for (const construct of constructsOf(node.declaration)) {
            env.report(construct.name, construct.node);
        }
        return;
    }
    if (!node.source) {
        reportSpecifiers(node.specifiers ?? [], env);
    }
};

const isLocalReference = function isLocalReference(
    declaration: ConstructNode | null | undefined,
    localConstructs: Set<string>,
): boolean {
    return (
        declaration?.type === "Identifier" &&
        typeof declaration.name === "string" &&
        localConstructs.has(declaration.name)
    );
};

const defaultExport = function defaultExport(node: Rule.Node, env: CoverageEnv): void {
    const declaration = asConstructNode(node)?.declaration;
    if (!isDefaultConstruct(declaration) && !isLocalReference(declaration, env.localConstructs)) {
        return;
    }
    if (!env.scope.coversDefault(env.scope.specifier)) {
        env.context.report({
            data: { specifier: env.scope.specifier ?? env.scope.label },
            messageId: "uncoveredDefault",
            node,
        });
    }
};

const onProgram = function onProgram(node: Rule.Node, env: CoverageEnv): void {
    for (const name of collectLocalConstructs(asConstructNode(node)?.body ?? [])) {
        env.localConstructs.add(name);
    }
};

const coverageListeners = function coverageListeners(context: Rule.RuleContext, scope: Scope): Rule.RuleListener {
    const localConstructs = new Set<string>();
    const report: Reporter = (name, target) => {
        if (!scope.coversName(name) && isRuleNode(target)) {
            context.report({ data: { module: scope.label, symbol: name }, messageId: "uncovered", node: target });
        }
    };
    const env: CoverageEnv = { context, localConstructs, report, scope };
    const onDefault = (node: Rule.Node): void => {
        defaultExport(node, env);
    };
    const onNamed = (node: Rule.Node): void => {
        exportNamed(asConstructNode(node), env);
    };
    const onProgramNode = (node: Rule.Node): void => {
        onProgram(node, env);
    };
    const handlers: [string, (node: Rule.Node) => void][] = [
        ["ExportDefaultDeclaration", onDefault],
        ["ExportNamedDeclaration", onNamed],
        ["Program", onProgramNode],
    ];
    return Object.fromEntries(handlers);
};

export default {
    create(context: Rule.RuleContext): Rule.RuleListener {
        const scope = resolvedScopeOf(context);
        if (scope === null) {
            return {};
        }
        return coverageListeners(context, scope);
    },
    meta: govlabMeta({
        canonical: ["test-quality"],
        description:
            "Every exported construct — a function/class declaration, a const bound to a function, an object literal with methods, an instance or factory result, a grouped `export { … }` specifier, or a default export — must have a provisioned test. Host source is covered by a testbase test importing it via a #host/* specifier; workspace source is covered by a co-located test inside its own package. The gate output is the live coverage ledger.",
        messages: {
            uncovered:
                "Construct '{{symbol}}' in module '{{module}}' has no provisioned test — add a test that references '{{symbol}}' in the module's test scope.",
            uncoveredDefault: "Default export of '{{specifier}}' has no provisioned test — add a test that imports it.",
        },
        ruleId: "require_test_coverage",
        schema: [],
    }),
} satisfies Rule.RuleModule;
