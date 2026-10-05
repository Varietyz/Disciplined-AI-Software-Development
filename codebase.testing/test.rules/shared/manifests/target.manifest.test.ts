import { ABSENT_MEMBERS, RUNTIME_BINDINGS } from "@ssot/govlab/shared/manifests/target.manifest.ts";
import { describe, expect, it } from "vitest";
import { absolutePath } from "@ssot/paths";

describe("the runtime registry", () => {
    it("binds each folder through a paths key that resolves", () => {
        for (const binding of RUNTIME_BINDINGS) {
            expect(absolutePath(binding.pathKey).length).toBeGreaterThan(0);
        }
    });

    it("lists the absent members of every bound runtime", () => {
        for (const binding of RUNTIME_BINDINGS) {
            expect(ABSENT_MEMBERS.get(binding.runtime)?.size ?? 0).toBeGreaterThan(0);
        }
    });
});
