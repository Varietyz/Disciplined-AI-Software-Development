import { FINDING_STATUSES, GO_MODULE } from "#configuration/constants/tool.constants";
import type { RunnerContext, SelectableToolSpec } from "#types/tool.types";
import { runSelectable, statusOkIn } from "#core/adapters/tool.adapter";
import type { RunResult } from "#types/finding.types";
import { defineTool } from "#core/registries/tool.registry";
import { nativeToolConfig } from "#core/resolvers/tool.resolver";
import { parseReviveOutput } from "#core/parsers/tool.revive.parser";
import { projectDirWithMarker } from "#core/resolvers/scope.resolver";

const TOOL = "revive";
const LANGUAGE = "go";
const CONFIG_FILE = "revive.toml";

const REVIVE_SPEC: SelectableToolSpec = {
    argsFor: (configFile) => [...(configFile === null ? [] : ["-config", configFile]), "-formatter", "json", "./..."],
    configFilename: CONFIG_FILE,
    cwdFor: (context) => projectDirWithMarker(context.root, context.paths, GO_MODULE),
    loadConfig: async (root) => nativeToolConfig(root, LANGUAGE, CONFIG_FILE),
    parse: parseReviveOutput,
    statusOk: statusOkIn(FINDING_STATUSES),
    tool: TOOL,
};

const runRevive = async function runRevive(context: RunnerContext): Promise<RunResult> {
    return runSelectable(REVIVE_SPEC, context);
};

defineTool({ ecosystems: [LANGUAGE], run: runRevive, tool: TOOL });
