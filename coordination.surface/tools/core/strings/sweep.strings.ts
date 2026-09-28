export const sweepHeld = function sweepHeld(held: readonly string[]): string {
    return (
        `SWEEP HELD  ${String(held.length)} item(s) stay on the board because an addressee has not been handed them ` +
        `yet: ${held.join("; ")}. An addressee writing after an item shows they were active, not that they read it, ` +
        "so each item waits until every addressee's wait has delivered it.\n"
    );
};

export const SWEEP_CONTENDED = "SWEEP HELD  The board changed during the sweep, so nothing was removed.\n";

export const swept = function swept(keys: readonly string[]): string {
    return (
        `SWEPT  ${String(keys.length)} item(s) that every addressee has been handed were moved whole to the ` +
        `history file: ${keys.join(", ")}\n`
    );
};
