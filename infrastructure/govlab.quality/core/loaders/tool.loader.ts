import { ADAPTER_SUFFIX } from "#configuration/constants/tool.constants";
import type { ToolRunner } from "#types/tool.types";
import { importFolder } from "#core/loaders/folder.loader";
import { registeredTools } from "#core/registries/tool.registry";

export const loadTools = async function loadTools(): Promise<ToolRunner[]> {
    await importFolder("govlab.quality.adapters", ADAPTER_SUFFIX);
    return registeredTools();
};
