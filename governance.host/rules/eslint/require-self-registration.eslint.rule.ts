import type { LocalRule, RuleContext, RuleListener } from "../../types/rule.types.ts";
import { MEMBER_ROOT, basenameOf, normalizePath } from "../../shared/resolvers/anchor.resolver.ts";
import { calleeName, isType, nodeAt, nodesAt } from "../../shared/selectors/syntax.selector.ts";
import { existsSync, readdirSync, statSync } from "node:fs";
import { isExempt, isParsed, parseFilename } from "../../shared/matchers/filename.matcher.ts";
import type { AstNode } from "../../types/syntax.types.ts";
import { defineCheck } from "@govlab/context/check";
import { join } from "node:path";
import { listener } from "../../shared/factories/listener.factory.ts";
import { loadClosureGraph } from "../../shared/loaders/graph.loader.ts";

const BARREL_MARKER = ".barrel.ts";
const INFRASTRUCTURE_CONCERNS = ["registry", "types", "constants", "schema", "ids"];

const barrelFolders = function barrelFolders(): Set<string> {
    const found = new Set<string>();
    const memberPrefix = normalizePath(MEMBER_ROOT);
    const walk = function walk(absDir: string): void {
        for (const name of readdirSync(absDir)) {
            const p = join(absDir, name);
            if (statSync(p).isDirectory()) {
                walk(p);
                continue;
            }
            if (name.endsWith(BARREL_MARKER)) {
                found.add(`${normalizePath(absDir).slice(memberPrefix.length + 1)}/`);
            }
        }
    };
    if (existsSync(MEMBER_ROOT)) {
        walk(MEMBER_ROOT);
    }
    return found;
};

const deriveSurfaces = function deriveSurfaces(): Map<string, string> {
    const folders = barrelFolders();
    const tally = new Map<string, Map<string, number>>();
    const graph = loadClosureGraph();
    for (const row of graph === null ? [] : graph.registers) {
        const dir = row.file.slice(0, row.file.lastIndexOf("/") + 1);
        if (!folders.has(dir)) {
            continue;
        }
        const counts = tally.get(dir) ?? new Map<string, number>();
        counts.set(row.fn, (counts.get(row.fn) ?? 0) + 1);
        tally.set(dir, counts);
    }
    const surfaces = new Map<string, string>();
    for (const [dir, counts] of tally) {
        const [winner] = [...counts].toSorted((a, b) => b[1] - a[1]);
        if (winner !== undefined) {
            surfaces.set(dir, winner[0]);
        }
    }
    return surfaces;
};

const SURFACES = deriveSurfaces();

const isVariantFile = function isVariantFile(basename: string): boolean {
    if (basename.endsWith(BARREL_MARKER)) {
        return false;
    }
    const parsed = parseFilename(basename);
    if (isExempt(parsed)) {
        return false;
    }
    if (isParsed(parsed)) {
        return !INFRASTRUCTURE_CONCERNS.includes(parsed.concern);
    }
    return !INFRASTRUCTURE_CONCERNS.some((concern) => basename.endsWith(`.${concern}.ts`));
};

const surfaceFor = function surfaceFor(filename: string): { dir: string; required: string } | null {
    const norm = normalizePath(filename);
    if (!isVariantFile(basenameOf(norm))) {
        return null;
    }
    for (const [dir, required] of SURFACES) {
        if (norm.includes(`/${dir}`)) {
            return { dir, required };
        }
    }
    return null;
};

const isTopLevelCallTo = function isTopLevelCallTo(statement: AstNode, name: string): boolean {
    if (statement.type !== "ExpressionStatement") {
        return false;
    }
    const expression = nodeAt(statement, "expression");
    return isType(expression, "CallExpression") && calleeName(expression) === name;
};

export default {
    create(context: RuleContext): RuleListener {
        const surface = surfaceFor(context.filename);
        if (surface === null) {
            return {};
        }
        return listener({
            program(view, node) {
                if (nodesAt(view, "body").some((stmt) => isTopLevelCallTo(stmt, surface.required))) {
                    return;
                }
                const payload = {
                    basename: basenameOf(context.filename),
                    dir: surface.dir,
                    required: surface.required,
                };
                context.report({ data: payload, messageId: "missing", node });
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({
                detects: [],
                enforces: ["architecture:registry-pattern", "architecture:open-closed"],
            }),
            description:
                "Every variant file in a self-registration surface must call that surface's register function at module top level. The surfaces are DERIVED, never listed: a folder holding a glob barrel is a glob-discovered variant surface, and the register function it requires is read from the closure graph's register call sites in that folder. A folder whose barrel globs elsewhere records no register call of its own and is not a surface. Infrastructure files — registry, types, constants, schemas, and the barrel itself — are excluded.",
        },
        messages: {
            missing:
                "File '{{basename}}' sits in self-registration surface '{{dir}}' but does not call '{{required}}(...)' at module top level. Call it, or — if the file is infrastructure for the folder rather than a variant — give it the concern it plays: registry, types, constants or schemas.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
