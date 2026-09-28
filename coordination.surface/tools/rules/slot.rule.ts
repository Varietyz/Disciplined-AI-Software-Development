import type { Finding, Remediation } from "../core/types/segment.types.ts";

import type { RuleContext, RuleDeclaration, RuleResult } from "../core/types/rule.types.ts";
import { basename, dirname } from "node:path";
import { checkNaming, checkPlacement, parseFilename } from "../core/validators/taxonomy.validator.ts";
import { NAMING_CODES } from "../core/types/taxonomy.types.ts";
import type { TaxonomyData } from "../core/types/taxonomy.types.ts";
import { governedPath } from "../core/resolvers/taxonomy.resolver.ts";

const remediate = function remediate(
    code: string,
    path: string,
    name: string,
    parentFolder: string,
    data: TaxonomyData,
): Remediation {
    if (code === "concernMismatch") {
        const expected = data.folderToTag[parentFolder];
        const { parsed } = parseFilename(name, data);
        if (expected !== undefined && parsed !== null) {
            const variant = parsed.variant === null ? "" : `${parsed.variant}.`;
            return {
                action: "rename",
                decide: "both operands are computed and this still does NOT heal, which is a property of the OPERATION rather than of the derivation: renaming a file changes what every importer of it resolves, so the repair is not confined to the artifact the remediation names and applying it alone breaks the tree. A remediation heals where its effect is bounded by its own operands; this one is deterministic and unbounded, and the missing half is a reference rewrite this package does not perform. Take the rename and the importers together, by hand, in one change",
                deterministic: true,
                from: name,
                target: dirname(path),
                to: `${parsed.subject}.${variant}${expected}.${parsed.ext}`,
            };
        }
    }

    const decideBy: Record<string, string> = {
        subjectEqualsConcern:
            "the subject carries no information when it equals the concern — name what the file serves",
        undeclaredSlot:
            "work the vocabulary ladder: pick an existing word, else reason it by the is-a test, else the filename is wrong",
        unparsable:
            "name it <subject>[.<variant>].<concern>.<ext> — read the file, take the narrowest accurate concern, use a declared subject",
    };

    return {
        action: code === "undeclaredSlot" ? "declare" : "rename",
        decide: decideBy[code] ?? `resolve naming code ${code}`,
        deterministic: false,
        from: name,
        target: path,
        to: null,
    };
};

type SlotRoute = "outside" | "reached" | "unplaceable";

interface SlotOutcome {
    readonly path: string;
    readonly route: SlotRoute;
    readonly finding: Finding | null;
}

const namingFinding = function namingFinding(
    path: string,
    root: string,
    parentFolder: string,
    data: TaxonomyData,
): Finding | null {
    const name = basename(path);
    const verdict = checkNaming(name, parentFolder, data);
    if (verdict.ok) {
        return null;
    }

    const remediation = remediate(verdict.code ?? "", path, name, parentFolder, data);
    return {
        actual: name,
        expected: remediation.to,
        healed: false,
        line: 0,
        locus: verdict.evidence,
        path,
        remediation,
        rule: `slot/${verdict.code ?? ""}`,
        stack: [
            { check: "jurisdiction", resolved: `root=${root}` },
            { check: "concernFolder", resolved: parentFolder },
            { check: "naming", resolved: verdict.code ?? "fail" },
        ],
    };
};

const slotOutcome = function slotOutcome(path: string, data: TaxonomyData): SlotOutcome {
    const governed = governedPath(path, data);
    if (governed === null) {
        return { finding: null, path, route: "outside" };
    }

    const placement = checkPlacement(governed.root, governed.segments, data);
    if (!placement.ok || placement.foreign === true) {
        return { finding: null, path, route: "unplaceable" };
    }

    return { finding: namingFinding(path, governed.root, placement.concernFolder ?? "", data), path, route: "reached" };
};

export const rule: RuleDeclaration = {
    check(context: RuleContext): RuleResult {
        const outcomes = context.paths.map((path) => slotOutcome(path, context.taxonomy));
        const pathsOn = (route: SlotRoute): string[] =>
            outcomes.filter((outcome) => outcome.route === route).map((outcome) => outcome.path);

        return {
            derivations: {
                reached: pathsOn("reached"),
                skippedAsOutsideJurisdiction: pathsOn("outside"),
                skippedAsUnplaceable: pathsOn("unplaceable"),
            },
            findings: outcomes.flatMap((outcome) => (outcome.finding === null ? [] : [outcome.finding])),
            healed: [],
        };
    },
    extensions: [],
    heals: false,
    invariant: "every filename slot draws from its closed array and the concern tag matches the parent folder",
    jurisdiction: "taxonomy",
    kinds: [...NAMING_CODES],

    stage: "structure",
};
