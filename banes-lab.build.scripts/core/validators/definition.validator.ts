import type { Finding, ValidationRoute } from "#types/validation.types";
import { unresolvedCitation, unresolvedPanel } from "#configuration/strings/definition.strings";
import { isRecord } from "#core/selectors/base.selector";
import { jsonFileOf } from "#core/resolvers/page.resolver";
import { readOrNull } from "#core/loaders/build.loader";

const KIND_KEY = "kind";
const DEFINITION_KIND = "definition" as const;
const DEFINITION_NAME_KEY = "name";
const DEFINITION_FILE_KEY = "file";
const DEFINITION_LINE_KEY = "line";
const DEFINITION_TITLE_KEY = "title";
const FRAGMENT_MARK = "#";
const FRAGMENT_ENDS = new Set([")", '"', "'", " ", "<", ">", "\n"]);

interface Citation {
    readonly file: string | null;
    readonly line: number | null;
    readonly name: string;
    readonly title: string;
}

const citationsIn = function citationsIn(value: unknown): Citation[] {
    if (Array.isArray(value)) {
        return value.flatMap(citationsIn);
    }
    if (!isRecord(value)) {
        return [];
    }
    const name = value[DEFINITION_NAME_KEY];
    const file = value[DEFINITION_FILE_KEY];
    const line = value[DEFINITION_LINE_KEY];
    const title = value[DEFINITION_TITLE_KEY];
    const own =
        value[KIND_KEY] === DEFINITION_KIND && typeof name === "string" && typeof title === "string"
            ? [
                  {
                      file: typeof file === "string" ? file : null,
                      line: typeof line === "number" ? line : null,
                      name,
                      title,
                  },
              ]
            : [];
    return [...own, ...Object.values(value).flatMap(citationsIn)];
};

const fragmentEnd = function fragmentEnd(text: string, from: number): number {
    let at = from;
    while (at < text.length && !FRAGMENT_ENDS.has(text.charAt(at))) {
        at += 1;
    }
    return at;
};

const fragmentsIn = function fragmentsIn(text: string, anchor: string): string[] {
    const found: string[] = [];
    let at = text.indexOf(FRAGMENT_MARK + anchor);
    while (at !== -1) {
        const end = fragmentEnd(text, at + FRAGMENT_MARK.length);
        found.push(text.slice(at + FRAGMENT_MARK.length, end));
        at = text.indexOf(FRAGMENT_MARK + anchor, end);
    }
    return found;
};

const stringsIn = function stringsIn(value: unknown): string[] {
    if (typeof value === "string") {
        return [value];
    }
    if (Array.isArray(value)) {
        return value.flatMap(stringsIn);
    }
    return isRecord(value) ? Object.values(value).flatMap(stringsIn) : [];
};

const checkCitations = async function checkCitations(file: string, raw: string): Promise<Finding[]> {
    const parsed: unknown = JSON.parse(raw);
    const loader = await import("@banes-lab/web/domain/loaders/anatomy.loader.ts");
    const anchors = await import("@banes-lab/web/core/ids/anatomy.ids.ts");
    const panels = citationsIn(parsed)
        .filter((citation) => loader.citedSource({ ...citation, kind: DEFINITION_KIND }) === null)
        .map((citation) => ({ file, message: unresolvedPanel(citation.title, citation.name) }));
    const links = stringsIn(parsed)
        .flatMap((text) => fragmentsIn(text, anchors.DEFINITION_ANCHOR))
        .map((fragment) => ({ file, message: unresolvedCitation(fragment) }));
    return [...panels, ...links];
};

export const citationFindings = async function citationFindings(
    routes: readonly ValidationRoute[],
): Promise<Finding[]> {
    const found = await Promise.all(
        routes.map(async (route) => {
            const json = jsonFileOf(route.page, route.tab);
            const raw = readOrNull(json);
            return raw === null ? Promise.resolve([]) : checkCitations(json, raw);
        }),
    );
    return found.flat();
};
