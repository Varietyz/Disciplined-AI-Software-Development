import { expect, test } from "vitest";
import { absolutePath } from "@ssot/paths";
import { loadRuleFolder } from "@govlab/quality/core/loaders/rule.loader.ts";

test("loadRuleFolder imports every rule file in a folder under the id its file name carries", async () => {
    const files = await loadRuleFolder(absolutePath("govlab.quality.contextRules"), ".eslint.rule.ts");
    expect(files.map((file) => file.id)).toContain("no-inline-context-literal");
    expect(files.every((file) => typeof file.module["default"] === "object")).toBe(true);
});
