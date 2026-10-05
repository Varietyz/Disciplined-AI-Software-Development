import { FOUNDATION_FOLDER, TEST_ROOT_SEGMENT, normalizePath } from "../../shared/resolvers/anchor.resolver.ts";
import type { LocalRule, RuleContext, RuleListener } from "../../types/rule.types.ts";
import { isType, locOf, nameOf, nodeAt, nodesAt } from "../../shared/selectors/syntax.selector.ts";
import type { AstNode } from "../../types/syntax.types.ts";
import { defineCheck } from "@govlab/context/check";
import { listener } from "../../shared/factories/listener.factory.ts";

const ALLOWED_BUILTIN_CONSTRUCTORS = new Set([
    "Map",
    "Set",
    "WeakMap",
    "WeakSet",
    "Date",
    "Array",
    "RegExp",
    "Error",
    "TypeError",
    "RangeError",
    "URL",
    "URLSearchParams",
    "Promise",
    "Uint8Array",
    "Uint16Array",
    "Uint32Array",
    "Int8Array",
    "Int16Array",
    "Int32Array",
    "Float32Array",
    "Float64Array",
    "ArrayBuffer",
    "DataView",
]);

const TEST_SUFFIXES = [".test.ts", ".spec.ts"];

const isExemptFile = function isExemptFile(filename: string): boolean {
    const norm = normalizePath(filename);
    if (norm.includes(FOUNDATION_FOLDER) || norm.includes(TEST_ROOT_SEGMENT)) {
        return true;
    }
    return TEST_SUFFIXES.some((suffix) => norm.endsWith(suffix));
};

const constructorNameOf = function constructorNameOf(newExpr: AstNode): string {
    const callee = nodeAt(newExpr, "callee");
    if (callee === null) {
        return "";
    }
    if (callee.type === "Identifier") {
        return nameOf(callee);
    }
    if (callee.type !== "MemberExpression") {
        return "";
    }
    const property = nodeAt(callee, "property");
    return isType(property, "Identifier") ? nameOf(property) : "";
};

export default {
    create(context: RuleContext): RuleListener {
        if (isExemptFile(context.filename)) {
            return {};
        }
        return listener({
            exportNamedDeclaration(view) {
                const declaration = nodeAt(view, "declaration");
                if (!isType(declaration, "VariableDeclaration")) {
                    return;
                }
                const singletons = nodesAt(declaration, "declarations").filter((decl) => {
                    const init = nodeAt(decl, "init");
                    if (init === null || !isType(init, "NewExpression")) {
                        return false;
                    }
                    const ctor = constructorNameOf(init);
                    return ctor !== "" && !ALLOWED_BUILTIN_CONSTRUCTORS.has(ctor);
                });
                for (const decl of singletons) {
                    const init = nodeAt(decl, "init");
                    const id = nodeAt(decl, "id");
                    const name = isType(id, "Identifier") ? nameOf(id) : "<destructured>";
                    const payload = { ctor: init === null ? "" : constructorNameOf(init), name };
                    context.report({ data: payload, loc: locOf(decl), messageId: "moduleSingleton" });
                }
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({
                detects: ["architecture:shared-mutable-state"],
                enforces: ["architecture:state-isolation"],
            }),
            description:
                "Bans an exported module-scope construction. Its lifetime is the bundle: it cannot be reset between runs, every consumer silently shares one instance, and nothing can substitute it under test. Keep the instance non-exported inside the module that owns it, or construct it once at composition and hand it to each consumer. Built-in containers and foundational folder files are exempt, and a NON-exported module-scope instance encapsulated inside a registry module is allowed.",
        },
        messages: {
            moduleSingleton:
                "`export const {{ name }} = new {{ ctor }}(...)` is a module-scope singleton — one instance for the whole bundle, constructed at import time, resettable by nobody and untestable in isolation. Keep the construction non-exported inside the module that owns it, or construct it once at composition and pass it to each consumer so every consumer gets its own. A non-exported module-scope instance encapsulated behind a registry is still allowed.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
