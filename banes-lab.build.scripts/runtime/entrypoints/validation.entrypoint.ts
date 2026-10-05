import { defineCheck } from "@govlab/context/check";
import process from "node:process";
import { reportOf } from "#core/formatters/validation.formatter";
import { validateDiscovery } from "#core/coordinators/validation.coordinator";

defineCheck({ detects: [], enforces: ["architecture:self-describing-api"] });

const findings = await validateDiscovery();
process.stdout.write(reportOf(findings));
process.exitCode = findings.length === 0 ? 0 : 1;
