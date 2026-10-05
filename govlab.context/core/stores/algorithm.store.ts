import { ALGORITHM_LABEL, COLLECTIONS } from "#configuration/constants/ontology.constants";
import type {
    AlgoGrammar,
    AlgoGrammarOptions,
    ClosureResult,
    Cluster,
    ConcernJoinRow,
    ConcernResolvers,
    Contract,
    ContractFilter,
    ContractIssues,
    SymbolEntry,
} from "#types/algorithm.types";
import { clustersOf, concernJoinOf, traverseComposes } from "#core/analyzers/algorithm.analyzer";
import { loadBundledSymbols, loadContracts } from "#core/loaders/algorithm.loader";
import { BaseOntology } from "#core/stores/ontology.store";
import { COMPOSES_RELATION } from "#configuration/constants/algorithm.constants";
import type { Logger } from "#types/ontology.types";
import { ReadAudit } from "#core/observers/record.observer";
import { matchesContract } from "#core/matchers/algorithm.matcher";
import { slugify } from "#core/converters/identifier.converter";
import { unknownClosureId } from "#configuration/strings/algorithm.strings";

export class AlgorithmStore extends BaseOntology<Contract, ContractFilter> implements AlgoGrammar {
    private readonly symbolIndex: SymbolEntry[];
    private readonly logger?: Logger | undefined;

    public constructor(options: AlgoGrammarOptions = {}, audit = new ReadAudit(COLLECTIONS.algorithms)) {
        super(loadContracts(audit, options.data), {
            audit,
            idOf: (contract) => contract.id,
            label: ALGORITHM_LABEL,
            logger: options.logger,
            matches: matchesContract,
        });
        this.symbolIndex = options.symbols ?? loadBundledSymbols();
        this.logger = options.logger;
    }

    public symbols = (): SymbolEntry[] => [...this.symbolIndex];

    public byForce = (force: string): Contract[] => this.query({ force });

    public resolveClosure = (ids: string[]): ClosureResult => {
        const byId = this.index();
        const seed = ids.filter((id) => byId.has(id));
        for (const id of ids.filter((candidate) => !byId.has(candidate))) {
            this.logger?.warn(unknownClosureId(id));
        }
        const order = traverseComposes(byId, seed);
        return {
            closure: order.flatMap((id) => {
                const contract = byId.get(id);
                return contract ? [contract] : [];
            }),
            order,
            seed,
        };
    };

    public cluster = (): Cluster[] => clustersOf(this.all());

    public joinConcerns = (resolvers: ConcernResolvers = {}): ConcernJoinRow[] => concernJoinOf(this.all(), resolvers);

    public validateOntology = (): ContractIssues => {
        const base = this.validateEdges(
            (contract) => [{ relation: COMPOSES_RELATION, targets: contract.composes }],
            slugify,
        );
        return {
            danglingComposes: base.danglingEdges.map(({ from, target }) => ({ from, target })),
            duplicateIds: base.duplicateIds,
        };
    };
}
