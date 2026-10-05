import {
    auditOf,
    hasFinding,
    readOptions,
    routeOfPage,
    shotNameOf,
} from "@project/scripts/core/converters/viewport.converter.ts";
import { describe, expect, it } from "vitest";
import { VIEWPORT_ARGV } from "@project/scripts/configuration/configs/viewport.config.ts";
import type { ViewportAudit } from "@project/scripts/types/viewport.types.ts";
import { argvOf } from "@govlab/argv";
import { join } from "node:path";

const clean: ViewportAudit = {
    clipped: [],
    inputs: [],
    overflow: [],
    scrollsSideways: false,
    targets: [],
    text: [],
    viewport: 390,
};

describe("readOptions", () => {
    it("refuses a call without an output folder", () => {
        expect(readOptions(argvOf(VIEWPORT_ARGV, ["--route", "/"]))).toBeNull();
    });

    it("reads every route given and the phone defaults", () => {
        const read = readOptions(argvOf(VIEWPORT_ARGV, ["--out-dir", "o", "--route", "/", "--route", "/pag"]));
        expect(read?.routes).toStrictEqual(["/", "/pag"]);
        expect(read?.width).toBe(390);
        expect(read?.height).toBe(844);
        expect(read?.software).toBe(true);
    });
});

describe("routeOfPage", () => {
    it("maps a built page to its route and skips every other file", () => {
        expect(routeOfPage("index.html")).toBe("/");
        expect(routeOfPage(join("pag", "keywords.html"))).toBe("/pag/keywords");
        expect(routeOfPage("404.html")).toBeNull();
        expect(routeOfPage(join("json", "pag.json"))).toBeNull();
    });
});

describe("shotNameOf", () => {
    it("names the screenshot after its route", () => {
        expect(shotNameOf("/")).toBe("home.png");
        expect(shotNameOf("/pag/keywords")).toBe("pag-keywords.png");
    });
});

describe("auditOf", () => {
    it("accepts an audit of the declared shape and refuses anything else", () => {
        expect(auditOf(clean)).toStrictEqual(clean);
        expect(auditOf({ ...clean, inputs: [1] })).toBeNull();
        expect(auditOf(null)).toBeNull();
    });
});

describe("hasFinding", () => {
    it("fails a page on every finding except clipped content", () => {
        expect(hasFinding(clean)).toBe(false);
        expect(hasFinding({ ...clean, clipped: ["div 1/2"] })).toBe(false);
        expect(hasFinding({ ...clean, scrollsSideways: true })).toBe(true);
        expect(hasFinding({ ...clean, targets: ["a 10x10"] })).toBe(true);
    });
});
