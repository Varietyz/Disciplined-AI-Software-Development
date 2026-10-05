import { CREDENTIAL_EXCLUSIONS, CREDENTIAL_EXTENSIONS } from "#configuration/constants/credential.constants";
import { ROOT, absolutePath } from "@ssot/paths";
import { credentialFindings } from "#core/analyzers/credential.analyzer";
import { credentialVerdict } from "#core/validators/credential.validator";
import { defineCheck } from "@govlab/context/check";
import { includedFilesUnder } from "#core/loaders/source.loader";
import { loadDetectors } from "@ssot/secrets";
import { normalizePath } from "@ssot/govlab/shared/resolvers/anchor.resolver.ts";
import process from "node:process";
import { readFileSync } from "node:fs";
import { relative } from "node:path";

defineCheck({
    detects: ["architecture:hardcoded-configuration", "architecture:secret-sprawl"],
    enforces: ["architecture:secrets-management"],
});

const excluded = CREDENTIAL_EXCLUSIONS.map((exclusion) => absolutePath(exclusion.key));
const detectors = await loadDetectors();
const files = [
    ...includedFilesUnder(ROOT, CREDENTIAL_EXTENSIONS),
    ...includedFilesUnder(absolutePath("methodology.root"), CREDENTIAL_EXTENSIONS),
].filter((file) => !excluded.some((folder) => file.startsWith(folder)));
const findings = files.flatMap((file) =>
    credentialFindings(normalizePath(relative(ROOT, file)), readFileSync(file, "utf8"), detectors),
);
const verdict = credentialVerdict(findings, files.length);
process.stdout.write(verdict.text);
process.exitCode = verdict.held ? 0 : 1;
