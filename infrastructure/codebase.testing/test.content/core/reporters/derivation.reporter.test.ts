import { afterEach, describe, expect, it, vi } from "vitest";
import { conclude, refuse, say } from "@banes-lab/content/core/reporters/derivation.reporter.ts";
import process from "node:process";

const EXIT_MESSAGE = "exit";

const exitThrows = function exitThrows(): never {
    throw new Error(EXIT_MESSAGE);
};

describe("say, refuse and conclude", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("writes a line to stdout", () => {
        const write = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
        say("hello");
        expect(write).toHaveBeenCalledWith("hello\n");
    });

    it("refuses on stderr and exits non-zero", () => {
        vi.spyOn(process.stderr, "write").mockImplementation(() => true);
        const exit = vi.spyOn(process, "exit").mockImplementation(exitThrows);
        expect(() => refuse("no")).toThrow(EXIT_MESSAGE);
        expect(exit).toHaveBeenCalledWith(1);
    });

    it("concludes clean with a zero exit", () => {
        vi.spyOn(process.stdout, "write").mockImplementation(() => true);
        const exit = vi.spyOn(process, "exit").mockImplementation(exitThrows);
        expect(() => {
            conclude("check", [], "clean");
        }).toThrow(EXIT_MESSAGE);
        expect(exit).toHaveBeenCalledWith(0);
    });

    it("lists findings and exits non-zero", () => {
        vi.spyOn(process.stdout, "write").mockImplementation(() => true);
        const exit = vi.spyOn(process, "exit").mockImplementation(exitThrows);
        expect(() => {
            conclude("check", [{ file: "a", message: "b" }], "clean");
        }).toThrow(EXIT_MESSAGE);
        expect(exit).toHaveBeenCalledWith(1);
    });
});
