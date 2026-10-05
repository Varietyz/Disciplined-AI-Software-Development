import { describe, expect, it } from "vitest";
import { parseCliArgs } from "@govlab/quality/core/parsers/invocation.parser.ts";

describe("parseCliArgs", () => {
    it("reads a concern, its paths and fix on by default", () => {
        const args = parseCliArgs(["eslint", "src"]);
        expect(args.concern).toBe("eslint");
        expect(args.paths).toStrictEqual(["src"]);
        expect(args.fix).toBe(true);
    });

    it("reads a known reporter", () => {
        expect(parseCliArgs(["eslint", "--reporter", "json"]).reporter).toBe("json");
    });

    it("refuses an unknown reporter rather than falling back to the default", () => {
        expect(() => parseCliArgs(["eslint", "--reporter", "xml"])).toThrow('unknown reporter "xml"');
    });

    it("refuses a value flag with no value", () => {
        expect(() => parseCliArgs(["eslint", "--config"])).toThrow("--config needs a value");
        expect(() => parseCliArgs(["eslint", "--reporter", "--no-fix"])).toThrow("--reporter needs a value");
    });

    it("refuses an unknown flag and an unknown concern", () => {
        expect(() => parseCliArgs(["eslint", "--fast"])).toThrow('unknown flag "--fast"');
        expect(() => parseCliArgs(["lints"])).toThrow('unknown concern "lints"');
    });

    it("reads install positionals as ecosystems", () => {
        expect(parseCliArgs(["install", "python", "go"]).ecosystems).toStrictEqual(["python", "go"]);
    });
});
