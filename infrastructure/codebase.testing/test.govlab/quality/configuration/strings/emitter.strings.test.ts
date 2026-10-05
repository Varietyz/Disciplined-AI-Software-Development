import { describe, expect, it } from "vitest";
import { duplicateFormatter, missingFormatter } from "@govlab/quality/configuration/strings/emitter.strings.ts";

describe("emitter strings", () => {
    it("name the config format and the tool whose descriptor names it", () => {
        expect(duplicateFormatter("toml")).toContain('"toml"');
        expect(missingFormatter("ini", "pylint")).toContain("pylint");
    });
});
