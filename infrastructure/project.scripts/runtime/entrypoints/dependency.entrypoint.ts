import { hoistVerdict, installScriptVerdict } from "#core/validators/dependency.validator";
import { ROOT } from "@ssot/paths";
import { defineCheck } from "@govlab/context/check";
import { hoistBreaches } from "#core/analyzers/dependency.analyzer";
import { installScriptListing } from "#core/adapters/dependency.adapter";
import process from "node:process";

defineCheck({ detects: [], enforces: ["architecture:single-source-of-truth"] });

const verdicts = [hoistVerdict(hoistBreaches(ROOT)), installScriptVerdict(installScriptListing())];
for (const verdict of verdicts) {
    process.stdout.write(verdict.text);
}
process.exitCode = verdicts.every((verdict) => verdict.held) ? 0 : 1;
