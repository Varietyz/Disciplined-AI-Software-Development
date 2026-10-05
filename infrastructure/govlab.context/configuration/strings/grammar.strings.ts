export const undeclaredPagKind = function undeclaredPagKind(kind: string): string {
    return `pag: the kind "${kind}" is not declared in the PAG taxonomy`;
};

export const missingRequiredSlot = function missingRequiredSlot(slot: string): string {
    return `missing_required_slot:${slot}`;
};

export const enumViolation = function enumViolation(slot: string): string {
    return `enum_violation:${slot}`;
};

export const unknownTemplateType = function unknownTemplateType(type: string): string {
    return `unknown_template_type:${type}`;
};
