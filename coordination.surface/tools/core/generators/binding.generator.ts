import { type Slot, type SlotValue, type SurfaceConfig, config } from "../../../config/surface.config.ts";
import { BINDING_PATH } from "../constants/binding.constants.ts";
import { writeRepair } from "../writers/repair.writer.ts";

const SECTIONS: readonly (keyof SurfaceConfig)[] = ["project", "surface", "convention", "limits", "execution"];

const HEADING: Readonly<Record<string, string>> = {
    convention: "Convention slots",
    execution: "Execution",
    limits: "Limits",
    project: "Project slots: what the host supplies",
    surface: "Surface slots: what this package owns",
};

const MARKER = "<!-- GENERATED from the surface configuration. Edit the configuration, never this file. -->";

const renderValue = function renderValue(value: SlotValue): string {
    if (value === null) {
        return "—";
    }
    if (typeof value === "number") {
        return `\`${String(value)}\``;
    }
    if (typeof value === "string") {
        return `\`${value}\``;
    }
    if (value.length === 0) {
        return "`[]`, declared and empty";
    }
    return value.map((entry) => `\`${entry}\``).join(" · ");
};

const renderRow = function renderRow(section: string, name: string, slot: Slot): string {
    return `| \`{${section}.${name}}\` | ${slot.state} | ${renderValue(slot.value)} | ${slot.note} |`;
};

export const renderBinding = function renderBinding(): string {
    const lines: string[] = [
        MARKER,
        "---",
        "name: adapter-project-binding",
        "type: binding",
        "summary: Resolves every abstract slot the reasoning templates and the placement standard declare, against this deployment. A slot is RESOLVED, ABSENT or DEFERRED, and never silently faked.",
        "concern: binding",
        "status: current",
        "---",
        "",
        "# Adapter: project binding",
        "",
        "The reasoning templates and the placement standard are runtime-neutral cores. They carry no paths,",
        "no commands and no model, and instead declare `{slots}` an adapter resolves against the host. This",
        "document is that adapter, and it is rendered from the surface configuration. The values live there,",
        "so a hand edit here is a second truth that disagrees the moment one of them moves.",
        "",
        "## Resolution states",
        "",
        "Every slot resolves to exactly one of three states, and the third carries the most weight.",
        "",
        "| state | meaning | consequence |",
        "|---|---|---|",
        "| `RESOLVED` | a real value exists here | the branch using it runs |",
        "| `ABSENT` | this deployment has no analogue | **the branch using it does not run, and the absence is declared** |",
        "| `DEFERRED` | it will exist and does not yet | the branch is blocked, not skipped |",
        "",
        "`ABSENT` is a first-class answer. A consumer gating on a build command in a deployment with no build",
        "reports that it cannot gate, and it never invents a substitute or quietly passes. **An adapter that",
        "resolves every slot misstates at least one of them.**",
        "",
    ];

    for (const section of SECTIONS) {
        const slots = config[section];
        const names = Object.keys(slots).toSorted((left, right) => left.localeCompare(right, "en"));
        if (names.length === 0) {
            continue;
        }

        lines.push(`## ${HEADING[section] ?? section}`, "", "| slot | state | value | why |", "|---|---|---|---|");
        for (const name of names) {
            const slot = slots[name];
            if (slot === undefined) {
                continue;
            }
            lines.push(renderRow(section, name, slot));
        }
        lines.push("");
    }

    const counts = SECTIONS.map((section) => {
        const slots = config[section];
        const values = Object.values(slots);
        const resolved = values.filter((slot) => slot.state === "RESOLVED").length;
        const absent = values.filter((slot) => slot.state === "ABSENT").length;
        const deferred = values.filter((slot) => slot.state === "DEFERRED").length;
        return `| \`${section}\` | ${String(resolved)} | ${String(absent)} | ${String(deferred)} |`;
    });

    lines.push(
        "## Resolution census",
        "",
        "Derived on render, so it cannot disagree with the table above.",
        "",
        "| section | RESOLVED | ABSENT | DEFERRED |",
        "|---|---|---|---|",
        ...counts,
        "",
    );

    return `${lines.join("\n")}\n`;
};

export const writeBinding = function writeBinding(repoRoot: string, rendered: string, declared = ""): string | null {
    return writeRepair({ declared, repoRoot }, BINDING_PATH, rendered).refusal;
};
