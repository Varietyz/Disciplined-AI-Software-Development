import type { LocalRule, RuleContext, RuleListener } from "../../types/rule.types.ts";
import { isType, nameOf, nodeAt } from "../../shared/selectors/syntax.selector.ts";
import type { AstNode } from "../../types/syntax.types.ts";
import { basenameOf } from "../../shared/resolvers/anchor.resolver.ts";
import { concernSuffix } from "../../shared/manifests/taxonomy.manifest.ts";
import { defineCheck } from "@govlab/context/check";
import { listener } from "../../shared/factories/listener.factory.ts";
import { suffixAfterVerb } from "../../shared/manifests/verb.manifest.ts";

const REGISTER_VERB = "register";
const REGISTRY_FILE_SUFFIXES = [concernSuffix("registry")];
const EXEMPT_BASENAME_SUFFIXES = [".test.ts", ".spec.ts"];
const EXPORT_PARENTS = new Set(["ExportNamedDeclaration", "ExportDefaultDeclaration"]);

const isSkippedFile = function isSkippedFile(filename: string): boolean {
    const basename = basenameOf(filename);
    if (REGISTRY_FILE_SUFFIXES.some((suffix) => basename.endsWith(suffix))) {
        return true;
    }
    return EXEMPT_BASENAME_SUFFIXES.some((suffix) => basename.endsWith(suffix));
};

const isExportedFunction = function isExportedFunction(node: AstNode): boolean {
    const parent = nodeAt(node, "parent");
    return parent !== null && EXPORT_PARENTS.has(parent.type);
};

export default {
    create(context: RuleContext): RuleListener {
        if (isSkippedFile(context.filename)) {
            return {};
        }
        return listener({
            functionDeclaration(view, node) {
                const id = nodeAt(view, "id");
                if (!isExportedFunction(view) || !isType(id, "Identifier")) {
                    return;
                }
                const name = nameOf(id);
                const suffix = suffixAfterVerb(name, REGISTER_VERB);
                if (suffix === null) {
                    return;
                }
                context.report({ data: { name, suffix }, messageId: "reservedVerb", node });
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({ detects: [], enforces: ["architecture:intent-revealing-interface"] }),
            description:
                "The `register*` verb is reserved for module-scope dispatch-table operations — functions that mutate a shared registry. A function that attaches a callback to one specific instance is doing something else, and naming it `register*` makes the two indistinguishable to every tool that finds registrations by that verb. Instance-scoped attachment uses `subscribe*` / `add*` / `track*` / `attach*` instead.",
        },
        messages: {
            reservedVerb:
                "Function `{{ name }}` uses the `register*` prefix but is declared outside a *.registry.ts file. The `register*` verb is reserved for dispatch-table registrations. Rename to `subscribe{{ suffix }}` / `track{{ suffix }}` / `attach{{ suffix }}` depending on the operation's semantics.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
