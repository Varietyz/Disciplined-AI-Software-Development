export const SAMPLE_ROLES = ["foo", "bar", "baz"] as const;

export const SAMPLE_INVARIANT = "retries-have-one-home";

export const SAMPLE_ESTABLISHES = "The retry limit is read from one setting.";

export const SAMPLE_POSITION_A = [
    "Position A1 — The retry limit moves into the settings file.",
    "Axis: Where the retry limit lives.",
    "Evidence: client.ts and worker.ts each set their own limit.",
    "Proposes: One retry.limit setting that both files read.",
    "Costs: Both call sites change in one step.",
    "Contradicts:",
    "Signed: A",
].join("\n");

export const SAMPLE_POSITION_B = [
    "Position B1 — The worker keeps its own limit.",
    "Axis: Where the retry limit lives.",
    "Evidence: The worker retries a queue, and the client retries a request.",
    "Proposes: Two settings, one for each caller.",
    "Costs: Two values to keep in step.",
    "Contradicts: A-1",
    "Signed: B",
].join("\n");

export const SAMPLE_OWNER_ENTRY = "# Owner note: The worker and the client share one limit for now.";

export const surfacesLine = function surfacesLine(count: number, reused: boolean, folder: string): string {
    return reused
        ? `surfaces: reused ${String(count)} figure(s) in ${folder}, because their inputs are unchanged\n`
        : `surfaces: recorded ${String(count)} figure(s) into ${folder}\n`;
};

export const stepFailed = function stepFailed(
    command: string,
    expected: number,
    actual: number,
    output: string,
): string {
    return `surfaces: \`${command}\` exited ${String(actual)}, and the scenario expects ${String(expected)}. Its output:\n${output}`;
};

export const waitUnresolved = function waitUnresolved(command: string): string {
    return `surfaces: \`${command}\` did not return after the next write, so the wait frame has no result`;
};

export const venueMissing = function venueMissing(): string {
    return "surfaces: the raise created no venue file, so the scenario has no surface to record";
};

export const slotsUnreadable = function slotsUnreadable(): string {
    return "surfaces: the package's config/surface.config.ts exports no slotText function, so the recorder cannot find the board template";
};

export const scriptMissing = function scriptMissing(name: string): string {
    return `surfaces: the package's package.json declares no \`${name}\` script run by node, so the scenario cannot start it`;
};
