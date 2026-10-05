import {
    fragmentObject,
    identifierName,
    property,
    propertyNames,
    stringArrayValues,
} from "#core/selectors/context.fragment.selector";
import { isArray, isDefineFragmentCall, isRuleNode } from "#core/predicates/context.fragment.predicate";
import type { AstNode } from "#types/context.types";
import type { Rule } from "eslint";
import { walk } from "#core/visitors/context.fragment.visitor";

const REQUIRED = ["id", "concern", "applies", "stable", "order", "params", "body"] as const;

const firstParamName = function firstParamName(body: AstNode | null): string | null {
    if (body === null || (body.type !== "ArrowFunctionExpression" && body.type !== "FunctionExpression")) {
        return null;
    }
    const { params } = body;
    const first = isArray(params) ? params[0] : null;
    return identifierName(first);
};

const accessedParamNames = function accessedParamNames(body: AstNode, paramName: string): Set<string> {
    const names = new Set<string>();
    walk(body, (node) => {
        if (node.type !== "MemberExpression" || node["computed"] === true) {
            return;
        }
        if (identifierName(node["object"]) === paramName) {
            const propName = identifierName(node["property"]);
            if (propName !== null) {
                names.add(propName);
            }
        }
    });
    return names;
};

interface ParamCheck {
    object: AstNode;
    body: AstNode;
    paramName: string;
}

const checkRequired = function checkRequired(context: Rule.RuleContext, object: AstNode, node: Rule.Node): void {
    const present = propertyNames(object);
    const missing = REQUIRED.filter((name) => !present.has(name));
    if (missing.length > 0) {
        context.report({ data: { names: missing.join(", ") }, messageId: "missing", node });
    }
};

const checkParams = function checkParams(context: Rule.RuleContext, pc: ParamCheck): void {
    const declared = new Set(stringArrayValues(property(pc.object, "params")));
    for (const accessed of accessedParamNames(pc.body, pc.paramName)) {
        if (!declared.has(accessed) && isRuleNode(pc.body)) {
            context.report({ data: { param: accessed }, messageId: "undeclared", node: pc.body });
        }
    }
};

const checkFragment = function checkFragment(context: Rule.RuleContext, node: Rule.Node): void {
    if (!isDefineFragmentCall(node)) {
        return;
    }
    const object = fragmentObject(node);
    if (object === null) {
        return;
    }
    checkRequired(context, object, node);
    const body = property(object, "body");
    const paramName = firstParamName(body);
    if (body !== null && paramName !== null) {
        checkParams(context, { body, object, paramName });
    }
};

export default {
    create(context: Rule.RuleContext): Rule.RuleListener {
        return Object.fromEntries([
            [
                "CallExpression",
                (node: Rule.Node): void => {
                    checkFragment(context, node);
                },
            ],
        ]);
    },

    meta: {
        docs: {
            description:
                "Every defineContextFragment must declare id/concern/applies/stable/order/params/body, and its body may reference only params it declared.",
        },
        messages: {
            missing: "defineContextFragment is missing required metadata: {{names}}. [require_fragment_metadata]",
            undeclared:
                "Fragment body reads param '{{param}}' that is not in its declared params array — composeContext only passes declared params, so this renders empty. Add it to params, or remove the read. [require_fragment_metadata]",
        },
        schema: [],
        type: "problem",
    },
} satisfies Rule.RuleModule;
