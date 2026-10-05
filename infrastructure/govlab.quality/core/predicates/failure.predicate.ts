import { MODULE_MISSING_CODES, NOT_FOUND_CODE } from "#configuration/constants/tool.constants";
import { errnoCode } from "#core/selectors/failure.selector";

export const isNotFound = function isNotFound(error: Error): boolean {
    return errnoCode(error) === NOT_FOUND_CODE;
};

export const isModuleMissing = function isModuleMissing(error: unknown): boolean {
    return error instanceof Error && MODULE_MISSING_CODES.has(errnoCode(error));
};

export const signalKilled = function signalKilled(status: number | null): boolean {
    return status === null;
};

export const statusIn = function statusIn(statuses: ReadonlySet<number>, status: number | null): boolean {
    return statuses.has(status ?? 0);
};
