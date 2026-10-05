import type { LocalRule, RuleContext, RuleListener } from "../../types/rule.types.ts";
import { detectedKinds, loadDetectors } from "@ssot/secrets";
import { literalString, nodesAt, recordAt, stringIn } from "../../shared/selectors/syntax.selector.ts";
import type { AstNode } from "../../types/syntax.types.ts";
import { defineCheck } from "@govlab/context/check";
import { listener } from "../../shared/factories/listener.factory.ts";

const DETECTORS = await loadDetectors();

const quasiTexts = function quasiTexts(view: AstNode): readonly string[] {
    return nodesAt(view, "quasis").map((part) => stringIn(recordAt(part, "value"), "cooked"));
};

const firstKind = function firstKind(texts: readonly string[]): string | undefined {
    const [kind] = texts.flatMap((text) => detectedKinds(text, DETECTORS));
    return kind;
};

export default {
    create(context: RuleContext): RuleListener {
        return listener({
            literal(view, node) {
                const text = literalString(view);
                const kind = text === null ? undefined : firstKind([text]);
                if (kind !== undefined) {
                    context.report({ data: { kind }, messageId: "secretValue", node });
                }
            },
            templateLiteral(view, node) {
                const kind = firstKind(quasiTexts(view));
                if (kind !== undefined) {
                    context.report({ data: { kind }, messageId: "secretValue", node });
                }
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({
                detects: ["architecture:hardcoded-configuration", "architecture:secret-sprawl"],
                enforces: ["architecture:secrets-management"],
            }),
            description:
                "A value with the shape of a secret or a server fact is never written in source. The rule runs every string through the detectors the secret store registers, one per kind: vendor tokens, signed web tokens, bearer headers, private keys, SSH keys, database URLs, URLs that carry a user and a password, and IP addresses. A finding names the kind and never the value.",
        },
        messages: {
            secretValue:
                "This string has the shape of a {{kind}} value. Move it into the secret store under a key its schema declares, and read it through the store's typed accessor.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
