import { ACTIVITY_VERBS, DOC_CONCERNS } from "#configuration/constants/concern.constants";
import { EXTENSION_DIR, loadUserRegistries } from "#core/loaders/registry.loader";
import { FLAG_NAMES, LIST_SEPARATOR } from "#configuration/constants/invocation.constants";
import { ROOT, absolutePath } from "@ssot/paths";
import { docsConfig, loadGovlabConfig } from "@govlab/quality/config";
import { flagValue, hasFlag, resolveArgv } from "@govlab/argv";
import { loadConceptMap, loadGovernanceDeriver } from "#core/loaders/quality.loader";
import { print, printErr } from "#core/reporters/base.reporter";
import type { ArchPort } from "#types/readme.types";
import { DOC_FORMS } from "#configuration/constants/form.constants";
import { DOC_VERBS } from "#configuration/constants/verb.constants";
import { DocChecks } from "#core/coordinators/document.coordinator";
import { GENERATED_MARK_PREFIX } from "@govlab/canonical-write";
import type { ManifestModule } from "#types/manifest.types";
import { PACKAGE_ARGV } from "#configuration/configs/invocation.config";
import { PACKAGE_TEXT } from "#configuration/strings/package.strings";
import { SpecOutputs } from "#core/factories/document.output.factory";
import { createArchRelations } from "@govlab/context";
import { createModuleDocs } from "#core/factories/document.factory";
import { deriveRepoMetrics } from "#core/adapters/vcs.adapter";
import { discoverManifests } from "#core/loaders/manifest.loader";
import { formatMarkdown } from "#core/adapters/markdown.adapter";
import { persistSpec } from "#core/persistence/document.persistence";
import process from "node:process";
import { resolve } from "node:path";
import { workspaceMapTargetFor } from "#core/coordinators/dependency.coordinator";

const TRAILING_SLASH = "/";
const FAILURE_EXIT = 1;

const argv = resolveArgv(PACKAGE_ARGV);
const config = await loadGovlabConfig(ROOT);
const docs = docsConfig(config);
const harnessRoot = docs.harness?.root ?? null;
const harnessDot = harnessRoot?.endsWith(TRAILING_SLASH) === true ? harnessRoot.slice(0, -1) : harnessRoot;
const discoverOptions = { allowDot: new Set([EXTENSION_DIR, ...(harnessDot === null ? [] : [harnessDot])]) };
const discoverAll = (): ManifestModule[] => discoverManifests(ROOT, discoverOptions);

const registries = await loadUserRegistries(
    ROOT,
    { activityVerbs: ACTIVITY_VERBS, concerns: DOC_CONCERNS, forms: DOC_FORMS, refVerbs: DOC_VERBS },
    { allowGlobal: config.extensions?.global ?? false },
);

const relations = createArchRelations();
const archRelations: ArchPort = {
    get: (id) => relations.get(id),
    resolve: (ids) => relations.resolve([...ids]),
    validateOntology: () => relations.validateOntology(),
};

const engine = createModuleDocs({
    archRelations,
    conceptMap: loadConceptMap(absolutePath("govlab.quality.generated.concepts")),
    consumerRoot: ROOT,
    deriveGovernedBy: loadGovernanceDeriver(absolutePath("govlab.quality.generated.rules")),
    deriveRepoMetrics,
    docConcerns: registries.concerns,
    docForms: registries.forms,
    docMembers: docs.members,
    hostTokens: docs.hostTokens,
});

const outputs = new SpecOutputs({ discoverAll, engine, formatMarkdown, root: ROOT });
const checks = new DocChecks({
    discoverAll,
    engine,
    generatedPrefix: GENERATED_MARK_PREFIX,
    moduleOutputs: async (module) => outputs.moduleOutputs(module),
    workspaceMapTarget: workspaceMapTargetFor({
        declaredDocLocation: (doc) => engine.declaredDocLocation(doc),
        discoverAll,
        formatMarkdown,
        renderDeclaredDoc: (doc) => engine.renderDeclaredDoc(doc),
        root: ROOT,
    }),
    writeSpec: persistSpec,
});

const onlyValue = flagValue(argv, FLAG_NAMES.only);
const only = onlyValue === undefined ? null : new Set(onlyValue.split(LIST_SEPARATOR));
const workspaceMapOnly = hasFlag(argv, FLAG_NAMES.workspaceMapOnly);
const [target] = argv.positionals;

try {
    if (hasFlag(argv, FLAG_NAMES.list)) {
        for (const module of discoverAll()) {
            print(module.relPath);
        }
    } else if (hasFlag(argv, FLAG_NAMES.fix) || hasFlag(argv, FLAG_NAMES.check)) {
        const findings = await checks.checkModules({ fix: hasFlag(argv, FLAG_NAMES.fix), only, workspaceMapOnly });
        process.exitCode = hasFlag(argv, FLAG_NAMES.check) && findings > 0 ? FAILURE_EXIT : 0;
    } else if (hasFlag(argv, FLAG_NAMES.all)) {
        await checks.generateAll({ only, workspaceMapOnly });
    } else if (target !== undefined && hasFlag(argv, FLAG_NAMES.write)) {
        await checks.writeOne(target);
    } else if (target === undefined) {
        printErr(PACKAGE_TEXT.usage);
        process.exitCode = FAILURE_EXIT;
    } else {
        const readme = engine.generateReadme(resolve(target));
        process.stdout.write(await formatMarkdown(readme));
    }
} catch (error) {
    printErr(error instanceof Error ? error.message : String(error));
    process.exitCode = FAILURE_EXIT;
}
