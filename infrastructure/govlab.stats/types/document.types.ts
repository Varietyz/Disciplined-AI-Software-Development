export interface DocArchStats {
    byForm: Map<string, number>;
    byStatus: Map<string, number>;
    total: number;
}

export interface DocInfo {
    form: string;
    status: string;
}
