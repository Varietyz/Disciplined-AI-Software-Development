import { expect, test } from "vitest";
import { importFolder } from "@govlab/quality/core/loaders/folder.loader.ts";
import { registeredValidators } from "@govlab/quality/core/registries/validation.registry.ts";

test("importFolder imports every file with the suffix, so self-registering files register", async () => {
    await importFolder("govlab.quality.validators", ".validator.ts");
    expect(registeredValidators().map((validator) => validator.id)).toContain("css-dead-var");
});
