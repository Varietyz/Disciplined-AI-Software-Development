export const CERTIFIED_KIND_LABEL = "certified kind";

export const STEP_KIND_LABEL = "pipeline step kind";

export const REGISTERED_RULE_LABEL = "registered rule";

export const PIPELINE_STEP_LABEL = "pipeline step";

export const ENTRY_COMMAND_LABEL = "entry-point command";

export const rosterMissing = function rosterMissing(target: string): string {
    return `REFUSED  ${target} does not exist, so there is no roster to write.\n`;
};

export const undeclaredHalf = function undeclaredHalf(value: string, questions: readonly string[]): string {
    return (
        `REFUSED  ${value} is not a value the third cell accepts. The cell takes the id of a registered check that ` +
        "observes the half; `none` when the half could be checked and no check exists yet; `—` when the " +
        `entry has no checkable half; or the question the half fails (${questions.join(", ")}).\n`
    );
};

export const rowMissing = function rowMissing(slug: string, target: string): string {
    return (
        `REFUSED  ${slug} has no row on ${target}. The coverage check only reads rules the roster lists, so add the ` +
        "row first.\n"
    );
};

export const rowMalformed = function rowMalformed(slug: string): string {
    return (
        `REFUSED  The row for ${slug} does not have the roster's columns, so the tool cannot find the third cell ` +
        "without risking the evidence cell beside it. Correct the row by hand, then run the command again.\n"
    );
};

export const halfStated = function halfStated(slug: string, value: string): string {
    return (
        `HALF  ${slug} now states ${value} in its third cell. A row with an empty third cell has not been assessed ` +
        "yet, so the remaining assessments can be counted from the table.\n"
    );
};
