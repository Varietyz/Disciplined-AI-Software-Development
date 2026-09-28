import { NO_GENERATOR, generatorFailed, generatorRunning, generatorsRan } from "../strings/document.strings.ts";
import { isResolved, projectRoot, slotList, surfacePrefix } from "../../../config/surface.config.ts";

import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const REPO_ROOT = projectRoot();

const SLOT = "document_generators";

const RUNTIME = process.execPath;

const main = function main(): number {
    if (!isResolved("execution", SLOT)) {
        process.stdout.write(NO_GENERATOR);
        return 0;
    }

    const declared = slotList("execution", SLOT);
    const cwd = resolve(REPO_ROOT, surfacePrefix());

    for (const invocation of declared) {
        const argv = invocation.split(" ").filter((token) => token.length > 0);
        process.stdout.write(generatorRunning(invocation));

        const outcome = spawnSync(RUNTIME, argv, { cwd, stdio: "inherit" });
        if (outcome.status === 0) {
            continue;
        }

        process.stdout.write(generatorFailed(invocation, outcome.status));
        return 1;
    }

    process.stdout.write(generatorsRan(declared.length));
    return 0;
};

process.exit(main());
