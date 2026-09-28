export const CONCERN_MISSING =
    "REFUSED  A role document is named for the concern the seat owns, and none was given. The filename carries the " +
    "concern because a concern outlives the seat that holds it; the letter goes into the document's frontmatter. " +
    'Add the concern, for example `--role "coverage"`, and run the command again.\n';

export const ROLE_EXISTS =
    "CLEAR  This seat already has a role document, so nothing was written. Edit that document in place; a second " +
    "one for the same concern would give other seats two answers about what this seat owns.\n";

export const TEMPLATE_WITHOUT_SECTIONS =
    "REFUSED  The role template declares no sections, so the tool has nothing to build the document from. The " +
    "sections come from the template on every run; restore them in the template, then run the command again.\n";

export const roleRaised = function roleRaised(letter: string, concern: string): string {
    return (
        `DOCUMENT  A role document for ${letter} was created for the concern "${concern}". Its sections and ` +
        "frontmatter come from the role template, and each section is marked <unwritten>. Fill in every section, " +
        "including the failure modes this seat actually shows; other seats read that section to know what to watch " +
        "for.\n"
    );
};
