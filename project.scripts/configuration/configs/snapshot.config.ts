import type { ArgvSpec } from "@govlab/argv";

export const SNAPSHOT_DEFAULTS = {
    clickAfterMs: 9000,
    height: 900,
    settleMs: 6000,
    timeoutMs: 60_000,
    width: 1440,
} as const;

export const SNAPSHOT_ARGV: ArgvSpec = {
    command: "npm run snapshot --",
    flags: [
        { describe: "the page to open; required", name: "--url", takesValue: true },
        { describe: "write a png screenshot here", name: "--out", takesValue: true },
        { describe: "write the console log here", name: "--log", takesValue: true },
        { describe: "the chrome or edge binary; detected when absent", name: "--browser", takesValue: true },
        { describe: "click at x,y after the page settles", name: "--click", takesValue: true },
        { describe: "milliseconds to wait before the click", name: "--click-after", takesValue: true },
        { describe: "viewport width in pixels", name: "--width", takesValue: true },
        { describe: "viewport height in pixels", name: "--height", takesValue: true },
        { describe: "milliseconds to let the page settle", name: "--settle", takesValue: true },
        { describe: "milliseconds before the capture is abandoned", name: "--timeout", takesValue: true },
        { describe: "render on the gpu instead of in software", name: "--gpu", takesValue: false },
    ],
    summary:
        "Open a page in a headless browser and capture a screenshot, a console log, or both. One of --out or --log is required.",
};
