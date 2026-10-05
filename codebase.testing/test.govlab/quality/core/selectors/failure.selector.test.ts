import { errnoCode, exitDetail, spawnDetail, tailLines } from "@govlab/quality/core/selectors/failure.selector.ts";
import { expect, test } from "vitest";

test("tailLines keeps the last lines joined, or the fallback when the text is blank", () => {
    expect(tailLines("a\nb\nc\nd", "none")).toBe("b c d");
    expect(tailLines("   ", "none")).toBe("none");
});

test("exitDetail prefers stderr and falls back to stdout", () => {
    expect(exitDetail({ status: 1, stderr: "bad", stdout: "out" })).toBe("bad");
    expect(exitDetail({ status: 1, stderr: "", stdout: "out" })).toBe("out");
});

test("errnoCode and spawnDetail read the error code beside the message", () => {
    const error = Object.assign(new Error("spawn x ENOENT"), { code: "ENOENT" });
    expect(errnoCode(error)).toBe("ENOENT");
    expect(spawnDetail(error)).toBe("ENOENT spawn x ENOENT");
    expect(errnoCode(new Error("plain"))).toBe("");
});
