export const producedTwice = function producedTwice(id: string): string {
    return `single-producer violated: node "${id}" produced twice`;
};

export const missingProducer = function missingProducer(id: string, producer: string): string {
    return `node "${id}" consumes missing producer "${producer}"`;
};

export const ownProducer = function ownProducer(id: string): string {
    return `node "${id}" is its own producer`;
};

export const effectCycle = function effectCycle(id: string): string {
    return `cycle in the effect layer through node "${id}"`;
};

export const stepsBack = function stepsBack(producer: string, id: string): string {
    return `edge "${producer}" → "${id}" steps back on the reasoning axis`;
};

export const orphanNode = function orphanNode(id: string): string {
    return `orphan node "${id}" has no producer`;
};

export const deadNode = function deadNode(id: string): string {
    return `dead node "${id}" reaches no sink`;
};
