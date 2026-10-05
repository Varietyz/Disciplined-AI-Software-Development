import { ROOT, relativePath } from "@ssot/paths";
import { memberIndex, workspaceMembers } from "@govlab/stats/core/resolvers/package.resolver.ts";
import type { ReportInput } from "@govlab/stats/types/report.types.ts";
import { collectActiveRules } from "@govlab/stats/core/analyzers/rule.analyzer.ts";
import { collectAnalysis } from "@govlab/stats/core/loaders/code.loader.ts";
import { collectApp } from "@govlab/stats/core/analyzers/site.analyzer.ts";
import { collectDependencyGraph } from "@govlab/stats/core/analyzers/dependency.analyzer.ts";
import { collectDocArch } from "@govlab/stats/core/loaders/document.loader.ts";
import { collectFindings } from "@govlab/stats/core/loaders/pattern.loader.ts";
import { collectMemory } from "@govlab/stats/core/loaders/agent.loader.ts";
import { collectQuality } from "@govlab/stats/core/loaders/catalog.loader.ts";
import { collectTaxonomy } from "@govlab/stats/core/analyzers/taxonomy.analyzer.ts";
import { collectTypescript } from "@govlab/stats/core/loaders/config.loader.ts";
import { collectVerifyReport } from "@govlab/stats/core/loaders/report.loader.ts";
import { collectWorkspace } from "@govlab/stats/core/loaders/manifest.loader.ts";
import { excludeMatcher } from "@govlab/quality/config";
import { join } from "node:path";
import { mkdtempSync } from "node:fs";
import { otherGateClaims } from "@govlab/stats/core/resolvers/folder.resolver.ts";
import { runScan } from "@govlab/stats/core/analyzers/source.analyzer.ts";
import { tmpdir } from "node:os";

export const BARE = mkdtempSync(join(tmpdir(), "stats-bare-"));

export const IGNORE = await excludeMatcher(ROOT);

export const CLAIMS = await otherGateClaims(ROOT);

export const TAXONOMY = collectTaxonomy(ROOT, IGNORE, CLAIMS);

export const APP_CONTAINERS: readonly string[] = TAXONOMY.roots
    .filter((entry) => entry.root.startsWith(`${relativePath("app.root")}/`))
    .flatMap((entry) => entry.containers.map((container) => `${entry.root}/${container.name}`));

export const INPUT: ReportInput = {
    activeRules: await collectActiveRules(ROOT),
    analysis: collectAnalysis(ROOT, IGNORE),
    app: collectApp(ROOT, APP_CONTAINERS, IGNORE),
    docs: collectDocArch(ROOT, IGNORE),
    findings: collectFindings(ROOT),
    git: null,
    graph: collectDependencyGraph(ROOT),
    memory: collectMemory(ROOT),
    packages: workspaceMembers(ROOT),
    quality: collectQuality(ROOT),
    state: runScan({ ignore: IGNORE, members: memberIndex(ROOT), root: ROOT }),
    taxonomy: TAXONOMY,
    typescript: collectTypescript(ROOT),
    verify: collectVerifyReport(ROOT),
    workspace: collectWorkspace(ROOT),
};
