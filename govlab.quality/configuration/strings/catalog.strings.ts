export const commandFailed = function commandFailed(command: string, stderr: string): string {
    return `The catalog command "${command}" failed. Install the tool it runs, or leave its producer out of the refresh.\n${stderr}`;
};

export const productLine = function productLine(source: string, summary: string): string {
    return `\n▸ ${source}\n${summary}\n`;
};

export const stepLine = function stepLine(name: string, milliseconds: number): string {
    return `  ✓ ${name} (${String(Math.round(milliseconds))} ms)\n`;
};

export const unknownProducer = function unknownProducer(name: string, known: string): string {
    return `No catalog producer is named "${name}". Name one of ${known}.`;
};

export const duplicateProducer = function duplicateProducer(name: string): string {
    return `Two catalog producers register the name "${name}". Give each producer file its own name.`;
};

export const duplicateStep = function duplicateStep(name: string): string {
    return `Two catalog steps register the name "${name}". Give each step file its own name.`;
};

export const duplicateGiver = function duplicateGiver(key: string, first: string, second: string): string {
    return `The catalog steps "${first}" and "${second}" both give "${key}". Let exactly one step give it.`;
};

export const missingNeed = function missingNeed(step: string, key: string): string {
    return `The catalog step "${step}" needs "${key}", which no step gives. Add the step that gives it, or drop the need.`;
};

export const stuckSteps = function stuckSteps(names: readonly string[]): string {
    return `The catalog steps ${names.join(", ")} wait on each other in a cycle. Break the cycle between their needs and gives.`;
};

export const undeclaredConcept = function undeclaredConcept(tool: string, ruleId: string, concept: string): string {
    return `Rule ${tool}:${ruleId} declares unknown concept "${concept}". Add it to the concept data, or fix the rule's canonical list.`;
};

export const unknownCanonRef = function unknownCanonRef(ref: string, concept: string): string {
    return `canon-refs: ${ref} names "${concept}", which is no quality concept\n`;
};

export const REGENERATED = "\n✓ quality-rule catalog regenerated\n";
