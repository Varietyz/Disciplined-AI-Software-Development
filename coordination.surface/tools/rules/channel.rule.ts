import type { RuleContext, RuleDeclaration, RuleResult } from "../core/types/rule.types.ts";
import { channelsIn, collidingScopes, misnamedChannels } from "../core/validators/channel.validator.ts";
import type { Finding } from "../core/types/segment.types.ts";
import { GENERATED_DIR } from "../core/constants/path.constants.ts";

export const rule: RuleDeclaration = {
    check(context: RuleContext): RuleResult {
        const findings: Finding[] = [];

        for (const breach of misnamedChannels(context.repoRoot)) {
            findings.push({
                actual: `${breach.name} decodes to ${breach.named} and its body declares ${breach.declared}`,
                expected: breach.declared,
                healed: false,
                line: 0,
                locus: breach.declared,
                path: `${GENERATED_DIR}/${breach.name}`,
                remediation: {
                    action: "declare",
                    decide:
                        "a channel name is a REVERSIBLE encoding of the scope its run declared, and the retention " +
                        "condition reads the scope back out of the filename rather than out of the body — so a name " +
                        "that does not decode to what the body states leaves the removal path acting on one scope " +
                        "while the report describes another. An encoding that is injective and not INVERTIBLE " +
                        "satisfies every collision question and breaks this one silently, which is why the property " +
                        "is checked as a round trip rather than as a uniqueness count. Either the encoding lost the " +
                        "scope or the file was written under a name from a different derivation; the body is the " +
                        "run's own account and the name is what every later reader resolves through",
                    deterministic: false,
                    from: breach.named,
                    target: `${GENERATED_DIR}/${breach.name}`,
                    to: breach.declared,
                },
                rule: "channel/nameScopeDisagreement",
                stack: [
                    { check: "decodedFromName", resolved: breach.named },
                    { check: "declaredInBody", resolved: breach.declared },
                    { check: "roundTrip", resolved: "no" },
                ],
            });
        }

        for (const collision of collidingScopes(context.repoRoot)) {
            const reported = `${GENERATED_DIR}/${collision.names[0] ?? ""}`;

            findings.push({
                actual: `${String(collision.names.length)} channels declare the scope ${collision.scope}`,
                expected: null,
                healed: false,
                line: 0,
                locus: collision.scope,
                path: reported,
                remediation: {
                    action: "delete",
                    decide:
                        "one scope derives one channel name, so two files declaring one scope means one of them was " +
                        "written under a derivation that has since changed — a stale name the current encoding no " +
                        "longer produces and the retention condition therefore never revisits. It is not removed " +
                        "automatically because WHICH of the two is current is a question about which derivation ran, " +
                        "and a healer choosing between two accounts of one run would delete the only copy of " +
                        "whichever it guessed against. The one the current encoding produces for that scope is the " +
                        "live one",
                    deterministic: false,
                    from: collision.names.join(", "),
                    target: reported,
                    to: null,
                },
                rule: "channel/scopeCollision",
                stack: [
                    { check: "declaredScope", resolved: collision.scope },
                    { check: "channelsDeclaringIt", resolved: collision.names.join(", ") },
                    { check: "oneChannelPerScope", resolved: "no" },
                ],
            });
        }

        const population = channelsIn(context.repoRoot);

        return {
            derivations: {
                channels: population.map((channel) => ({
                    declared: channel.declared,
                    name: channel.name,
                    named: channel.scope,
                })),
                criterion:
                    "THE POPULATION IS WHAT THE REPORTER'S DECODER ENUMERATES AND THE CRITERION IS PUBLISHED RATHER " +
                    "THAN IMPLIED, because a walk correct over the set it chose reads as a verdict over the set a " +
                    "reader wanted. A member is a file in the generated directory whose name carries the channel lead " +
                    "and tail with a non-empty encoded segment between them, and whose body declares this tool with " +
                    "authoritative FALSE. So the whole-scope aggregate is outside by construction — its encoded " +
                    "segment is empty — and any report another tool writes is outside because its body does not " +
                    "declare this one. What that criterion CANNOT see is a channel whose name does not decode at all: " +
                    "such a file is skipped by the enumerator rather than reported, so this walk is silent about it " +
                    "and says so here rather than letting a green stand for a set it never reached",
                unreachable:
                    "INJECTIVITY IS NOT OBSERVABLE FROM THIS POPULATION AND THE CHECK DOES NOT CLAIM IT. Two scopes " +
                    "encoding to one name produce one FILE, so the collision leaves nothing on disk to compare and a " +
                    "count over channels would pass every time. What is observable is the inverse — two files " +
                    "declaring one scope — which catches a derivation that CHANGED rather than one that collides, and " +
                    "those are different properties. The injectivity half is held by the encoding's own alphabet " +
                    "excluding the separator, which is a property of the function rather than a condition anything " +
                    "here checks",
            },
            findings,
            healed: [],
        };
    },
    extensions: [],
    heals: false,
    invariant:
        "a channel NAMES the scope its run declared, so the scope decoded from its filename equals the scope its body states, and no two channels declare one scope",
    jurisdiction: "all",
    kinds: ["nameScopeDisagreement", "scopeCollision"],

    readsTree:
        "a channel is generated output and sits outside the governed path set by construction, so a rule reading only " +
        "that set would report clean over every channel in the directory the pipeline writes. The population is what " +
        "the reporter's own decoder enumerates over that directory rather than a listed set, so a channel written " +
        "tomorrow is inside it with no edit here",

    stage: "meta",
};
