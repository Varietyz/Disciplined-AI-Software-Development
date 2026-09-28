import { classesFiled } from "../strings/archive.strings.ts";
import { isClassHeading } from "../predicates/marker.predicate.ts";

export const ENTRY_MARKER = "### ";

export const ENTRY_LEADS = ["POPULATION:", "BOUNDARY:"];

interface Promotion {
    readonly lines: string[];
    readonly promoted: string[];
}

export const declaresLead = function declaresLead(body: string, lead: string): boolean {
    return body.split("\n").some((line) => line.startsWith(lead));
};

export const filedHeadings = function filedHeadings(source: string): string[] {
    const out: string[] = [];

    for (const line of source.split("\n")) {
        if (!line.startsWith(ENTRY_MARKER)) {
            continue;
        }
        const heading = line.slice(ENTRY_MARKER.length).trim();
        if (heading.length > 0) {
            out.push(heading);
        }
    }

    return out;
};

export const filedNotice = function filedNotice(source: string): string {
    const filed = filedHeadings(source);
    if (filed.length === 0) {
        return "";
    }

    const classes = filed.filter((heading) => isClassHeading(heading));
    return classesFiled(classes, filed.length - classes.length);
};

export const entryEnd = function entryEnd(lines: readonly string[], opens: number): number {
    const next = lines.findIndex((line, index) => index > opens && line.startsWith(ENTRY_MARKER));
    return next === -1 ? lines.length : next;
};

export const promoteLeads = function promoteLeads(line: string): Promotion {
    const lines: string[] = [];
    const promoted: string[] = [];
    let held = line;

    for (const lead of ENTRY_LEADS) {
        const at = held.indexOf(lead);
        if (at > 0) {
            lines.push(held.slice(0, at).trimEnd());
            held = held.slice(at);
            promoted.push(lead);
        }
    }

    return { lines: [...lines, held], promoted };
};

export const clauseEnd = function clauseEnd(lines: readonly string[], opens: number, lead: string): number {
    const end = entryEnd(lines, opens);
    const starts = lines.findIndex((line, index) => index > opens && index < end && line.startsWith(lead));
    if (starts === -1) {
        return -1;
    }
    const blank = lines.findIndex((line, index) => index > starts && index < end && line.trim().length === 0);
    return (blank === -1 ? end : blank) - 1;
};
