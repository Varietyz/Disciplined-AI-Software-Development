import type { Finding, FindingBuilder } from "../types/segment.types.ts";
import { FRONTMATTER_FENCE } from "../constants/template.constants.ts";
import type { MeasuredSection } from "../types/role.types.ts";

const USAGE_HEADING = "# HOW THIS TEMPLATE IS USED";

const trimmedLines = function trimmedLines(source: string): string[] {
    return source.split("\n").map((line) => line.trim());
};

export const roleSectionsFrom = function roleSectionsFrom(template: string): readonly string[] {
    return trimmedLines(template).filter((text) => text.startsWith("# ") && text !== USAGE_HEADING);
};

export const roleSubsectionsFrom = function roleSubsectionsFrom(template: string): readonly string[] {
    return trimmedLines(template).filter((text) => text.startsWith("## "));
};

const isPlaceholder = function isPlaceholder(text: string): boolean {
    return text.startsWith("<") && text.endsWith(">");
};

const sectionBody = function sectionBody(source: string, heading: string): string[] | null {
    const lines = trimmedLines(source);
    const start = lines.findIndex((text) => text.startsWith(heading));
    if (start === -1) {
        return null;
    }

    const rest = lines.slice(start + 1);
    const end = rest.findIndex((text) => text.startsWith("#"));
    return (end === -1 ? rest : rest.slice(0, end)).filter((text) => text.length > 0 && !isPlaceholder(text));
};

export const unfilledMeasuredSections = function unfilledMeasuredSections(
    source: string,
    template: string,
): MeasuredSection[] {
    return roleSubsectionsFrom(template).flatMap((heading): MeasuredSection[] => {
        const body = sectionBody(source, heading);
        if (body === null) {
            return [{ section: heading, state: "absent" }];
        }
        return body.length === 0 ? [{ section: heading, state: "unfilled" }] : [];
    });
};

const fieldLine = function fieldLine(text: string): string {
    const colon = text.indexOf(":");
    const key = text.slice(0, colon);
    const value = text.slice(colon + 1).trim();
    return value.startsWith("<") ? `${key}:` : `${key}: ${value}`;
};

export const roleFieldsFrom = function roleFieldsFrom(template: string): readonly string[] {
    const lines = trimmedLines(template);
    if (lines[0] !== FRONTMATTER_FENCE) {
        return [];
    }

    const rest = lines.slice(1);
    const close = rest.indexOf(FRONTMATTER_FENCE);
    return (close === -1 ? rest : rest.slice(0, close)).filter((text) => text.indexOf(":") > 0).map(fieldLine);
};

const DECIDE =
    "a role document states who a seat is, what it owns, what it refuses and the principles that decide " +
    "its calls — and it is read by every other seat to know what may be routed where. A uniform shape is " +
    "what makes the set comparable: a reader looking for what a seat REFUSES must find it in the " +
    "same place in each, or the document is prose that happens to be filed together. The section set is " +
    "DERIVED from the role template rather than transcribed here, so the check cannot drift from the " +
    "document a seat is raised from: it is " +
    "the contract and the frontmatter carries the operands a tool reads — the letter the citations " +
    "resolve through, and the concern the filename is derived from";

const MEASURED_DECIDE =
    "A SEAT'S MEASURED ERROR DISTRIBUTION IS THE ONLY EVIDENCE IT HOLDS ABOUT ITSELF, AND NOTHING ELSE IN THE TREE KEEPS A COPY. A rule carries the shape it enforces, a gate carries a verdict, the accumulator carries what a discussion concluded — none of them records what one seat has repeatedly got wrong, which is the input that makes a role document more than a job description. A DECLARED-AND-EMPTY SECTION AND AN ABSENT ONE ARE DIFFERENT STATES AND ONLY ONE OF THEM IS AN ANSWER: a seat that has measured nothing yet writes what it has, and a template seed left in place states nothing while reading as a section that exists. The section set is DERIVED from the role template on every run, so this cannot drift from the document a seat is raised from, and a document listing only virtues is decoration — a seat reading its own document is looking for the trap it fell into last time";

export const checkRoleCoverage = function checkRoleCoverage(
    letters: readonly string[],
    files: readonly string[],
    build: FindingBuilder,
): Finding[] {
    return letters
        .filter((letter) => !files.some((file) => file.endsWith(`.${letter.toLowerCase()}.role.md`)))
        .map((letter) =>
            build(
                "roleMissing",
                letter,
                `${letter} is ACTIVE in the agent index and owns no role document`,
                `a <subject>.${letter.toLowerCase()}.role.md under the roles directory`,
                "a seat's role document is what every other seat reads to know what may be routed to it, and what a resuming session reads to know what it owns and refuses. The index ALLOCATES the letter and this check binds the obligation to it, so a new seat cannot become active without one — otherwise the shape is gated and the existence is not, and a uniform document nobody is required to write is a folder that stays empty while the gate reports green",
            ),
        );
};

export const checkRoleShape = function checkRoleShape(
    path: string,
    source: string,
    template: string,
    build: FindingBuilder,
): Finding[] {
    const sections = roleSectionsFrom(template);
    const present = new Set(trimmedLines(source));

    const fields = roleFieldsFrom(template)
        .filter((field) => !source.includes(field))
        .map((field) =>
            build("roleFieldMissing", field, `${path} declares no ${field}`, `${field} in the frontmatter`, DECIDE),
        );

    const missing = sections
        .filter((section) => !present.has(section))
        .map((section) =>
            build(
                "roleSectionMissing",
                section,
                `${path} carries no "${section}" section`,
                sections.join(", "),
                DECIDE,
            ),
        );

    const unfilled = unfilledMeasuredSections(source, template).map((gap) =>
        build(
            "measuredSectionUnfilled",
            gap.section,
            gap.state === "absent"
                ? `${path} carries no "${gap.section}" subsection`
                : `${path} declares "${gap.section}" and states nothing under it`,
            `${gap.section} carrying at least one measured entry, or absent from the template`,
            MEASURED_DECIDE,
        ),
    );

    return [...fields, ...missing, ...unfilled];
};
