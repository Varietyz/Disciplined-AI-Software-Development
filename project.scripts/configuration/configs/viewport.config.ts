import type { ArgvSpec } from "@govlab/argv";
import type { ViewportRules } from "#types/viewport.types";

export const VIEWPORT_DEFAULTS = { height: 844, scale: 2, settleMs: 3500, timeoutMs: 60_000, width: 390 } as const;

export const VIEWPORT_RULES: ViewportRules = {
    cuttingOverflow: ["hidden", "clip"],
    fieldSelector: "input, textarea, select",
    drawingSelector: "svg",
    hiddenSelector: ".visually-hidden",
    inlineSelector: "p, li, dd, td, figcaption, pre, code, .section-text",
    inputMinPx: 16,
    scrollPauseMs: 120,
    scrollRootId: "app",
    targetMinPx: 24,
    targetSelector: "a, button, summary, input, select, textarea, [role='button']",
    textMinPx: 12,
    tolerancePx: 1,
};

export const VIEWPORT_USER_AGENT =
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1";

export const VIEWPORT_PLATFORM = "iPhone";

export const VIEWPORT_TOUCH_POINTS = 5;

export const VIEWPORT_ARGV: ArgvSpec = {
    command: "npm run viewport --",
    flags: [
        {
            describe: "the folder that receives the report and one png per route; required",
            name: "--out-dir",
            takesValue: true,
        },
        {
            describe: "a built route to check, such as / or /pag/keywords; every built route when absent",
            name: "--route",
            repeatable: true,
            takesValue: true,
        },
        { describe: "the chrome or edge binary; detected when absent", name: "--browser", takesValue: true },
        { describe: "viewport width in pixels", name: "--width", takesValue: true },
        { describe: "viewport height in pixels", name: "--height", takesValue: true },
        { describe: "milliseconds to let each page settle", name: "--settle", takesValue: true },
        { describe: "milliseconds before the browser is abandoned", name: "--timeout", takesValue: true },
        { describe: "render on the gpu instead of in software", name: "--gpu", takesValue: false },
    ],
    summary:
        "Serve the built site on a free local port and open each route as a phone would, with a touch screen and a phone-sized viewport. Report each page that scrolls sideways, each element that runs past the screen, each form field under the size that stops the browser zooming on focus, each piece of text under the legible size, and each control under the touch minimum. Build the site first.",
};
