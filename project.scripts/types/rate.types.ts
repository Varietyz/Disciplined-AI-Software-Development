export interface RateRecord {
    readonly id: string;
    readonly createdAt: number;
    readonly rate: number;
    readonly titles: readonly string[];
    readonly seniorities: readonly string[];
    readonly country: string;
}

export interface PeerGroup {
    readonly label: string;
    readonly titles: readonly string[];
    readonly seniorities: readonly string[];
}

export interface GroupSummary {
    readonly label: string;
    readonly count: number;
    readonly median: number;
    readonly p25: number;
    readonly p75: number;
    readonly p90: number;
    readonly highest: number;
    readonly below: number | null;
}

export interface RateOptions {
    readonly rate: number | null;
    readonly months: number;
    readonly out: string;
}

export interface RateReport {
    readonly fetchedOn: string;
    readonly statedUpdate: string;
    readonly statedCount: number | null;
    readonly records: readonly RateRecord[];
    readonly counted: readonly RateRecord[];
    readonly months: number;
    readonly rate: number | null;
    readonly groups: readonly GroupSummary[];
}
