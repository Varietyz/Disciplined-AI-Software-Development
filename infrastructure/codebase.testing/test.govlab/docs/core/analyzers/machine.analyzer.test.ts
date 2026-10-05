import { afterAll, describe, expect, it } from "vitest";
import { detectState } from "@govlab/docs/core/analyzers/machine.analyzer.ts";
import { programFor } from "./program.fixture.ts";

const fixture = programFor({
    "machine.ts": [
        'export type Kind = "a" | "b" | "c";',
        'export type JobStatus = "idle" | "running" | "done";',
        'export const NEXT = { idle: "running", running: "done", done: "missing" };',
        'export const AGAIN = { idle: "running" };',
    ].join("\n"),
});
const empty = programFor({ "plain.ts": "export const x = 1;\n" });

afterAll(() => {
    fixture.dispose();
    empty.dispose();
});

describe("detectState", () => {
    it("prefers the status-named union and reads each transition once", () => {
        expect(detectState(fixture.analysis)).toStrictEqual({
            initial: "idle",
            states: ["idle", "running", "done"],
            transitions: [
                { from: "idle", to: "running" },
                { from: "running", to: "done" },
            ],
        });
    });

    it("finds no state machine in a module without a string union", () => {
        expect(detectState(empty.analysis)).toBeNull();
    });
});
