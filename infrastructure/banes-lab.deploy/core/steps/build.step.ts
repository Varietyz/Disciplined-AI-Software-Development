import {
    BUILD_MARKER_SUFFIX,
    BUILD_PACKAGES,
    MODULES_FOLDER,
    NGINX_SOURCE,
    PACKAGE_INDEX_COMMAND,
    PACKAGE_INSTALL_COMMAND,
    PACKAGE_LOCK_WAIT,
    PREVIOUS_SUFFIX,
    SETUP_STAGING,
    SOURCE_MODULES,
} from "#configuration/constants/nginx.constants";
import type { Journal, Shell, SourceArchive, SourceModule } from "#types/deployment.types";
import { MODULE_BUILDING, MODULE_BUILD_FAILED } from "#configuration/strings/nginx.strings";
import { PATH_SEPARATOR } from "#configuration/constants/deployment.constants";

const COMMAND_JOIN = " && ";

export const markerOf = function markerOf(module: SourceModule): string {
    return `${NGINX_SOURCE.upstream} ${module.version}`;
};

const objectPath = function objectPath(module: SourceModule): string {
    return MODULES_FOLDER + PATH_SEPARATOR + module.object;
};

const markerPath = function markerPath(module: SourceModule): string {
    return objectPath(module) + BUILD_MARKER_SUFFIX;
};

export const verifiedFetch = function verifiedFetch(url: string, path: string, sha256: string): string {
    return `curl -fsSL -o ${path} "${url}" && echo "${sha256}  ${path}" | sha256sum -c --quiet -`;
};

export const staleModules = async function staleModules(shell: Shell): Promise<readonly SourceModule[]> {
    const checked = await Promise.all(
        SOURCE_MODULES.map(async (module) => {
            const result = await shell.run(`test -f ${objectPath(module)} && cat ${markerPath(module)}`);
            return result.code === 0 && result.stdout.trim() === markerOf(module) ? null : module;
        }),
    );
    return checked.filter((module): module is SourceModule => module !== null);
};

const unpacked = function unpacked(source: SourceArchive): string {
    const archive = `${SETUP_STAGING}/${source.folder}.tar.gz`;
    return [verifiedFetch(source.archive, archive, source.sha256), `tar -xzf ${archive} -C ${SETUP_STAGING}`].join(
        COMMAND_JOIN,
    );
};

export const builtPath = function builtPath(module: SourceModule): string {
    return `${SETUP_STAGING}/${NGINX_SOURCE.folder}/objs/${module.object}`;
};

export const compileModules = async function compileModules(
    shell: Shell,
    journal: Journal,
    modules: readonly SourceModule[],
): Promise<void> {
    journal.log(MODULE_BUILDING + modules.map((module) => module.object).join(", "));
    const dynamic = modules.map((module) => `--add-dynamic-module=../${module.folder}`).join(" ");
    const result = await shell.run(
        [
            `mkdir -p ${SETUP_STAGING}`,
            PACKAGE_LOCK_WAIT,
            PACKAGE_INDEX_COMMAND,
            `${PACKAGE_INSTALL_COMMAND} ${BUILD_PACKAGES.join(" ")}`,
            unpacked(NGINX_SOURCE),
            ...modules.map(unpacked),
            `cd ${SETUP_STAGING}/${NGINX_SOURCE.folder}`,
            `./configure --with-compat ${dynamic} > /dev/null`,
            "make modules > /dev/null",
        ].join(COMMAND_JOIN),
    );
    if (result.code !== 0) {
        throw new Error(MODULE_BUILD_FAILED + result.stderr);
    }
};

export const swapModules = async function swapModules(shell: Shell, modules: readonly SourceModule[]): Promise<void> {
    const commands = modules.map((module) => {
        const [object, marker] = [objectPath(module), markerPath(module)];
        return [
            `if [ -f ${object} ]; then sudo cp -p ${object} ${object}${PREVIOUS_SUFFIX}; fi`,
            `if [ -f ${marker} ]; then sudo cp -p ${marker} ${marker}${PREVIOUS_SUFFIX}; fi`,
            `sudo install -m 644 ${builtPath(module)} ${object}`,
            `echo '${markerOf(module)}' | sudo tee ${marker} > /dev/null`,
        ].join(COMMAND_JOIN);
    });
    const result = await shell.run(commands.join(COMMAND_JOIN));
    if (result.code !== 0) {
        throw new Error(MODULE_BUILD_FAILED + result.stderr);
    }
};

export const restoreModules = async function restoreModules(
    shell: Shell,
    modules: readonly SourceModule[],
): Promise<void> {
    const commands = modules.flatMap((module) =>
        [objectPath(module), markerPath(module)].map(
            (path) =>
                `if [ -f ${path}${PREVIOUS_SUFFIX} ]; then sudo mv ${path}${PREVIOUS_SUFFIX} ${path}; else sudo rm -f ${path}; fi`,
        ),
    );
    await shell.run(commands.join("; "));
};

export const settleModules = async function settleModules(
    shell: Shell,
    modules: readonly SourceModule[],
): Promise<void> {
    const paths = modules.flatMap((module) => [objectPath(module), markerPath(module)]);
    await shell.run(`sudo rm -f ${paths.map((path) => path + PREVIOUS_SUFFIX).join(" ")}`);
};
