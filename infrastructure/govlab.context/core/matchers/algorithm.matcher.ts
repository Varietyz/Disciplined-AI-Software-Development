import type { Contract, ContractFilter } from "#types/algorithm.types";

const wanted = function wanted(value: string | undefined): string | null {
    return typeof value === "string" && value.length > 0 ? value : null;
};

const matchesDomain = function matchesDomain(contract: Contract, filter: ContractFilter): boolean {
    const domain = wanted(filter.domain);
    return domain === null || contract.domain === domain;
};

const matchesForce = function matchesForce(contract: Contract, filter: ContractFilter): boolean {
    const force = wanted(filter.force);
    return force === null || contract.force.includes(force);
};

const matchesComposes = function matchesComposes(contract: Contract, filter: ContractFilter): boolean {
    const composes = wanted(filter.composes);
    return composes === null || contract.composes.includes(composes);
};

const matchesMeta = function matchesMeta(contract: Contract, filter: ContractFilter): boolean {
    return typeof filter.meta !== "boolean" || Boolean(contract.meta) === filter.meta;
};

export const matchesContract = function matchesContract(contract: Contract, filter: ContractFilter): boolean {
    return (
        matchesDomain(contract, filter) &&
        matchesForce(contract, filter) &&
        matchesComposes(contract, filter) &&
        matchesMeta(contract, filter)
    );
};
