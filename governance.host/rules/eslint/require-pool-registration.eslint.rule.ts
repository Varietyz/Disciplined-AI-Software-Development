import type { LocalRule, RuleContext, RuleListener } from "../../types/rule.types.ts";
import { PROJECT_ROOT, normalizePath, projectDirs } from "../../shared/resolvers/anchor.resolver.ts";
import { calleeName, isType, locOf, nameOf, nodeAt, nodesAt } from "../../shared/selectors/syntax.selector.ts";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import type { AstNode } from "../../types/syntax.types.ts";
import { concernFolders } from "../../shared/resolvers/container.resolver.ts";
import { defineCheck } from "@govlab/context/check";
import { isIdentifierChar } from "@govlab/constants";
import { join } from "node:path";
import { listener } from "../../shared/factories/listener.factory.ts";

const REGISTER_CALL_NAME = "registerPool";
const POOLED_CONCERNS = ["cache", "pool"];
const CLASS_EXPORT = "export class ";

const identifierEnd = function identifierEnd(text: string): number {
    for (let at = 0; at < text.length; at += 1) {
        if (!isIdentifierChar(text[at] ?? "")) {
            return at;
        }
    }
    return -1;
};

const primitiveDirs = function primitiveDirs(): string[] {
    const dirs: string[] = [];
    for (const tag of POOLED_CONCERNS) {
        for (const folder of concernFolders(tag, projectDirs())) {
            const abs = join(PROJECT_ROOT, folder);
            if (existsSync(abs) && !dirs.includes(abs)) {
                dirs.push(abs);
            }
        }
    }
    return dirs;
};

const derivePrimitives = function derivePrimitives(): { basenames: Set<string>; ctors: Set<string> } {
    const ctors = new Set<string>();
    const basenames = new Set<string>();
    for (const dir of primitiveDirs()) {
        for (const name of readdirSync(dir)) {
            if (!name.endsWith(".ts")) {
                continue;
            }
            basenames.add(name);
            const text = readFileSync(join(dir, name), "utf8");
            let at = text.indexOf(CLASS_EXPORT);
            while (at !== -1) {
                const rest = text.slice(at + CLASS_EXPORT.length);
                const end = identifierEnd(rest);
                ctors.add(end === -1 ? rest : rest.slice(0, end));
                at = text.indexOf(CLASS_EXPORT, at + 1);
            }
        }
    }
    return { basenames, ctors };
};

const { basenames: ALLOWED_BASENAMES, ctors: POOL_CONSTRUCTORS } = derivePrimitives();

const basenameOf = function basenameOf(path: string): string {
    const norm = normalizePath(path);
    const idx = norm.lastIndexOf("/");
    return idx === -1 ? norm : norm.slice(idx + 1);
};

const isAllowedFile = function isAllowedFile(filename: string): boolean {
    const norm = normalizePath(filename);
    return norm.endsWith(".test.ts") || ALLOWED_BASENAMES.has(basenameOf(norm));
};

const poolConstructorName = function poolConstructorName(node: AstNode | null): string {
    if (!isType(node, "NewExpression")) {
        return "";
    }
    const callee = nodeAt(node, "callee");
    if (!isType(callee, "Identifier")) {
        return "";
    }
    const name = nameOf(callee);
    return POOL_CONSTRUCTORS.has(name) ? name : "";
};

const topLevelPoolConstructions = function topLevelPoolConstructions(
    program: AstNode,
): { ctor: string; node: AstNode }[] {
    const found: { ctor: string; node: AstNode }[] = [];
    for (const stmt of nodesAt(program, "body")) {
        const candidates =
            stmt.type === "VariableDeclaration"
                ? nodesAt(stmt, "declarations").map((decl) => nodeAt(decl, "init"))
                : [stmt.type === "ExpressionStatement" ? nodeAt(stmt, "expression") : null];
        for (const candidate of candidates) {
            const ctor = poolConstructorName(candidate);
            if (ctor !== "" && candidate !== null) {
                found.push({ ctor, node: candidate });
            }
        }
    }
    return found;
};

const hasRegisterPoolCall = function hasRegisterPoolCall(program: AstNode): boolean {
    return nodesAt(program, "body").some((stmt) => {
        if (stmt.type !== "ExpressionStatement") {
            return false;
        }
        const expression = nodeAt(stmt, "expression");
        return isType(expression, "CallExpression") && calleeName(expression) === REGISTER_CALL_NAME;
    });
};

export default {
    create(context: RuleContext): RuleListener {
        if (isAllowedFile(context.filename)) {
            return {};
        }
        return listener({
            program(view) {
                const constructions = topLevelPoolConstructions(view);
                if (constructions.length === 0 || hasRegisterPoolCall(view)) {
                    return;
                }
                for (const hit of constructions) {
                    const payload = { ctor: hit.ctor, required: "{id, kind, handle}" };
                    context.report({ data: payload, loc: locOf(hit.node), messageId: "unregistered" });
                }
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({ detects: [], enforces: ["architecture:registry-pattern"] }),
            description:
                "Module-top-level cache/pool constructions must be paired with a registerPool(...) call so the pool is visible in the pool registry.",
        },
        messages: {
            unregistered:
                "Module-top-level 'new {{ctor}}(...)' must be paired with a 'registerPool({{required}})' call in the same module so the pool is discoverable via the pool registry.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
