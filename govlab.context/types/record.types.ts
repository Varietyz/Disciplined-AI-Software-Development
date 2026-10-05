export type UnreadReason = "not-a-record" | "rejected" | "unread";

export interface UnreadKey {
    collection: string;
    key: string;
    reason: UnreadReason;
    record: string;
}

export interface TrackedRecord {
    delegated: Set<string>;
    raw: Record<string, unknown>;
    read: Set<string>;
    record: string;
}

export interface RecordOrigin {
    entry: TrackedRecord;
    prefix: string;
    target: Record<string, unknown>;
}
