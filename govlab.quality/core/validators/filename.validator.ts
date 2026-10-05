import { NAMING_FIX, fileNameSpace, folderNotKebab } from "#configuration/strings/validation.strings";
import type { FileInput } from "#types/validation.types";
import type { Finding } from "#types/finding.types";
import { NAMING_EXTENSIONS } from "#configuration/constants/validation.constants";
import { defineValidator } from "#core/registries/validation.registry";
import { everyChar } from "@govlab/constants";
import { isAsciiUpper } from "#core/predicates/code-point.predicate";
import { projectFinding } from "#core/factories/finding.factory";

const RULE_ID = "naming";

const hasUpper = function hasUpper(text: string): boolean {
    return !everyChar(text, (ch) => !isAsciiUpper(ch.codePointAt(0)));
};

const segmentsOf = function segmentsOf(path: string): string[] {
    return path
        .split("\\")
        .join("/")
        .split("/")
        .filter((segment) => segment.length > 0);
};

const namingFinding = function namingFinding(file: string, message: string): Finding {
    return projectFinding({ file, message, ruleId: RULE_ID, suggestion: NAMING_FIX });
};

const fileFindings = function fileFindings(file: FileInput, flaggedFolders: Set<string>): Finding[] {
    const segments = segmentsOf(file.path);
    const fileName = segments.at(-1) ?? "";
    const out: Finding[] = fileName.includes(" ") ? [namingFinding(file.path, fileNameSpace(fileName))] : [];
    let accumulated = "";
    for (const folder of segments.slice(0, -1)) {
        accumulated = accumulated === "" ? folder : `${accumulated}/${folder}`;
        if ((folder.includes(" ") || hasUpper(folder)) && !flaggedFolders.has(accumulated)) {
            flaggedFolders.add(accumulated);
            out.push(namingFinding(file.path, folderNotKebab(folder)));
        }
    }
    return out;
};

defineValidator({
    appliesTo: NAMING_EXTENSIONS,
    id: RULE_ID,
    meta: {
        canonical: ["naming-convention"],
        description: "Require lowercase-kebab-case file and folder names (no spaces, no uppercase folders)",
    },
    validate(files): Finding[] {
        const flaggedFolders = new Set<string>();
        return files.flatMap((file) => fileFindings(file, flaggedFolders));
    },
});
