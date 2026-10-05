import {
    BUILDING,
    BUILD_FAILED,
    BUILT,
    SITE_INVALID,
    SITE_VALID,
    VALIDATING_SITE,
    buildEnded,
} from "#configuration/strings/deployment.strings";
import type { ChildExit, Journal } from "#types/deployment.types";
import { absolutePath } from "@ssot/paths";
import { buildRelease } from "#core/adapters/release.adapter";
import { messageOf } from "#core/converters/failure.converter";
import { reportOf } from "@banes-lab/build-scripts/core/formatters/validation.formatter.ts";
import { validateDiscovery } from "@banes-lab/build-scripts/core/coordinators/validation.coordinator.ts";

export const validateSite = async function validateSite(
    journal: Journal,
    validate: typeof validateDiscovery = validateDiscovery,
): Promise<void> {
    journal.log(VALIDATING_SITE);
    const findings = await validate();
    if (findings.length > 0) {
        throw new Error(SITE_INVALID + reportOf(findings));
    }
    journal.mark(SITE_VALID);
};

export const buildSite = async function buildSite(
    journal: Journal,
    run: typeof buildRelease = buildRelease,
): Promise<void> {
    journal.log(BUILDING);
    const ended: ChildExit = await run(absolutePath("app.member")).catch((error: unknown) => {
        throw new Error(BUILD_FAILED + messageOf(error), { cause: error });
    });
    if (ended.code !== 0) {
        throw new Error(BUILD_FAILED + buildEnded(ended.code, ended.signal));
    }
    journal.mark(BUILT);
};
