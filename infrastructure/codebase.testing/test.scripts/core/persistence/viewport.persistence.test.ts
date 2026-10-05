import { describe, expect, it } from "vitest";
import { mkdtempSync, readFileSync } from "node:fs";
import { writeReport, writeShot } from "@project/scripts/core/persistence/viewport.persistence.ts";
import { join } from "node:path";
import { tmpdir } from "node:os";

const audit = { clipped: [], inputs: [], overflow: [], scrollsSideways: false, targets: [], text: [], viewport: 390 };

describe("the viewport's files", () => {
    it("writes a screenshot from its base64 frame and the report as json", () => {
        const folder = mkdtempSync(join(tmpdir(), "viewport-out-"));
        writeShot(folder, "home.png", Buffer.from("png").toString("base64"));
        writeReport(folder, [{ audit, route: "/" }]);
        expect(readFileSync(join(folder, "home.png"), "utf8")).toBe("png");
        const report = readFileSync(join(folder, "viewport.report.json"), "utf8");
        expect(JSON.parse(report)).toStrictEqual([{ audit, route: "/" }]);
    });
});
