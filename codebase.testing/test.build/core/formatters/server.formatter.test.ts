import { describe, expect, it } from "vitest";
import { prefixLines } from "@banes-lab/build-scripts/core/formatters/server.formatter.ts";

describe("prefixLines", () => {
    it("prefixes each complete line and carries a partial line into the next chunk", () => {
        const first = prefixLines("site", "", "ready in 3s\nLocal: http");
        expect(first).toStrictEqual({ carry: "Local: http", lines: ["[site] ready in 3s\n"] });
        const second = prefixLines("site", first.carry, "s://localhost:4202\n");
        expect(second).toStrictEqual({ carry: "", lines: ["[site] Local: https://localhost:4202\n"] });
    });
});
