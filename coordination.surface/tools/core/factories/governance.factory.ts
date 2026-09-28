import type { Finding } from "../types/segment.types.ts";
import { GENERATED_DIR } from "../constants/path.constants.ts";
import { basename } from "node:path";
import type { staleChannels } from "../validators/channel.validator.ts";
import type { unsanctionedWriters } from "../validators/writer.validator.ts";

type Breach = ReturnType<typeof unsanctionedWriters>[number];

type StaleChannel = ReturnType<typeof staleChannels>[number];

export const contractFinding = function contractFinding(
    path: string,
    locus: string,
    actual: string,
    decide: string,
    resolved: string,
): Finding {
    return {
        actual,
        expected: null,
        healed: false,
        line: 0,
        locus,
        path,
        remediation: { action: "declare", decide, deterministic: false, from: actual, target: path, to: null },
        rule: "governance/ruleContract",
        stack: [
            { check: "ruleSource", resolved: basename(path) },
            { check: "contract", resolved },
        ],
    };
};

export const orphanFinding = function orphanFinding(name: string): Finding {
    return {
        actual: name,
        expected: null,
        healed: true,
        line: 0,
        locus: name,
        path: `${GENERATED_DIR}/${name}`,
        remediation: {
            action: "delete",
            decide: "",
            deterministic: true,
            from: name,
            target: `${GENERATED_DIR}/${name}`,
            to: null,
        },
        rule: "governance/orphanReport",
        stack: [
            { check: "reportShape", resolved: "declares rule and stage" },
            { check: "claimedBy", resolved: "no rule declaration and no step emission" },
        ],
    };
};

export const writerFinding = function writerFinding(breach: Breach): Finding {
    return {
        actual: `${breach.path} writes the filesystem directly and a run reaches it`,
        expected: null,
        healed: false,
        line: 0,
        locus: breach.member,
        path: breach.path,
        remediation: {
            action: "declare",
            decide:
                "route the write through the restricted writer, which takes the scope this run DECLARED and " +
                "refuses a path outside it — so containment is answered at one function rather than by a witness " +
                "nobody holds for a repair scattered across source. A gate over a DIRECTORY reports a complete " +
                "funnel while a module writes beneath it, which is why this ranges over what a run REACHES",
            deterministic: false,
            from: breach.member,
            target: breach.path,
            to: null,
        },
        rule: "governance/unsanctionedWriter",
        stack: [
            { check: "reachableFromARun", resolved: "yes" },
            { check: "sanctionedWriter", resolved: "no" },
        ],
    };
};

export const staleChannelFinding = function staleChannelFinding(channel: StaleChannel): Finding {
    return {
        actual: channel.scope,
        expected: null,
        healed: true,
        line: 0,
        locus: channel.scope,
        path: `${GENERATED_DIR}/${channel.name}`,
        remediation: {
            action: "delete",
            decide: "",
            deterministic: true,
            from: channel.name,
            target: `${GENERATED_DIR}/${channel.name}`,
            to: null,
        },
        rule: "governance/staleChannel",
        stack: [
            { check: "channelShape", resolved: "names its scope and declares itself non-authoritative" },
            { check: "scopeResolves", resolved: "no" },
        ],
    };
};
