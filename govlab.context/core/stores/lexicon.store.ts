import type { Lexicon, LexiconOptions, Term, TermFilter } from "#types/lexicon.types";
import { BaseOntology } from "#core/stores/ontology.store";
import { COLLECTIONS } from "#configuration/constants/ontology.constants";
import { ReadAudit } from "#core/observers/record.observer";
import { loadTerms } from "#core/loaders/lexicon.loader";
import { matchesTerm } from "#core/matchers/lexicon.matcher";
import { slugify } from "#core/converters/identifier.converter";

export class LexiconStore extends BaseOntology<Term, TermFilter> implements Lexicon {
    private readonly resolveId: (term: string) => string;

    public constructor(options: LexiconOptions = {}, audit = new ReadAudit(COLLECTIONS.lexicon)) {
        super(loadTerms(audit, options.data), {
            audit,
            idOf: (term) => term.id,
            label: COLLECTIONS.lexicon,
            logger: options.logger,
            matches: matchesTerm,
        });
        const base = options.canonicalizeId ?? slugify;
        const aliasByKey = new Map<string, string>();
        for (const term of this.all()) {
            for (const alias of term.aliases) {
                aliasByKey.set(slugify(alias), term.id);
            }
        }
        this.resolveId = (term): string => aliasByKey.get(slugify(term)) ?? base(term);
    }

    public resolve = (target: string): Term | null => this.get(this.resolveId(target));
}
