import type { BaseFaceConfig, Edge, Ontology, OntologyAudit, OntologyIssues } from "#types/ontology.types";
import type { UnreadKey } from "#types/record.types";
import { createOntology } from "#core/factories/ontology.factory";

export abstract class BaseOntology<R, F extends object> {
    protected readonly ontology: Ontology<R>;
    private readonly matchesFilter: (record: R, filter: F) => boolean;
    private readonly audit: OntologyAudit;

    public constructor(records: readonly R[], config: BaseFaceConfig<R, F>) {
        this.ontology = createOntology<R>({ idOf: config.idOf, label: config.label, logger: config.logger, records });
        this.matchesFilter = config.matches;
        this.audit = config.audit;
    }

    public attributions(): string[] {
        return this.audit.attributions();
    }

    public unreadKeys(): UnreadKey[] {
        return this.audit.unread();
    }

    public get(id: string): R | null {
        return this.ontology.get(id);
    }

    public all(): R[] {
        return this.ontology.all();
    }

    public ids(): string[] {
        return this.ontology.ids();
    }

    public index(): ReadonlyMap<string, R> {
        return this.ontology.index();
    }

    public query(filter?: F): R[] {
        return this.ontology.query((record) => !filter || this.matchesFilter(record, filter));
    }

    protected validateEdges(edgesOf: (record: R) => Edge[], resolveId?: (target: string) => string): OntologyIssues {
        return this.ontology.validateOntology(edgesOf, resolveId);
    }
}
