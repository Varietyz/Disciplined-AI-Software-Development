import { GOVERNED_ROOT, normalizePath } from "../../shared/resolvers/anchor.resolver.ts";
import type { LocalRule, RuleContext, RuleListener } from "../../types/rule.types.ts";
import { isType, nameOf, nodeAt, nodesAt } from "../../shared/selectors/syntax.selector.ts";
import type { AstNode } from "../../types/syntax.types.ts";
import { PLATFORM_PATH_PREFIXES } from "../../shared/manifests/layer.manifest.ts";
import { containerPath } from "../../shared/resolvers/container.resolver.ts";
import { defineCheck } from "@govlab/context/check";
import { listener } from "../../shared/factories/listener.factory.ts";

const PLATFORM_ROOTS = PLATFORM_PATH_PREFIXES.map((prefix) => `/${containerPath(prefix.slice(0, -1), GOVERNED_ROOT)}`);
const VALUES_ACCESSOR = "values";

const isPlatformFile = function isPlatformFile(filename: string): boolean {
    const normalized = normalizePath(filename);
    if (normalized.endsWith(".test.ts")) {
        return false;
    }
    return PLATFORM_ROOTS.some((root) => normalized.includes(root));
};

const callsValues = function callsValues(callExpr: AstNode | null): boolean {
    if (!isType(callExpr, "CallExpression")) {
        return false;
    }
    const callee = nodeAt(callExpr, "callee");
    if (!isType(callee, "MemberExpression")) {
        return false;
    }
    const property = nodeAt(callee, "property");
    return isType(property, "Identifier") && nameOf(property) === VALUES_ACCESSOR;
};

const statementHasReturn = function statementHasReturn(node: AstNode | null): boolean {
    if (node === null) {
        return false;
    }
    if (node.type === "ReturnStatement") {
        return true;
    }
    return node.type === "BlockStatement" && nodesAt(node, "body").some((s) => s.type === "ReturnStatement");
};

const bodyHasEarlyReturn = function bodyHasEarlyReturn(body: AstNode | null): boolean {
    if (!isType(body, "BlockStatement")) {
        return false;
    }
    return nodesAt(body, "body").some((stmt) => {
        if (stmt.type !== "IfStatement") {
            return false;
        }
        return statementHasReturn(nodeAt(stmt, "consequent")) || statementHasReturn(nodeAt(stmt, "alternate"));
    });
};

export default {
    create(context: RuleContext): RuleListener {
        if (!isPlatformFile(context.filename)) {
            return {};
        }
        return listener({
            forOfStatement(view, node) {
                if (!callsValues(nodeAt(view, "right")) || !bodyHasEarlyReturn(nodeAt(view, "body"))) {
                    return;
                }
                context.report({ messageId: "scan", node });
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({ detects: [], enforces: ["architecture:algorithmic-efficiency"] }),
            description:
                "A linear scan whose only purpose is to find one element by key is banned on a hot substrate. Build a keyed secondary index and look up in constant time.",
        },
        messages: {
            scan: "Linear scan with early return: O(N) where a keyed secondary index is O(1). Build the index alongside the collection and keep it in sync at every site that adds, updates or removes a member.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
