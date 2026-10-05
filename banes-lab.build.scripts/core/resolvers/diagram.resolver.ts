import { DIAGRAM_FILE_PREFIX, DIAGRAM_FILE_SUFFIX } from "#configuration/constants/diagram.constants";
import { digestOf, digestedFileName } from "#core/resolvers/asset.resolver";

export const diagramDigest = function diagramDigest(source: string): string {
    return digestOf(source);
};

export const diagramFileName = function diagramFileName(source: string): string {
    return digestedFileName(DIAGRAM_FILE_PREFIX, source, DIAGRAM_FILE_SUFFIX);
};
