import { ABSENT_MEMBERS, RUNTIME_BINDINGS } from "../../shared/manifests/target.manifest.ts";
import type { LocalRule, RuleContext, RuleListener } from "../../types/rule.types.ts";
import { booleanAt, literalString, locOf, nameOf, nodeAt } from "../../shared/selectors/syntax.selector.ts";
import type { AstNode } from "../../types/syntax.types.ts";
import { absolutePath } from "@ssot/paths";
import { defineCheck } from "@govlab/context/check";
import { listener } from "../../shared/factories/listener.factory.ts";
import { normalizePath } from "../../shared/resolvers/anchor.resolver.ts";

const BOUND = RUNTIME_BINDINGS.map((binding) => ({
    folder: `${normalizePath(absolutePath(binding.pathKey))}/`,
    runtime: binding.runtime,
}));

const runtimeOf = function runtimeOf(filename: string): string | null {
    return BOUND.find((binding) => filename.startsWith(binding.folder))?.runtime ?? null;
};

const memberName = function memberName(view: AstNode): string | null {
    const property = nodeAt(view, "property");
    return booleanAt(view, "computed") ? literalString(property) : nameOf(property);
};

export default {
    create(context: RuleContext): RuleListener {
        const runtime = runtimeOf(normalizePath(context.filename));
        const absent = runtime === null ? undefined : ABSENT_MEMBERS.get(runtime);
        if (runtime === null || absent === undefined) {
            return {};
        }
        return listener({
            memberExpression(view) {
                const member = memberName(view);
                if (member !== null && absent.has(member)) {
                    context.report({ data: { member, runtime }, loc: locOf(view), messageId: "absentMember" });
                }
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({
                detects: [],
                enforces: ["architecture:environment-parity", "architecture:portability"],
            }),
            description:
                "A script that runs under a constrained runtime uses only what that runtime provides. The registry binds a folder, by its paths key, to the runtime its scripts run under, and lists the members that runtime lacks. A tool that runs the script under a fuller runtime, such as a test runner, does not see the missing member, so the call fails only in production. The rule refuses any member access, dotted or computed with a literal, to a listed member in a bound folder.",
        },
        messages: {
            absentMember:
                "This script runs under {{runtime}}, which does not provide {{member}}, so the call throws there although it passes under a fuller runtime. Replace it with an operation the runtime provides.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
