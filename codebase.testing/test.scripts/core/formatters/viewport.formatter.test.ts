import { VIEWPORT_PROBE, auditPage, scrollThrough } from "@project/scripts/core/probes/viewport.probe.ts";
import {
    auditExpression,
    reportJson,
    resultLines,
    scrollExpression,
} from "@project/scripts/core/formatters/viewport.formatter.ts";
import { describe, expect, it } from "vitest";
import { JSDOM } from "jsdom";
import { VIEWPORT_RULES } from "@project/scripts/configuration/configs/viewport.config.ts";
import type { ViewportAudit } from "@project/scripts/types/viewport.types.ts";
import { auditOf } from "@project/scripts/core/converters/viewport.converter.ts";

const clean: ViewportAudit = {
    clipped: [],
    inputs: [],
    overflow: [],
    scrollsSideways: false,
    targets: [],
    text: [],
    viewport: 390,
};

describe("resultLines", () => {
    it("says none for a clean page", () => {
        expect(resultLines({ audit: clean, route: "/" })).toBe("\n/ (390px wide)\n  none\n");
    });

    it("lists each finding under its label", () => {
        const lines = resultLines({
            audit: { ...clean, inputs: ["input.filter 11px"], scrollsSideways: true },
            route: "/pag",
        });
        expect(lines).toBe(
            "\n/pag (390px wide)\n  the page scrolls sideways\n  Form fields that zoom the page on focus: 1\n    input.filter 11px\n",
        );
    });
});

describe("auditExpression", () => {
    it("builds source that runs in a page with no module and returns the audit", () => {
        const page = new JSDOM("<!doctype html><body><main id='app'></main></body>", { runScripts: "outside-only" });
        const expression = auditExpression(auditPage, VIEWPORT_RULES, VIEWPORT_PROBE);
        expect(auditOf(page.window.eval(expression))).toEqual({ ...clean, viewport: page.window.innerWidth });
    });
});

describe("scrollExpression", () => {
    it("builds source that runs in a page with no module and resolves once it rests at the top", async () => {
        const page = new JSDOM("<!doctype html><body><main id='app'></main></body>", { runScripts: "outside-only" });
        const expression = scrollExpression(scrollThrough, { ...VIEWPORT_RULES, scrollPauseMs: 0 });
        await expect(page.window.eval(expression)).resolves.toBe(0);
    });
});

describe("reportJson", () => {
    it("writes the results as indented json", () => {
        expect(JSON.parse(reportJson([{ audit: clean, route: "/" }]))).toStrictEqual([{ audit: clean, route: "/" }]);
    });
});
