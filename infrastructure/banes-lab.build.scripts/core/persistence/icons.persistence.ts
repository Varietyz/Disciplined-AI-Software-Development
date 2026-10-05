import { FONT_FORMAT, SUBSET_FILE } from "#configuration/constants/icons.constants";
import { mkdirSync, readFileSync } from "node:fs";
import { absolutePath } from "@ssot/paths";
import { fontSource } from "#core/resolvers/icons.resolver";
import { glyphTextOf } from "#core/formatters/icons.formatter";
import { join } from "node:path";
import subsetFont from "subset-font";
import { writeVerbatim } from "@govlab/canonical-write";

export const writeFontSubset = async function writeFontSubset(
    names: readonly string[],
    folder = absolutePath("app.iconFont"),
): Promise<void> {
    mkdirSync(folder, { recursive: true });
    const subset = await subsetFont(readFileSync(fontSource()), glyphTextOf(names), { targetFormat: FONT_FORMAT });
    writeVerbatim(join(folder, SUBSET_FILE), subset);
};
