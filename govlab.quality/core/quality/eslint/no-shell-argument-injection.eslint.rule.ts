import { asNode, identName, propKeyName } from "#core/selectors/syntax.selector";
import type { Rule } from "eslint";
import type { SyntaxNode } from "#types/syntax.types";
import { govlabMeta } from "#core/factories/eslint.factory";

const CHILD_PROCESS_SPAWNERS = new Set(["spawn", "spawnSync", "execFile", "execFileSync"]);

const calleeName = function calleeName(callee: SyntaxNode | undefined): string | null {
    if (callee?.type === "Identifier") {
        return identName(callee);
    }
    return callee?.type === "MemberExpression" ? identName(callee.property) : null;
};

const isTruthyLiteral = function isTruthyLiteral(value: SyntaxNode | null): boolean {
    return value?.type === "Literal" && value.value !== false && value.value !== "" && value.value !== null;
};

const ARGS_ARGUMENT_INDEX = 2;

const hasShellOption = function hasShellOption(node: SyntaxNode): boolean {
    return (
        node.type === "ObjectExpression" &&
        (node.properties ?? []).some(
            (property) =>
                property.type === "Property" &&
                propKeyName(property) === "shell" &&
                isTruthyLiteral(asNode(property.value)),
        )
    );
};

export default {
    create(context: Rule.RuleContext): Rule.RuleListener {
        const onCall = (node: Rule.Node): void => {
            const call = asNode(node);
            if (call === null || !CHILD_PROCESS_SPAWNERS.has(calleeName(call.callee) ?? "")) {
                return;
            }
            const args = call.arguments ?? [];
            if (args.findIndex(hasShellOption) >= ARGS_ARGUMENT_INDEX) {
                context.report({ messageId: "shellArgs", node });
            }
        };
        return Object.fromEntries([["CallExpression", onCall]]);
    },
    meta: govlabMeta({
        canonical: ["injection"],
        description:
            "A child-process spawner must not combine a separate argument array with a truthy shell option — the arguments are concatenated into the shell command line unescaped, so any dynamic argument becomes a command-injection vector",
        messages: {
            shellArgs:
                "A child process is spawned with a separate argument array AND a truthy shell option, so the arguments are concatenated into the shell command line unescaped — any dynamic argument is a command-injection vector. Drop the shell option so the argument array is handed to the executable directly (never parsed by a shell); if a shell command line is genuinely required, pass ONE command string built only from trusted literals, never interpolated untrusted input.",
        },
        ruleId: "no_shell_argument_injection",
    }),
} satisfies Rule.RuleModule;
