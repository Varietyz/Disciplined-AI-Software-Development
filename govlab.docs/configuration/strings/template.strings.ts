export const unknownForm = function unknownForm(form: string, valid: string): string {
    return `✖ docs:new — unknown form "${form}". Valid forms: ${valid}`;
};

export const MISSING_SUBJECT =
    "✖ docs:new — provide --subject (the topic tail); the name composes as <prefix>-[<verb>-]<subject>.";

export const notActivity = function notActivity(form: string, concern: string, activities: string): string {
    return `✖ docs:new — form "${form}" is directive; concern "${concern}" must be an activity (${activities}).`;
};

export const brokenName = function brokenName(name: string, detail: string): string {
    return `✖ docs:new — name "${name}" breaks the naming convention: ${detail}`;
};

export const unplaceable = function unplaceable(reason: string, detail: string, hint: string): string {
    return `✖ docs:new — ${reason}: ${detail}.${hint}`;
};

export const concernHint = function concernHint(concerns: string): string {
    return ` Valid concerns: ${concerns}.`;
};

export const memberHint = function memberHint(members: string): string {
    return ` Pass --member <one of: ${members}>.`;
};

export const alreadyExists = function alreadyExists(path: string): string {
    return `✖ docs:new — already exists: ${path}`;
};

export const created = function created(path: string): string {
    return `✓ docs:new — created ${path}`;
};

export const placeholderSummary = function placeholderSummary(name: string): string {
    return `One-line summary of ${name}.`;
};

export const MODULE_BODY = "Newest entries first.";

export const DEFAULT_BODY = "Content.";
