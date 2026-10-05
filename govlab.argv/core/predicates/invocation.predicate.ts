import { SCRIPT_AT } from "#configuration/constants/invocation.constants";
import { fileURLToPath } from "node:url";
import process from "node:process";
import { resolve } from "node:path";

export const isMainModule = function isMainModule(moduleUrl: string): boolean {
    const script = process.argv.at(SCRIPT_AT);
    if (script === undefined) {
        return false;
    }
    return resolve(script) === resolve(fileURLToPath(moduleUrl));
};
