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
import { absolutePath } from "@ssot/paths";
import { defineCheck } from "@govlab/context/check";
import { listener } from "../../shared/factories/listener.factory.ts";
import { normalizePath } from "../../shared/resolvers/anchor.resolver.ts";

const EXCLUSION_NAME_PARTS = ["skip", "ignore", "prune", "exclude", "runtime_root", "runtimeroot"];
const SSOT_CALLEES = new Set([
    "masterExcludeMarkers",
    "masterExclude",
    "withMasterExclude",
    "relativePath",
    "absolutePath",
]);
const INFRASTRUCTURE_HINTS = [
    "node_modules",
    "dist",
    "build",
    "coverage",
    "target",
    ".git",
    ".cache",
    ".vite",
    ".registry",
    ".vscode",
    ".next",
    ".tmp",
];
const MASTER_LIST_OWNER = normalizePath(absolutePath("govlabHost.config"));

const isExemptFile = function isExemptFile(filename: string): boolean {
    return normalizePath(filename) === MASTER_LIST_OWNER;
};

const namesAnExclusion = function namesAnExclusion(name: string): boolean {
    const lowered = name.toLowerCase();
    return EXCLUSION_NAME_PARTS.some((part) => lowered.includes(part));
};

const literalsIn = function literalsIn(element: AstNode): string[] {
    const literal = literalString(element);
    if (literal !== null) {
        return [literal];
    }
    if (element.type !== "TemplateLiteral") {
        return [];
    }
    return nodesAt(element, "quasis")
        .map((quasi) => stringIn(recordAt(quasi, "value"), "cooked"))
        .filter((cooked) => cooked.trim().length > 0);
};

const literalsOf = function literalsOf(node: AstNode | null): string[] {
    return nodesAt(node, "elements").flatMap(literalsIn);
};

const holdsSsotCall = function holdsSsotCall(node: AstNode | null): boolean {
    return nodesAt(node, "elements").some((element) => {
        const inner = element.type === "SpreadElement" ? nodeAt(element, "argument") : element;
        return isType(inner, "CallExpression") && SSOT_CALLEES.has(calleeName(inner));
    });
};

const WRAPPERS = new Set(["NewExpression", "CallExpression"]);

const arrayOf = function arrayOf(init: AstNode | null): AstNode | null {
    if (init === null) {
        return null;
    }
    if (init.type === "ArrayExpression") {
        return init;
    }
    return WRAPPERS.has(init.type) ? argumentAt(init, 0) : null;
};

export default {
    create(context: RuleContext): RuleListener {
        if (isExemptFile(context.filename)) {
            return {};
        }
        return listener({
            variableDeclarator(view) {
                const id = nodeAt(view, "id");
                const name = isType(id, "Identifier") ? nameOf(id) : "";
                if (name === "" || !namesAnExclusion(name)) {
                    return;
                }
                const array = arrayOf(nodeAt(view, "init"));
                if (array === null) {
                    return;
                }
                const first = literalsOf(array).find((value) =>
                    INFRASTRUCTURE_HINTS.some((hint) => value.includes(hint)),
                );
                if (first === undefined) {
                    return;
                }
                const payload = { name, value: first };
                if (holdsSsotCall(array)) {
                    context.report({ data: payload, loc: locOf(view), messageId: "partialExclusion" });
                } else {
                    context.report({ data: payload, loc: locOf(view), messageId: "hardcodedExclusion" });
                }
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({
                detects: ["architecture:hardcoded-configuration"],
                enforces: ["architecture:single-source-of-truth"],
            }),
            description:
                "An exclusion set is declared once, in the quality config, and reached through the master-exclude surface. A list spelled in source drifts from that one silently, and every tool then walks a slightly different tree — which is how a directory ends up skipped by one check and scanned by another. A genuinely tool-specific exclusion is declared under the tool's key in the config and requested by name, so the addition is still data rather than code.",
            workspaceWide: true,
        },
        messages: {
            hardcodedExclusion:
                "`{{ name }}` spells its own exclusion set — `{{ value }}`. Take it from the master exclude surface, and declare any tool-specific addition under that tool's key in the quality config.",
            partialExclusion:
                "`{{ name }}` reads the master exclude surface and then appends `{{ value }}` in source. The appended entry is invisible to every other tool — declare it under this tool's key in the quality config instead.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
