import { describe, expect, it } from "vitest";
import { stageBinDir, withNodeOption, withPathEntry } from "@govlab/pipeline/core/converters/environment.converter.ts";
import { ROOT } from "@ssot/paths";
import { STAGE_NODE_OPTION } from "@govlab/pipeline/configuration/constants/shell.constants.ts";
import path from "node:path";

const EXISTING = "/already/here";
const ADDED = "/added/entry";

describe("withPathEntry", () => {
    it("puts the new entry first, so it wins over anything already on the path", () => {
        expect(withPathEntry(EXISTING, ADDED).split(path.delimiter)).toStrictEqual([ADDED, EXISTING]);
    });

    it("leaves the path untouched when the entry is already present", () => {
        const already = [ADDED, EXISTING].join(path.delimiter);
        expect(withPathEntry(already, ADDED)).toBe(already);
    });

    it("builds a single-entry path from nothing", () => {
        expect(withPathEntry(undefined, ADDED)).toBe(ADDED);
        expect(withPathEntry("", ADDED)).toBe(ADDED);
    });
});

describe("withNodeOption", () => {
    it("appends the option to what is already declared", () => {
        expect(withNodeOption("--trace-warnings", STAGE_NODE_OPTION)).toBe(`--trace-warnings ${STAGE_NODE_OPTION}`);
    });

    it("leaves the options untouched when the option is already declared", () => {
        expect(withNodeOption(STAGE_NODE_OPTION, STAGE_NODE_OPTION)).toBe(STAGE_NODE_OPTION);
    });

    it("declares the option alone when nothing was set, with no leading space", () => {
        expect(withNodeOption(undefined, STAGE_NODE_OPTION)).toBe(STAGE_NODE_OPTION);
        expect(withNodeOption("", STAGE_NODE_OPTION)).toBe(STAGE_NODE_OPTION);
    });
});

describe("stageBinDir", () => {
    it("resolves the hoisted binary folder under the root it is given", () => {
        const dir = stageBinDir(ROOT);
        expect(dir.startsWith(ROOT)).toBe(true);
        expect(dir.endsWith(path.join("node_modules", ".bin"))).toBe(true);
    });
});
