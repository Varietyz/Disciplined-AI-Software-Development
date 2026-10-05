import { WINDOWS, WINDOWS_SHELL, WINDOWS_SHELL_FLAGS } from "#configuration/constants/shell.constants";
import type { Invocation } from "#types/shell.types";

export const invocationFor = function invocationFor(
    platform: string,
    name: string,
    args: readonly string[],
): Invocation {
    if (platform !== WINDOWS) {
        return { args, file: name };
    }
    return { args: [...WINDOWS_SHELL_FLAGS, name, ...args], file: WINDOWS_SHELL };
};
