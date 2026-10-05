import type { PathExclusion } from "#types/exclusions.types";
import { loadGovlabConfig } from "#core/loaders/config.loader";
import { masterExcludeMarkers } from "#core/selectors/exclusions.selector";
import { pathExclusion } from "#core/matchers/exclusions.matcher";

export const excludeMatcher = async (root: string, tool?: string): Promise<PathExclusion> =>
    pathExclusion(root, masterExcludeMarkers(await loadGovlabConfig(root), tool));
