import type { LocalRule, NodeHandler, RuleContext, RuleListener } from "../../types/rule.types.ts";
import { WORKSPACE_ROOT, collapsePath, normalizePath } from "../../shared/resolvers/anchor.resolver.ts";
import { literalString, locOf, nodeAt } from "../../shared/selectors/syntax.selector.ts";
import { manifestAt, memberRels } from "../../shared/loaders/manifest.loader.ts";
import { defineCheck } from "@govlab/context/check";
import { listener } from "../../shared/factories/listener.factory.ts";
import { noPackageName } from "../../shared/strings/manifest.strings.ts";
import path from "node:path";

interface Member {
    name: string;
    rel: string;
}

const packageNameOf = function packageNameOf(memberRel: string): string {
    const { name } = manifestAt(path.join(WORKSPACE_ROOT, memberRel));
    if (typeof name !== "string" || name.length === 0) {
        throw new TypeError(noPackageName(memberRel));
    }
    return name;
};

const buildMembers = function buildMembers(): Member[] {
    return memberRels()
        .map((memberRel) => ({ name: packageNameOf(memberRel), rel: memberRel }))
        .toSorted((a, b) => b.rel.length - a.rel.length);
};

const MEMBERS = buildMembers();
const ROOT_POSIX = normalizePath(WORKSPACE_ROOT);

const memberOf = function memberOf(absolute: string): Member | null {
    const posix = normalizePath(absolute);
    if (!posix.startsWith(`${ROOT_POSIX}/`)) {
        return null;
    }
    const relative = posix.slice(ROOT_POSIX.length + 1);
    return MEMBERS.find((member) => relative === member.rel || relative.startsWith(`${member.rel}/`)) ?? null;
};

export default {
    create(context: RuleContext): RuleListener {
        const check: NodeHandler = function check(view, node) {
            const source = nodeAt(view, "source");
            const specifier = literalString(source);
            if (specifier === null) {
                return;
            }
            if (!specifier.startsWith(".")) {
                return;
            }
            const filename = normalizePath(context.filename);
            const fromDir = filename.slice(0, filename.lastIndexOf("/"));
            const target = collapsePath(`${fromDir}/${specifier}`);
            const from = memberOf(filename);
            const to = memberOf(target);
            if (from === null || to === null || from.rel === to.rel) {
                return;
            }
            const payload = { specifier: to.name.length > 0 ? to.name : to.rel, target: to.rel };
            if (source === null) {
                context.report({ data: payload, messageId: "crossMember", node });
                return;
            }
            context.report({ data: payload, loc: locOf(source), messageId: "crossMember" });
        };
        return listener({ exportAllDeclaration: check, exportNamedDeclaration: check, importDeclaration: check });
    },
    meta: {
        docs: {
            checks: defineCheck({
                detects: ["architecture:boundary-leakage"],
                enforces: ["architecture:explicit-boundaries"],
            }),
            description:
                "A relative import addresses a sibling by hop count, which is only stable inside one workspace member. Escaping the member with `../` encodes the distance between two trees that move independently: nothing fails when the count goes stale, the specifier just resolves somewhere else or stops resolving. Cross-member references go through the declared package specifier, which is the module SSOT and survives either end moving.",
            workspaceWide: true,
        },
        messages: {
            crossMember:
                "This relative import leaves its workspace member and reaches into `{{ target }}` by hop count, so it breaks silently the moment either tree moves. Import from `{{ specifier }}` instead, adding the subpath to that package's `exports` map if it is not published yet.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
