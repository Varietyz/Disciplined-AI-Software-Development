const ESC = "\u001B[";

export const C = {
    bold: `${ESC}1m`,
    cyan: `${ESC}36m`,
    dim: `${ESC}2m`,
    green: `${ESC}32m`,
    red: `${ESC}31m`,
    reset: `${ESC}0m`,
    yellow: `${ESC}33m`,
} as const;

export const WINDOWS = "win32";

export const WINDOWS_SHELL = "cmd.exe";

export const WINDOWS_FLAG = "/d /s /c";

export const POSIX_SHELL = "/bin/sh";

export const POSIX_FLAG = "-c";

export const FLAG_SEPARATOR = " ";

export const COMMAND_PROCESSOR_KEY = "ComSpec";

export const PATH_KEY = "PATH";

export const NODE_OPTIONS_KEY = "NODE_OPTIONS";

export const STAGE_NODE_OPTION = "--conditions=development";

export const BIN_SEGMENTS: readonly string[] = ["node_modules", ".bin"];

export const FALLBACK_EXIT = 1;
