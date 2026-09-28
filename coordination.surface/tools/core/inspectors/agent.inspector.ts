import {
    FRONTMATTER_FENCE,
    IDENTITY_MARKER,
    PROTOCOL_SKILL,
    SKILLS_MARKER,
    SUPPORTED_AGENT_KEYS,
} from "../constants/template.constants.ts";
import type { Finding, FindingBuilder } from "../types/segment.types.ts";

const closingFence = function closingFence(lines: readonly string[]): number {
    return lines.findIndex((line, index) => index > 0 && line.trim() === FRONTMATTER_FENCE);
};

export const bodyOf = function bodyOf(source: string): string {
    const lines = source.split("\n");
    if ((lines[0] ?? "").trim() !== FRONTMATTER_FENCE) {
        return source;
    }
    const close = closingFence(lines);
    return close === -1 ? "" : lines.slice(close + 1).join("\n");
};

const isLetter = function isLetter(char: string): boolean {
    return (char >= "a" && char <= "z") || (char >= "A" && char <= "Z");
};

export const participationOf = function participationOf(source: string): string | null {
    const body = bodyOf(source);
    const at = body.indexOf(IDENTITY_MARKER);
    if (at === -1) {
        return null;
    }

    let rest = body.slice(at + IDENTITY_MARKER.length).trimStart();
    while (rest.startsWith("*")) {
        rest = rest.slice(1);
    }
    let out = "";
    for (const char of rest) {
        if (!isLetter(char)) {
            break;
        }
        out += char;
    }
    return out;
};

const frontmatterKeys = function frontmatterKeys(source: string): string[] {
    const lines = source.split("\n");
    if ((lines[0] ?? "").trim() !== FRONTMATTER_FENCE) {
        return [];
    }
    const close = closingFence(lines);
    return lines
        .slice(1, close === -1 ? lines.length : close)
        .filter((line) => !line.startsWith(" ") && !line.startsWith("-") && line.indexOf(":") > 0)
        .map((line) => line.slice(0, line.indexOf(":")).trim());
};

export const preloadedSkills = function preloadedSkills(source: string): string[] {
    return bodyOf(source)
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.startsWith(SKILLS_MARKER))
        .flatMap((line) =>
            line
                .slice(SKILLS_MARKER.length)
                .split(",")
                .map((part) => part.trim())
                .filter((value) => value.length > 0),
        );
};

export const checkKeys = function checkKeys(name: string, source: string, build: FindingBuilder): Finding[] {
    return frontmatterKeys(source)
        .filter((key) => !SUPPORTED_AGENT_KEYS.includes(key))
        .map((key) =>
            build(
                "undeliveredKey",
                key,
                `${name} declares "${key}", which the adopted runtime does not read`,
                "a key the configuration lists as one the runtime reads, or the same content stated in the delivered body",
                "the runtime parses this frontmatter against a fixed set of keys and ignores every other one, so an unrecognized key is read by its author and by an auditor and DELIVERED TO NOBODY. That gives it two readerships and no consumer, which is the condition under which a declaration drifts against the body beside it and against every ruling above it with nothing breaking when it is wrong. Content the agent must act on belongs in the BODY, which is its system prompt; content the runtime must act on belongs in a key the runtime reads, and the configuration lists those keys because they differ per runtime. A third category exists only as decoration that reads like configuration",
            ),
        );
};

const unresolvedSkills = function unresolvedSkills(
    name: string,
    source: string,
    skills: ReadonlySet<string>,
    build: FindingBuilder,
): Finding[] {
    return preloadedSkills(source)
        .filter((skill) => !skills.has(skill))
        .map((skill) =>
            build(
                "skillDoesNotResolve",
                skill,
                `${name} loads ${skill}, which resolves to no skill in the tree`,
                `${skill} existing as a skill the runtime can load`,
                "a declared skill that does not resolve is skipped without an error the agent sees, so the spec declares the channel, the check passes on the declaration, and the agent receives nothing. The check binds EVERY declared entry rather than one named skill, because a guard written for one instance leaves a typo in every other entry silent — and the reasoning that justifies the guard is identical for all of them, which is exactly the shape of a rule that names an instance instead of the construct",
            ),
        );
};

const undeclaredParticipation = function undeclaredParticipation(name: string, build: FindingBuilder): Finding {
    return build(
        "participationUndeclared",
        name,
        `${name} states no "${IDENTITY_MARKER}" line in its delivered body`,
        `"${IDENTITY_MARKER} <LETTER>" in the body, which is the agent's system prompt`,
        "every board mechanism is keyed by an agent's letter — the fence, the reader set, the snapshot diff, the closure check — so an agent writing without one is unaddressable, uncloseable and cannot be told what was written to it. The declaration is read from the BODY because the body IS the delivered system prompt, while an unrecognized frontmatter key reaches nobody: a letter declared in such a field is one the agent never receives, so a check reading that field would measure the artifact while the mechanism stood inert",
    );
};

const unindexedParticipation = function unindexedParticipation(
    name: string,
    declared: string,
    build: FindingBuilder,
): Finding {
    return build(
        "participationUnindexed",
        declared,
        `${name} writes under ${declared}, which the agent index does not bind`,
        `${declared} carrying an index row before its first write`,
        "a letter is claimed by adding the index row, never by declaring it in a spec — an agent writing under a letter nothing resolves is unaddressable and uncloseable, and every citation later written against it resolves to nothing too",
    );
};

const protocolNotPreloaded = function protocolNotPreloaded(
    name: string,
    declared: string,
    build: FindingBuilder,
): Finding {
    return build(
        "protocolNotPreloaded",
        PROTOCOL_SKILL,
        `${name} writes under ${declared} without naming ${PROTOCOL_SKILL} on its ${SKILLS_MARKER} line`,
        `a ${SKILLS_MARKER} line in the body naming ${PROTOCOL_SKILL}`,
        "an agent holding a letter writes to a shared surface, and every rule governing that surface — one writer per record, the fence, extraction before removal, the handler removes the item — reaches it through NO other channel. The body is the agent's own and carries no shared protocol, and the board itself is never delivered. A skill is loaded WHOLE and is per-agent, which makes it the only surface that is both delivered and shared. The declaration sits in the body because the body is the one surface every runtime delivers, and adoption maps it onto the runtime's own preload key where the runtime has one",
    );
};

const letterNotInName = function letterNotInName(name: string, declared: string, build: FindingBuilder): Finding {
    return build(
        "letterNotInName",
        declared,
        `${name} does not carry ${declared} in its filename`,
        `<subject>.${declared}.md, with a name field ending -${declared}`,
        "the runtime resolves an agent by its name field and never by its filename, so this check is about THIS TREE'S citation graph rather than about how the agent is invoked. Every board item, index row and changelog line that ever named this letter is resolved by a reader searching the tree, and a filename carrying the letter is what makes that search terminate — carry it in a field alone and a rename disconnects those citations silently, because nothing here resolves them at runtime to fail loudly",
    );
};

export const checkIdentity = function checkIdentity(
    name: string,
    source: string,
    letters: ReadonlySet<string>,
    skills: ReadonlySet<string>,
    build: FindingBuilder,
): Finding[] {
    const declared = participationOf(source);
    if (declared === null || declared.length === 0) {
        return [undeclaredParticipation(name, build)];
    }
    const preloadsProtocol = preloadedSkills(source).includes(PROTOCOL_SKILL);
    return [
        ...(letters.has(declared) ? [] : [unindexedParticipation(name, declared, build)]),
        ...unresolvedSkills(name, source, skills, build),
        ...(preloadsProtocol ? [] : [protocolNotPreloaded(name, declared, build)]),
        ...(name.includes(`.${declared}.`) ? [] : [letterNotInName(name, declared, build)]),
    ];
};
