import {
    absentChapters,
    absentRecords,
    chapterSubject,
    definitionNode,
    fileNode,
    folderNode,
    groundedBy,
    groundedChapters,
    recordSubject,
} from "@banes-lab/web/core/factories/evidence.factory.ts";
import { describe, expect, it } from "vitest";

describe("evidence subjects and nodes", () => {
    it("builds a record subject from a collection and an id, and a chapter subject from its three parts", () => {
        expect(recordSubject("architecture", "caching")).toStrictEqual({ kind: "record", ref: "architecture:caching" });
        expect(chapterSubject("method", "build", "one-home")).toStrictEqual({
            kind: "chapter",
            page: "method",
            section: "one-home",
            tab: "build",
        });
    });

    it("builds a definition with an optional file, a file and a folder from its words", () => {
        expect(definitionNode("emitEvent")).toStrictEqual({ file: null, kind: "definition", name: "emitEvent" });
        expect(definitionNode("appendSection", "text.formatter.ts")).toMatchObject({ file: "text.formatter.ts" });
        expect(fileNode("records.barrel.ts")).toStrictEqual({ kind: "file", name: "records.barrel.ts" });
        expect(folderNode("core", "buses")).toStrictEqual({ kind: "folder", words: ["core", "buses"] });
    });
});

describe("groundedBy and absentRecords", () => {
    it("gives every id of a collection the same nodes, or the same declared absence", () => {
        const nodes = [fileNode("records.barrel.ts")];
        expect(groundedBy(nodes, "architecture", ["a", "b"]).map((entry) => entry.subject)).toStrictEqual([
            { kind: "record", ref: "architecture:a" },
            { kind: "record", ref: "architecture:b" },
        ]);
        expect(groundedBy(nodes, "architecture", ["a"])[0]?.nodes).toBe(nodes);
        expect(absentRecords("named-not-built", "architecture", ["vector-clocks"])).toStrictEqual([
            { reason: "named-not-built", subject: { kind: "record", ref: "architecture:vector-clocks" } },
        ]);
    });
});

describe("groundedChapters and absentChapters", () => {
    it("gives every section of one tab the same nodes, or the same declared absence", () => {
        const nodes = [definitionNode("importsDiagram")];
        expect(groundedChapters(nodes, "method", "build", ["a"])).toStrictEqual([
            { nodes, subject: chapterSubject("method", "build", "a") },
        ]);
        expect(absentChapters("a-practice-not-a-construct", "method", "start", ["b", "c"])).toStrictEqual([
            { reason: "a-practice-not-a-construct", subject: chapterSubject("method", "start", "b") },
            { reason: "a-practice-not-a-construct", subject: chapterSubject("method", "start", "c") },
        ]);
    });
});
