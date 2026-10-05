import { accessHeading, accessLine, accessTotal } from "#configuration/strings/invocation.strings";
import { ACCESS_ARGV } from "#configuration/configs/invocation.config";
import { DEFAULT_PROJECTS } from "#configuration/constants/invocation.constants";
import { fixIndexAccess } from "#core/coordinators/access.coordinator";
import path from "node:path";
import process from "node:process";
import { resolveArgv } from "@govlab/argv";

const argv = resolveArgv(ACCESS_ARGV);
const projects = argv.rest.length > 0 ? argv.rest : DEFAULT_PROJECTS;

process.stdout.write(accessHeading);
const counts = projects.map((project) => {
    const fixed = fixIndexAccess(path.resolve(project));
    process.stdout.write(accessLine(project, fixed));
    return fixed;
});
process.stdout.write(accessTotal(counts.reduce((sum, count) => sum + count, 0)));
