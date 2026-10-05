import { describe, expect, it } from "vitest";
import { noPackageName, notJsonObject, notValidJson } from "@ssot/govlab/shared/strings/manifest.strings.ts";

describe("the manifest reader errors", () => {
    it("name the file each refusal is about", () => {
        expect(notValidJson("a/package.json")).toContain("a/package.json is not valid JSON");
        expect(notJsonObject("a/package.json")).toContain("a/package.json does not hold a JSON object");
        expect(noPackageName("a")).toContain("a declares no package name");
    });
});
