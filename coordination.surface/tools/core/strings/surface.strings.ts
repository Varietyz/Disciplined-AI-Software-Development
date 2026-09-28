export const SUBJECT_MISSING =
    "REFUSED  A new surface is named for its subject, and none was given. Citations reach a surface through its " +
    "filename, so the subject is required.\n";

export const subjectUndeclared = function subjectUndeclared(subject: string, declared: readonly string[]): string {
    return (
        `REFUSED  ${subject} is not a declared subject, so a surface named for it would fail the naming check on ` +
        "its first run. Use a declared subject, or add the word to the subjects in `config/taxonomy.config.ts` " +
        `after checking it is not a concern or a synonym of an existing subject. Declared: ${declared.join(" ")}\n`
    );
};

export const templateSeedsNothing = function templateSeedsNothing(templateSlot: string): string {
    return (
        `REFUSED  ${templateSlot} is not declared as seeding a surface, so the tool cannot tell where the new file ` +
        "belongs. The destination comes from the template's seeds declaration in the configuration.\n"
    );
};

export const templateFileMissing = function templateFileMissing(templateSlot: string): string {
    return `REFUSED  ${templateSlot} points to no file, so there is no template to build the surface from.\n`;
};

export const surfaceExists = function surfaceExists(target: string): string {
    return (
        `CLEAR  ${target} already exists, so nothing was written. Edit that surface in place; a second one for the ` +
        "same subject would give readers two versions to choose between.\n"
    );
};

export const contractBlockMissing = function contractBlockMissing(templateSlot: string): string {
    return (
        `REFUSED  ${templateSlot} has no permanent block, so a surface built from it would carry no rules. Restore ` +
        "the template's permanent block, then run the command again.\n"
    );
};

export const surfaceRehearsed = function surfaceRehearsed(target: string, templateSlot: string): string {
    return (
        `REHEARSED  ${target} would be created from ${templateSlot}, with its permanent blocks. Nothing was ` +
        "written. Every check the real command runs has passed: the subject is declared, the template and its " +
        "destination resolve, the file is free, and the permanent block is present.\n"
    );
};

export const surfaceRaised = function surfaceRaised(target: string, templateSlot: string): string {
    return (
        `SURFACE  ${target} was created from ${templateSlot}. It carries the template's permanent blocks, and its ` +
        "working sections are present and empty, ready for their first entries.\n"
    );
};
