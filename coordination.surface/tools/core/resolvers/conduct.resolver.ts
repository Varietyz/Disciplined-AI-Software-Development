import {
    CERTIFIED_KIND_LABEL,
    ENTRY_COMMAND_LABEL,
    PIPELINE_STEP_LABEL,
    REGISTERED_RULE_LABEL,
    STEP_KIND_LABEL,
} from "../strings/conduct.strings.ts";
import { FAILING_QUESTIONS, PAIR_SEPARATOR } from "../constants/conduct.constants.ts";

export const corpusOf = function corpusOf(
    cell: string,
    ruleIds: ReadonlySet<string>,
    stepIds: ReadonlySet<string>,
    commands: ReadonlySet<string>,
    certified: ReadonlySet<string>,
    stepKinds: ReadonlySet<string>,
): string {
    const keyedCorpora = [
        { label: CERTIFIED_KIND_LABEL, members: certified },
        { label: STEP_KIND_LABEL, members: stepKinds },
    ];
    const bareCorpora = [
        { label: REGISTERED_RULE_LABEL, members: ruleIds },
        { label: PIPELINE_STEP_LABEL, members: stepIds },
        { label: ENTRY_COMMAND_LABEL, members: commands },
    ];

    const named = (member: string): string => {
        if (FAILING_QUESTIONS.includes(member)) {
            return "failing question";
        }
        if (member.includes(PAIR_SEPARATOR)) {
            return keyedCorpora.find((corpus) => corpus.members.has(member))?.label ?? "unkeyed";
        }
        const sets = bareCorpora.filter((corpus) => corpus.members.has(member)).map((corpus) => corpus.label);
        return sets.length === 0 ? "unresolved" : sets.join(" and ");
    };

    return cell
        .split(" ")
        .filter((held) => held.length > 0)
        .map((member) => `${member} → ${named(member)}`)
        .join(", ");
};

export const observerResolves = function observerResolves(
    cell: string,
    registered: ReadonlySet<string>,
    keyed: ReadonlySet<string>,
): boolean {
    const members = cell.split(" ").filter((member) => member.length > 0);
    if (members.length === 0) {
        return false;
    }

    if (members.some((member) => FAILING_QUESTIONS.includes(member))) {
        return members.length === 1;
    }

    return members.every((member) => (member.includes(PAIR_SEPARATOR) ? keyed : registered).has(member));
};
