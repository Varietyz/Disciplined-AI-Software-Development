import type { DocForm } from "#types/location.types";
import type { DocVerb } from "#types/reference.types";
import type { UserRegistries } from "#types/manifest.types";
import { isRecord } from "#core/predicates/record.predicate";

const VERB_KEY = "verb";
const CONCERN_KEY = "concern";

const hasText = function hasText(record: Record<string, unknown>, key: string): boolean {
    const value = record[key];
    return typeof value === "string" && value.length > 0;
};

const hasFormAxes = function hasFormAxes(record: Record<string, unknown>): boolean {
    return (
        typeof record["ownerAxis"] === "string" &&
        typeof record["kind"] === "string" &&
        typeof record["boundary"] === "boolean"
    );
};

const isValidForm = function isValidForm(form: unknown, usedFolders: ReadonlySet<string>): form is DocForm {
    if (!isRecord(form) || !hasText(form, "id") || !hasText(form, "folder")) {
        return false;
    }
    return !usedFolders.has(String(form["folder"])) && hasFormAxes(form);
};

const concernOf = function concernOf(entry: unknown): string | null {
    if (typeof entry === "string") {
        return entry.length > 0 ? entry : null;
    }
    return isRecord(entry) && hasText(entry, CONCERN_KEY) ? String(entry[CONCERN_KEY]) : null;
};

const isValidRefVerb = function isValidRefVerb(entry: unknown): entry is DocVerb & { verb: string } {
    return (
        isRecord(entry) &&
        typeof entry[VERB_KEY] === "string" &&
        Array.isArray(entry["checks"]) &&
        Array.isArray(entry["satisfies"])
    );
};

export class RegistryBuilder {
    readonly #forms: Record<string, DocForm>;
    readonly #concerns: string[];
    readonly #activityVerbs: Record<string, string>;
    readonly #refVerbs: Record<string, DocVerb>;
    readonly #usedFolders: Set<string>;

    public constructor(base: UserRegistries) {
        this.#forms = { ...base.forms };
        this.#concerns = [...base.concerns];
        this.#activityVerbs = { ...base.activityVerbs };
        this.#refVerbs = { ...base.refVerbs };
        this.#usedFolders = new Set(Object.values(base.forms).map((form) => form.folder));
    }

    public addRefVerb(entry: unknown): void {
        if (isValidRefVerb(entry) && !Object.hasOwn(this.#refVerbs, entry.verb)) {
            this.#refVerbs[entry.verb] = { checks: entry.checks, satisfies: entry.satisfies };
        }
    }

    public addForm(form: unknown): void {
        if (isValidForm(form, this.#usedFolders) && !Object.hasOwn(this.#forms, form.id)) {
            this.#forms[form.id] = form;
            this.#usedFolders.add(form.folder);
        }
    }

    public addConcern(entry: unknown): void {
        const concern = concernOf(entry);
        if (concern === null || this.#concerns.includes(concern)) {
            return;
        }
        this.#concerns.push(concern);
        if (isRecord(entry) && hasText(entry, VERB_KEY)) {
            this.#activityVerbs[concern] = String(entry[VERB_KEY]);
        }
    }

    public frozen(): UserRegistries {
        return {
            activityVerbs: Object.freeze(this.#activityVerbs),
            concerns: Object.freeze(this.#concerns),
            forms: Object.freeze(this.#forms),
            refVerbs: Object.freeze(this.#refVerbs),
        };
    }
}
