import { bindingClean, bindingFailed, bindingLine } from "@govlab/quality/configuration/strings/binding.strings.ts";
import { expect, test } from "vitest";

const COUNT = 3;

test("binding strings report the clean count, the failure count and one line per finding", () => {
    expect(bindingClean(COUNT)).toContain("all 3 rules");
    expect(bindingFailed(COUNT)).toContain("3 finding(s)");
    expect(bindingLine({ detail: "", file: "a.ts", id: "no-x", reason: "no-contract" })).toContain("no-x");
    expect(bindingLine({ detail: "ghost", file: "a.ts", id: "no-x", reason: "unknown-concept" })).toContain("(ghost)");
});
