import type { Rule } from "eslint";
import { govlabMeta } from "#core/factories/eslint.factory";

interface TsParam {
    type: string;
    parameter?: { optional?: boolean; typeAnnotation?: { typeAnnotation?: { type: string } } };
}

const isOptionalInjectedDependency = function isOptionalInjectedDependency(param: TsParam): boolean {
    if (param.type !== "TSParameterProperty" || !param.parameter) {
        return false;
    }
    const inner = param.parameter;
    if (inner.optional !== true) {
        return false;
    }
    const annotation = inner.typeAnnotation?.typeAnnotation;
    return annotation?.type === "TSTypeReference";
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
                if (isOptionalInjectedDependency(param) && isRuleNode(param)) {
                    context.report({ messageId: "optionalDependency", node: param });
                }
            }
        };
        const handlers: [string, (node: Rule.Node) => void][] = [
            ["MethodDefinition[kind='constructor']", onConstructor],
        ];
        return Object.fromEntries(handlers);
    },
    meta: govlabMeta({
        canonical: ["mandatory-dependency"],
        description:
            "Disallow an optional injected constructor dependency — mandate mandatory injection so behavior is system-defined",
        messages: {
            optionalDependency:
                "This injected constructor dependency is optional — every use must null-guard it, and the component's behavior silently changes with its presence (caller-defined, not system-defined). Make it mandatory: a required parameter, defaulted to a no-op implementation when absence is genuinely valid.",
        },
        ruleId: "optional_dependency",
    }),
} satisfies Rule.RuleModule;
