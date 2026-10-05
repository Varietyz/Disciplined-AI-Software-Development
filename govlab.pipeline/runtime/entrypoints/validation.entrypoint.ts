import {
    COMMAND_PROCESSOR_KEY,
    FALLBACK_EXIT,
    NODE_OPTIONS_KEY,
    PATH_KEY,
    STAGE_NODE_OPTION,
} from "#configuration/constants/shell.constants";
import { GATE_LABEL, LIST_SEPARATOR, MOCKS_MARKER } from "#configuration/constants/stage.constants";
import { INDEX_FAILED, noQualityRoot, skippedWide, unknownMembers } from "#configuration/strings/stage.strings";
import { ROOT, absolutePath, relativePath } from "@ssot/paths";
import { loadGovlabConfig, masterExcludeMarkers, qualityEngineConfig } from "@govlab/quality/config";
import { stageBinDir, withNodeOption, withPathEntry } from "#core/converters/environment.converter";
import { GATE_ARGV } from "#configuration/configs/invocation.config";
import { MEMBERS } from "#configuration/configs/package.config";
import { line } from "#core/reporters/stage.reporter";
import { mkdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { resolveArgv } from "@govlab/argv";
import { runLive } from "#core/adapters/shell.adapter";
import { runStages } from "#core/coordinators/stage.coordinator";
import { shellFor } from "#core/resolvers/shell.resolver";
import { stageArgsOf } from "#core/converters/invocation.converter";
import { stagesFor } from "#core/factories/plan.factory";
import { writeCanonicalJson } from "@govlab/canonical-write";

const args = stageArgsOf(resolveArgv(GATE_ARGV));

process.env[PATH_KEY] = withPathEntry(process.env[PATH_KEY], stageBinDir(ROOT));
process.env[NODE_OPTIONS_KEY] = withNodeOption(process.env[NODE_OPTIONS_KEY], STAGE_NODE_OPTION);
const shell = shellFor(process.platform, process.env[COMMAND_PROCESSOR_KEY]);

const indexStatus = await runLive(shell, `node ${relativePath("govlabHost.indexer")}`);
if (indexStatus !== 0) {
    process.stderr.write(`${INDEX_FAILED}\n`);
    process.exit(indexStatus);
}

const config = await loadGovlabConfig(ROOT);
const { root: qualityRoot } = qualityEngineConfig(config);
if (typeof qualityRoot !== "string" || qualityRoot.length === 0) {
    process.stderr.write(`${noQualityRoot(relativePath("govlabHost.config"))}\n`);
    process.exit(FALLBACK_EXIT);
}

const known = MEMBERS.map((member) => member.id);
const unknown = [...args.members].filter((id) => !known.includes(id));
if (unknown.length > 0) {
    process.stderr.write(`${unknownMembers(unknown, known)}\n`);
    process.exit(FALLBACK_EXIT);
}

const masterIgnore = masterExcludeMarkers(config);
const plan = stagesFor({
    cleanCommentsIgnore: [...masterIgnore, MOCKS_MARKER].join(LIST_SEPARATOR),
    hexIgnore: masterIgnore.join(LIST_SEPARATOR),
    qualityRoot,
    scope: args.members,
});

if (plan.skippedWide.length > 0) {
    line(skippedWide(plan.skippedWide));
}

const reportPath = absolutePath("govlabHost.reports.verify");
mkdirSync(path.dirname(reportPath), { recursive: true });

await runStages(GATE_LABEL, plan.stages, {
    args,
    options: {
        reportPath,
        violationsPath: absolutePath("govlabHost.reports.violations"),
        writeReport: writeCanonicalJson,
    },
    shell,
});
