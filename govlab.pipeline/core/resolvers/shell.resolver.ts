import {
    POSIX_FLAG,
    POSIX_SHELL,
    WINDOWS,
    WINDOWS_FLAG,
    WINDOWS_SHELL,
} from "#configuration/constants/shell.constants";
import type { ShellDescriptor } from "#types/shell.types";

export const shellFor = function shellFor(platform: string, commandProcessor?: string): ShellDescriptor {
    if (platform !== WINDOWS) {
        return { flag: POSIX_FLAG, shell: POSIX_SHELL };
    }
    return { flag: WINDOWS_FLAG, shell: commandProcessor ?? WINDOWS_SHELL };
};
