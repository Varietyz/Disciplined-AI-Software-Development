import { GO_MODULE_FILE, GO_SOURCE_SUFFIX, GO_TEST_SUFFIX } from "#configuration/constants/code.go.constants";
import { buildGoGraph, indexGoFiles } from "#core/analyzers/code.go.analyzer";
import type { Analyzer } from "#types/code.types";
import { ROOT } from "@ssot/paths";
import { excludeMatcher } from "@govlab/quality/config";
import { existsSync } from "node:fs";
import { goSummary } from "#configuration/strings/code.strings";
import { join } from "node:path";
import { walkFiles } from "#core/loaders/base.loader";

const isExcluded = await excludeMatcher(ROOT);

const isGoSource = function isGoSource(file: string): boolean {
    return file.endsWith(GO_SOURCE_SUFFIX) && !file.endsWith(GO_TEST_SUFFIX);
};

const makeRelPath = function makeRelPath(dirPosix: string): (file: string) => string {
    return (file: string): string => {
        const posix = file.split("\\").join("/");
        return posix.startsWith(dirPosix) ? posix.slice(dirPosix.length + 1) : posix;
    };
};

export const analyzer: Analyzer = {
    analyze(request) {
        const files = walkFiles(request.moduleDir, isExcluded).filter(isGoSource);
        if (files.length === 0) {
            return null;
        }
        const relPath = makeRelPath(request.moduleDir.split("\\").join("/"));
        const index = indexGoFiles(files);
        if (index.funcMap.size === 0) {
            return null;
        }
        const graph = buildGoGraph(index, relPath).result();
        const module = relPath(request.moduleDir) || request.moduleDir;
        request.logger?.(goSummary(module, index.funcMap.size, graph.nodes.length));
        return graph.nodes.length === 0 ? null : graph;
    },
    canAnalyze(dir) {
        return existsSync(join(dir, GO_MODULE_FILE));
    },
    ecosystem: "go",
};
