import { bindingClean, bindingFailed, bindingLine } from "#configuration/strings/binding.strings";
import { bindingFindings } from "#core/validators/binding.validator";
import { createGovlabContext } from "@govlab/context";
import { isRegisteredConcept } from "#configuration/quality/generated/canon.generated";
import { loadRuleSources } from "#core/loaders/binding.loader";
import process from "node:process";

const FAILURE = 1;

const rules = loadRuleSources();
const contracts = new Set(createGovlabContext().algo.ids());
const findings = bindingFindings(rules, contracts, isRegisteredConcept);

if (findings.length === 0) {
    process.stdout.write(bindingClean(rules.length));
} else {
    process.stderr.write(bindingFailed(findings.length));
    for (const finding of findings) {
        process.stderr.write(bindingLine(finding));
    }
    process.exitCode = FAILURE;
}
