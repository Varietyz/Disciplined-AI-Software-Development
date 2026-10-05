export const iconsLine = function iconsLine(count: number, file: string): string {
    return `icons: wrote ${String(count)} glyph(s) into ${file}\n`;
};

export const unknownGlyph = function unknownGlyph(name: string): string {
    return `icons: "${name}" names no glyph in the icon font. Pick a name the icon package declares.`;
};
