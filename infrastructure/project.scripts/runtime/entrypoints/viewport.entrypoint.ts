import { NO_BROWSER, NO_BUILD, REFUSED_ARGUMENTS, unknownRoute } from "#configuration/strings/viewport.strings";
import { VIEWPORT_ARGV } from "#configuration/configs/viewport.config";
import { absolutePath } from "@ssot/paths";
import { auditRoutes } from "#core/coordinators/viewport.coordinator";
import { builtRoutes } from "#core/loaders/viewport.loader";
import { findBrowser } from "@banes-lab/build-scripts/core/resolvers/browser.resolver.ts";
import { mkdirSync } from "node:fs";
import process from "node:process";
import { readOptions } from "#core/converters/viewport.converter";
import { resolveArgv } from "@govlab/argv";

const options = readOptions(resolveArgv(VIEWPORT_ARGV));
const root = absolutePath("builds.web");
const built = builtRoutes(root);
const unknown = options === null ? [] : options.routes.filter((route) => !built.includes(route));
const binary = options === null ? null : findBrowser(options.browser);

if (options === null) {
    process.stderr.write(REFUSED_ARGUMENTS);
    process.exitCode = 1;
} else if (built.length === 0) {
    process.stderr.write(NO_BUILD);
    process.exitCode = 1;
} else if (unknown.length > 0) {
    process.stderr.write(unknown.map(unknownRoute).join(""));
    process.exitCode = 1;
} else if (binary === null) {
    process.stderr.write(NO_BROWSER);
    process.exitCode = 1;
} else {
    mkdirSync(options.outDir, { recursive: true });
    const routes = options.routes.length > 0 ? options.routes : built;
    process.exitCode = (await auditRoutes(binary, options, root, routes)) ? 0 : 1;
}
