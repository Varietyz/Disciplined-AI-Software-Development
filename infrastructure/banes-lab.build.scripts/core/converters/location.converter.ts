import type { Identity, Link, Placed, Placement } from "#types/catalog.types";
import type { IndexPlan } from "#types/index.types";
import { linkOf } from "#core/resolvers/link.resolver";

export const placedOf = function placedOf(placement: Placement | null): Placed {
    return { siblings: placement?.siblings ?? null, up: placement?.up ?? null };
};

const neighborAt = function neighborAt(members: readonly Identity[], at: number, site: string): Link | null {
    const member = members.find((_, index) => index === at);
    return member === undefined ? null : linkOf(member, site, member.title);
};

export const placementsOf = function placementsOf(
    plans: readonly IndexPlan[],
    identities: readonly Identity[],
    site: string,
): ReadonlyMap<string, Placement> {
    const known = new Map([...identities, ...plans.map((plan) => plan.identity)].map((held) => [held.ref, held]));
    const placements = new Map<string, Placement>();
    for (const plan of plans) {
        const up = linkOf(plan.identity, site, plan.identity.title);
        const members = plan.refs.flatMap((ref) => {
            const member = known.get(ref);
            return member === undefined ? [] : [member];
        });
        members.forEach((member, at) => {
            if (!placements.has(member.ref)) {
                const siblings = {
                    next: neighborAt(members, at + 1, site),
                    previous: neighborAt(members, at - 1, site),
                };
                placements.set(member.ref, { siblings, up });
            }
        });
    }
    return placements;
};
