import { describe, expect, it } from "vitest";
import { validateWith } from "./validation.fixture.ts";

describe("the naming validator", () => {
    it("flags spaces in file names and uppercase folders", () => {
        const found = validateWith("naming", [
            ["src/Utils/thing.ts", "x"],
            ["src/a/my file.ts", "y"],
            ["src/a/ok.ts", "z"],
        ]);
        const messages = found.map((finding) => finding.message).join(" | ");
        expect(messages).toContain("Utils");
        expect(messages).toContain("my file.ts");
    });

    it("does not flag clean kebab paths", () => {
        expect(validateWith("naming", [["src/dom-factory/create-el.ts", "x"]])).toEqual([]);
    });
});
