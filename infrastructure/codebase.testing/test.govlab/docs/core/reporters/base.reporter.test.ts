import { afterEach, describe, expect, it, vi } from "vitest";
import { print, printErr } from "@govlab/docs/core/reporters/base.reporter.ts";
import { captureOutput } from "../coordinators/output.fixture.ts";

afterEach(() => {
    vi.restoreAllMocks();
});

describe("print and printErr", () => {
    it("write one line to their stream", () => {
        const output = captureOutput();
        print("hello");
        printErr();
        expect(output).toStrictEqual({ err: ["\n"], out: ["hello\n"] });
    });
});
