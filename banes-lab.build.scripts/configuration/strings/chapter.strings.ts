export const chapterRefused = function chapterRefused(shape: string, reason: string): string {
    return `chapters: the ${shape} shape was not rendered. ${reason}`;
};

export const chaptersLine = function chaptersLine(
    shape: string,
    written: number,
    removed: number,
    out: string,
): string {
    return `chapters: rendered ${String(written)} ${shape} chapter(s) into ${out}, removed ${String(removed)}\n`;
};
