import { EXTERNAL_PLAINTEXT_ENDPOINTS, URL_SHAPED_IDENTIFIERS } from "../../shared/manifests/identifier.manifest.ts";
import type { LocalRule, RuleContext, RuleListener } from "../../types/rule.types.ts";
import {
    isType,
    literalString,
    nodeAt,
    nodesAt,
    propertyKeyName,
    recordAt,
    stringIn,
} from "../../shared/selectors/syntax.selector.ts";
import type { AstNode } from "../../types/syntax.types.ts";
import { defineCheck } from "@govlab/context/check";
import { listener } from "../../shared/factories/listener.factory.ts";
import { templateShapeOf } from "../../shared/selectors/literal.selector.ts";

const PLAINTEXT_SCHEMES: readonly string[] = ["http://", "ws://"];
const SERVER_KEY = "server";
const PORT_KEY = "port";
const TRANSPORT_KEY = "https";

const isPlaintextUrl = function isPlaintextUrl(text: string, followed: boolean): boolean {
    if (URL_SHAPED_IDENTIFIERS.has(text) || EXTERNAL_PLAINTEXT_ENDPOINTS.has(text)) {
        return false;
    }
    return PLAINTEXT_SCHEMES.some((scheme) => text.startsWith(scheme) && (followed || text.length > scheme.length));
};

const keysOf = function keysOf(object: AstNode | null): ReadonlySet<string> {
    return new Set(nodesAt(object, "properties").map(propertyKeyName));
};

const BRANCH_KEYS: readonly string[] = ["consequent", "alternate", "left", "right"];

const serverBlocksOf = function serverBlocksOf(value: AstNode | null): AstNode[] {
    if (isType(value, "ObjectExpression") && value !== null) {
        return [value];
    }
    if (isType(value, "ConditionalExpression") || isType(value, "LogicalExpression")) {
        return BRANCH_KEYS.flatMap((key) => serverBlocksOf(nodeAt(value, key)));
    }
    return [];
};

const isPlaintextListener = function isPlaintextListener(block: AstNode): boolean {
    const keys = keysOf(block);
    return keys.has(PORT_KEY) && !keys.has(TRANSPORT_KEY);
};

export default {
    create(context: RuleContext): RuleListener {
        return listener({
            literal(view, node) {
                const text = literalString(view);
                if (text !== null && isPlaintextUrl(text, false)) {
                    context.report({ messageId: "plaintextUrl", node });
                }
            },
            property(view, node) {
                if (propertyKeyName(view) !== SERVER_KEY) {
                    return;
                }
                if (serverBlocksOf(nodeAt(view, "value")).some(isPlaintextListener)) {
                    context.report({ messageId: "plaintextListener", node });
                }
            },
            templateLiteral(view, node) {
                if (EXTERNAL_PLAINTEXT_ENDPOINTS.has(templateShapeOf(view) ?? "")) {
                    return;
                }
                const [head] = nodesAt(view, "quasis");
                const text = stringIn(recordAt(head ?? null, "value"), "cooked");
                if (isPlaintextUrl(text, nodesAt(view, "expressions").length > 0)) {
                    context.report({ messageId: "plaintextUrl", node });
                }
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({ detects: [], enforces: ["architecture:encryption-in-transit"] }),
            description:
                "Every locally served surface speaks encrypted transport, development included. A plaintext URL, page or socket, or a server block that declares a listening port without declaring its encrypted transport, is reported at the source. The one exception is a loopback endpoint a third-party process serves with no encrypted form, recorded by its template shape in a classified registry.",
        },
        messages: {
            plaintextListener:
                "This server block listens on a port without declaring encrypted transport. Declare the transport with the generated local certificate so the surface is served encrypted, the same way production serves it.",
            plaintextUrl:
                "This URL uses the plaintext scheme. Every served surface is encrypted, local ones included; address it with the encrypted scheme and serve it with the generated local certificate.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
