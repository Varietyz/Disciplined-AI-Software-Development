import type { Rule } from "eslint";
import { compareText } from "#core/comparators/text.comparator";
import { govlabMeta } from "#core/factories/eslint.factory";

type ImportDecl = Extract<Rule.Node, { type: "ImportDeclaration" }>;
type Spec = ImportDecl["specifiers"][number];

const NAMESPACE = "ImportNamespaceSpecifier";
const NAMED = "ImportSpecifier";
const GROUP_SIDE_EFFECT = 0;
const GROUP_NAMESPACE = 1;
const GROUP_MULTI_NAMED = 2;
const GROUP_SINGLE = 3;
const MIN_MEMBERS = 2;
const MIN_DECLS = 2;

const localName = (spec: Spec | undefined): string => spec?.local.name ?? "";

const memberGroup = (decl: ImportDecl): number => {
    if (decl.specifiers.length === 0) {
        return GROUP_SIDE_EFFECT;
    }
    if (decl.specifiers.some((spec) => spec.type === NAMESPACE)) {
        return GROUP_NAMESPACE;
    }
    return decl.specifiers.filter((spec) => spec.type === NAMED).length > 1 ? GROUP_MULTI_NAMED : GROUP_SINGLE;
};

const declRank = (decl: ImportDecl): [number, string] => [memberGroup(decl), localName(decl.specifiers[0])];

const before = (a: [number, string], b: [number, string]): boolean =>
    a[0] < b[0] || (a[0] === b[0] && compareText(a[1], b[1]) < 0);

const namedSpecs = (decl: ImportDecl): Spec[] => decl.specifiers.filter((spec) => spec.type === NAMED);

const swapText =
    (context: Rule.RuleContext, nodes: Spec[], sorted: Spec[]) =>
    (fixer: Rule.RuleFixer): Rule.Fix[] =>
        nodes.map((node, index) => fixer.replaceText(node, context.sourceCode.getText(sorted[index])));

const reorderDecls =
    (context: Rule.RuleContext, decls: ImportDecl[], sorted: ImportDecl[]) =>
    (fixer: Rule.RuleFixer): Rule.Fix[] =>
        decls.map((decl, index) => fixer.replaceText(decl, context.sourceCode.getText(sorted[index])));

const reportMemberOrder = (context: Rule.RuleContext, named: Spec[]): void => {
    const sorted = [...named].sort((a, b) => compareText(localName(a), localName(b)));
    let attached = false;
    for (let i = 1; i < named.length; i += 1) {
        const current = named[i];
        const prev = named[i - 1];
        if (current && prev && compareText(localName(current), localName(prev)) < 0) {
            context.report({
                ...(attached ? {} : { fix: swapText(context, named, sorted) }),
                messageId: "members",
                node: current,
            });
            attached = true;
        }
    }
};

const rangeAt = (node: { range?: [number, number] | undefined } | undefined, index: 0 | 1): number =>
    node?.range?.[index] ?? -1;

const hasInterleavedComments = (context: Rule.RuleContext, decls: ImportDecl[]): boolean => {
    const [first] = decls;
    const last = decls.at(-1);
    const start = rangeAt(first, 0);
    const end = rangeAt(last, 1);
    return context.sourceCode
        .getAllComments()
        .some((comment) => rangeAt(comment, 0) > start && rangeAt(comment, 1) < end);
};

const reportDeclOrder = (context: Rule.RuleContext, decls: ImportDecl[]): void => {
    const commentsBetween = hasInterleavedComments(context, decls);
    const sorted = [...decls].sort((a, b) => (before(declRank(a), declRank(b)) ? -1 : 1));
    let attached = false;
    for (let i = 1; i < decls.length; i += 1) {
        const current = decls[i];
        const prev = decls[i - 1];
        if (current && prev && before(declRank(current), declRank(prev))) {
            const canFix = !commentsBetween && !attached;
            context.report({
                ...(canFix ? { fix: reorderDecls(context, decls, sorted) } : {}),
                messageId: "declarations",
                node: current,
            });
            attached = true;
        }
    }
};

export default {
    create(context: Rule.RuleContext): Rule.RuleListener {
        const decls: ImportDecl[] = [];
        const onImport = (node: Rule.Node): void => {
            if (node.type !== "ImportDeclaration") {
                return;
            }
            decls.push(node);
            const named = namedSpecs(node);
            if (named.length >= MIN_MEMBERS) {
                reportMemberOrder(context, named);
            }
        };
        const onExit = (): void => {
            if (decls.length >= MIN_DECLS) {
                reportDeclOrder(context, decls);
            }
        };
        const handlers: [string, (node: Rule.Node) => void][] = [
            ["ImportDeclaration", onImport],
            ["Program:exit", onExit],
        ];
        return Object.fromEntries(handlers);
    },
    meta: govlabMeta({
        canonical: ["sort-order"],
        description:
            "Require sorted import members and sorted import declarations (declaration order fixed when the import block has no interleaved comments)",
        fixable: "code",
        messages: {
            declarations: "Import declarations should be sorted.",
            members: "Import members should be sorted alphabetically.",
        },
        ruleId: "sort_imports",
        type: "suggestion",
    }),
} satisfies Rule.RuleModule;
