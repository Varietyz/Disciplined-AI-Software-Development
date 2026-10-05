import type { Rule } from "eslint";
import { govlabMeta } from "#core/factories/eslint.factory";

type ImportDecl = Extract<Rule.Node, { type: "ImportDeclaration" }>;

const MIN_GROUP = 2;

const isRecord = function isRecord(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === "object";
};

const importKindOf = function importKindOf(decl: unknown): string {
    if (isRecord(decl) && typeof decl["importKind"] === "string") {
        return decl["importKind"];
    }
    return "value";
};

const sourceValue = function sourceValue(decl: ImportDecl): string {
    return typeof decl.source.value === "string" ? decl.source.value : "";
};

const groupKey = function groupKey(decl: ImportDecl): string {
    return `${importKindOf(decl)} ${sourceValue(decl)}`;
};

const namedOnly = function namedOnly(decl: ImportDecl): boolean {
    return decl.specifiers.length > 0 && decl.specifiers.every((spec) => spec.type === "ImportSpecifier");
};

const collectNames = function collectNames(context: Rule.RuleContext, group: ImportDecl[]): string[] {
    const seen = new Set<string>();
    const names: string[] = [];
    for (const decl of group) {
        for (const spec of decl.specifiers) {
            const text = context.sourceCode.getText(spec);
            if (!seen.has(text)) {
                seen.add(text);
                names.push(text);
            }
        }
    }
    return names;
};

const mergedText = function mergedText(context: Rule.RuleContext, group: ImportDecl[]): string {
    const [first] = group;
    if (!first) {
        return "";
    }
    const names = collectNames(context, group);
    const kind = importKindOf(first) === "type" ? "type " : "";
    const source = context.sourceCode.getText(first.source);
    return `import ${kind}{ ${names.join(", ")} } from ${source};`;
};

const removeRange = function removeRange(context: Rule.RuleContext, decl: ImportDecl): [number, number] {
    const range = decl.range ?? [0, 0];
    const [start, end] = range;
    return context.sourceCode.getText()[end] === "\n" ? [start, end + 1] : range;
};

const reportGroup = function reportGroup(context: Rule.RuleContext, group: ImportDecl[]): void {
    const [head] = group;
    if (!head) {
        return;
    }
    const mergeable = group.every(namedOnly);
    for (let i = 1; i < group.length; i += 1) {
        const dup = group[i];
        if (dup) {
            const makeFix = (fixer: Rule.RuleFixer): Rule.Fix[] => [
                fixer.replaceText(head, mergedText(context, group)),
                ...group.slice(1).map((other) => fixer.removeRange(removeRange(context, other))),
            ];
            context.report({
                data: { source: sourceValue(dup) },
                ...(mergeable && i === 1 ? { fix: makeFix } : {}),
                messageId: "duplicate",
                node: dup,
            });
        }
    }
};

export default {
    create(context: Rule.RuleContext): Rule.RuleListener {
        const groups = new Map<string, ImportDecl[]>();
        const onImport = (node: Rule.Node): void => {
            if (node.type !== "ImportDeclaration") {
                return;
            }
            const key = groupKey(node);
            const list = groups.get(key) ?? [];
            list.push(node);
            groups.set(key, list);
        };
        const onExit = (): void => {
            for (const group of groups.values()) {
                if (group.length >= MIN_GROUP) {
                    reportGroup(context, group);
                }
            }
        };
        const handlers: [string, (node: Rule.Node) => void][] = [
            ["ImportDeclaration", onImport],
            ["Program:exit", onExit],
        ];
        return Object.fromEntries(handlers);
    },
    meta: govlabMeta({
        canonical: ["duplicate-code"],
        description: "Disallow duplicate imports from one module; merge named-only imports into the first",
        fixable: "code",
        messages: { duplicate: "'{{source}}' is imported more than once; merge into a single import." },
        ruleId: "no_duplicate_imports",
        type: "problem",
    }),
} satisfies Rule.RuleModule;
