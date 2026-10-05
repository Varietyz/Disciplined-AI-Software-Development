import { expect, test } from "vitest";
import { regenerateCatalog } from "@govlab/quality/core/coordinators/catalog.coordinator.ts";

test("regenerateCatalog refuses a producer name no producer registers, before it writes anything", async () => {
    const lines: string[] = [];
    await expect(
        regenerateCatalog({ knobs: [], rules: ["no-such-producer"] }, (line) => {
            lines.push(line);
        }),
    ).rejects.toThrow('"no-such-producer"');
    expect(lines).toStrictEqual([]);
});
