import type { DocArchStats, DocInfo } from "#types/document.types";
import { NO_STATUS, ROOT_FORM, STATUS_KEY } from "#configuration/constants/document.constants";
import { MARKDOWN_EXTENSION } from "#configuration/constants/agent.constants";
import type { PathExclusion } from "@govlab/quality/config";
import { frontmatterValue } from "#core/selectors/document.selector";
import path from "node:path";
import { readFileSync } from "node:fs";
import { readdirSafe } from "#core/loaders/folder.loader";
import { relativePath } from "@ssot/paths";
import { tally } from "#core/selectors/metric.selector";

const walkDocs = function walkDocs(absDir: string, base: string, ignore: PathExclusion): DocInfo[] {
    return readdirSafe(absDir).flatMap((entry): DocInfo[] => {
        const abs = path.join(absDir, entry.name);
        if (entry.isDirectory() && !ignore(abs)) {
            return walkDocs(abs, base, ignore);
        }
        if (!entry.isFile() || !entry.name.toLowerCase().endsWith(MARKDOWN_EXTENSION)) {
            return [];
        }
        return [
            {
                form: path.relative(base, abs).split(path.sep).at(0) ?? ROOT_FORM,
                status: frontmatterValue(readFileSync(abs, "utf8"), STATUS_KEY) ?? NO_STATUS,
            },
        ];
    });
};

export const collectDocArch = function collectDocArch(root: string, ignore: PathExclusion): DocArchStats {
    const base = path.join(root, relativePath("docArch"));
    const docs = walkDocs(base, base, ignore);
    return { byForm: tally(docs, (doc) => doc.form), byStatus: tally(docs, (doc) => doc.status), total: docs.length };
};
