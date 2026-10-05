import { LOOKUP_VERBS, REGISTER_VERBS, opensWith } from "../../shared/manifests/verb.manifest.ts";
import type { LocalRule, RuleContext, RuleListener } from "../../types/rule.types.ts";
import {
    argumentAt,
    calleeName,
    isType,
    literalString,
    locOf,
    nameOf,
    nodeAt,
    nodesAt,
    recordAt,
    stringIn,
} from "../../shared/selectors/syntax.selector.ts";
import type { AstNode } from "../../types/syntax.types.ts";
import { defineCheck } from "@govlab/context/check";
import { listener } from "../../shared/factories/listener.factory.ts";

const ALLOWED_CONCERNS = ["constants", "schema", "ids"];
const ALLOWED_PATH_SEGMENTS = [".test.", ".spec."];

const basenameOf = function basenameOf(path: string): string {
    const norm = path.split("\\").join("/");
    const idx = norm.lastIndexOf("/");
    return idx === -1 ? norm : norm.slice(idx + 1);
};

const isExemptFile = function isExemptFile(filename: string): boolean {
    const basename = basenameOf(filename);
    if (ALLOWED_CONCERNS.some((concern) => basename.endsWith(`.${concern}.ts`))) {
        return true;
    }
    return ALLOWED_PATH_SEGMENTS.some((segment) => basename.includes(segment));
};

const staticText = function staticText(node: AstNode | null): string | null {
    if (node === null) {
        return null;
    }
    if (node.type === "Literal") {
        return literalString(node);
    }
    if (node.type !== "TemplateLiteral" || nodesAt(node, "expressions").length > 0) {
        return null;
    }
    const [part] = nodesAt(node, "quasis");
    return part === undefined ? "" : stringIn(recordAt(part, "value"), "cooked");
};

const idProperty = function idProperty(objectExpr: AstNode | null): AstNode | null {
    if (!isType(objectExpr, "ObjectExpression")) {
        return null;
    }
    for (const prop of nodesAt(objectExpr, "properties")) {
        if (prop.type !== "Property") {
            continue;
        }
        const key = nodeAt(prop, "key");
        const keyName = isType(key, "Identifier") ? nameOf(key) : literalString(key);
        if (keyName === "id") {
            return nodeAt(prop, "value");
        }
    }
    return null;
};

export default {
    create(context: RuleContext): RuleListener {
        if (isExemptFile(context.filename)) {
            return {};
        }
        return listener({
            callExpression(view) {
                const callee = calleeName(view);
                const first = argumentAt(view, 0);
                if (callee.length === 0 || first === null) {
                    return;
                }
                const isLookup = opensWith(callee, LOOKUP_VERBS);
                if (!isLookup && !opensWith(callee, REGISTER_VERBS)) {
                    return;
                }
                const direct = staticText(first);
                if (direct !== null) {
                    const payload = { callee, value: direct };
                    context.report({ data: payload, loc: locOf(first), messageId: "literalIdArg" });
                    return;
                }
                if (isLookup || isType(first, "Identifier")) {
                    return;
                }
                const idValue = idProperty(first);
                const nested = staticText(idValue);
                if (idValue !== null && nested !== null) {
                    const payload = { callee, value: nested };
                    context.report({ data: payload, loc: locOf(idValue), messageId: "literalIdProperty" });
                }
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({
                detects: ["architecture:stringly-typed-programming"],
                enforces: ["architecture:single-source-of-truth"],
            }),
            description:
                "A registry key written as a bare literal is banned in registration and lookup positions; it comes from the matching id module, which is that registry's symbol table. Which calls are those positions is DERIVED from the verb the callee opens with: a lookup verb takes the id as its first argument, a registration verb takes it as the first argument or as the `id` of the record it is handed.",
        },
        messages: {
            literalIdArg:
                "String literal '{{value}}' as id argument to {{callee}}() — import a const from the matching *.ids.ts file instead.",
            literalIdProperty:
                "String literal '{{value}}' as id field in {{callee}}({...}) — import a const from the matching *.ids.ts file instead.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
