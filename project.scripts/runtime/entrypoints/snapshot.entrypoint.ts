import { NO_BROWSER, REFUSED_ARGUMENTS } from "#configuration/strings/snapshot.strings";
import { SNAPSHOT_ARGV } from "#configuration/configs/snapshot.config";
import { capturePage } from "#core/coordinators/snapshot.coordinator";
import { findBrowser } from "@banes-lab/build-scripts/core/resolvers/browser.resolver.ts";
import process from "node:process";
import { readOptions } from "#core/converters/snapshot.converter";
import { resolveArgv } from "@govlab/argv";

const options = readOptions(resolveArgv(SNAPSHOT_ARGV));
const binary = options === null ? null : findBrowser(options.browser);

if (options === null) {
    process.stderr.write(REFUSED_ARGUMENTS);
    process.exitCode = 1;
} else if (binary === null) {
    process.stderr.write(NO_BROWSER);
    process.exitCode = 1;
} else {
    process.exitCode = (await capturePage(binary, options)) ? 0 : 1;
}
