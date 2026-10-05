import assert from "node:assert/strict";
import { test } from "vitest";
import { validateInstallRequest } from "@govlab/quality/core/validators/dependency.validator.ts";

test("validateInstallRequest expands a shortcode and drops a repeated ecosystem", () => {
    const request = validateInstallRequest({ auto: false, dryRun: true, ecosystems: ["ts", "typescript"] });
    assert.deepEqual(request.ecosystems, ["typescript"]);
});

test("validateInstallRequest accepts an empty list only with auto detection", () => {
    assert.deepEqual(validateInstallRequest({ auto: true, dryRun: false, ecosystems: [] }).ecosystems, []);
    assert.throws(() => validateInstallRequest({ auto: false, dryRun: false, ecosystems: [] }));
});

test("validateInstallRequest rejects an unknown ecosystem", () => {
    assert.throws(() => validateInstallRequest({ auto: false, dryRun: false, ecosystems: ["cobol-2099"] }));
});
