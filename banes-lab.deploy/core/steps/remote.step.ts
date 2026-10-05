import type { Journal, Shell } from "#types/deployment.types";
import {
    PATH_SEPARATOR,
    REMOTE_ROOT,
    REMOTE_SITE,
    REMOTE_STAGING,
} from "#configuration/constants/deployment.constants";
import { ROOT_CLEAN, ROOT_PRUNED, ROOT_PRUNING, STALE_REMOVED } from "#configuration/strings/deployment.strings";

const OWNED = [REMOTE_SITE, REMOTE_STAGING].map((path) => path.slice(path.lastIndexOf(PATH_SEPARATOR) + 1));

const listStale = async function listStale(shell: Shell): Promise<string[]> {
    const guards = OWNED.map((name) => `! -name ${name}`).join(" ");
    const result = await shell.run(`find ${REMOTE_ROOT} -mindepth 1 -maxdepth 1 ${guards}`);
    return result.stdout
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
};

export const pruneRemoteRoot = async function pruneRemoteRoot(shell: Shell, journal: Journal): Promise<string[]> {
    journal.log(ROOT_PRUNING);
    const stale = await listStale(shell);
    if (stale.length === 0) {
        journal.mark(ROOT_CLEAN);
        return stale;
    }
    await shell.run(`rm -rf ${stale.join(" ")}`);
    for (const path of stale) {
        journal.log(STALE_REMOVED + path);
    }
    journal.mark(ROOT_PRUNED);
    return stale;
};
