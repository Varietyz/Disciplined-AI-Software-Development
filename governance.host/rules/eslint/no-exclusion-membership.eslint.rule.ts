import {
    DERIVING_METHODS,
    MARKER_SOURCE_CALLEES,
    MARKER_SOURCE_NAMES,
    MEMBERSHIP_METHODS,
} from "../../shared/manifests/exclusions.manifest.ts";
import type { LocalRule, RuleContext, RuleListener } from "../../types/rule.types.ts";
import {
    argumentAt,
    calleeName,
    isType,
    locOf,
    nameOf,
    nodeAt,
    nodesAt,
} from "../../shared/selectors/syntax.selector.ts";
import type { AstNode } from "../../types/syntax.types.ts";
import { defineCheck } from "@govlab/context/check";
import { listener } from "../../shared/factories/listener.factory.ts";

const SET_CONSTRUCTOR = "Set";

const isMarkerSource = function isMarkerSource(node: AstNode): boolean {
    if (isType(node, "Identifier")) {
        return MARKER_SOURCE_NAMES.has(nameOf(node));
    }
    return isType(node, "CallExpression") && MARKER_SOURCE_CALLEES.has(calleeName(node));
};

const derivedFrom = function derivedFrom(node: AstNode): AstNode | null {
    const callee = nodeAt(node, "callee");
    const derives = isType(callee, "MemberExpression") && DERIVING_METHODS.has(calleeName(node));
    return derives ? nodeAt(callee, "object") : null;
};

const holdsMarkers = function holdsMarkers(node: AstNode | null, bound: ReadonlySet<string>): boolean {
    if (node === null) {
        return false;
    }
    if (isMarkerSource(node)) {
        return true;
    }
    switch (node.type) {
        case "Identifier": {
            return bound.has(nameOf(node));
        }
        case "AwaitExpression":
        case "SpreadElement": {
            return holdsMarkers(nodeAt(node, "argument"), bound);
        }
        case "ArrayExpression": {
            return nodesAt(node, "elements").some((element) => holdsMarkers(element, bound));
        }
        case "NewExpression": {
            return nameOf(nodeAt(node, "callee")) === SET_CONSTRUCTOR && holdsMarkers(argumentAt(node, 0), bound);
        }
        case "CallExpression": {
            return holdsMarkers(derivedFrom(node), bound);
        }
        default: {
            return false;
        }
    }
};

export default {
    create(context: RuleContext): RuleListener {
        const bound = new Set<string>();
        return listener({
            callExpression(view) {
                const callee = nodeAt(view, "callee");
                if (!isType(callee, "MemberExpression") || !MEMBERSHIP_METHODS.has(calleeName(view))) {
                    return;
                }
                if (holdsMarkers(nodeAt(callee, "object"), bound)) {
                    context.report({ data: { method: calleeName(view) }, loc: locOf(view), messageId: "membership" });
                }
            },
            newExpression(view) {
                if (nameOf(nodeAt(view, "callee")) === SET_CONSTRUCTOR && holdsMarkers(argumentAt(view, 0), bound)) {
                    context.report({ loc: locOf(view), messageId: "markerSet" });
                }
            },
            variableDeclarator(view) {
                const id = nodeAt(view, "id");
                if (isType(id, "Identifier") && holdsMarkers(nodeAt(view, "init"), bound)) {
                    bound.add(nameOf(id));
                }
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({ detects: [], enforces: ["architecture:single-source-of-truth"] }),
            description:
                "An exclusion marker is a folder name, a path under the workspace root or a wildcard. A walker that tests an entry name against the marker list honors only the first form, so a path marker or a wildcard marker never prunes anything and the walk reads what the configuration excludes. The rule refuses a membership method called on the marker list, on a binding that holds it, or on a list derived from it, and a set built from it. The marker list stays legal as an argument, for the path matcher and for the ignore flags a tool receives.",
            workspaceWide: true,
        },
        messages: {
            markerSet:
                "A set is built from the exclusion markers, so a later lookup matches an entry name only and misses path and wildcard markers. Test each path relative to the workspace root with the exclusion matcher instead.",
            membership:
                "`{{ method }}` tests a value against the exclusion markers, which matches a folder name only and misses path and wildcard markers. Test the path relative to the workspace root with the exclusion matcher instead.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
