import { FAILURE_EXIT, FLAG_NAMES } from "#configuration/constants/invocation.constants";
import { MARKDOWN_SUFFIX, PACKAGE_FILE } from "#configuration/constants/document.constants";
import {
    deadScriptPath,
    deadScriptsFailure,
    scriptSummary,
    strictFailure,
} from "#configuration/strings/finding.strings";
import { flagValue, hasFlag, resolveArgv } from "@govlab/argv";
import { print, printErr } from "#core/reporters/base.reporter";
import { DOCUMENT_ARGV } from "#configuration/configs/invocation.config";
import { DOCUMENT_USAGE } from "#configuration/strings/invocation.strings";
import { DocValidator } from "#core/coordinators/validation.coordinator";
import type { DocsHost } from "#types/environment.types";
import type { ParsedArgv } from "@govlab/argv";
import { ROOT } from "@ssot/paths";
import { deadScriptRefs } from "#core/validators/package.validator";
import { docsHostFor } from "#core/factories/environment.factory";
import { indexDirectory } from "#core/persistence/catalog.persistence";
import process from "node:process";
import { runCatalog } from "#core/coordinators/catalog.coordinator";
import { runFix } from "#core/coordinators/markdown.coordinator";
import { runNew } from "#core/coordinators/template.coordinator";

const flagText = function flagText(argv: ParsedArgv, name: string): string {
    return flagValue(argv, name) ?? "";
};

const checkScripts = function checkScripts(host: DocsHost): number {
    const manifests = host.walk(host.root, PACKAGE_FILE);
    const dead = manifests.flatMap((pkgPath) =>
        deadScriptRefs(pkgPath).map((ref) => deadScriptPath(host.relative(pkgPath), ref.script, ref.path)),
    );
    for (const line of dead) {
        printErr(line);
    }
    print(scriptSummary(dead.length, manifests.length));
    return dead.length;
};

const runValidate = async function runValidate(host: DocsHost, strict: boolean): Promise<boolean> {
    const docFindings = await new DocValidator(host.ctx).run(host.walk(host.root, MARKDOWN_SUFFIX));
    const deadScripts = checkScripts(host);
    if (deadScripts > 0) {
        printErr(deadScriptsFailure(deadScripts));
    }
    if (strict && docFindings > 0) {
        printErr(strictFailure(docFindings));
    }
    return deadScripts === 0 && !(strict && docFindings > 0);
};

const newDocument = function newDocument(host: DocsHost, argv: ParsedArgv): void {
    const type = flagText(argv, FLAG_NAMES.type);
    runNew(
        { locationOptions: host.locationOptions, registries: host.registries, root: host.root, userReg: host.userReg },
        {
            concern: flagText(argv, FLAG_NAMES.concern),
            form: type.length > 0 ? type : flagText(argv, FLAG_NAMES.form),
            member: flagText(argv, FLAG_NAMES.member),
            name: flagText(argv, FLAG_NAMES.name),
            status: flagText(argv, FLAG_NAMES.status),
            subject: flagText(argv, FLAG_NAMES.subject),
            summary: flagText(argv, FLAG_NAMES.docSummary),
        },
    );
};

const run = async function run(argv: ParsedArgv): Promise<boolean> {
    const host = await docsHostFor(ROOT);
    if (hasFlag(argv, FLAG_NAMES.fix)) {
        runFix(host);
        return true;
    }
    if (hasFlag(argv, FLAG_NAMES.validate)) {
        return runValidate(host, hasFlag(argv, FLAG_NAMES.strict));
    }
    if (hasFlag(argv, FLAG_NAMES.catalog)) {
        await runCatalog(
            {
                docs: host.walk(host.root, MARKDOWN_SUFFIX),
                relative: host.relative,
                root: host.root,
                rootPrefix: host.rootPrefix,
            },
            indexDirectory(),
        );
        return true;
    }
    if (hasFlag(argv, FLAG_NAMES.new)) {
        newDocument(host, argv);
        return true;
    }
    printErr(DOCUMENT_USAGE);
    return false;
};

try {
    process.exitCode = (await run(resolveArgv(DOCUMENT_ARGV))) ? 0 : FAILURE_EXIT;
} catch (error) {
    printErr(error instanceof Error ? error.message : String(error));
    process.exitCode = FAILURE_EXIT;
}
