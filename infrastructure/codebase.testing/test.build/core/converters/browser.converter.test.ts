import {
    consoleRecord,
    eventRecord,
    exceptionRecord,
} from "@banes-lab/build-scripts/core/converters/browser.converter.ts";
import { describe, expect, it } from "vitest";
import type { ConsoleRecord } from "@banes-lab/build-scripts/types/browser.types.ts";

describe("consoleRecord", () => {
    it("joins the arguments and locates the first call frame", () => {
        const record: ConsoleRecord = consoleRecord({
            args: [{ value: "hello" }, { value: 2 }],
            stackTrace: { callFrames: [{ lineNumber: 4, url: "https://site.test/app.js" }] },
            type: "warning",
        });
        expect(record).toStrictEqual({ level: "warning", source: "https://site.test/app.js:5", text: "hello 2" });
    });

    it("defaults to the log level with no source when nothing is known", () => {
        expect(consoleRecord(null)).toStrictEqual({ level: "log", source: "", text: "" });
    });
});

describe("eventRecord", () => {
    it("records a console call and a thrown exception and ignores any other event", () => {
        const logged = eventRecord({
            method: "Runtime.consoleAPICalled",
            params: { args: [{ value: "hi" }], type: "log" },
        });
        expect(logged?.text).toBe("hi");
        const thrown = eventRecord({
            method: "Runtime.exceptionThrown",
            params: { exceptionDetails: { exception: { description: "Boom" }, lineNumber: 0, url: "a.js" } },
        });
        expect(thrown).toStrictEqual({ level: "exception", source: "a.js:1", text: "Boom" });
        expect(eventRecord({ method: "Page.loadEventFired", params: {} })).toBeNull();
    });
});

describe("exceptionRecord", () => {
    it("takes the first line of the thrown description", () => {
        const record = exceptionRecord({ exception: { description: "Boom\n  at x" }, lineNumber: 1, url: "a.js" });
        expect(record).toStrictEqual({ level: "exception", source: "a.js:2", text: "Boom" });
    });
});
