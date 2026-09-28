const FENCE_MARK = "`";

const FENCE_MINIMUM = 3;

const fenceRun = function fenceRun(line: string): number {
    const text = line.trimStart();

    let run = 0;
    while (run < text.length && text.charAt(run) === FENCE_MARK) {
        run += 1;
    }

    return run;
};

const isBlank = function isBlank(text: string): boolean {
    return text.replaceAll(" ", "").replaceAll("\t", "").length === 0;
};

const closesFence = function closesFence(line: string, opened: number): boolean {
    const run = fenceRun(line);
    return run >= opened && isBlank(line.trimStart().slice(run));
};

export const fencedFlags = function fencedFlags(source: string): boolean[] {
    const flags: boolean[] = [];
    let opened = 0;

    for (const line of source.split("\n")) {
        if (opened === 0) {
            const run = fenceRun(line);
            opened = run >= FENCE_MINIMUM ? run : 0;
            flags.push(opened > 0);
        } else {
            flags.push(true);
            opened = closesFence(line, opened) ? 0 : opened;
        }
    }

    return flags;
};
