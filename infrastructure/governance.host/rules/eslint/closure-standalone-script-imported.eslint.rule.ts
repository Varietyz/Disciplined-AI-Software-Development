import type { LocalRule, RuleContext, RuleListener } from "../../types/rule.types.ts";
import { absolutePath, relativePath } from "@ssot/paths";
import { applicationImporters } from "../../shared/analyzers/specifier.analyzer.ts";
import { defineCheck } from "@govlab/context/check";
import { listener } from "../../shared/factories/listener.factory.ts";
import { normalizePath } from "../../shared/resolvers/anchor.resolver.ts";

const LIST_JOINER = ", ";
const SHOWN_IMPORTERS = 3;

const STANDALONE_ROOT = `${normalizePath(absolutePath("project.scripts"))}/`;
const HOME = relativePath("app.build");
const IMPORTERS = applicationImporters();

export default {
    create(context: RuleContext): RuleListener {
        const filename = normalizePath(context.filename);
        const found = filename.startsWith(STANDALONE_ROOT) ? IMPORTERS.get(filename) : undefined;
        if (found === undefined) {
            return {};
        }
        return listener({
            program(_view, node) {
                const importers = [...new Set(found)].slice(0, SHOWN_IMPORTERS).join(LIST_JOINER);
                context.report({ data: { home: HOME, importers }, messageId: "importedScript", node });
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({ detects: [], enforces: ["architecture:explicit-boundaries"] }),
            description:
                "A standalone script runs on its own and nothing imports it. Once a file under the application root imports one, the script has become a dependency of the application, and it belongs in the member that owns the application's build.",
            workspaceWide: true,
        },
        messages: {
            importedScript:
                "This script is imported by {{importers}}, so it is part of the application's build rather than a standalone script. Move it to {{home}}, the member that owns the scripts the application imports, and point its importers at that package.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
