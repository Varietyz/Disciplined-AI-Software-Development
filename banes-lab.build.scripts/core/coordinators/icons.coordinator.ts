import { renderGlyphs, renderStylesheet } from "#core/formatters/icons.formatter";
import { absolutePath } from "@ssot/paths";
import { discoverIcons } from "#core/loaders/icons.loader";
import { writeCanonicalText } from "@govlab/canonical-write";
import { writeFontSubset } from "#core/persistence/icons.persistence";

export const buildIcons = async function buildIcons(): Promise<number> {
    const names = await discoverIcons();
    await writeFontSubset(names);
    await Promise.all([
        writeCanonicalText(absolutePath("app.icons"), renderStylesheet(names)),
        writeCanonicalText(absolutePath("app.glyphs"), renderGlyphs(names)),
    ]);
    return names.length;
};
