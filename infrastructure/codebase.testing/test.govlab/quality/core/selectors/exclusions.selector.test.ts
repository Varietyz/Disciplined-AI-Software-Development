import { expect, test } from "vitest";
import {
    masterExclude,
    masterExcludeMarkers,
    withMasterExclude,
} from "@govlab/quality/core/selectors/exclusions.selector.ts";
import { relativePath } from "@ssot/paths";

const DOCUMENTS = relativePath("docArch.root");
const config = { qualityMaster: { exclude: ["**/node_modules/**", "dist"], toolExclude: { comments: [DOCUMENTS] } } };

test("the master exclusion list merges into a tool's own list and strips to bare markers", () => {
    expect(masterExclude(config)).toStrictEqual(["**/node_modules/**", "dist"]);
    expect(withMasterExclude(config, ["dist", "own"])).toStrictEqual(["**/node_modules/**", "dist", "own"]);
    expect(masterExcludeMarkers(config)).toStrictEqual(["node_modules", "dist"]);
    expect(masterExcludeMarkers(config, "comments")).toStrictEqual(["node_modules", "dist", DOCUMENTS]);
});
