import { describe, expect, it } from "vitest";
import {
    installRecordFor,
    loadInstallRegistry,
    selectableTools,
} from "@govlab/quality/core/loaders/dependency.loader.ts";

describe("the dependency registry", () => {
    it("loads the install records", () => {
        expect(loadInstallRegistry().records.length).toBeGreaterThan(0);
    });

    it("finds a record by tool and lists only selectable tools", () => {
        const registry = loadInstallRegistry();
        const [first] = registry.records;
        expect(installRecordFor(first?.tool ?? "", registry)).toBe(first);
        expect(installRecordFor("some-unregistered-tool", registry)).toBeUndefined();
        const selectable = selectableTools(registry);
        for (const tool of selectable) {
            expect(installRecordFor(tool, registry)?.disposition).toBe("selectable");
        }
    });
});
