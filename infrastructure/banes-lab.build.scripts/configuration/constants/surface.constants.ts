import {
    SAMPLE_ESTABLISHES,
    SAMPLE_INVARIANT,
    SAMPLE_OWNER_ENTRY,
    SAMPLE_POSITION_A,
    SAMPLE_POSITION_B,
    SAMPLE_ROLES,
} from "#configuration/strings/surface.strings";
import type { Scenario, ScenarioStep } from "#types/surface.types";

export const VENUE_PLACEHOLDER = "{venue}";

export const INSTALL_FOLDER = "coordination";

export const TEMPORARY_PREFIX = "surface-recording-";

export const RECORD_OPEN = "┌─── AGENT ";

export const RECORD_CLOSE = "└─── END AGENT ";

export const SECTION_BANNER = "═══";

export const CODE_FENCE = "```";

export const ROSTER_LINES: readonly string[] = ["NOT-READ:", "READ AND AWAITING:"];

export const STEP_TIMEOUT_MS = 180_000;

export const WAIT_SETTLE_MS = 600;

export const WAIT_POLL_MS = 50;

export const WAIT_LIMIT_MS = 20_000;

export const HASHED_FOLDERS: readonly string[] = ["config", "templates", "tools"];

export const RECORDER_FOLDERS: readonly string[] = ["configuration", "core", "types"];

export const RECORDER_SUBJECT = "surface.";

export const SCRIPT_RUNNER = "node ";

const [FOO, BAR, BAZ] = SAMPLE_ROLES;

const ESTABLISHES_FILE = "establishes.md";

const POSITION_A_FILE = "position-a.md";

const POSITION_B_FILE = "position-b.md";

const setup = function setup(tool: "await" | "govern", args: readonly string[], exit: number | null): ScenarioStep {
    return { args, delivers: false, exit, figures: [], kind: "tool", tool };
};

export const SCENARIO: Scenario = {
    samples: [
        { name: ESTABLISHES_FILE, text: SAMPLE_ESTABLISHES },
        { name: POSITION_A_FILE, text: SAMPLE_POSITION_A },
        { name: POSITION_B_FILE, text: SAMPLE_POSITION_B },
    ],
    steps: [
        setup("await", ["--agent", "A", "--index", FOO], 0),
        setup("await", ["--agent", "B", "--index", BAR], 0),
        setup("await", ["--agent", "C", "--index", BAZ], 0),
        setup("await", ["--agent", "A", "--record", "--no-wait"], 0),
        setup("await", ["--agent", "B", "--record", "--no-wait"], 0),
        setup("await", ["--agent", "C", "--record", "--no-wait"], 0),
        setup(
            "await",
            ["--agent", "A", "--agenda", SAMPLE_INVARIANT, "--establishes-file", ESTABLISHES_FILE, "--planned", "1"],
            0,
        ),
        setup("govern", ["--agent", "A"], null),
        setup("await", ["--agent", "A", "--raise", SAMPLE_INVARIANT], 0),
        setup("await", ["--agent", "A", "--file", VENUE_PLACEHOLDER, "--no-wait"], 0),
        setup("await", ["--agent", "B", "--file", VENUE_PLACEHOLDER, "--no-wait"], 0),
        setup("await", ["--agent", "C", "--file", VENUE_PLACEHOLDER, "--no-wait"], 0),
        {
            args: [
                "--agent",
                "A",
                "--file",
                VENUE_PLACEHOLDER,
                "--item-file",
                POSITION_A_FILE,
                "--kind",
                "judgment",
                "--no-wait",
            ],
            delivers: false,
            exit: 0,
            figures: ["venue"],
            kind: "tool",
            tool: "await",
        },
        { args: ["--agent", "C", "--file", VENUE_PLACEHOLDER], exit: 0, figures: ["wait"], kind: "wait" },
        {
            args: [
                "--agent",
                "B",
                "--file",
                VENUE_PLACEHOLDER,
                "--item-file",
                POSITION_B_FILE,
                "--kind",
                "judgment",
                "--no-wait",
            ],
            delivers: false,
            exit: 0,
            figures: ["venue", "wait", "delivery"],
            kind: "tool",
            tool: "await",
        },
        {
            args: ["--agent", "A", "--file", VENUE_PLACEHOLDER, "--no-wait"],
            delivers: true,
            exit: 0,
            figures: ["delivery"],
            kind: "tool",
            tool: "await",
        },
        { figures: ["owner"], kind: "write", text: SAMPLE_OWNER_ENTRY },
        ...["A", "B", "C"].map((letter): ScenarioStep => ({
            args: ["--agent", letter, "--file", VENUE_PLACEHOLDER, "--no-wait"],
            delivers: true,
            exit: 0,
            figures: ["owner"],
            kind: "tool",
            tool: "await",
        })),
    ],
};
