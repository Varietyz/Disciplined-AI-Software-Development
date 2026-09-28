import type { LocalRule, RuleContext, RuleListener } from "../../types/rule.types.ts";
import { absolutePath, relativePath } from "@ssot/paths";
import { existsSync, readdirSync } from "node:fs";
import { gateTargets, reachedUnder, scriptTargets } from "../../shared/analyzers/specifier.analyzer.ts";
import { DISCOVERED_FOLDER_KEYS } from "../../shared/manifests/folder.manifest.ts";
import { defineCheck } from "@govlab/context/check";
import { join } from "node:path";
import { listener } from "../../shared/factories/listener.factory.ts";
import { normalizePath } from "../../shared/resolvers/anchor.resolver.ts";

const SOURCE_EXTENSION = ".ts";

const discoveredFiles = function discoveredFiles(key: string): string[] {
    const folder = absolutePath(key);
    return existsSync(folder)
        ? readdirSync(folder)
              .filter((name) => name.endsWith(SOURCE_EXTENSION))
              .map((name) => normalizePath(join(folder, name)))
        : [];
};

const BUILD_ROOT = `${normalizePath(absolutePath("app.build"))}/`;
const HOME = relativePath("project.scripts");
const REACHED = reachedUnder(
    BUILD_ROOT,
    new Set([...scriptTargets(), ...gateTargets(), ...DISCOVERED_FOLDER_KEYS.flatMap(discoveredFiles)]),
);

export default {
    create(context: RuleContext): RuleListener {
        const filename = normalizePath(context.filename);
        if (!filename.startsWith(BUILD_ROOT) || !filename.endsWith(SOURCE_EXTENSION) || REACHED.has(filename)) {
            return {};
        }
        return listener({
            program(_view, node) {
                context.report({ data: { home: HOME }, messageId: "unimportedScript", node });
            },
        });
    },
    meta: {
        docs: {
            checks: defineCheck({ detects: [], enforces: ["architecture:explicit-boundaries"] }),
            description:
                "The build member holds only the scripts the application reaches through its imports, that a package script or a gate step runs, or that a pipeline discovers in one of its declared discovery folders. A file there that none of these reaches is a standalone script, and it belongs with the standalone scripts.",
            workspaceWide: true,
        },
        messages: {
            unimportedScript:
                "No chain of imports from the application reaches this file, and neither a package script nor a gate step runs it, so it is a standalone script rather than part of the build. Move it to {{home}}, where standalone scripts live.",
        },
        schema: [],
        type: "problem",
    },
} satisfies LocalRule;
