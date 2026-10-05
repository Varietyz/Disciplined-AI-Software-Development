import type { Rule } from "eslint";
import { govlabMeta } from "#core/factories/eslint.factory";

interface TsParam {
    type: string;
    parameter?: TsParam;
    typeAnnotation?: { typeAnnotation?: { type: string } };
}

const paramTypeNode = function paramTypeNode(param: TsParam): { type: string } | undefined {
    const inner = param.type === "TSParameterProperty" && param.parameter ? param.parameter : param;
    return inner.typeAnnotation?.typeAnnotation;
};

const isCallbackParam = function isCallbackParam(param: TsParam): boolean {
    const annotation = paramTypeNode(param);
    return annotation?.type === "TSFunctionType";
};

const isRecord = function isRecord(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === "object";
};

const isRuleNode = function isRuleNode(value: unknown): value is Rule.Node {
    return value !== null && typeof value === "object" && "type" in value;
};

const isTsParam = function isTsParam(value: unknown): value is TsParam {
    return isRecord(value) && typeof value["type"] === "string";
};

const paramsOf = function paramsOf(node: unknown): TsParam[] {
    if (!isRecord(node) || !isRecord(node["value"])) {
        return [];
    }
    const { params } = node["value"];
    return Array.isArray(params) ? params.filter(isTsParam) : [];
};

export default {
    create(context: Rule.RuleContext): Rule.RuleListener {
        const onConstructor = (node: Rule.Node): void => {
            for (const param of paramsOf(node)) {
                if (isCallbackParam(param) && isRuleNode(param)) {
                    context.report({ messageId: "constructorCallback", node: param });
                }
            }
        };
        const handlers: [string, (node: Rule.Node) => void][] = [
            ["MethodDefinition[kind='constructor']", onConstructor],
        ];
        return Object.fromEntries(handlers);
    },
    meta: govlabMeta({
        canonical: ["event-emission"],
        description:
            "Disallow a function-typed constructor parameter — mandate event emission over a parent-supplied callback",
        messages: {
            constructorCallback:
                "This constructor takes a callback parameter — the component holds a reference to a parent that must supply the reaction (tight coupling). Emit an event instead (an event sink the component owns) and let consumers subscribe, so the producer announces facts without knowing who reacts.",
        },
        ruleId: "constructor_callback",
    }),
} satisfies Rule.RuleModule;
