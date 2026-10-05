export const EVERY_SCRIPT_DECIDED =
    "[install-scripts] every dependency install script is approved or denied in allowScripts\n";

export const REVIEW_REMEDY =
    "  Review each script, then record the decision in the root package.json with npm install-scripts approve or deny.";

export const missingAllowScripts = function missingAllowScripts(output: string): string {
    return `[install-scripts] npm answered without an allowScripts list: ${output}`;
};

export const listingFailed = function listingFailed(status: number | null, stderr: string): string {
    return `[install-scripts] npm install-scripts ls exited ${String(status)}: ${stderr}`;
};

export const ONE_HOIST_HELD = "[one-hoist] no node_modules folder or lockfile sits below the workspace root\n";

export const HOIST_REMEDY =
    "  Point the tool that wrote each one at a location under the root through the paths SSOT, then delete it. A dependency belongs in the root package.json.";

export const hoistBreachHeading = function hoistBreachHeading(count: number): string {
    return `[one-hoist] ${String(count)} node_modules folder(s) or lockfile(s) sit below the workspace root, outside the one hoist:`;
};

export const undecidedHeading = function undecidedHeading(count: number): string {
    return `[install-scripts] ${String(count)} dependency install script(s) have no allowScripts decision:`;
};
