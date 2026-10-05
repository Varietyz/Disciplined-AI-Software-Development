import { expect, test } from "vitest";
import { ROOT } from "@ssot/paths";
import { loadEmitInputs } from "@govlab/quality/core/loaders/concern.loader.ts";

test("loadEmitInputs reads the validated concerns and the config they came from", async () => {
    const inputs = await loadEmitInputs(ROOT);
    expect(typeof inputs.concerns).toBe("object");
    expect(inputs.config.qualityMaster).toBeDefined();
});
