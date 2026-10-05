import {
    MODULES_FOLDER,
    MODULE_LOADERS,
    PACKAGE_INDEX_COMMAND,
    PACKAGE_INSTALL_COMMAND,
    PACKAGE_LOCK_WAIT,
    PACKAGE_REMOVE_COMMAND,
    PACKAGE_REVERT_COMMAND,
    REMOTE_SITE_CONFIG,
    SERVICE_ENABLE_COMMAND,
    SETUP_STAGING,
    SITE_LINK,
    TEST_COMMAND,
} from "#configuration/constants/nginx.constants";
import {
    PACKAGES_INSTALLING,
    PACKAGES_REVERTED,
    PACKAGES_REVERTING,
    PACKAGE_INSTALL_FAILED,
    PACKAGE_REVERT_FAILED,
    TEST_FAILED,
} from "#configuration/strings/nginx.strings";
import type { PackageStanza, SetupContext, SetupEffect, Shell } from "#types/deployment.types";
import { compileModules, restoreModules, settleModules, swapModules, verifiedFetch } from "#core/steps/build.step";
import { fileOf } from "#core/converters/index.converter";
import { pushConfigs } from "#core/steps/nginx.step";

const COMMAND_JOIN = " && ";

const always = function always(): boolean {
    return true;
};

const buildsModules = function buildsModules(context: SetupContext): boolean {
    return context.modules.length > 0;
};

const installsPackages = function installsPackages(context: SetupContext): boolean {
    return context.plan.install.length > 0;
};

const restoresPackages = function restoresPackages(context: SetupContext): boolean {
    return context.plan.revert.length > 0 || context.plan.added.length > 0;
};

export const checked = async function checked(shell: Shell, command: string, failure: string): Promise<string> {
    const result = await shell.run(command);
    if (result.code !== 0) {
        throw new Error(failure + result.stderr);
    }
    return result.stdout;
};

export const stagedOf = function stagedOf(stanzas: readonly PackageStanza[]): readonly string[] {
    return stanzas.map((stanza) => `${SETUP_STAGING}/${fileOf(stanza)}`);
};

export const runEffects = async function runEffects(
    effects: readonly SetupEffect[],
    context: SetupContext,
): Promise<void> {
    const [first, ...rest] = effects;
    if (first === undefined) {
        return;
    }
    if (first.applies(context)) {
        await first.run(context);
    }
    await runEffects(rest, context);
};

const writeLoaders = async function writeLoaders(context: SetupContext): Promise<void> {
    const commands = MODULE_LOADERS.map(
        (loader) =>
            `if [ -f ${MODULES_FOLDER}/${loader.object} ]; then echo 'load_module modules/${loader.object};' | sudo tee ${loader.file} > /dev/null; else sudo rm -f ${loader.file}; fi`,
    );
    await checked(context.shell, commands.join(COMMAND_JOIN), PACKAGE_INSTALL_FAILED);
};

const enableService = async function enableService(context: SetupContext): Promise<void> {
    await checked(context.shell, SERVICE_ENABLE_COMMAND, PACKAGE_INSTALL_FAILED);
};

const testConfig = async function testConfig(context: SetupContext): Promise<void> {
    await checked(context.shell, TEST_COMMAND, TEST_FAILED);
};

const testRestored = async function testRestored(context: SetupContext): Promise<void> {
    await checked(context.shell, TEST_COMMAND, PACKAGE_REVERT_FAILED);
};

const stagePackages = async function stagePackages(context: SetupContext): Promise<void> {
    const stanzas = [...context.plan.install, ...context.plan.revert];
    const staged = stagedOf(stanzas);
    const fetches = stanzas.map((stanza, at) => verifiedFetch(stanza.url, staged[at] ?? "", stanza.sha256));
    await checked(context.shell, [`mkdir -p ${SETUP_STAGING}`, ...fetches].join(COMMAND_JOIN), PACKAGE_INSTALL_FAILED);
};

const buildModules = async function buildModules(context: SetupContext): Promise<void> {
    await compileModules(context.shell, context.journal, context.modules);
};

const placeModules = async function placeModules(context: SetupContext): Promise<void> {
    await swapModules(context.shell, context.modules);
};

const installPackages = async function installPackages(context: SetupContext): Promise<void> {
    context.journal.log(PACKAGES_INSTALLING + context.plan.install.map(fileOf).join(", "));
    const install = `${PACKAGE_INSTALL_COMMAND} ${stagedOf(context.plan.install).join(" ")}`;
    await checked(
        context.shell,
        [PACKAGE_LOCK_WAIT, PACKAGE_INDEX_COMMAND, install].join(COMMAND_JOIN),
        PACKAGE_INSTALL_FAILED,
    );
};

const keepModules = async function keepModules(context: SetupContext): Promise<void> {
    await settleModules(context.shell, context.modules);
};

const returnModules = async function returnModules(context: SetupContext): Promise<void> {
    context.journal.log(PACKAGES_REVERTING);
    await restoreModules(context.shell, context.modules);
};

const returnPackages = async function returnPackages(context: SetupContext): Promise<void> {
    const { plan } = context;
    const commands = [
        PACKAGE_LOCK_WAIT,
        ...(plan.revert.length > 0 ? [`${PACKAGE_REVERT_COMMAND} ${stagedOf(plan.revert).join(" ")}`] : []),
        ...(plan.added.length > 0 ? [`${PACKAGE_REMOVE_COMMAND} ${plan.added.join(" ")}`] : []),
    ];
    await checked(context.shell, commands.join(COMMAND_JOIN), PACKAGE_REVERT_FAILED);
};

const reportRestored = async function reportRestored(context: SetupContext): Promise<void> {
    await Promise.resolve();
    context.journal.log(PACKAGES_REVERTED);
};

const pushSite = async function pushSite(context: SetupContext): Promise<void> {
    await pushConfigs(context.shell, context.journal);
};

const linkSite = async function linkSite(context: SetupContext): Promise<void> {
    await checked(context.shell, `sudo ln -sfn ${REMOTE_SITE_CONFIG} ${SITE_LINK}`, PACKAGE_INSTALL_FAILED);
};

export const UPKEEP_EFFECTS: readonly SetupEffect[] = [
    { applies: always, run: writeLoaders },
    { applies: always, run: enableService },
];

const SERVICE_EFFECTS: readonly SetupEffect[] = [...UPKEEP_EFFECTS, { applies: always, run: testConfig }];

export const STAGE_EFFECTS: readonly SetupEffect[] = [
    { applies: always, run: stagePackages },
    { applies: buildsModules, run: buildModules },
];

export const APPLY_EFFECTS: readonly SetupEffect[] = [
    { applies: buildsModules, run: placeModules },
    { applies: installsPackages, run: installPackages },
    ...SERVICE_EFFECTS,
    { applies: buildsModules, run: keepModules },
];

export const REVERT_EFFECTS: readonly SetupEffect[] = [
    { applies: always, run: returnModules },
    { applies: restoresPackages, run: returnPackages },
    { applies: always, run: writeLoaders },
    { applies: always, run: testRestored },
    { applies: always, run: reportRestored },
];

export const PUBLISH_EFFECTS: readonly SetupEffect[] = [
    { applies: always, run: pushSite },
    { applies: always, run: linkSite },
];
