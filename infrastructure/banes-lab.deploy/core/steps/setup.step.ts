import {
    APPLY_EFFECTS,
    PUBLISH_EFFECTS,
    REVERT_EFFECTS,
    STAGE_EFFECTS,
    UPKEEP_EFFECTS,
    runEffects,
} from "#core/pipelines/setup.pipeline";
import {
    ARCHITECTURE_COMMAND,
    CODENAME_COMMAND,
    MODULE_PACKAGES,
    NGINX_PACKAGE,
    NGINX_SOURCE,
    PACKAGE_SOURCES,
    PACKAGE_STATUS_COMMAND,
    SETUP_STAGING,
} from "#configuration/constants/nginx.constants";
import type {
    IndexFetcher,
    InstalledPackage,
    Journal,
    PackagePlan,
    PackageStanza,
    Platform,
    SetupContext,
    Shell,
} from "#types/deployment.types";
import {
    PACKAGE_REVERT_FAILED,
    PACKAGE_REVERT_UNAVAILABLE,
    PACKAGE_UNAVAILABLE,
    SERVER_CHECKING,
    SERVER_CURRENT,
    SERVER_READY,
} from "#configuration/strings/nginx.strings";
import {
    codenameOf,
    companionOf,
    indexUrl,
    installedOf,
    isCurrent,
    serverTarget,
    stanzaAt,
    stanzasOf,
} from "#core/converters/index.converter";
import { messageOf } from "#core/converters/failure.converter";
import { staleModules } from "#core/steps/build.step";

const required = function required<T>(value: T | null, message: string): T {
    if (value === null) {
        throw new Error(message);
    }
    return value;
};

const loadIndexes = async function loadIndexes(
    fetchIndex: IndexFetcher,
    codename: string,
    architecture: string,
): Promise<readonly PackageStanza[]> {
    const indexes = await Promise.all(
        PACKAGE_SOURCES.map(async (source) =>
            stanzasOf(await fetchIndex(indexUrl(source, codename, architecture)), source),
        ),
    );
    return indexes.flat();
};

const installedAll = async function installedAll(
    shell: Shell,
    names: readonly string[],
): Promise<readonly InstalledPackage[]> {
    return Promise.all(
        names.map(async (name) => installedOf(name, (await shell.run(`${PACKAGE_STATUS_COMMAND} ${name}`)).stdout)),
    );
};

const revertStanzas = async function revertStanzas(
    fetchIndex: IndexFetcher,
    kept: readonly InstalledPackage[],
    architecture: string,
): Promise<readonly PackageStanza[]> {
    return Promise.all(
        kept.map(async (installed) => {
            const version = installed.version ?? "";
            const stanzas = await loadIndexes(fetchIndex, codenameOf(version), architecture);
            return required(
                stanzaAt(stanzas, installed.name, version),
                `${PACKAGE_REVERT_UNAVAILABLE}${installed.name} ${version}`,
            );
        }),
    );
};

export const planPackages = async function planPackages(
    shell: Shell,
    fetchIndex: IndexFetcher,
    platform: Platform,
): Promise<PackagePlan> {
    const stanzas = await loadIndexes(fetchIndex, platform.codename, platform.architecture);
    const target = required(
        serverTarget(stanzas, NGINX_SOURCE.upstream),
        `${PACKAGE_UNAVAILABLE}${NGINX_PACKAGE} ${NGINX_SOURCE.upstream} ${platform.codename}`,
    );
    const wanted = [
        target,
        ...MODULE_PACKAGES.map((name) =>
            required(companionOf(stanzas, name, target), `${PACKAGE_UNAVAILABLE}${name} ${target.version}`),
        ),
    ];
    const installed = await installedAll(
        shell,
        wanted.map((stanza) => stanza.name),
    );
    const install = wanted.filter((stanza, at) => installed[at] === undefined || !isCurrent(installed[at], stanza));
    const changing = installed.filter((entry) => install.some((stanza) => stanza.name === entry.name));
    const kept = changing.filter((entry) => entry.configured && entry.version !== null);
    const revert = await revertStanzas(fetchIndex, kept, platform.architecture);
    const added = changing.filter((entry) => !entry.configured).map((entry) => entry.name);
    return { added, install, revert };
};

const changeServer = async function changeServer(context: SetupContext): Promise<void> {
    await runEffects(STAGE_EFFECTS, context);
    try {
        await runEffects(APPLY_EFFECTS, context);
    } catch (error: unknown) {
        try {
            await runEffects(REVERT_EFFECTS, context);
        } catch (revertError: unknown) {
            throw new Error(`${messageOf(error)} ${PACKAGE_REVERT_FAILED}${messageOf(revertError)}`, {
                cause: revertError,
            });
        }
        throw error;
    }
};

const contextOf = async function contextOf(
    shell: Shell,
    journal: Journal,
    fetchIndex: IndexFetcher,
): Promise<SetupContext> {
    const platform: Platform = {
        architecture: (await shell.run(ARCHITECTURE_COMMAND)).stdout.trim(),
        codename: (await shell.run(CODENAME_COMMAND)).stdout.trim(),
    };
    const plan = await planPackages(shell, fetchIndex, platform);
    return { fetchIndex, journal, modules: await staleModules(shell), plan, shell };
};

export const ensureServer = async function ensureServer(
    shell: Shell,
    journal: Journal,
    fetchIndex: IndexFetcher,
): Promise<SetupContext> {
    journal.log(SERVER_CHECKING);
    const context = await contextOf(shell, journal, fetchIndex);
    const current = context.plan.install.length === 0 && context.modules.length === 0;
    try {
        if (current) {
            journal.log(SERVER_CURRENT);
            await runEffects(UPKEEP_EFFECTS, context);
        } else {
            await changeServer(context);
        }
    } finally {
        await shell.run(`rm -rf ${SETUP_STAGING}`);
    }
    journal.log(SERVER_READY);
    return context;
};

export const prepareServer = async function prepareServer(
    shell: Shell,
    journal: Journal,
    fetchIndex: IndexFetcher,
): Promise<void> {
    await runEffects(PUBLISH_EFFECTS, await ensureServer(shell, journal, fetchIndex));
};
