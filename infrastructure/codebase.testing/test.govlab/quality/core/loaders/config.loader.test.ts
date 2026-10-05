import { expect, test } from "vitest";
import { loadGovlabConfig, resolveConfigInDir } from "@govlab/quality/core/loaders/config.loader.ts";
import { ROOT } from "@ssot/paths";
import { tmpdir } from "node:os";

test("the workspace config resolves and loads, and a folder without one resolves to null", async () => {
    expect(resolveConfigInDir(tmpdir())).toBeNull();
    const config = await loadGovlabConfig(ROOT);
    expect(config.qualityMaster?.ecosystems).toContain("typescript");
});
