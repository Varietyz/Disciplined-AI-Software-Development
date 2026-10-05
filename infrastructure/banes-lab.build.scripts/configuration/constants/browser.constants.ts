export const PROFILE_PREFIX = ".browser-profile-";

export const ACTIVE_PORT_FILE = "DevToolsActivePort";

export const LOCKED_FILE_CODES: ReadonlySet<string> = new Set(["EBUSY", "EPERM", "EACCES"]);

export const EXIT_WAIT_MS = 10_000;

export const PROFILE_REMOVE_RETRIES = 50;

export const PROFILE_RETRY_DELAY_MS = 200;

export const BROWSER_CANDIDATES: readonly string[] = [
    String.raw`C:\Program Files\Google\Chrome\Application\chrome.exe`,
    String.raw`C:\Program Files (x86)\Google\Chrome\Application\chrome.exe`,
    String.raw`C:\Program Files\Microsoft\Edge\Application\msedge.exe`,
    String.raw`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`,
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
];
