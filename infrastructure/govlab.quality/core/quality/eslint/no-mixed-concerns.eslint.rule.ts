import {
    API_GLOBALS,
    API_METHODS,
    DOMAIN_LABELS,
    DOM_DOCUMENT_METHODS,
    DOM_MUTATION_METHODS,
    DOM_OBJECTS,
    DOM_PROPERTIES,
    EVENT_METHODS,
    EVENT_OBJECTS,
    STORAGE_OBJECTS,
    TIMER_GLOBALS,
} from "#configuration/constants/concern.domain.constants";
import type { Rule } from "eslint";
import { govlabMeta } from "#core/factories/eslint.factory";

interface AstNode {
    type: string;
    name?: string;
    id?: AstNode;
    key?: AstNode;
    object?: AstNode;
    property?: AstNode;
    callee?: AstNode;
    parent?: AstNode;
}

interface FrameState {
    concerns: Set<string>;
    node: Rule.Node;
}

const DEFAULT_THRESHOLD = 3;

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null;

const isAstNode = (value: unknown): value is AstNode => isRecord(value) && "type" in value;

const asNode = (value: unknown): AstNode | null => (isAstNode(value) ? value : null);

const identName = (node: AstNode | undefined): string | null =>
    node?.type === "Identifier" && typeof node.name === "string" ? node.name : null;

const labelFor = (domain: string): string => DOMAIN_LABELS[domain] ?? domain;

const resolveThreshold = (raw: unknown): number => {
    const threshold = isRecord(raw) ? raw["threshold"] : DEFAULT_THRESHOLD;
    return typeof threshold === "number" ? threshold : DEFAULT_THRESHOLD;
};

const parentName = (parent: AstNode | undefined): string => {
    if (parent?.type === "VariableDeclarator") {
        return identName(parent.id) ?? "<anonymous>";
    }
    if (parent?.type === "MethodDefinition" || parent?.type === "Property") {
        return identName(parent.key) ?? "<anonymous>";
    }
    return "<anonymous>";
};

const functionName = (node: Rule.Node): string => {
    const ast = asNode(node);
    if (ast === null) {
        return "<anonymous>";
    }
    return identName(ast.id) ?? parentName(ast.parent);
};

const isDomConcern = (objName: string | null, propName: string, isCall: boolean): boolean => {
    if (objName !== null && DOM_OBJECTS.has(objName)) {
        return true;
    }
    if (objName === "document" && DOM_DOCUMENT_METHODS.has(propName)) {
        return true;
    }
    if (isCall && DOM_MUTATION_METHODS.has(propName)) {
        return true;
    }
    return DOM_PROPERTIES.has(propName);
};

const isStorageConcern = (objName: string | null, propName: string): boolean => {
    const named = objName !== null && STORAGE_OBJECTS.has(objName);
    return named || (objName === "document" && propName === "cookie");
};

const isEventConcern = (objName: string | null, propName: string, isCall: boolean): boolean => {
    const named = objName !== null && EVENT_OBJECTS.has(objName);
    return named || (isCall && EVENT_METHODS.has(propName));
};

const memberConcern = (objName: string | null, propName: string, isCall: boolean): string | null => {
    if (isDomConcern(objName, propName, isCall)) {
        return "dom";
    }
    if (isStorageConcern(objName, propName)) {
        return "storage";
    }
    if (isEventConcern(objName, propName, isCall)) {
        return "events";
    }
    return isCall && API_METHODS.has(propName) ? "api" : null;
};

const addConcern = (stack: FrameState[], domain: string): void => {
    const top = stack.at(-1);
    if (top) {
        top.concerns.add(domain);
    }
};

const classifyMember = (node: AstNode, stack: FrameState[]): void => {
    const propName = identName(node.property);
    if (propName === null) {
        return;
    }
    const isCall = node.parent?.type === "CallExpression" && node.parent.callee === node;
    const concern = memberConcern(identName(node.object), propName, isCall);
    if (concern !== null) {
        addConcern(stack, concern);
    }
};

const reportFrame = (context: Rule.RuleContext, frame: FrameState | undefined, threshold: number): void => {
    if (!frame || frame.concerns.size < threshold) {
        return;
    }
    const domains = [...frame.concerns].map((domain) => labelFor(domain)).join(", ");
    context.report({
        data: { count: String(frame.concerns.size), domains, name: functionName(frame.node) },
        messageId: "mixedConcerns",
        node: frame.node,
    });
};

const onCallNode = (stack: FrameState[], node: Rule.Node): void => {
    const name = stack.length > 0 ? identName(asNode(node)?.callee) : null;
    if (name === null) {
        return;
    }
    if (API_GLOBALS.has(name)) {
        addConcern(stack, "api");
        return;
    }
    if (TIMER_GLOBALS.has(name)) {
        addConcern(stack, "timer");
    }
};

const onMemberNode = (stack: FrameState[], node: Rule.Node): void => {
    const member = stack.length > 0 ? asNode(node) : null;
    if (member !== null) {
        classifyMember(member, stack);
    }
};

const onNewNode = (stack: FrameState[], node: Rule.Node): void => {
    if (stack.length > 0 && identName(asNode(node)?.callee) === "XMLHttpRequest") {
        addConcern(stack, "api");
    }
};

const buildListeners = (context: Rule.RuleContext, threshold: number): Rule.RuleListener => {
    const stack: FrameState[] = [];
    const enter = (node: Rule.Node): void => {
        stack.push({ concerns: new Set(), node });
    };
    const exit = (): void => {
        reportFrame(context, stack.pop(), threshold);
    };
    const onCall = onCallNode.bind(null, stack);
    const onMember = onMemberNode.bind(null, stack);
    const onNew = onNewNode.bind(null, stack);
    const handlers: [string, (node: Rule.Node) => void][] = [
        ["ArrowFunctionExpression", enter],
        ["ArrowFunctionExpression:exit", exit],
        ["CallExpression", onCall],
        ["FunctionDeclaration", enter],
        ["FunctionDeclaration:exit", exit],
        ["FunctionExpression", enter],
        ["FunctionExpression:exit", exit],
        ["MemberExpression", onMember],
        ["NewExpression", onNew],
    ];
    return Object.fromEntries(handlers);
};

export default {
    create(context: Rule.RuleContext): Rule.RuleListener {
        return buildListeners(context, resolveThreshold(context.options[0]));
    },
    meta: govlabMeta({
        canonical: ["separation-of-concerns"],
        description: "Disallow functions that mix 3+ concern domains (god-method detection)",
        messages: {
            mixedConcerns:
                "Function '{{name}}' mixes {{count}} concern domains ({{domains}}). Split it into single-responsibility functions — one function, one concern.",
        },
        ruleId: "bounded_complexity",
        schema: [
            {
                additionalProperties: false,
                properties: { threshold: { maximum: 5, minimum: 2, type: "integer" } },
                type: "object",
            },
        ],
    }),
} satisfies Rule.RuleModule;
