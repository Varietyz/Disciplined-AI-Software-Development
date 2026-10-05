import { describe, expect, it } from "vitest";
import {
    namedWalk,
    packCells,
    refOf,
    severityOf,
    unpackCells,
    walkCells,
} from "@govlab/patterns/core/converters/walk.converter.ts";
import type { CodeSymbol } from "@govlab/patterns/types/code.types.ts";
import type { WalkNode } from "@govlab/patterns/types/walk.types.ts";
import { walkGrid } from "@govlab/patterns/core/resolvers/walk.resolver.ts";

const REF_INDEX = 35;
const LINE_CALL = 3;
const LINE_DEF = 7;

const walk: WalkNode[] = [
    { depth: 0, label: "program", role: "node" },
    { depth: 1, file: "a.ts", label: "function_declaration", line: 2, name: "run", role: "definition" },
    { depth: 2, label: "call_expression", role: "call", text: "fetch(url(x))" },
];

const symbolAt = function symbolAt(role: string, line: number, name: string): CodeSymbol {
    return {
        callable: false,
        enclosing: "root",
        exported: false,
        file: "",
        hash: "",
        kind: role,
        line,
        member: false,
        name,
        role,
        size: 0,
    };
};

describe("the walk converter", () => {
    it("refOf writes the index in base 36", () => {
        expect(refOf(REF_INDEX)).toBe("z");
    });

    it("walkCells carries each node's data by ref and breaks markup-unsafe tokens in its text", () => {
        const cells = walkCells(walk);
        expect(cells[1]).toMatchObject({ file: "a.ts", name: "run", ref: "1", state: "declare" });
        expect(cells[2]?.text).toBe("fetch(url (x))");
    });

    it("severityOf reads the flag keyed by the node's file and name", () => {
        const [, cell] = walkGrid(walk);
        expect(cell !== undefined && severityOf(cell, new Map([["a.ts::run", "high"]]))).toBe("high");
        expect(walkCells(walk, new Map([["a.ts::run", "high"]]))[1]?.severity).toBe("high");
    });

    it("packCells and unpackCells round-trip the cells with their refs", () => {
        const cells = walkCells(walk);
        const packed = packCells(cells);
        expect(packed.columns).toHaveLength(packed.rows[0]?.length ?? 0);
        expect(unpackCells(packed)).toStrictEqual(cells);
    });

    it("namedWalk names a node by its role and line, first symbol winning", () => {
        const records = [
            { line: LINE_CALL, nodeType: "call_expression", role: "call" },
            { line: LINE_DEF, nodeType: "lexical_declaration", role: "declare" },
        ];
        const named = namedWalk(records, [symbolAt("call", LINE_CALL, "a"), symbolAt("call", LINE_CALL, "b")]);
        expect(named.map((node) => node.name)).toStrictEqual(["a", undefined]);
    });
});
