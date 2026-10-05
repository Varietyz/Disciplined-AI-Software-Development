import { STYLESHEET_FILE } from "#configuration/constants/diagram.constants";
import { diagramFileName } from "#core/resolvers/diagram.resolver";
import { hoistStyles } from "#core/converters/style.converter";
import { replaceFolderFiles } from "#core/persistence/asset.persistence";

export const writeAssets = function writeAssets(folder: string, rendered: ReadonlyMap<string, string>): void {
    const hoisted = hoistStyles(rendered);
    const vectors = [...hoisted.vectors].map(([source, markup]) => [diagramFileName(source), markup] as const);
    replaceFolderFiles(folder, new Map([...vectors, [STYLESHEET_FILE, hoisted.stylesheet] as const]));
};
