import type { PositionSources, SearchAsset, SearchPage, SearchPositions } from "@banes-lab/web/types/search.types.js";
import type { DefinitionLocation } from "@banes-lab/web/types/anatomy.types.js";
import type { Evidence } from "@banes-lab/web/types/evidence.types.js";
import type { ModuleImporter } from "#types/loader.types";
import { RUNNER_MODULES } from "#configuration/constants/loader.constants";

export const searchAssetOf = async function searchAssetOf(
    runner: ModuleImporter,
    route: readonly string[],
): Promise<SearchAsset> {
    const [pages, positions, evidence, definitions] = await Promise.all([
        runner.import<{ readonly searchPages: () => Promise<readonly SearchPage[]> }>(RUNNER_MODULES.corpus.path),
        runner.import<{ readonly positionsOf: (input: PositionSources) => SearchPositions }>(
            RUNNER_MODULES.search.path,
        ),
        runner.import<{ readonly EVIDENCE: readonly Evidence[] }>(RUNNER_MODULES.evidenceConstants.path),
        runner.import<{ readonly listDefinitions: () => readonly DefinitionLocation[] }>(
            RUNNER_MODULES.definitions.path,
        ),
    ]);
    return {
        definitions: definitions.listDefinitions(),
        positions: positions.positionsOf({ evidence: evidence.EVIDENCE, pages: await pages.searchPages(), route }),
    };
};
