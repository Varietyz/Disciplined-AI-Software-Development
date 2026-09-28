const HEADING_LEAD = "### ";

const BACKTICK = "`";

const isLead = function isLead(candidate: string): boolean {
    if (candidate.length < 2) {
        return false;
    }
    if (!candidate.endsWith(":")) {
        return false;
    }

    for (const char of candidate.slice(0, -1)) {
        if (char < "A" || char > "Z") {
            return false;
        }
    }

    return true;
};

const CLASS_BOUND_MARKER = "presuppose a CLASS";

const preamble = function preamble(accumulator: string): string[] {
    const lines = accumulator.split("\n");
    const heading = lines.findIndex((line) => line.startsWith(HEADING_LEAD));
    return heading === -1 ? lines : lines.slice(0, heading);
};

const backticked = function backticked(line: string): string[] {
    const parts = line.split(BACKTICK);
    return parts.filter((_, index) => index % 2 === 1 && index < parts.length - 1).map((part) => part.trim());
};

const leadsIn = function leadsIn(lines: readonly string[]): string[] {
    return [...new Set(lines.flatMap(backticked).filter(isLead))];
};

export const classBoundLeads = function classBoundLeads(accumulator: string): string[] {
    return leadsIn(preamble(accumulator).filter((line) => line.includes(CLASS_BOUND_MARKER)));
};

export const declaredLeads = function declaredLeads(accumulator: string): string[] {
    return leadsIn(preamble(accumulator));
};
