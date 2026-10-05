import { callsIn, parseFuncs } from "@govlab/docs/core/parsers/code.go.parser.ts";
import { describe, expect, it } from "vitest";

const SOURCE = [
    "package main",
    "",
    "func (s *Server) Start(port int) error {",
    "\treturn s.store.Open(port)",
    "}",
    "",
    "func helper() int {",
    "\treturn len(os.Args) + compute(1)",
    "}",
    "",
    "var funcs = 1",
].join("\n");

describe("parseFuncs", () => {
    it("reads each function with its receiver and body bounds", () => {
        const funcs = parseFuncs(SOURCE);
        expect(funcs.map((fn) => [fn.receiver, fn.name])).toStrictEqual([
            ["Server", "Start"],
            [null, "helper"],
        ]);
        expect(SOURCE.slice(funcs[1]?.bodyStart, funcs[1]?.bodyEnd)).toContain("compute(1)");
    });
});

describe("callsIn", () => {
    it("reads calls with their qualifier and skips keywords and builtins", () => {
        const [start, helper] = parseFuncs(SOURCE);
        expect(callsIn(SOURCE, helper?.bodyStart ?? 0, helper?.bodyEnd ?? 0)).toStrictEqual([
            { name: "compute", qualifier: null },
        ]);
        expect(callsIn(SOURCE, start?.bodyStart ?? 0, start?.bodyEnd ?? 0)).toStrictEqual([
            { name: "Open", qualifier: "store" },
        ]);
    });
});
