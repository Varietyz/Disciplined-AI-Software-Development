import { EXTENSION_DOT, NO_EXTENSION } from "@govlab/stats/configuration/constants/source.constants.ts";
import { describe, expect, it } from "vitest";
import { extensionOf, posixOf } from "@govlab/stats/core/selectors/source.selector.ts";
import { join } from "node:path";

describe("extensionOf and posixOf", () => {
    it("lower-case the extension, name a file without one, and join a path with forward slashes", () => {
        expect(extensionOf("A.TS")).toBe(`${EXTENSION_DOT}ts`);
        expect(extensionOf(".profile")).toBe(NO_EXTENSION);
        expect(extensionOf("Makefile")).toBe(NO_EXTENSION);
        expect(posixOf(join("a", "b"))).toBe("a/b");
    });
});
