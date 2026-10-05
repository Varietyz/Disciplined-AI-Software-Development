import type { TransferView } from "#types/deployment.types";

export const DEPLOY_START = "Bane's Lab deployment starting.";

export const CONNECTING = "Connecting to the droplet.";

export const CONNECTED = "SSH connected.";

export const BUILDING = "Building the site.";

export const BUILT = "Site built.";

export const BACKING_UP = "Creating a remote backup.";

export const BACKED_UP = "Remote backup created.";

export const DOWNLOADING_BACKUP = "Downloading the backup.";

export const BACKUP_SAVED = "Backup saved locally: ";

export const REMOTE_BACKUP_REMOVED = "Removed the remote backup file.";

export const PRUNING = "Pruning old backups, keeping the last ";

export const BACKUP_REMOVED = "Removed old backup: ";

export const PRUNED = "Prune step done.";

export const ROOT_PRUNING = "Pruning the remote root of anything the deploy does not own.";

export const ROOT_CLEAN = "The remote root holds only the site and the staging folder.";

export const STALE_REMOVED = "Removed stale remote entry: ";

export const ROOT_PRUNED = "Remote root pruned.";

export const UPLOADING = "Uploading the built site.";

export const FILES_FOUND = " file(s) to upload.";

export const PACKING = "Packing the built site into one archive.";

export const PACKED = "Site archive packed.";

export const UNPACKING = "Replacing the remote site with the archive's contents.";

export const unpackFailed = function unpackFailed(detail: string): string {
    return `The site archive did not unpack on the droplet, so the remote site may be empty: ${detail}`;
};

export const UPLOAD_LABEL = "Upload";

export const DOWNLOAD_LABEL = "Backup download";

export const REUPLOAD_LABEL = "Backup re-upload";

export const ARCHIVE_UNIT = "archive";

export const TIME_UNKNOWN = "--:--:--";

export const transferLine = function transferLine(view: TransferView): string {
    return `${view.label} ${view.bar} ${view.percent}%: ${view.done} of ${view.total} ${view.unit}, ${view.moved} of ${view.size} at ${view.rate}/s, ${view.left} left, ${view.failed} failed`;
};

export const UPLOAD_DONE = "Upload complete: ";

export const UPLOAD_INCOMPLETE = "Upload incomplete: ";

export const ROLLING_BACK = "Rolling back to the previous backup.";

export const REUPLOADING = "Re-uploading the backup: ";

export const EXTRACTING = "Extracting the backup on the remote.";

export const ROLLED_BACK = "Rollback complete.";

export const ROLLBACK_FAILED = "Rollback also failed: ";

export const SUMMARY_TITLE = "Deployment summary";

export const SUMMARY_FILES = "Files: ";

export const SUMMARY_SIZE = "Size: ";

export const SUMMARY_DURATION = "Duration: ";

export const SUMMARY_BACKUP = "Backup: ";

export const DEPLOY_DONE = "Deployment succeeded.";

export const DEPLOY_FAILED = "Deployment failed: ";

export const FATAL = "Fatal error: ";

export const NOTIFYING = "Sending the Discord notification.";

export const NOTIFIED = "Discord notification sent.";

export const NOTIFY_FAILED = "Failed to send the Discord notification: ";

export const BUILD_FAILED = "Site build failed.";

export const buildEnded = function buildEnded(code: number | null, signal: string | null): string {
    return signal === null ? ` The build exited with code ${String(code)}.` : ` The build was stopped by ${signal}.`;
};

export const VALIDATING_SITE = "Validating the built site.";

export const SITE_VALID = "Site validation passed.";

export const SITE_INVALID = "Site validation failed: ";

export const PROBING_SITE = "Checking the live site.";

export const PROBE_PASSED = "Live site check passed.";

export const PROBE_FAILED = "Live site check failed: ";

export const PROBE_ANSWERED = " answered ";

export const PROBE_INSTEAD = " instead of ";

export const PROBE_STALE = " serves content that differs from its catalog record.";

export const PROBE_LOGGED = "The server wrote to its error log while the site was checked:\n";

export const PROBE_LOG_UNREADABLE = "The server's error log could not be read: ";

export const PROBE_NO_RECORD = "The catalog lists no ontology record to check the query endpoint against.";

export const ERROR_LOG_MISSING =
    "The nginx site file declares no error_log directive, so the server's error log cannot be checked.";

export const SECONDS_SUFFIX = "s";

export const UPLOAD_OF = " of ";

export const UPLOADED_SUFFIX = " uploaded, ";

export const UPLOAD_FAILURES = " failed.";

export const NO_STATS = "No deployment stats available.";

export const NOT_AVAILABLE = "N/A";

export const NOT_CONNECTED = "SSH is not connected.";

export const ARCHIVE_FAILED =
    "The remote site could not be archived, so no rollback point exists and the deploy stops before it ships: ";
