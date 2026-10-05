import type { TemplateRecord, TemplateSlot } from "#types/grammar.types";
import { enumViolation, missingRequiredSlot } from "#configuration/strings/grammar.strings";
import type { TemplateResolveResult } from "#types/grammar.document.types";

const slotMarkOf = function slotMarkOf(name: string): string {
    return `{${name}}`;
};

const suppliedValue = function suppliedValue(slots: Record<string, string>, name: string): string {
    return Object.hasOwn(slots, name) ? (slots[name] ?? "") : "";
};

const outOfEnum = function outOfEnum(slot: TemplateSlot, value: string): boolean {
    if (value === "" || !Array.isArray(slot.enum) || slot.enum.length === 0) {
        return false;
    }
    return !slot.enum.includes(value);
};

const slotViolation = function slotViolation(slot: TemplateSlot, value: string): string | null {
    if (slot.required && value === "") {
        return missingRequiredSlot(slot.name);
    }
    return outOfEnum(slot, value) ? enumViolation(slot.name) : null;
};

const substitute = function substitute(body: string, slots: Record<string, string>): string {
    return Object.entries(slots).reduce((text, [name, value]) => text.replaceAll(slotMarkOf(name), value), body);
};

export const resolvePagTemplate = function resolvePagTemplate(
    template: TemplateRecord,
    slots: Record<string, string>,
): TemplateResolveResult {
    const violations = template.slots.flatMap((slot) => slotViolation(slot, suppliedValue(slots, slot.name)) ?? []);
    const text = substitute(template.body, slots);
    const unresolved = template.slots.filter((slot) => text.includes(slotMarkOf(slot.name))).map((slot) => slot.name);
    return { text, unresolved, violations };
};

export const slotIsDangling = function slotIsDangling(template: TemplateRecord, slot: TemplateSlot): boolean {
    return !template.body.includes(slotMarkOf(slot.name));
};
