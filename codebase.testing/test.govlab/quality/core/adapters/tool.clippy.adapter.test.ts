import { clippyArgs, runClippy } from "@govlab/quality/core/adapters/tool.clippy.adapter.ts";
import { describe, expect, it } from "vitest";

describe("clippyArgs", () => {
    it("enables SSOT-mapped lints after `--` as `-W <lint>`", () => {
        expect(clippyArgs(["clippy::too_many_lines", "clippy::too_many_arguments"], false)).toEqual([
            "clippy",
            "--message-format",
            "json",
            "--",
            "-W",
            "clippy::too_many_lines",
            "-W",
            "clippy::too_many_arguments",
        ]);
    });

    it("omits the `--` separator when there are no lints to enable", () => {
        expect(clippyArgs([], false)).toEqual(["clippy", "--message-format", "json"]);
    });

    it("prepends the safe-autofix flags on the fix pass", () => {
        expect(clippyArgs([], true)).toEqual([
            "clippy",
            "--fix",
            "--allow-dirty",
            "--allow-no-vcs",
            "--message-format",
            "json",
        ]);
    });

    it("exposes the runner the registry dispatches", () => {
        expect(typeof runClippy).toBe("function");
    });
});
