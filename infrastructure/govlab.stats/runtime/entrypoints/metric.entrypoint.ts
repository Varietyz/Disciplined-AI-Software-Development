import {
    CENSUS_COMMAND,
    CENSUS_SUMMARY,
    authoredLine,
    taxonomyLine,
    wroteCensus,
} from "#configuration/strings/metric.strings";
import { ROOT, absolutePath, relativePath } from "@ssot/paths";
import { humanBytes, num } from "#core/formatters/metric.formatter";
import { memberIndex, workspaceMembers } from "#core/resolvers/package.resolver";
import { collectActiveRules } from "#core/analyzers/rule.analyzer";
import { collectAnalysis } from "#core/loaders/code.loader";
import { collectApp } from "#core/analyzers/site.analyzer";
import { collectDependencyGraph } from "#core/analyzers/dependency.analyzer";
import { collectDocArch } from "#core/loaders/document.loader";
import { collectFindings } from "#core/loaders/pattern.loader";
import { collectGit } from "#core/adapters/vcs.adapter";
import { collectMemory } from "#core/loaders/agent.loader";
import { collectQuality } from "#core/loaders/catalog.loader";
import { collectTaxonomy } from "#core/analyzers/taxonomy.analyzer";
import { collectTypescript } from "#core/loaders/config.loader";
import { collectVerifyReport } from "#core/loaders/report.loader";
import { collectWorkspace } from "#core/loaders/manifest.loader";
import { excludeMatcher } from "@govlab/quality/config";
import { otherGateClaims } from "#core/resolvers/folder.resolver";
import path from "node:path";
import process from "node:process";
import { renderReport } from "#core/reporters/report.reporter";
import { resolveArgv } from "@govlab/argv";
import { runScan } from "#core/analyzers/source.analyzer";
import { writeCensus } from "#core/persistence/metric.persistence";

resolveArgv({ command: CENSUS_COMMAND, flags: [], summary: CENSUS_SUMMARY });

const ignore = await excludeMatcher(ROOT);
const state = runScan({ ignore, members: memberIndex(ROOT), root: ROOT });
const workspace = collectWorkspace(ROOT);
const taxonomy = collectTaxonomy(ROOT, ignore, await otherGateClaims(ROOT));
const appRoot = relativePath("app.root");
const appContainers = taxonomy.roots
    .filter((entry) => entry.root.startsWith(`${appRoot}/`))
    .flatMap((entry) => entry.containers.map((container) => `${entry.root}/${container.name}`));
const target = await writeCensus(
    renderReport({
        activeRules: await collectActiveRules(ROOT),
        analysis: collectAnalysis(ROOT, ignore),
        app: collectApp(ROOT, appContainers, ignore),
        docs: collectDocArch(ROOT, ignore),
        findings: collectFindings(ROOT),
        git: collectGit(ROOT),
        graph: collectDependencyGraph(ROOT),
        memory: collectMemory(ROOT),
        packages: workspaceMembers(ROOT),
        quality: collectQuality(ROOT),
        state,
        taxonomy,
        typescript: collectTypescript(ROOT),
        verify: collectVerifyReport(ROOT),
        workspace,
    }),
    absolutePath("docArch.generated"),
);
const authored = [...state.authored.values()];
const authoredFiles = authored.reduce((sum, bucket) => sum + bucket.files, 0);
const authoredBytes = authored.reduce((sum, bucket) => sum + bucket.bytes, 0);

process.stdout.write(
    [
        wroteCensus(path.relative(ROOT, target)),
        authoredLine(num(authoredFiles), num(state.lines.code), humanBytes(authoredBytes), num(workspace.total)),
        taxonomyLine(num(taxonomy.totals.conformant), num(taxonomy.totals.assessed), num(taxonomy.ungovernedFiles)),
        "",
    ].join("\n"),
);
