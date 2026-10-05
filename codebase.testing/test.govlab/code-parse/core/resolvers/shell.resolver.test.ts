import {
    WINDOWS,
    WINDOWS_SHELL,
    WINDOWS_SHELL_FLAGS,
} from "@govlab/code-parse/configuration/constants/shell.constants.ts";
import { describe, expect, it } from "vitest";
import { invocationFor } from "@govlab/code-parse/core/resolvers/shell.resolver.ts";

describe("invocationFor", () => {
    it("routes through the command interpreter on Windows, where a package binary is a batch shim the loader refuses to spawn directly", () => {
        const invocation = invocationFor(WINDOWS, "npm", ["pack", "tree-sitter-json"]);
        expect(invocation.file).toBe(WINDOWS_SHELL);
        expect(invocation.args).toEqual([...WINDOWS_SHELL_FLAGS, "npm", "pack", "tree-sitter-json"]);
    });

    it("spawns the binary directly with its arguments everywhere else", () => {
        for (const platform of ["linux", "darwin", "freebsd"]) {
            expect(invocationFor(platform, "npm", ["pack"])).toEqual({ args: ["pack"], file: "npm" });
        }
    });
});
