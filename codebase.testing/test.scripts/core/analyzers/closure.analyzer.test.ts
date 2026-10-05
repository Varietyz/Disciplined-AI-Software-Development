import { ZONE, memberFixture } from "./closure.fixture.ts";
import { describe, expect, it } from "vitest";
import { fileDeltas, flagsOf } from "@project/scripts/core/analyzers/closure.analyzer.ts";
import { join } from "node:path";

describe("flagsOf", () => {
    it("tells an ids, a strings and an icons module apart by the concern tag in the file name", () => {
        expect(flagsOf(`${ZONE}/page.ids.ts`)).toStrictEqual({ isIcons: false, isIds: true, isStrings: false });
        expect(flagsOf(`${ZONE}/site.fragment.strings.ts`).isStrings).toBe(true);
        expect(flagsOf(`${ZONE}/menu.icons.ts`).isIcons).toBe(true);
        expect(flagsOf(`${ZONE}/a.ts`)).toStrictEqual({ isIcons: false, isIds: false, isStrings: false });
    });
});

describe("fileDeltas", () => {
    it("emits one delta per node, and an unresolved self import stays as written", () => {
        const root = memberFixture();
        const deltas = fileDeltas(join(root, ZONE, "c.ts"), root, new Map());
        const imports = deltas.flatMap((delta) => delta.imports ?? []);
        expect(imports.map((entry) => entry.from)).toStrictEqual([`#${ZONE}/a.ids`, `#${ZONE}/b.strings`]);
        expect(deltas.flatMap((delta) => delta.registers ?? []).map((entry) => entry.fn)).toStrictEqual([
            "registerThing",
        ]);
    });
});
