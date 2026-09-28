import type { LocalRule, RuleContext, RuleListener } from "../../types/rule.types.ts";
import { basenameOf, normalizePath, projectDirs } from "../../shared/resolvers/anchor.resolver.ts";
import { concernFolders } from "../../shared/resolvers/container.resolver.ts";
import { concernSuffix } from "../../shared/manifests/taxonomy.manifest.ts";
import { defineCheck } from "@govlab/context/check";
import { listener } from "../../shared/factories/listener.factory.ts";

const LISTENER_CONCERN = "listener";
const IDS_CONCERN = "ids";

const DIRS = projectDirs();
const LISTENER_FOLDERS = concernFolders(LISTENER_CONCERN, DIRS);
const IDS_FOLDERS = concernFolders(IDS_CONCERN, DIRS);

const IDS_SUFFIX = concernSuffix(IDS_CONCERN);
const LISTENER_SUFFIX = concernSuffix(LISTENER_CONCERN);

const inAnyFolder = function inAnyFolder(filename: string, folders: readonly string[]): boolean {
    const norm = normalizePath(filename);
    return folders.some((folder) => norm.startsWith(folder) || norm.includes(`/${folder}`));
};

export default {
    create(context: RuleContext): RuleListener {
        const { filename } = context;
        const basename = basenameOf(filename);
        if (basename.endsWith(IDS_SUFFIX) && !inAnyFolder(filename, IDS_FOLDERS)) {
            return listener({
                program(_view, node) {
                    context.report({ data: { basename }, messageId: "misplacedEventIdsFile", node });
                },
            });
        }
        if (basename.endsWith(LISTENER_SUFFIX) && !inAnyFolder(filename, LISTENER_FOLDERS)) {
            return listener({
                program(_view, node) {
                    context.report({ data: { basename }, messageId: "misplacedListenerFile", node });
                },
            });
        }
        return {};
    },
    meta: {
        docs: {
            checks: defineCheck({ detects: [], enforces: ["architecture:introspection"] }),
            description:
                "Ids modules live in an ids concern folder and listeners in a listeners concern folder; both folder sets are DISCOVERED from the tree, never hardcoded, so the rule follows a rename with no edit. Centralizing both is what lets a cross-cutting consumer — telemetry, replay, audit, an automated observer — introspect the whole surface at once. A scattered surface cannot be introspected, only searched, and a search misses what it does not know to look for.",
        },
        messages: {
            misplacedEventIdsFile:
                "Ids file '{{basename}}' sits outside every declared ids folder. Move it into one — an ids module is a registry's symbol table, and a scattered symbol table cannot be introspected as a whole.",
            misplacedListenerFile:
                "Listener file '{{basename}}' sits outside every declared listeners folder. Move it into one — listeners self-register through the glob barrel, so one outside it is never discovered and never runs.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
