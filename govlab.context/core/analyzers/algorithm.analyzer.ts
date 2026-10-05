import type { Cluster, ConcernJoinRow, ConcernResolvers, Contract } from "#types/algorithm.types";
import { CORE_DEGREE } from "#configuration/constants/algorithm.constants";
import { slugify } from "#core/converters/identifier.converter";

const byName = function byName(a: string, b: string): number {
    return a.localeCompare(b);
};

export const allForces = function allForces(contracts: readonly Contract[]): string[] {
    return [...new Set(contracts.flatMap((contract) => contract.force))].toSorted(byName);
};

const degreesOf = function degreesOf(members: readonly Contract[]): Map<string, number> {
    const memberIds = new Set(members.map((contract) => contract.id));
    const degree = new Map<string, number>();
    for (const contract of members) {
        for (const target of contract.composes.filter((id) => memberIds.has(id))) {
            degree.set(contract.id, (degree.get(contract.id) ?? 0) + 1);
            degree.set(target, (degree.get(target) ?? 0) + 1);
        }
    }
    return degree;
};

export const clustersOf = function clustersOf(contracts: readonly Contract[]): Cluster[] {
    return allForces(contracts).map((force) => {
        const members = contracts.filter((contract) => contract.force.includes(force));
        const degree = degreesOf(members);
        const isCore = (contract: Contract): boolean => (degree.get(contract.id) ?? 0) >= CORE_DEGREE;
        return {
            core: members
                .filter(isCore)
                .map((contract) => contract.id)
                .toSorted(byName),
            force,
            supporting: members
                .filter((contract) => !isCore(contract))
                .map((contract) => contract.id)
                .toSorted(byName),
        };
    });
};

export const concernJoinOf = function concernJoinOf(
    contracts: readonly Contract[],
    resolvers: ConcernResolvers,
): ConcernJoinRow[] {
    return allForces(contracts).map((force) => ({
        concerns: resolvers.concernsForForce?.(force) ?? [],
        contracts: contracts
            .filter((contract) => contract.force.includes(force))
            .map((contract) => contract.id)
            .toSorted(byName),
        force,
        principles: resolvers.principlesForForce?.(force) ?? [],
    }));
};

const neighborsOf = function neighborsOf(byId: ReadonlyMap<string, Contract>, id: string, seen: Set<string>): string[] {
    return (byId.get(id)?.composes ?? [])
        .map((target) => slugify(target))
        .filter((resolved) => byId.has(resolved) && !seen.has(resolved));
};

export const traverseComposes = function traverseComposes(
    byId: ReadonlyMap<string, Contract>,
    seed: readonly string[],
): string[] {
    const seen = new Set<string>();
    const order: string[] = [];
    const queue = [...seed];
    while (queue.length > 0) {
        const id = queue.shift();
        if (typeof id === "string" && !seen.has(id)) {
            seen.add(id);
            order.push(id);
            queue.push(...neighborsOf(byId, id, seen));
        }
    }
    return order;
};
