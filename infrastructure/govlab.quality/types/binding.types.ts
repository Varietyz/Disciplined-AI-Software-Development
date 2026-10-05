export interface RuleSource {
    id: string;
    file: string;
    text: string;
}

export interface BindingFinding {
    file: string;
    id: string;
    reason: "no-canonical" | "no-contract" | "unknown-concept";
    detail: string;
}
