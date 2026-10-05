export const exampleShapeOf = function exampleShapeOf(category: string): string {
    return `lexicon: the example shape of category ${category}`;
};

export const NO_EXAMPLE = "carries no example, and its category declares a placed file for every term";

export const misplacedExample = function misplacedExample(example: string): string {
    return `example "${example}" is not <folder>/<subject>.<tag>.<ext> with a subject apart from the tag`;
};

export const UNNAMED_TAG =
    "names no tag or no folder, so its example cannot be compared with it: name the term <tag> Tag and end its definition on the folder it files in";

export const exampleTagMismatch = function exampleTagMismatch(placed: string, tag: string): string {
    return `example tags its file "${placed}", and the term names "${tag}"`;
};

export const exampleFolderMismatch = function exampleFolderMismatch(placed: string, folder: string): string {
    return `example sits in "${placed}", and the definition files the tag in "${folder}"`;
};

export const NO_RENAME = "carries no rename, and its category declares a rename for every term";

export const MALFORMED_RENAME = "rename is not two <folder>/<subject>.<tag>.<ext> paths";

export const SUBJECT_CHANGED = "rename changes the subject, and a rename keeps it";

export const renameFromDeclaredTag = function renameFromDeclaredTag(tag: string): string {
    return `rename starts from "${tag}", which is a declared tag and not a refused word`;
};

export const renameUncovered = function renameUncovered(folder: string, tag: string): string {
    return `rename lands on "${folder}/…${tag}", which no tag in its seeAlso places`;
};

export const STRAY_EXAMPLE = "carries an example its category declares no shape for";

export const undeclaredPlacement = function undeclaredPlacement(shape: string): string {
    return `states where its tag is filed, and its category declares no "${shape}" example shape`;
};

export const undeclaredRefusal = function undeclaredRefusal(shape: string): string {
    return `refuses a tag word, and its category declares no "${shape}" example shape`;
};
