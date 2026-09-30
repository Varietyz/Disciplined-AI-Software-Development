import type { LocalRule, RuleContext, RuleListener, RuleNode } from "../../types/rule.types.ts";
import {
    anchoredBySsot,
    isMemberPathsSource,
    isModuleSpecifier,
    isPathShaped,
    isProseContext,
    isSsotExemptFile,
} from "../../shared/predicates/location.predicate.ts";
import {
    argumentAt,
    calleeName,
    isType,
    literalString,
    nameOf,
    nodeAt,
    nodesAt,
} from "../../shared/selectors/syntax.selector.ts";
import {
    boundNameOf,
    composedKeyOf,
    cookedOf,
    depthBelowPackage,
    holdsMeta,
    isFileDir,
    isMetaClimb,
    staticTargetOf,
} from "../../shared/analyzers/location.analyzer.ts";
import { collapsePath, normalizePath } from "../../shared/resolvers/anchor.resolver.ts";
import { composedTokenOf, foldSegments } from "../../shared/analyzers/segment.analyzer.ts";
import type { AstNode } from "../../types/syntax.types.ts";
import { defineCheck } from "@govlab/context/check";
import { existsSync } from "node:fs";
import { listener } from "../../shared/factories/listener.factory.ts";
import { tokenIn } from "../../shared/registries/location.registry.ts";

const SSOT_MODULE = "@ssot/paths";

const WRITE_CALLEES = new Set(["cpSync", "mkdir", "mkdirSync", "renameSync", "writeFile", "writeFileSync"]);

interface PendingTarget {
    boundTo: string | null;
    node: RuleNode;
    target: string;
}

export default {
    create(context: RuleContext): RuleListener {
        const { filename } = context;
        if (isSsotExemptFile(filename)) {
            return {};
        }
        const depth = depthBelowPackage(filename);
        const posixFile = normalizePath(filename);
        const fromDir = posixFile.slice(0, posixFile.lastIndexOf("/"));
        const metaNames = new Set<string>();
        const dirNames = new Set<string>();
        const writtenNames = new Set<string>();
        const pendingTargets: PendingTarget[] = [];
        const constSegments = new Map<string, string[]>();
        const ssotNames = new Set<string>();
        const viaSsot = function viaSsot(node: AstNode): boolean {
            const parent = nodeAt(node, "parent");
            return isType(parent, "CallExpression") && ssotNames.has(calleeName(parent));
        };
        const reportPending = function reportPending(_view: AstNode): void {
            for (const pending of pendingTargets) {
                if (pending.boundTo !== null && writtenNames.has(pending.boundTo)) {
                    continue;
                }
                const target = collapsePath(pending.target);
                if (!existsSync(target)) {
                    context.report({ data: { target }, messageId: "metaMissing", node: pending.node });
                }
            }
        };
        return listener(
            {
                callExpression(view, node) {
                    if (ssotNames.has(calleeName(view))) {
                        return;
                    }
                    if (WRITE_CALLEES.has(calleeName(view))) {
                        const first = argumentAt(view, 0);
                        if (isType(first, "Identifier")) {
                            writtenNames.add(nameOf(first));
                        }
                    }
                    if (isMetaClimb(view, metaNames, depth)) {
                        context.report({ messageId: "metaClimb", node });
                        return;
                    }
                    const segmented = composedTokenOf(view, constSegments);
                    if (segmented !== null) {
                        context.report({ data: { token: segmented }, messageId: "segmentedLocation", node });
                        return;
                    }
                    const target = staticTargetOf(view, dirNames, fromDir);
                    if (target !== null) {
                        pendingTargets.push({ boundTo: boundNameOf(view), node, target });
                    }
                },
                importDeclaration(view) {
                    const source = literalString(nodeAt(view, "source")) ?? "";
                    if (source !== SSOT_MODULE && !isMemberPathsSource(fromDir, source)) {
                        return;
                    }
                    for (const spec of nodesAt(view, "specifiers")) {
                        const local = nodeAt(spec, "local");
                        if (isType(local, "Identifier")) {
                            ssotNames.add(nameOf(local));
                        }
                    }
                },
                literal(view, node) {
                    const value = literalString(view);
                    if (value === null || isModuleSpecifier(view) || viaSsot(view) || isProseContext(view)) {
                        return;
                    }
                    const token = tokenIn(value);
                    if (token !== null) {
                        context.report({ data: { token }, messageId: "hardcodedLocation", node });
                        return;
                    }
                    if (isPathShaped(value) && !anchoredBySsot(view, ssotNames)) {
                        context.report({ data: { value }, messageId: "unanchoredPath", node });
                    }
                },
                templateElement(view, node) {
                    const cooked = cookedOf(view);
                    if (cooked.length === 0 || isProseContext(view)) {
                        return;
                    }
                    const composed = composedKeyOf(view, ssotNames);
                    if (composed !== null) {
                        context.report({
                            data: { key: composed.key, tail: composed.tail },
                            messageId: "composedKey",
                            node,
                        });
                        return;
                    }
                    const token = tokenIn(cooked);
                    if (token !== null) {
                        context.report({ data: { token }, messageId: "hardcodedLocation", node });
                    }
                },
                variableDeclarator(view) {
                    const id = nodeAt(view, "id");
                    if (!isType(id, "Identifier")) {
                        return;
                    }
                    const name = nameOf(id);
                    const init = nodeAt(view, "init");
                    if (holdsMeta(init)) {
                        metaNames.add(name);
                    }
                    if (isFileDir(init, dirNames)) {
                        dirNames.add(name);
                    }
                    const folded = foldSegments(init, constSegments);
                    if (folded !== null) {
                        constSegments.set(name, folded);
                    }
                },
            },
            reportPending,
        );
    },
    meta: {
        docs: {
            checks: defineCheck({
                detects: ["architecture:hardcoded-configuration"],
                enforces: ["architecture:single-source-of-truth"],
            }),
            description:
                "Every workspace location comes from the paths SSOT. A file may not hardcode a member directory in a path-forming position, and may not derive a root by climbing from its own location with import.meta — file-relative arithmetic silently resolves inside the wrong package the moment anything moves, and a hardcoded member name goes stale without failing. Import `@ssot/paths` and call `relativePath(key)` / `absolutePath(key)`, adding the key to paths.yaml when it is missing. A self-governed member anchors through the paths config its manifest declares.",
            workspaceWide: true,
        },
        messages: {
            composedKey:
                'This appends `{{ tail }}` to an SSOT lookup to rebuild a location the SSOT already declares as `{{ key }}`. Hand-composing splits one declared fact across a call and a literal, so the container stops being renameable from its declaration. Use `relativePath("{{ key }}")` / `absolutePath("{{ key }}")`.',
            hardcodedLocation:
                "`{{ token }}` is a workspace location owned by the paths SSOT — hardcoding it here goes stale silently when the tree moves. Use `relativePath(key)` or `absolutePath(key)` from `@ssot/paths` with the key that declares `{{ token }}`, adding the key to `project.paths/paths.yaml` if it has none.",
            metaClimb:
                "This climbs out of its own package from `import.meta`, so it resolves relative to THIS file and silently points into the wrong package once either end moves. Climbing inside the package is fine; escaping it is not — resolve the other package through `@ssot/paths`.",
            metaMissing:
                "This resolves from `import.meta` to `{{ target }}`, which does not exist — file-relative arithmetic followed the file instead of the target when one of them moved. Resolve the location through `@ssot/paths` so it is a declared key rather than a hop count.",
            segmentedLocation:
                "These segments concatenate to `{{ token }}`, a location owned by the paths SSOT — split across arguments no single literal spells it, so the hardcode passes every per-string check and still goes stale when the tree moves. Resolve it in one call through `@ssot/paths`.",
            unanchoredPath:
                "`{{ value }}` is a path spelled from nothing — it names a location without an anchor the SSOT owns, so no rename can follow it and nothing fails when it goes stale. Anchor it: build the path from `relativePath(key)` / `absolutePath(key)` and keep only the tail as a literal, adding the key to `project.paths/paths.yaml` when the location has none.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
