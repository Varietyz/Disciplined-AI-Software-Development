import { SITE_LOGO } from "@banes-lab/web/core/assets/image.assets.ts";
import { SITE_URL } from "@banes-lab/web/core/assets/link.assets.ts";

export const REMOTE_ROOT = "/var/www/banes-lab";

export const REMOTE_SITE = `${REMOTE_ROOT}/web`;

export const REMOTE_STAGING = `${REMOTE_ROOT}/staging`;

export const BACKUP_RETENTION = 5;

export const SITE_ARCHIVE = "site.tar.gz";

export const ARCHIVE_BINARY = "tar";

export const BUILD_BINARY = "npx";

export const BUILD_ARGUMENTS: readonly string[] = ["vite", "build", "--logLevel", "error"];

export const ARCHIVE_TEMPORARY_PREFIX = "banes-lab-site-";

export const PROBE_TIMEOUT_MS = 15_000;

export const BACKUP_PREFIX = "banes-lab-backup_";

export const ARCHIVE_SUFFIX = ".backup.tgz";

export const THUMBNAIL_URL = SITE_URL + SITE_LOGO;

export const MONITORING: readonly (readonly [string, string])[] = [
    ["Security headers", "https://securityheaders.com/?q=banes-lab.com"],
    ["SSL test", "https://www.ssllabs.com/ssltest/"],
    ["Performance", "https://pagespeed.web.dev/"],
    ["HTTP observatory", "https://developer.mozilla.org/en-US/observatory"],
    ["Hardenize", "https://www.hardenize.com/"],
];

export const MS_PER_SECOND = 1000;

export const BYTES_PER_MB = 1_000_000;

export const BYTES_PER_GB = 1_000_000_000;

export const SECONDS_PER_HOUR = 3600;

export const SECONDS_PER_DAY = 86_400;

export const STEP_SUMMARY_LIMIT = 900;

export const COMMIT_MESSAGE_LIMIT = 50;

export const ELLIPSIS = "...";

export const STAMP_SEPARATOR = "-";

export const STAMP_LENGTH = 19;

export const PATH_SEPARATOR = "/";

export const LINE_BREAK = "\n";

export const DECIMALS = 2;

export const PROGRESS_BAR_WIDTH = 30;

export const PROGRESS_REDRAW_MS = 250;

export const PROGRESS_LOG_STEP = 5;

export const PROGRESS_JOURNAL_STEP = 25;

export const PERCENT = 100;

export const BAR_FILLED = "█";

export const BAR_EMPTY = "░";

export const CARRIAGE_RETURN = "\r";

export const CLEAR_LINE = "\u001B[2K";

export const SECONDS_PER_MINUTE = 60;

export const CLOCK_SEPARATOR = ":";

export const CLOCK_PAD = 2;

export const CLOCK_FILL = "0";
