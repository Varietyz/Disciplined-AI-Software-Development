import { listingFailed } from "#configuration/strings/dependency.strings";
import spawn from "cross-spawn";

const LIST_ARGS: readonly string[] = ["install-scripts", "ls", "--json"];

export const installScriptListing = function installScriptListing(): string {
    const listed = spawn.sync("npm", [...LIST_ARGS], { encoding: "utf8" });
    if (listed.status !== 0) {
        throw new Error(listingFailed(listed.status, listed.stderr));
    }
    return listed.stdout;
};
