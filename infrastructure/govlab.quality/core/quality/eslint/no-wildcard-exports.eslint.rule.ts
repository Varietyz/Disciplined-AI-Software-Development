import type { Rule } from "eslint";
import { packageRelOf } from "#core/resolvers/package.resolver";

const EXPORT_ALL_MESSAGE =
    "Re-export-all (export * from '...') is forbidden in workspace packages — every export must be explicit so the public surface is grep-able and the barrel is the package's exhaustive index. " +
    "Replace with a named re-export listing every public symbol. [explicit_exports_only]";

const NAMESPACE_IMPORT_MESSAGE =
    "Wildcard imports (import * as ns from './...') from a relative/sibling source are forbidden in workspace packages — every in-package symbol is an explicit dependency surface, named one at a time. " +
    "Replace with a named import listing every symbol you actually use. " +
    "Namespace imports from a bare third-party specifier (e.g. import * as THREE from 'three') are permitted — that is the vendor's own consumption contract. [explicit_imports_only]";

const SELECTORS = ["ExportAllDeclaration", "ImportNamespaceSpecifier"];

interface WithSource {
    source?: { value?: unknown };
}

const hasSource = function hasSource(node: unknown): node is WithSource {
    return typeof node === "object" && node !== null;
};

const sourceValueOf = function sourceValueOf(node: unknown): unknown {
    return hasSource(node) ? node.source?.value : null;
};

const isRelativeSource = function isRelativeSource(source: unknown): boolean {
    return typeof source === "string" && source.length > 0 && source.startsWith(".");
};

const isInWorkspacePackage = function isInWorkspacePackage(filename: string): boolean {
    return packageRelOf(filename) !== null;
};

const onNamespaceImport = function onNamespaceImport(context: Rule.RuleContext, node: Rule.Node): void {
    if (isRelativeSource(sourceValueOf(node.parent))) {
        context.report({ messageId: "noNamespaceImport", node });
    }
};

export default {
    create(context): Rule.RuleListener {
        if (!isInWorkspacePackage(context.filename)) {
            return {};
        }
        const handlers: ((node: Rule.Node) => void)[] = [
            (node): void => {
                context.report({ messageId: "noExportAll", node });
            },
            (node): void => {
                onNamespaceImport(context, node);
            },
        ];
        const listeners: Rule.RuleListener = {};
        SELECTORS.forEach((selector, i) => {
            listeners[selector] = handlers[i];
        });
        return listeners;
    },

    meta: {
        docs: {
            description:
                "Ban wildcard exports (export *) and relative-source namespace imports (import * as ns from './...') in workspace packages — the barrel must enumerate every public symbol and every in-package import must name what it consumes. Bare third-party namespace imports are exempt.",
        },
        messages: { noExportAll: EXPORT_ALL_MESSAGE, noNamespaceImport: NAMESPACE_IMPORT_MESSAGE },
        schema: [],
        type: "problem",
    },
} satisfies Rule.RuleModule;
