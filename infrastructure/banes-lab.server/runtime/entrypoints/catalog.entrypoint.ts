import fs from "node:fs";

interface NjsRequest {
    readonly args: Readonly<Record<string, string | undefined>>;
    readonly headersOut: Record<string, string>;
    readonly uri: string;
    readonly variables: { readonly document_root: string; readonly host?: string };
    return: (status: number, body: string) => void;
}

type Row = Record<string, unknown>;

interface Table {
    readonly columns: readonly string[];
    readonly rows: readonly (readonly unknown[])[];
}

interface IdRow extends Row {
    readonly json: string;
    readonly kind: string;
    readonly ref: string;
    readonly title: string;
}

interface MoveRow {
    readonly json: string;
    readonly to: string | null;
}

interface Address {
    readonly json: string;
}

interface IdsShard extends Address {
    readonly group: string;
}

interface IdsHead {
    readonly kinds: readonly string[];
    readonly shards: readonly IdsShard[];
}

interface FuzzyRules {
    readonly stemMinimum: number;
    readonly suffixes: readonly string[];
    readonly suggestions: number;
}

interface NameMatch {
    readonly key: string;
    readonly match: string;
}

interface QueryLeaf {
    readonly endpoint: string;
    readonly fuzzy: FuzzyRules;
    readonly index: string;
    readonly limits: { readonly defaultLimit: number; readonly depth: number; readonly limit: number };
    readonly messages: Readonly<Record<string, string>>;
    readonly relations: readonly string[];
    readonly site: string;
}

interface SlugRules {
    readonly characters: string;
    readonly separator: string;
}

interface WordRules {
    readonly americanWords: Readonly<Record<string, string>>;
    readonly fuzzyMinimum: number;
    readonly izeStems: readonly string[];
    readonly izeSuffixes: Readonly<Record<string, string>>;
    readonly pluralIes: readonly [string, string];
    readonly pluralKeptAfter: readonly string[];
    readonly pluralMinimum: number;
    readonly pluralSuffix: string;
    readonly spellingPrefixes: readonly string[];
    readonly wordCharacters: string;
}

interface SearchLeaf {
    readonly kinds: Readonly<Record<string, Address>>;
    readonly rules: WordRules;
}

type ShardMap = Readonly<Record<string, string | undefined>>;

interface SearchIndex extends Table {
    readonly parts?: readonly string[];
    readonly shards: ShardMap;
}

interface ResolveLeaf {
    readonly shards: ShardMap;
    readonly slugRules: SlugRules;
}

interface PostingShard {
    readonly postings: Readonly<Record<string, readonly (readonly [number, number])[]>>;
}

interface SlugShard {
    readonly slugs: Readonly<Record<string, readonly string[] | undefined>>;
}

interface EntryLeaf {
    readonly entries: readonly { readonly ref: string }[];
    readonly parts?: readonly Address[];
}

interface RecordLeaf {
    readonly relations?: readonly {
        readonly links: readonly { readonly json: string; readonly label: string; readonly ref: string | null }[];
        readonly relation: string;
    }[];
}

interface State {
    readonly groups: Map<string, ReadonlyMap<string, IdRow>>;
    readonly ids: IdsHead;
    readonly mtime: number;
    readonly query: QueryLeaf;
    readonly root: string;
    readonly shards: Record<string, unknown>;
    readonly site: string;
}

interface Ranked {
    readonly position: number | null;
    readonly row: Row;
    readonly score: number;
    readonly title: string;
}

interface Refusal {
    readonly code: string;
    readonly values: Readonly<Record<string, unknown>>;
}

const EXTENSION = ".json";
const QUERY_PATH = "/json/api/query";
const IDS_PATH = "/json/api/ids";
const MOVED_PATH = "/json/api/moved";
const SEARCH_PATH = "/json/api/search";
const RESOLVE_PATH = "/json/api/resolve";
const FACETS_PATH = "/json/api/facets/";
const RECORDS_PATH = "/json/api/records/";
const REF_SEPARATOR = ":";
const OPERATIONS: ReadonlySet<string> = new Set(["ref", "name", "q", "collection", "id", "walk"]);
const PAGING: ReadonlySet<string> = new Set(["limit", "offset"]);
const OPERATION_OPTIONS: Readonly<Record<string, ReadonlySet<string> | undefined>> = {
    id: new Set(["kind"]),
    name: new Set(["kind"]),
    q: new Set(["kind"]),
    walk: new Set(["depth", "relation"]),
};
const KIND_OPTION = "kind";
const WILDCARD = "*";
const MISSING = "ENOENT";
const SPACE = " ";
const DIGIT_CHARACTERS = "0123456789";
const PERMANENT_REDIRECT = 308;
const MARKDOWN_EXTENSION = ".md";
const PAGE_EXTENSION = ".html";
const HOME_TWIN = "/index.md";
const HOME_ROUTE = "/";
const HOME_PAGE = "/index.html";

type Guard<T> = (value: unknown) => value is T;

const states: Record<string, State | undefined> = {};

const isObject = function isObject(value: unknown): value is Row {
    return typeof value === "object" && value !== null;
};

const isText = function isText(value: Row, key: string): boolean {
    return typeof value[key] === "string";
};

const isTable = function isTable(value: unknown): value is Table {
    return isObject(value) && Array.isArray(value["columns"]) && Array.isArray(value["rows"]);
};

const hasTexts = function hasTexts(value: Row, keys: readonly string[]): boolean {
    return keys.every((key) => isText(value, key));
};

const hasObjects = function hasObjects(value: Row, keys: readonly string[]): boolean {
    return keys.every((key) => isObject(value[key]));
};

const isQueryLeaf = function isQueryLeaf(value: unknown): value is QueryLeaf {
    return (
        isObject(value) &&
        hasTexts(value, ["site"]) &&
        hasObjects(value, ["fuzzy", "limits", "messages"]) &&
        Array.isArray(value["relations"])
    );
};

const isIdsHead = function isIdsHead(value: unknown): value is IdsHead {
    return isObject(value) && Array.isArray(value["shards"]) && Array.isArray(value["kinds"]);
};

const isSearchLeaf = function isSearchLeaf(value: unknown): value is SearchLeaf {
    return isObject(value) && isObject(value["kinds"]) && isObject(value["rules"]);
};

const isResolveLeaf = function isResolveLeaf(value: unknown): value is ResolveLeaf {
    return isObject(value) && isObject(value["slugRules"]) && isObject(value["shards"]);
};

const isSearchIndex = function isSearchIndex(value: unknown): value is SearchIndex {
    return isTable(value) && isObject(Reflect.get(value, "shards"));
};

const isPostingShard = function isPostingShard(value: unknown): value is PostingShard {
    return isObject(value) && isObject(value["postings"]);
};

const isSlugShard = function isSlugShard(value: unknown): value is SlugShard {
    return isObject(value) && isObject(value["slugs"]);
};

const isEntryLeaf = function isEntryLeaf(value: unknown): value is EntryLeaf {
    return isObject(value) && Array.isArray(value["entries"]);
};

const isRecordLeaf = function isRecordLeaf(value: unknown): value is RecordLeaf {
    return isObject(value);
};

const isIdRow = function isIdRow(value: unknown): value is IdRow {
    return isObject(value) && hasTexts(value, ["json", "kind", "ref", "title"]);
};

const isMoveRow = function isMoveRow(value: unknown): value is MoveRow {
    return isObject(value) && isText(value, "json") && (value["to"] === null || isText(value, "to"));
};

const hasRef = function hasRef(value: Row): value is Row & { readonly ref: string } {
    return isText(value, "ref");
};

const read = function read<T>(root: string, path: string, guard: Guard<T>): T {
    const parsed: unknown = JSON.parse(fs.readFileSync(root + path + EXTENSION, "utf8"));
    if (!guard(parsed)) {
        throw new TypeError(root + path + EXTENSION);
    }
    return parsed;
};

const isMissing = function isMissing(error: unknown): boolean {
    return typeof error === "object" && error !== null && "code" in error && error.code === MISSING;
};

const readIfPresent = function readIfPresent<T>(root: string, path: string, guard: Guard<T>): T | null {
    try {
        return read(root, path, guard);
    } catch (error) {
        if (isMissing(error)) {
            return null;
        }
        throw error;
    }
};

const localOf = function localOf(site: string, url: string): string {
    return url.startsWith(site) ? url.slice(site.length) : url;
};

const rowsOf = function rowsOf(leaf: Table): Row[] {
    return leaf.rows.map((row) => {
        const record: Row = {};
        leaf.columns.forEach((column, at) => {
            record[column] = row[at];
        });
        return record;
    });
};

const loadState = function loadState(root: string, mtime: number): State {
    const query = read(root, QUERY_PATH, isQueryLeaf);
    return {
        groups: new Map(),
        ids: read(root, IDS_PATH, isIdsHead),
        mtime,
        query,
        root,
        shards: {},
        site: query.site,
    };
};

const stateOf = function stateOf(root: string): State {
    const held = states[root];
    const mtime = fs.statSync(root + IDS_PATH + EXTENSION).mtimeMs;
    if (held?.mtime === mtime) {
        return held;
    }
    const loaded = loadState(root, mtime);
    states[root] = loaded;
    return loaded;
};

const cached = function cached<T>(state: State, path: string, guard: Guard<T>): T | null {
    if (!(path in state.shards)) {
        state.shards[path] = readIfPresent(state.root, path, guard);
    }
    const held = state.shards[path];
    return guard(held) ? held : null;
};

const groupRows = function groupRows(state: State, group: string): ReadonlyMap<string, IdRow> {
    const held = state.groups.get(group);
    if (held !== undefined) {
        return held;
    }
    const rows = new Map<string, IdRow>();
    state.ids.shards
        .filter((shard) => shard.group === group)
        .forEach((shard) => {
            rowsOf(read(state.root, localOf(state.site, shard.json), isTable)).forEach((row) => {
                if (isIdRow(row)) {
                    rows.set(row.ref, row);
                }
            });
        });
    state.groups.set(group, rows);
    return rows;
};

const rowOf = function rowOf(state: State, ref: string): IdRow | null {
    const at = ref.indexOf(REF_SEPARATOR);
    return at === -1 ? null : (groupRows(state, ref.slice(0, at)).get(ref) ?? null);
};

const allRows = function allRows(state: State): IdRow[] {
    const groups = [...new Set(state.ids.shards.map((shard) => shard.group))];
    return groups.flatMap((group) => [...groupRows(state, group).values()]);
};

const knownRows = function knownRows(state: State, refs: readonly string[]): IdRow[] {
    return refs.flatMap((ref) => {
        const row = rowOf(state, ref);
        return row === null ? [] : [row];
    });
};

const searchLeafOf = function searchLeafOf(state: State): SearchLeaf {
    const leaf = cached(state, SEARCH_PATH, isSearchLeaf);
    if (leaf === null) {
        throw new TypeError(state.root + SEARCH_PATH + EXTENSION);
    }
    return leaf;
};

const resolveLeafOf = function resolveLeafOf(state: State): ResolveLeaf {
    const leaf = cached(state, RESOLVE_PATH, isResolveLeaf);
    if (leaf === null) {
        throw new TypeError(state.root + RESOLVE_PATH + EXTENSION);
    }
    return leaf;
};

const slugRulesOf = function slugRulesOf(state: State): SlugRules {
    return resolveLeafOf(state).slugRules;
};

const shardsUnder = function shardsUnder(shards: ShardMap, start: string): string[] {
    return Object.keys(shards)
        .filter((prefix) => prefix.startsWith(start) || start.startsWith(prefix))
        .flatMap((prefix) => {
            const address = shards[prefix];
            return address === undefined ? [] : [address];
        });
};

const indexRows = function indexRows(state: State, index: SearchIndex): Row[] {
    if (index.parts === undefined) {
        return rowsOf(index);
    }
    return index.parts.flatMap((part) => rowsOf(read(state.root, localOf(state.site, part), isTable)));
};

const entriesOf = function entriesOf(state: State, leaf: EntryLeaf): readonly { readonly ref: string }[] {
    if (leaf.parts === undefined) {
        return leaf.entries;
    }
    return leaf.parts.flatMap((part) => read(state.root, localOf(state.site, part.json), isEntryLeaf).entries);
};

const filled = function filled(template: string, values: Readonly<Record<string, unknown>>): string {
    return Object.keys(values).reduce((text, key) => text.split(`{${key}}`).join(String(values[key])), template);
};

const slugOf = function slugOf(text: string, rules: SlugRules): string {
    let out = "";
    let joined = false;
    for (const char of text.toLowerCase()) {
        if (rules.characters.includes(char)) {
            out += char;
            joined = false;
            continue;
        }
        if (out.length > 0 && !joined) {
            out += rules.separator;
            joined = true;
        }
    }
    return joined ? out.slice(0, -rules.separator.length) : out;
};

const isPrefixedStem = function isPrefixedStem(stem: string, rules: WordRules): boolean {
    return (
        rules.izeStems.includes(stem) ||
        rules.spellingPrefixes.some(
            (prefix) => stem.startsWith(prefix) && rules.izeStems.includes(stem.slice(prefix.length)),
        )
    );
};

const listedOf = function listedOf(word: string, rules: WordRules): string | null {
    const listed = Object.keys(rules.americanWords);
    if (listed.includes(word)) {
        return rules.americanWords[word] ?? null;
    }
    const prefix = rules.spellingPrefixes.find(
        (candidate) => word.startsWith(candidate) && listed.includes(word.slice(candidate.length)),
    );
    return prefix === undefined ? null : prefix + (rules.americanWords[word.slice(prefix.length)] ?? "");
};

const spelledOf = function spelledOf(word: string, rules: WordRules): string {
    const listed = listedOf(word, rules);
    if (listed !== null) {
        return listed;
    }
    const suffixes = [...Object.keys(rules.izeSuffixes)].sort((left, right) => right.length - left.length);
    for (const british of suffixes) {
        const stem = word.slice(0, -british.length);
        if (word.endsWith(british) && isPrefixedStem(stem, rules)) {
            return stem + (rules.izeSuffixes[british] ?? british);
        }
    }
    return word;
};

const singularOf = function singularOf(word: string, rules: WordRules): string {
    const suffix = rules.pluralSuffix;
    if (word.length < rules.pluralMinimum || !word.endsWith(suffix)) {
        return word;
    }
    if (word.endsWith(rules.pluralIes[0])) {
        return word.slice(0, -rules.pluralIes[0].length) + rules.pluralIes[1];
    }
    const before = word.charAt(word.length - suffix.length - 1);
    return rules.pluralKeptAfter.includes(before) ? word : word.slice(0, -suffix.length);
};

const normalizeWord = function normalizeWord(word: string, rules: WordRules): string {
    const spelled = spelledOf(word.toLowerCase(), rules);
    return spelledOf(singularOf(spelled, rules), rules);
};

const wordsOf = function wordsOf(text: string, rules: WordRules): string[] {
    const words: string[] = [];
    let current = "";
    for (const char of text.toLowerCase() + SPACE) {
        if (rules.wordCharacters.includes(char)) {
            current += char;
            continue;
        }
        if (current.length > 0) {
            words.push(normalizeWord(current, rules));
            current = "";
        }
    }
    return words;
};

const isSwap = function isSwap(left: string, right: string, at: number): boolean {
    return (
        left.length === right.length &&
        left.charAt(at) === right.charAt(at + 1) &&
        left.charAt(at + 1) === right.charAt(at) &&
        left.slice(at + 2) === right.slice(at + 2)
    );
};

const oneEditApart = function oneEditApart(left: string, right: string): boolean {
    if (Math.abs(left.length - right.length) > 1 || left === right) {
        return false;
    }
    let at = 0;
    while (at < left.length && at < right.length && left.charAt(at) === right.charAt(at)) {
        at += 1;
    }
    return (
        left.slice(at + 1) === right.slice(at + 1) ||
        left.slice(at + 1) === right.slice(at) ||
        left.slice(at) === right.slice(at + 1) ||
        isSwap(left, right, at)
    );
};

const matchedKeys = function matchedKeys(
    postings: PostingShard["postings"],
    word: string,
    minimum: number,
): readonly string[] {
    if (word in postings) {
        return [word];
    }
    const keys = Object.keys(postings);
    const prefixed = keys.filter((key) => key.startsWith(word));
    if (prefixed.length > 0 || word.length < minimum) {
        return prefixed;
    }
    return keys.filter((key) => oneEditApart(key, word));
};

const termScores = function termScores(
    state: State,
    rules: WordRules,
    index: SearchIndex,
    word: string,
): Map<number, number> {
    const scores = new Map<number, number>();
    const postings: Record<string, readonly (readonly [number, number])[]> = {};
    shardsUnder(index.shards, word.charAt(0)).forEach((address) => {
        const shard = cached(state, localOf(state.site, address), isPostingShard);
        Object.assign(postings, shard === null ? {} : shard.postings);
    });
    matchedKeys(postings, word, rules.fuzzyMinimum).forEach((key) => {
        (postings[key] ?? []).forEach((posting) => {
            scores.set(posting[0], (scores.get(posting[0]) ?? 0) + posting[1]);
        });
    });
    return scores;
};

const searchKind = function searchKind(
    state: State,
    leaf: SearchLeaf,
    kind: string,
    words: readonly string[],
): Ranked[] {
    const address = leaf.kinds[kind];
    const index = address === undefined ? null : cached(state, localOf(state.site, address.json), isSearchIndex);
    if (index === null) {
        return [];
    }
    const rows = indexRows(state, index);
    const perWord = words.map((word) => termScores(state, leaf.rules, index, word));
    const results: Ranked[] = [];
    (perWord[0] ?? new Map<number, number>()).forEach((_score, at) => {
        const entry = rows[at];
        const listed = entry !== undefined && hasRef(entry) ? rowOf(state, entry.ref) : null;
        if (listed === null || entry === undefined || !perWord.every((scores) => scores.has(at))) {
            return;
        }
        const score = perWord.reduce((acc, scores) => acc + (scores.get(at) ?? 0), 0);
        const position = typeof entry["position"] === "number" ? entry["position"] : null;
        results.push({ position, row: { ...listed, score }, score, title: listed.title });
    });
    return results;
};

const textOrder = function textOrder(left: string, right: string): number {
    const length = Math.min(left.length, right.length);
    for (let at = 0; at < length; at += 1) {
        const difference = (left.codePointAt(at) ?? 0) - (right.codePointAt(at) ?? 0);
        if (difference !== 0) {
            return difference;
        }
    }
    return left.length - right.length;
};

const rankOf = function rankOf(left: Ranked, right: Ranked): number {
    if (left.score !== right.score) {
        return right.score - left.score;
    }
    const leftAt = left.position ?? Number.MAX_VALUE;
    const rightAt = right.position ?? Number.MAX_VALUE;
    return leftAt === rightAt ? textOrder(left.title, right.title) : leftAt - rightAt;
};

const byWords = function byWords(state: State, text: string): readonly Row[] {
    const leaf = searchLeafOf(state);
    const words = wordsOf(text, leaf.rules);
    if (words.length === 0) {
        return [];
    }
    return Object.keys(leaf.kinds)
        .flatMap((kind) => searchKind(state, leaf, kind, words))
        .sort(rankOf)
        .map((ranked) => ranked.row);
};

const caseSplit = function caseSplit(text: string): string {
    let out = "";
    let previousLower = false;
    for (const char of text) {
        const upper = char !== char.toLowerCase();
        if (upper && previousLower) {
            out += SPACE;
        }
        out += char;
        previousLower = !upper && !DIGIT_CHARACTERS.includes(char);
    }
    return out;
};

const nameKeyOf = function nameKeyOf(text: string, slugRules: SlugRules, wordRules: WordRules): string {
    return slugOf(caseSplit(text), slugRules)
        .split(slugRules.separator)
        .filter((word) => word.length > 0)
        .map((word) => normalizeWord(word, wordRules))
        .join(slugRules.separator);
};

const slugsOf = function slugsOf(state: State, letter: string): SlugShard["slugs"] {
    if (letter.length === 0) {
        return {};
    }
    const slugs: Record<string, readonly string[] | undefined> = {};
    shardsUnder(resolveLeafOf(state).shards, letter).forEach((address) => {
        const shard = cached(state, localOf(state.site, address), isSlugShard);
        Object.assign(slugs, shard === null ? {} : shard.slugs);
    });
    return slugs;
};

const nearKeys = function nearKeys(state: State, key: string): string[] {
    const letters = [key.charAt(0), key.charAt(1)].filter((letter, at, all) => all.indexOf(letter) === at);
    return letters.flatMap((letter) => Object.keys(slugsOf(state, letter)));
};

const stemOf = function stemOf(key: string, fuzzy: FuzzyRules): string {
    const fitting = fuzzy.suffixes.filter(
        (candidate) => key.endsWith(candidate) && key.length - candidate.length >= fuzzy.stemMinimum,
    );
    const [suffix] = [...fitting].sort((left, right) => right.length - left.length);
    return suffix === undefined ? key : key.slice(0, -suffix.length);
};

const fuzzyKeys = function fuzzyKeys(state: State, key: string, minimum: number): string[] {
    const near = nearKeys(state, key);
    const edits = key.length < minimum ? [] : near.filter((candidate) => oneEditApart(candidate, key));
    if (edits.length > 0) {
        return edits;
    }
    const stem = stemOf(key, state.query.fuzzy);
    return stem.length < state.query.fuzzy.stemMinimum
        ? []
        : near.filter((candidate) => candidate !== key && stemOf(candidate, state.query.fuzzy) === stem);
};

const nameMatches = function nameMatches(state: State, text: string): NameMatch[] {
    const slugRules = slugRulesOf(state);
    const wordRules = searchLeafOf(state).rules;
    const key = nameKeyOf(text, slugRules, wordRules);
    if (key.length === 0) {
        return [];
    }
    if (slugsOf(state, key.charAt(0))[key] !== undefined) {
        return [{ key, match: slugOf(text, slugRules) === key ? "exact" : "normalized" }];
    }
    return fuzzyKeys(state, key, wordRules.fuzzyMinimum).map((found) => ({ key: found, match: "fuzzy" }));
};

const byName = function byName(state: State, text: string): Row[] {
    const rows = nameMatches(state, text).flatMap((found) =>
        knownRows(state, slugsOf(state, found.key.charAt(0))[found.key] ?? []).map((row) => ({
            ...row,
            match: found.match,
        })),
    );
    return rows.filter((row, at) => rows.findIndex((other) => other.ref === row.ref) === at);
};

const sharedPrefix = function sharedPrefix(left: string, right: string): number {
    let at = 0;
    while (at < left.length && at < right.length && left.charAt(at) === right.charAt(at)) {
        at += 1;
    }
    return at;
};

const nameSuggestions = function nameSuggestions(state: State, text: string): string[] {
    const key = nameKeyOf(text, slugRulesOf(state), searchLeafOf(state).rules);
    return Object.keys(slugsOf(state, key.charAt(0)))
        .sort((left, right) => sharedPrefix(right, key) - sharedPrefix(left, key) || textOrder(left, right))
        .slice(0, state.query.fuzzy.suggestions);
};

const byId = function byId(state: State, pattern: string): IdRow[] {
    const prefix = pattern.endsWith(WILDCARD) ? pattern.slice(0, -WILDCARD.length) : null;
    if (prefix === null) {
        return knownRows(state, [pattern]);
    }
    return allRows(state).filter((row) => row.ref.startsWith(prefix));
};

const byFacets = function byFacets(
    state: State,
    collection: string,
    fields: readonly (readonly [string, string])[],
): IdRow[] {
    const rules = slugRulesOf(state);
    const lists =
        fields.length === 0
            ? [cached(state, RECORDS_PATH + slugOf(collection, rules), isEntryLeaf)]
            : fields.map((field) =>
                  cached(state, FACETS_PATH + [collection, field[0], slugOf(field[1], rules)].join("/"), isEntryLeaf),
              );
    const present = lists.flatMap((leaf) => (leaf === null ? [] : [leaf]));
    if (present.length !== lists.length) {
        return [];
    }
    const sets = present.map((leaf) => entriesOf(state, leaf).map((entry) => entry.ref));
    const [first = []] = sets;
    return knownRows(
        state,
        first.filter((ref) => sets.every((set) => set.includes(ref))),
    );
};

const byWalk = function byWalk(state: State, start: string, relation: string | undefined, depth: number): Row[] {
    const edges: Row[] = [];
    const seen = new Set([start]);
    let frontier = [start];
    for (let hop = 1; hop <= depth && frontier.length > 0; hop += 1) {
        const next: string[] = [];
        frontier.forEach((ref) => {
            const row = rowOf(state, ref);
            const leaf = row === null ? null : readIfPresent(state.root, localOf(state.site, row.json), isRecordLeaf);
            (leaf?.relations ?? []).forEach((group) => {
                if (relation !== undefined && group.relation !== relation) {
                    return;
                }
                group.links.forEach((target) => {
                    const listed = target.ref === null ? null : rowOf(state, target.ref);
                    if (listed === null) {
                        return;
                    }
                    edges.push({ ...listed, from: ref, hop, relation: group.relation });
                    if (!seen.has(listed.ref)) {
                        seen.add(listed.ref);
                        next.push(listed.ref);
                    }
                });
            });
        });
        frontier = next;
    }
    return edges;
};

const numberOf = function numberOf(value: string | undefined, fallback: number): number | null {
    if (value === undefined) {
        return fallback;
    }
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed >= 0 ? parsed : null;
};

const respond = function respond(r: NjsRequest, status: number, body: object): void {
    r.headersOut["Content-Type"] = "application/json";
    r.headersOut["Access-Control-Allow-Origin"] = "*";
    r.return(status, `${JSON.stringify(body)}\n`);
};

const messageOf = function messageOf(state: State, code: string): string {
    return state.query.messages[code] ?? "";
};

const refuse = function refuse(r: NjsRequest, state: State, refusal: Refusal): void {
    const values = { ids: state.site + IDS_PATH, index: state.query.index, ...refusal.values };
    respond(r, 400, {
        code: refusal.code,
        error: filled(messageOf(state, refusal.code), values),
        index: state.query.index,
    });
};

const argOf = function argOf(args: NjsRequest["args"], key: string): string {
    return args[key] ?? "";
};

type Check = (state: State, args: NjsRequest["args"], operation: string) => Refusal | null;

const unknownParameter: Check = (_state, args, operation) => {
    if (operation === "collection") {
        return null;
    }
    const options = OPERATION_OPTIONS[operation] ?? new Set<string>();
    const unknown = Object.keys(args).find((key) => !OPERATIONS.has(key) && !PAGING.has(key) && !options.has(key));
    return unknown === undefined ? null : { code: "unknownParameter", values: { name: unknown } };
};

const emptyValue: Check = (_state, args, operation) =>
    argOf(args, operation).length === 0 ? { code: "emptyValue", values: { name: operation } } : null;

const badLimit: Check = (state, args) => {
    const { limits } = state.query;
    const limit = numberOf(args["limit"], limits.defaultLimit);
    return limit === null || limit > limits.limit
        ? { code: "badNumber", values: { max: limits.limit, name: "limit" } }
        : null;
};

const badOffset: Check = (state, args) =>
    numberOf(args["offset"], 0) === null
        ? { code: "badNumber", values: { max: state.query.limits.limit, name: "offset" } }
        : null;

const badDepth: Check = (state, args) => {
    const depth = numberOf(args["depth"], 1);
    const inRange = depth !== null && depth >= 1 && depth <= state.query.limits.depth;
    return inRange ? null : { code: "badDepth", values: { max: state.query.limits.depth } };
};

const unknownRelation: Check = (state, args) => {
    const { relation } = args;
    return relation === undefined || state.query.relations.includes(relation)
        ? null
        : { code: "unknownRelation", values: { name: relation } };
};

const unknownKind: Check = (state, args, operation) => {
    const kind = operation === "collection" ? undefined : args[KIND_OPTION];
    return kind === undefined || state.ids.kinds.includes(kind)
        ? null
        : { code: "unknownKind", values: { name: kind } };
};

const CHECKS: readonly Check[] = [
    unknownParameter,
    emptyValue,
    badLimit,
    badOffset,
    badDepth,
    unknownRelation,
    unknownKind,
];

const refusalOf = function refusalOf(
    state: State,
    args: NjsRequest["args"],
    operations: readonly string[],
): Refusal | null {
    const [operation] = operations;
    if (operation === undefined) {
        return { code: "noOperation", values: {} };
    }
    if (operations.length > 1) {
        return { code: "manyOperations", values: {} };
    }
    for (const check of CHECKS) {
        const refusal = check(state, args, operation);
        if (refusal !== null) {
            return refusal;
        }
    }
    return null;
};

const run = function run(state: State, args: NjsRequest["args"], operation: string): readonly Row[] {
    if (operation === "ref") {
        return knownRows(state, [argOf(args, "ref")]);
    }
    if (operation === "name") {
        return byName(state, argOf(args, "name"));
    }
    if (operation === "q") {
        return byWords(state, argOf(args, "q"));
    }
    if (operation === "id") {
        return byId(state, argOf(args, "id"));
    }
    if (operation === "walk") {
        return byWalk(state, argOf(args, "walk"), args["relation"], numberOf(args["depth"], 1) ?? 1);
    }
    const fields = Object.keys(args)
        .filter((key) => !OPERATIONS.has(key) && !PAGING.has(key))
        .map((key): readonly [string, string] => [key, argOf(args, key)]);
    return byFacets(state, argOf(args, "collection"), fields);
};

const q = function q(r: NjsRequest): void {
    const state = stateOf(r.variables.document_root);
    const { args } = r;
    const operations = Object.keys(args).filter((key) => OPERATIONS.has(key));
    const refusal = refusalOf(state, args, operations);
    const [operation] = operations;
    if (refusal !== null || operation === undefined) {
        refuse(r, state, refusal ?? { code: "noOperation", values: {} });
        return;
    }
    const kind = operation === "collection" ? undefined : args[KIND_OPTION];
    const results = run(state, args, operation).filter((row) => kind === undefined || row["kind"] === kind);
    if (results.length === 0) {
        const suggestions = operation === "name" ? { suggestions: nameSuggestions(state, argOf(args, "name")) } : {};
        respond(r, 404, {
            code: "notFound",
            error: messageOf(state, "notFound"),
            index: state.query.index,
            ...suggestions,
        });
        return;
    }
    const limit = numberOf(args["limit"], state.query.limits.defaultLimit) ?? state.query.limits.defaultLimit;
    const offset = numberOf(args["offset"], 0) ?? 0;
    respond(r, 200, {
        count: results.length,
        limit,
        offset,
        operation,
        results: results.slice(offset, offset + limit),
    });
};

const movesOf = function movesOf(state: State): Map<string, string | null> {
    const moves = new Map<string, string | null>();
    const moved = cached(state, MOVED_PATH, isTable);
    rowsOf(moved ?? { columns: [], rows: [] }).forEach((row) => {
        if (isMoveRow(row)) {
            moves.set(localOf(state.site, row.json), row.to);
        }
    });
    return moves;
};

const missing = function missing(r: NjsRequest): void {
    const state = stateOf(r.variables.document_root);
    const index = `${state.site}/json/api`;
    const moves = movesOf(state);
    if (!moves.has(r.uri)) {
        respond(r, 404, { code: "missing", error: messageOf(state, "missing"), index });
        return;
    }
    const to = moves.get(r.uri) ?? null;
    if (to === null) {
        respond(r, 410, { code: "gone", error: messageOf(state, "gone"), index });
        return;
    }
    r.headersOut["Access-Control-Allow-Origin"] = "*";
    r.return(PERMANENT_REDIRECT, to);
};

const staticQuery = function staticQuery(r: NjsRequest): void {
    const state = stateOf(r.variables.document_root);
    respond(r, 400, { code: "staticQuery", error: messageOf(state, "staticQuery"), query: state.query.endpoint });
};

const pageExists = function pageExists(root: string, page: string): boolean {
    try {
        fs.statSync(root + page);
        return true;
    } catch (error) {
        if (isMissing(error)) {
            return false;
        }
        throw error;
    }
};

const markdownCanonical = function markdownCanonical(r: NjsRequest): string {
    if (!r.uri.endsWith(MARKDOWN_EXTENSION)) {
        return "";
    }
    const home = r.uri === HOME_TWIN;
    const route = home ? HOME_ROUTE : r.uri.slice(0, -MARKDOWN_EXTENSION.length);
    const page = home ? HOME_PAGE : route + PAGE_EXTENSION;
    if (!pageExists(r.variables.document_root, page)) {
        return "";
    }
    return `<https://${r.variables.host ?? ""}${route}>; rel="canonical"`;
};

export default { markdownCanonical, missing, nameKeyOf, normalizeWord, q, staticQuery };
