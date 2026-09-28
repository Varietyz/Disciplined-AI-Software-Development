export type WriteOperand = "document" | "entry" | "field" | "item" | "record";

export type MandateRoute = "outOfScope" | "reached" | "unwritable";

export interface ToolForm {
    readonly operand: WriteOperand;
    readonly member: string | null;
    readonly venueOnly: boolean;
    readonly anyMember?: boolean;
    readonly slots?: readonly string[];
}

export interface FormAssessment {
    readonly effect: "carry" | "remove" | "write";
    readonly region: string | null;
    readonly note: string;
    readonly reaches?: ToolForm;
}

export interface MandatedSurface {
    readonly slot: string;
    readonly operand: WriteOperand;
    readonly member: string | null;
    readonly refusal: string;
    readonly lowCost?: string;
}

export interface WritablePair {
    readonly path: string;
    readonly operand: WriteOperand;
    readonly member: string | null;
    readonly anyMember: boolean;
}

export interface ResolvedMandate {
    readonly from: string;
    readonly target: string;
    readonly operand: WriteOperand;
    readonly member: string | null;
    readonly refusal: string;
    readonly lowCost?: string;
}
