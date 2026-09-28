import type { ApplyResult, Document, Edit, Inline, RenameMap, Segment } from "../types/segment.types.ts";

const FIELD_KINDS: ReadonlySet<Segment["kind"]> = new Set(["field", "frontmatter-field"]);

const FIELD_BOUNDARIES: readonly string[] = ["#", " "];

const INLINE_BOUNDARIES: readonly string[] = ["#"];

const prefixOf = function prefixOf(
    value: string,
    map: RenameMap,
    boundaries: readonly string[],
): readonly [string, string] | null {
    const found = Object.entries(map).find(
        ([from]) =>
            value.length > from.length && value.startsWith(from) && boundaries.includes(value.charAt(from.length)),
    );
    return found ?? null;
};

export const editsFromInlines = function editsFromInlines(
    document: Document,
    map: RenameMap,
    kinds: readonly Inline["kind"][],
): Edit[] {
    return document.segments.flatMap((segment) =>
        segment.inlines
            .filter((inline) => kinds.includes(inline.kind))
            .flatMap((inline) => {
                const replacement = map[inline.value];
                return replacement === undefined
                    ? []
                    : [
                          {
                              end: inline.end,
                              path: document.path,
                              reason: `${inline.kind}: ${inline.value} → ${replacement}`,
                              replacement,
                              start: inline.start,
                          },
                      ];
            }),
    );
};

export const editsFromFieldValues = function editsFromFieldValues(
    document: Document,
    key: string,
    map: RenameMap,
): Edit[] {
    return document.segments
        .filter((segment) => FIELD_KINDS.has(segment.kind) && segment.key === key)
        .flatMap((segment) => {
            const { value } = segment;
            const replacement = value === undefined ? undefined : map[value];
            return value === undefined || replacement === undefined
                ? []
                : [
                      {
                          end: segment.end,
                          path: document.path,
                          reason: `${key}: ${value} → ${replacement}`,
                          replacement,
                          start: segment.end - value.length,
                      },
                  ];
        });
};

export const editsFromFieldPrefixes = function editsFromFieldPrefixes(
    document: Document,
    keys: readonly string[],
    map: RenameMap,
): Edit[] {
    return document.segments
        .filter((segment) => FIELD_KINDS.has(segment.kind))
        .filter((segment) => segment.key !== undefined && keys.includes(segment.key))
        .flatMap((segment) => {
            const value = segment.value ?? "";
            const prefix = prefixOf(value, map, FIELD_BOUNDARIES);
            if (prefix === null) {
                return [];
            }

            const [from, replacement] = prefix;
            const valueStart = segment.end - value.length;
            return [
                {
                    end: valueStart + from.length,
                    path: document.path,
                    reason: `${String(segment.key)} prefix: ${from} → ${replacement}`,
                    replacement,
                    start: valueStart,
                },
            ];
        });
};

export const editsFromInlinePrefixes = function editsFromInlinePrefixes(
    document: Document,
    map: RenameMap,
    kinds: readonly Inline["kind"][],
): Edit[] {
    return document.segments.flatMap((segment) =>
        segment.inlines
            .filter((inline) => kinds.includes(inline.kind) && map[inline.value] === undefined)
            .flatMap((inline) => {
                const prefix = prefixOf(inline.value, map, INLINE_BOUNDARIES);
                if (prefix === null) {
                    return [];
                }

                const [from, replacement] = prefix;
                return [
                    {
                        end: inline.start + from.length,
                        path: document.path,
                        reason: `${inline.kind} prefix: ${from} → ${replacement}`,
                        replacement,
                        start: inline.start,
                    },
                ];
            }),
    );
};

export const applyEdits = function applyEdits(source: string, edits: readonly Edit[]): ApplyResult {
    const ordered = edits.toSorted((a, b) => b.start - a.start || b.end - a.end);

    const applied: Edit[] = [];
    const rejected: Edit[] = [];
    let text = source;
    let boundary = source.length;

    for (const edit of ordered) {
        const malformed = edit.start < 0 || edit.end < edit.start || edit.end > text.length;
        if (edit.end > boundary || malformed) {
            rejected.push(edit);
        } else {
            text = text.slice(0, edit.start) + edit.replacement + text.slice(edit.end);
            applied.push(edit);
            boundary = edit.start;
        }
    }

    return { applied, rejected, text };
};
