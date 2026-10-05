import { EXTENSION_MAP_FILE, EXTENSION_MAP_INDENT } from "#configuration/constants/grammar.constants";
import { absolutePath } from "@ssot/paths";
import { writeCanonicalJson } from "@govlab/canonical-write";

export const writeExtensionMap = async function writeExtensionMap(map: Record<string, string[]>): Promise<string> {
    const target = absolutePath("govlab.utils.codeParse.generated", EXTENSION_MAP_FILE);
    await writeCanonicalJson(target, map, { tabWidth: EXTENSION_MAP_INDENT });
    return target;
};
