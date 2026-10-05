import { NO_BROWSER, REFUSED_ARGUMENTS } from "#configuration/strings/route.strings";
import { CAPTURE_ARGV } from "#configuration/configs/route.config";
import { captureRoutes } from "#core/coordinators/route.coordinator";
import { findBrowser } from "@banes-lab/build-scripts/core/resolvers/browser.resolver.ts";
import process from "node:process";
import { readCaptureOptions } from "#core/converters/route.converter";
import { resolveArgv } from "@govlab/argv";

const options = readCaptureOptions(resolveArgv(CAPTURE_ARGV));
const binary = options === null ? null : findBrowser(options.browser);

if (options === null) {
    process.stderr.write(REFUSED_ARGUMENTS);
    process.exitCode = 1;
} else if (binary === null) {
    process.stderr.write(NO_BROWSER);
    process.exitCode = 1;
} else {
    process.exitCode = (await captureRoutes(binary, options)) ? 0 : 1;
}
