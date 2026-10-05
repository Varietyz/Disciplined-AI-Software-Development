export interface TransferOptions {
    readonly step: (transferred: number, chunk: number, size: number) => void;
}

export interface UploadStats {
    readonly failedCount: number;
    readonly totalBytes: number;
    readonly totalFileCount: number;
    readonly uploadedCount: number;
}

export interface Journal {
    readonly error: (message: string) => void;
    readonly log: (message: string) => void;
    readonly mark: (message: string) => void;
    readonly summary: () => string;
}

export interface TransferPlan {
    readonly label: string;
    readonly size: number;
    readonly total: number;
    readonly unit: string;
}

export interface TransferState extends TransferPlan {
    readonly done: number;
    readonly failed: number;
    readonly startedAt: number;
    readonly transferred: number;
}

export interface TransferView {
    readonly bar: string;
    readonly done: string;
    readonly failed: string;
    readonly label: string;
    readonly left: string;
    readonly moved: string;
    readonly percent: string;
    readonly rate: string;
    readonly size: string;
    readonly total: string;
    readonly unit: string;
}

export interface Progress {
    readonly advance: (items: number, bytes: number, failed: boolean) => void;
    readonly finish: () => void;
    readonly note: (message: string) => void;
}

export interface ProgressSink {
    readonly isTTY?: boolean;
    readonly write: (text: string) => boolean;
}

export type ByteStep = (transferred: number, size: number) => void;

export interface CommandResult {
    readonly code: number | null;
    readonly stderr: string;
    readonly stdout: string;
}

export interface ChildExit {
    readonly code: number | null;
    readonly signal: string | null;
}

export interface ManagedBackup {
    readonly local: string | null;
    readonly remote: string;
}

export interface Shell {
    readonly connect: () => Promise<void>;
    readonly dispose: () => void;
    readonly download: (localPath: string, remotePath: string, step?: ByteStep) => Promise<void>;
    readonly run: (command: string) => Promise<CommandResult>;
    readonly upload: (localPath: string, remotePath: string, step?: ByteStep) => Promise<void>;
}

export interface Span {
    readonly finishedAt: number;
    readonly startedAt: number;
}

export interface Secrets {
    readonly deployWebhook: string;
    readonly host: string;
    readonly keyFile: string;
    readonly nginxWebhook: string;
    readonly passphrase: string | null;
    readonly user: string;
}

export interface PackageSource {
    readonly base: string;
    readonly component: string;
}

export interface Relation {
    readonly exact: string | null;
    readonly name: string;
}

export interface PackageStanza {
    readonly depends: readonly Relation[];
    readonly name: string;
    readonly provides: readonly string[];
    readonly sha256: string;
    readonly url: string;
    readonly version: string;
}

export interface InstalledPackage {
    readonly configured: boolean;
    readonly name: string;
    readonly version: string | null;
}

export interface SourceArchive {
    readonly archive: string;
    readonly folder: string;
    readonly sha256: string;
}

export interface SourceModule extends SourceArchive {
    readonly object: string;
    readonly version: string;
}

export interface ModuleLoader {
    readonly file: string;
    readonly object: string;
}

export interface Platform {
    readonly architecture: string;
    readonly codename: string;
}

export interface PackagePlan {
    readonly added: readonly string[];
    readonly install: readonly PackageStanza[];
    readonly revert: readonly PackageStanza[];
}

export type IndexFetcher = (url: string) => Promise<string>;

export interface ProbeResponse {
    readonly body: string;
    readonly status: number;
    readonly type: string;
}

export type ProbeFetcher = (url: string, method: string) => Promise<ProbeResponse>;

export interface ProbeExpectation {
    readonly address: string;
    readonly method: string;
    readonly status: number;
    readonly type: string;
}

export interface CatalogRow {
    readonly bytes: number;
    readonly fingerprint: string;
    readonly json: string;
    readonly markdown: string | null;
    readonly ref: string | null;
    readonly title: string | null;
}

export interface SetupContext {
    readonly fetchIndex: IndexFetcher;
    readonly journal: Journal;
    readonly modules: readonly SourceModule[];
    readonly plan: PackagePlan;
    readonly shell: Shell;
}

export interface SetupEffect {
    readonly applies: (context: SetupContext) => boolean;
    readonly run: (context: SetupContext) => Promise<void>;
}

export interface Outcome {
    readonly backup: string;
    readonly failure: string;
    readonly span: Span;
    readonly stats: UploadStats | null;
}
