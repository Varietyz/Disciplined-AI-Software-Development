import { describe, expect, it } from "vitest";
import { createRegistry } from "@banes-lab/web/domain/registries/base.registry.ts";

const FIRST = "first";
const SECOND = "second";

describe("createRegistry", () => {
    it("stores entries by id and lists them in insertion order", () => {
        const registry = createRegistry<{ readonly id: string }>();
        registry.register({ id: FIRST });
        registry.register({ id: SECOND });
        expect(registry.byId(FIRST)?.id).toBe(FIRST);
        expect(registry.all().map((entry) => entry.id)).toStrictEqual([FIRST, SECOND]);
    });

    it("replaces an entry registered twice under the same id", () => {
        const registry = createRegistry<{ readonly id: string; readonly order: number }>();
        registry.register({ id: FIRST, order: 1 });
        registry.register({ id: FIRST, order: 2 });
        expect(registry.all()).toHaveLength(1);
        expect(registry.byId(FIRST)?.order).toBe(2);
    });

    it("answers undefined for an unknown id", () => {
        expect(createRegistry().byId(FIRST)).toBeUndefined();
    });
});
