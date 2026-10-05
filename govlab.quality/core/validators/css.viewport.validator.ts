import { CSS_EXTENSIONS, MOBILE_SUFFIX } from "#configuration/constants/validation.constants";
import {
    mobileNotImported,
    mobileNotImportedFix,
    mobileWithoutBase,
    mobileWithoutBaseFix,
} from "#configuration/strings/validation.strings";
import type { FileInput } from "#types/validation.types";
import type { Finding } from "#types/finding.types";
import { defineValidator } from "#core/registries/validation.registry";
import { projectFinding } from "#core/factories/finding.factory";

const RULE_ID = "css-mobile-imports";

const basename = function basename(path: string): string {
    const normalized = path.split("\\").join("/");
    return normalized.slice(normalized.lastIndexOf("/") + 1);
};

const mobileFinding = function mobileFinding(
    file: FileInput,
    ctx: { allContent: string; basenames: ReadonlySet<string> },
): Finding[] {
    const name = basename(file.path);
    if (!name.endsWith(MOBILE_SUFFIX)) {
        return [];
    }
    const baseName = `${name.slice(0, -MOBILE_SUFFIX.length)}.css`;
    if (!ctx.basenames.has(baseName)) {
        return [
            projectFinding({
                file: file.path,
                message: mobileWithoutBase(name, baseName),
                ruleId: RULE_ID,
                suggestion: mobileWithoutBaseFix(baseName),
            }),
        ];
    }
    if (!ctx.allContent.includes(name)) {
        return [
            projectFinding({
                file: file.path,
                message: mobileNotImported(name),
                ruleId: RULE_ID,
                suggestion: mobileNotImportedFix(name, baseName),
            }),
        ];
    }
    return [];
};

defineValidator({
    appliesTo: CSS_EXTENSIONS,
    id: RULE_ID,
    meta: {
        canonical: ["css-architecture", "responsive-design"],
        description: "Require every -mobile.css to have a base file and be imported by a barrel",
    },
    validate(files): Finding[] {
        const ctx = {
            allContent: files.map((file) => file.content).join("\n"),
            basenames: new Set(files.map((file) => basename(file.path))),
        };
        return files.flatMap((file) => mobileFinding(file, ctx));
    },
});
