import { expect, test } from "vitest";
import { bindingFindings } from "@govlab/quality/core/validators/binding.validator.ts";

const rule = (id: string, text: string): { file: string; id: string; text: string } => ({ file: `${id}.ts`, id, text });

const isConcept = (concept: string): boolean => concept === "magic-number";

test("bindingFindings reports a rule with no contract, no canonical list, or an unknown concept", () => {
    const contracts = new Set(["no-x"]);
    expect(bindingFindings([rule("no-x", 'canonical: ["magic-number"]')], contracts, isConcept)).toStrictEqual([]);
    const findings = bindingFindings([rule("no-y", 'canonical: ["ghost"]'), rule("no-x", "")], contracts, isConcept);
    expect(findings.map((finding) => finding.reason)).toStrictEqual(["no-contract", "unknown-concept", "no-canonical"]);
});
