import type { Rule } from "eslint";
import { biasTokensIn } from "#core/matchers/context.matcher";
import { isDefineFragmentCall } from "#core/predicates/context.fragment.predicate";

class ContextTokenVisitor {
    private fragmentDepth = 0;
    private readonly context: Rule.RuleContext;

    public constructor(context: Rule.RuleContext) {
        this.context = context;
    }

    public listeners(): Rule.RuleListener {
        const handlers: [string, (node: Rule.Node) => void][] = [
            ["CallExpression", this.onEnter.bind(this)],
            ["CallExpression:exit", this.onExit.bind(this)],
            ["Literal", this.onLiteral.bind(this)],
            ["TemplateElement", this.onTemplate.bind(this)],
        ];
        return Object.fromEntries(handlers);
    }

    private scan(node: Rule.Node, text: string): void {
        if (this.fragmentDepth > 0) {
            for (const token of biasTokensIn(text)) {
                this.context.report({ data: { token }, messageId: "token", node });
            }
        }
    }

    private onEnter(node: Rule.Node): void {
        if (isDefineFragmentCall(node)) {
            this.fragmentDepth += 1;
        }
    }

    private onExit(node: Rule.Node): void {
        if (isDefineFragmentCall(node)) {
            this.fragmentDepth -= 1;
        }
    }

    private onLiteral(node: Rule.Node): void {
        if (node.type === "Literal" && typeof node.value === "string") {
            this.scan(node, node.value);
        }
    }

    private onTemplate(node: Rule.Node): void {
        if (node.type === "TemplateElement") {
            this.scan(node, node.value.cooked ?? node.value.raw);
        }
    }
}

export default {
    create(context: Rule.RuleContext): Rule.RuleListener {
        return new ContextTokenVisitor(context).listeners();
    },

    meta: {
        docs: {
            description:
                "Disallow hardcoded stack/tool/product tokens in a context fragment body — source them from a param.",
        },
        messages: {
            token: "Fragment body hardcodes the stack/tool token '{{token}}'. Route it through a param derived from the tool registry / config, not a literal. [no_hardcoded_context_token]",
        },
        schema: [],
        type: "problem",
    },
} satisfies Rule.RuleModule;
