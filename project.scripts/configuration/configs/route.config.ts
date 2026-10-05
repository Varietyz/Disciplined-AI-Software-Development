import type { ArgvSpec } from "@govlab/argv";

export const LISTEN_TIMEOUT_MS = 180_000;

export const LISTEN_POLL_MS = 250;

export const LOCAL_ORIGIN = "https://localhost:";

export const CAPTURE_ARGV: ArgvSpec = {
    command: "npm run capture --",
    flags: [
        {
            describe: "a site route to capture, such as / or /anatomy/tree; required",
            name: "--route",
            repeatable: true,
            takesValue: true,
        },
        {
            describe: "the folder that receives one png and one console log per route; required",
            name: "--out-dir",
            takesValue: true,
        },
        { describe: "the chrome or edge binary; detected when absent", name: "--browser", takesValue: true },
        { describe: "milliseconds to let each page settle", name: "--settle", takesValue: true },
        { describe: "render on the gpu instead of in software", name: "--gpu", takesValue: false },
    ],
    summary:
        "Start the dev server on its declared port, capture a screenshot and a console log for each route, and stop the server it started. Refuses when anything already holds the port, because a process this tool did not start is never its to stop.",
};
