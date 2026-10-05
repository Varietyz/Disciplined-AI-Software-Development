import { BINDING_PATH, CONFIGURATION_PATH } from "../constants/binding.constants.ts";
import type { Finding } from "../types/segment.types.ts";
import type { Resolution } from "../types/binding.types.ts";

export const unresolvedSlot = function unresolvedSlot(path: string, line: number, slot: string): Finding {
    return {
        actual: `${slot} is consumed but the adapter binding does not resolve it`,
        expected: `${slot} declared in ${BINDING_PATH}, or resolved ABSENT`,
        healed: false,
        line,
        locus: slot,
        path,
        remediation: {
            action: "declare",
            decide: `an abstract slot resolves against the adapter binding or resolves ABSENT, and an ABSENT slot means the branch using it does not run — which is declared rather than faked. Two artifacts can carry the repair and only one of them is this finding's subject: either ${path} stops naming ${slot}, or ${BINDING_PATH} binds it to its project value or declares it ABSENT. Deciding which is the judgment, so neither is offered as the target`,
            deterministic: false,
            from: slot,
            target: path,
            to: BINDING_PATH,
        },
        rule: "binding/unresolvedSlot",
        stack: [
            { check: "slot", resolved: slot },
            { check: "binding", resolved: BINDING_PATH },
            { check: "resolution", resolved: "absent" },
        ],
    };
};

export const misSectioned = function misSectioned(path: string, line: number, slot: string, actual: string): Finding {
    return {
        actual: `${slot} names a section that does not declare it, and ${actual} does`,
        expected: actual,
        healed: false,
        line,
        locus: slot,
        path,
        remediation: { action: "rename", decide: "", deterministic: true, from: slot, target: path, to: actual },
        rule: "binding/slotInWrongSection",
        stack: [
            { check: "slot", resolved: slot },
            { check: "declared", resolved: actual },
        ],
    };
};

export const unhonored = function unhonored(path: string, line: number, slot: string, state: Resolution): Finding {
    return {
        actual: `${slot} is consumed as though it resolved, and the adapter resolves it ${state}`,
        expected: `the consuming line names ${state}, so the branch reading ${slot} does not run`,
        healed: false,
        line,
        locus: slot,
        path,
        remediation: {
            action: "declare",
            decide: `a slot has three resolution states and only one of them lets its branch run. The adapter is checked for whether a slot is DECLARED; nothing checks whether the CONSUMER honors what it declares, so a spec reading a non-resolving slot as though it resolved passes every existing check — which makes a gate satisfiable only by fabricating the evidence it demands. Two repairs are available and choosing between them is the judgment: ${path} states the ${state} resolution at the consuming line and does not run that branch, or it stops naming ${slot} at all. ABSENT means this deployment has no analogue and the branch is skipped; DEFERRED means the branch is BLOCKED rather than skipped, and collapsing the second into the first answers a different question in the right shape`,
            deterministic: false,
            from: slot,
            target: path,
            to: state,
        },
        rule: "binding/stateNotHonored",
        stack: [
            { check: "slot", resolved: slot },
            { check: "binding", resolved: BINDING_PATH },
            { check: "resolution", resolved: state },
        ],
    };
};

export const drifted = function drifted(path: string): Finding {
    return {
        actual: "the adapter binding on disk differs from the configuration it is rendered from",
        expected: "the rendered binding",
        healed: true,
        line: 0,
        locus: "adapter binding",
        path,
        remediation: {
            action: "declare",
            decide: `the binding is rendered from ${CONFIGURATION_PATH} and frozen to every hand, so a value that should change is changed in the configuration and the binding re-renders from it`,
            deterministic: true,
            from: path,
            target: CONFIGURATION_PATH,
            to: path,
        },
        rule: "binding/bindingDrift",
        stack: [
            { check: "source", resolved: "the surface configuration" },
            { check: "rendered", resolved: "differs from the document on disk" },
        ],
    };
};
