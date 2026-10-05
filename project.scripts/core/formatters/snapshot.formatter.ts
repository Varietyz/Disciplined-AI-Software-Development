import type { ConsoleRecord } from "@banes-lab/build-scripts/types/browser.types.ts";

interface Tally {
    readonly record: ConsoleRecord;
    count: number;
}

export const logLines = function logLines(records: readonly ConsoleRecord[]): string {
    const tally = new Map<string, Tally>();
    for (const record of records) {
        const key = `${record.level}|${record.text}|${record.source}`;
        const held = tally.get(key);
        if (held === undefined) {
            tally.set(key, { count: 1, record });
        } else {
            held.count += 1;
        }
    }
    const rows = [...tally.values()].map((entry) => {
        const times = entry.count === 1 ? "" : ` [x${String(entry.count)}]`;
        const where = entry.record.source.length === 0 ? "" : `  (${entry.record.source})`;
        return `${entry.record.level}: ${entry.record.text}${times}${where}`;
    });
    return `${rows.join("\n")}\n`;
};
