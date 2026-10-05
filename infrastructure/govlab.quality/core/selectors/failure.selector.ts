import { NO_ERROR_DETAIL } from "#configuration/strings/tool.strings";
import { STDERR_TAIL } from "#configuration/constants/tool.constants";
import type { ToolExit } from "#types/tool.types";
import { isRecord } from "#core/selectors/record.selector";

export const tailLines = function tailLines(text: string, fallback: string): string {
    return text.trim().split("\n").slice(-STDERR_TAIL).join(" ") || fallback;
};

export const exitDetail = function exitDetail(exit: ToolExit): string {
    return tailLines(exit.stderr.trim() || exit.stdout.trim(), NO_ERROR_DETAIL);
};

export const errnoCode = function errnoCode(error: Error): string {
    return isRecord(error) && typeof error["code"] === "string" ? error["code"] : "";
};

export const spawnDetail = function spawnDetail(error: Error): string {
    return `${errnoCode(error)} ${error.message}`.trim();
};
