import { CODEPOINTS_SPECIFIER, FONT_FILE, FONT_FOLDER, ICON_PREFIX } from "#configuration/constants/icons.constants";
import codepoints from "bootstrap-icons/font/bootstrap-icons.json" with { type: "json" };
import { fileURLToPath } from "node:url";
import { unknownGlyph } from "#configuration/strings/icons.strings";

export const codepointOf = function codepointOf(name: string): number {
    const value: unknown = Reflect.get(codepoints, name);
    if (typeof value !== "number") {
        throw new TypeError(unknownGlyph(ICON_PREFIX + name));
    }
    return value;
};

export const fontSource = function fontSource(): string {
    const fonts = new URL(FONT_FOLDER, import.meta.resolve(CODEPOINTS_SPECIFIER));
    return fileURLToPath(new URL(FONT_FILE, fonts));
};
