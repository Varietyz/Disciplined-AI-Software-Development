import { transportFindings, transportVerdict } from "#core/validators/server.validator";
import { NO_BUILD_CONFIG } from "#configuration/strings/server.strings";
import { buildConfigFiles } from "#core/loaders/server.loader";
import { defineCheck } from "@govlab/context/check";
import { listenerSurfacesOf } from "#core/adapters/server.adapter";
import { normalizePath } from "@ssot/govlab/shared/resolvers/anchor.resolver.ts";
import process from "node:process";
import { relative } from "node:path";

defineCheck({ detects: [], enforces: ["architecture:encryption-in-transit"] });

const files = buildConfigFiles();

if (files.length === 0) {
    process.stderr.write(NO_BUILD_CONFIG);
    process.exitCode = 1;
} else {
    const findings = await Promise.all(
        files.map(async (file) => {
            const shown = normalizePath(relative(process.cwd(), file));
            return transportFindings(shown, await listenerSurfacesOf(file));
        }),
    );
    const verdict = transportVerdict(findings.flat(), files.length);
    process.stdout.write(verdict.text);
    process.exitCode = verdict.held ? 0 : 1;
}
