<!-- Auto-generated 2026-09-29T00:22Z v14 -->

# @ssot/govlab

<!-- concern:overview -->

## Purpose

Govlab reads every consumer's `.govlab/` by convention, so this directory is wiring-free: a file's location is its registration. `rules/eslint/` holds the local rules. `rules/entrypoints/index.entrypoint.ts` walks it and writes the generated rule index, the exclusion markers and the file budget under `shared/generated/`. `rules/plugins/rule.plugin.ts` wraps each rule once with the `isGovernedFile` guard, which reaches every governed root the taxonomy declares. `rules/entrypoints/writing.entrypoint.ts` renders the writing canon from `shared/manifests/writing.*.manifest.ts` into `.claude/rules/register.md` and checks the canon's records, `CLAUDE.md` and every `_manifest.json` against it. A rule whose meta declares `workspaceWide` sits outside that guard, as does any wrapper file in `rules/eslint/` that default-exports `{ tool, plugins }`. `codemods/` holds the TypeScript-program-driven rewriters: each is an analyzer under `codemods/analyzers/` producing findings with a `reason` plus an entrypoint under `codemods/entrypoints/` that applies only what the checker proves safe. `codemods/validators/` holds the whole-program checks the gate runs, such as field reach and closed values. `shared/` holds the seams the rules compose: selectors over the syntax tree, the listener factory, the anchor resolver, the manifests, the allowlists and the exclusions. `types/` is the host's flat type bucket.
<!-- /concern:overview -->

<!-- concern:use -->

## When to use

- Adding a rule that governs the governed roots. The rule is a file in `rules/eslint/`, and the index is regenerated after it lands.
- Adding a rule that governs the whole workspace. The rule is a file in `rules/eslint/` exporting `{ tool, plugins }`, named explicitly in the quality config.
- Replacing a linter's unsafe auto-fixer. The replacement is an analyzer plus an entrypoint under `codemods/`, which verifies its own output before writing.
- Changing how a string is written. The rules are records in `shared/manifests/writing.*.manifest.ts`, and the writing entry point renders them again.

## When NOT to use

- Rules that belong to the framework instead of this consumer. Those live in `@govlab/quality`'s own plugins and reach every consumer through the catalog.
- Mechanical rewrites a linter already applies safely. A codemod is for the cases where a fixer would produce unverified output.
- Anything needing a published entry point. The host exposes no API for other members to import.

<!-- /concern:use -->

<!-- concern:charts -->

## Architecture charts

The structure, logical-flow and dependency diagrams derived from the source AST live in [_code.info.generated/mermaid-charts.generated.md](./_code.info.generated/mermaid-charts.generated.md).
<!-- /concern:charts -->

<!-- concern:install -->

## Install

The package is private and resolves as `@ssot/govlab`. Build it with `npm run build`, then import from the barrel.

## Quick start

```js EXAMPLE: Add a member-scoped lint rule and activate it
# drop the rule in, then regenerate the index govlab.config reads
node .govlab/rules/entrypoints/index.entrypoint.ts
```

```js EXAMPLE: Run a codemod, which applies fixes by default
node.govlab / codemods / entrypoints / increment.entrypoint.ts;
```

```js EXAMPLE: Inspect what a codemod would touch, without writing
node .govlab/codemods/entrypoints/code-point.entrypoint.ts --map
```

```js EXAMPLE: Replace an exact string across data files, listing the matches first
npm run codemod:literal -- --from '"old_id"' --to '"new_id"' --root govlab.root/govlab.context/configuration --ext .json --map
```

```js EXAMPLE: Narrow a codemod to the programs one member owns
node .govlab/codemods/entrypoints/increment.entrypoint.ts --tsconfig banes-lab.root/banes-lab.web/tsconfig.json
```

<!-- /concern:install -->

<!-- concern:api -->

## API

- `const AGENT_MARKER: "by"`
- `const ASSET_MODULE_NAME: string`
- `const ASSET_PATH_HINTS: readonly string[]`
- `const BANNED_TERMS: readonly string[]`
- `const CANON_PRECEDENCE: "CLAUDE.md > this canon > the rules and manifests on disk > memory"`
- `const CANONICAL_TERMS: readonly TermRecord[]`
- `function canonicalFor(terms: readonly TermRecord[], synonym: string): TermRecord | null`
- `const CARD_RULES: readonly CanonRule[]`
- `const CARRIED_FIELDS: ReadonlyMap<string, string>`
- `const CASE: string`
- `const CHECK_BY_KIND: ReadonlyMap<CompositionKind, CanonCheckId>`
- `function classifyFile(filepath: string): string | null`
- `const CLOSED_SCOPE_LABEL: "ontology records the build reads"`
- `const COLLECTION_PATH_SEGMENTS: readonly string[]`
- `const COMMENT_OPENERS: readonly (readonly string[])[]`
- `const COMPOSITION_RULES: readonly CanonRule[]`
- `const COMPOUND_MARKERS: readonly string[]`
- `function concernForPath(filePath: string): string | undefined`
- `function concernSuffix(tag: string, ext?: string): string`
- `function concernTags(): string[]`
- `function containersFor(root: string): string[]`
- `const COORDINATORS: ReadonlySet<string>`
- `default export`
- `default export`
- `const DERIVATION_MODULES: ReadonlySet<string>`
- `const DERIVING_METHODS: ReadonlySet<string>`
- `const DIAGRAM_EDGE_CHARACTERS: ReadonlySet<string>`
- `const DIAGRAM_GROUP_KEYWORD: "subgraph"`
- `const DIAGRAM_HEADERS: ReadonlySet<string>`
- `const DIAGRAM_IDENTIFIER_CHARACTERS: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_"`
- `const DIAGRAM_KEYWORDS: ReadonlySet<string>`
- `const DIAGRAM_SHAPE_OPENERS: ReadonlySet<string>`
- `const DIALECTS: readonly Dialect[]`
- `const DISCOVERED_FOLDER_KEYS: readonly string[]`
- `const DOCUMENT_CHANNEL: CanonLayerId`
- `const DOCUMENT_LAYER: CanonLayer`
- `function excludedTrees(): string[]`
- `const EXTERNAL_PLAINTEXT_ENDPOINTS: ReadonlySet<string>`
- `const FACTORY_OWNED_TYPES: ReadonlyMap<string, string>`
- `const FIELD_OVERLAP: 0.6`
- `const FIELD_SCOPES: readonly FieldScope[]`
- `const FILE_SHAPES: readonly string[]`
- `const FILLER_PHRASES: readonly (readonly string[])[]`
- `function fixtureMarkerOf(basename: string, root?: string): string | undefined`
- `function folderFor(tag: string): string | undefined`
- `const FUNCTION_WORDS: ReadonlySet<string>`
- `const GENERATED_MARKER: ".generated."`
- `function governedRoots(): string[]`
- `const GRAMMAR_ROLES: GrammarRoles`
- `const HARNESS_TOKENS: readonly string[]`
- `const HIDDEN_FIELDS: ReadonlyMap<string, string>`
- `const IDENTIFIER_LAYER: CanonLayer`
- `const IMPERATIVE_OPENERS: ReadonlySet<string>`
- `const INDEFINITE_PARTIES: readonly (readonly string[])[]`
- `const IRREGULAR_PARTICIPLES: ReadonlySet<string>`
- `function isCheckEnforced(id: CanonCheckId, channel: CanonLayerId): boolean`
- `function isCompoundMarker(segment: string, root?: string): boolean`
- `function isConcern(tag: string, root?: string): boolean`
- `function isConcernFolder(folder: string, root?: string): boolean`
- `function isContainer(root: string, segment: string): boolean`
- `function isDeclaredContainer(root: string, segment: string): boolean`
- `function isDeclaredSubject(word: string, root?: string): boolean`
- `function isDeclaredVariant(word: string, root?: string): boolean`
- `function isEnforced(filePath: string): boolean`
- `function isForeignContainer(root: string, segment: string): boolean`
- `function isGeneratedFolder(name: string, root?: string): boolean`
- `function isIgnoredName(name: string, root?: string): boolean`
- `function isImportedRoot(root: string | undefined): boolean`
- `function isLegalSubject(word: string, root?: string): boolean`
- `function isMarkerFolder(folder: string, root?: string): boolean`
- `function isNameExempt(basename: string, root?: string): boolean`
- `function isNestedRoot(root: string, segment: string): boolean`
- `function isSpecialContainer(root: string, segment: string): boolean`
- `function isTestRoot(root?: string): boolean`
- `function isVerbOrOpensWith(name: string, verbs: readonly string[]): boolean`
- `const JOIN_CAP: 1`
- `const KNOWN_VIOLATIONS: ReadonlyMap<string, string>`
- `const LABEL_MAX_WORDS: 3`
- `const LABELLING_OPENERS: readonly (readonly string[])[]`
- `function layerFor(tag: string, root?: string): string | undefined`
- `const LEGAL_SUBJECTS: ReadonlySet<string>`
- `function legalSubjects(): string[]`
- `const LESSON_FIELD_MOODS: Readonly<Record<string, FieldMood>>`
- `const LONG_DASH: "—"`
- `const LOOKUP_VERBS: readonly string[]`
- `const MARKER_EXEMPT_BASENAMES: ReadonlySet<string>`
- `const MARKER_SOURCE_CALLEES: ReadonlySet<string>`
- `const MARKER_SOURCE_NAMES: ReadonlySet<string>`
- `function markerFolderOf(basename: string, root?: string): string | undefined`
- `const MAX_DEPTH: number`
- `const MEMBERSHIP_METHODS: ReadonlySet<string>`
- `const METRIC_UNITS: readonly string[]`
- `function mirrorSourceOf(root?: string): string | undefined`
- `const NON_IMPERATIVE_OPENERS: ReadonlySet<string>`
- `function normalizePath(path: string): string`
- `const NOT_PARTICIPLES: ReadonlySet<string>`
- `const NOTE_LAYER: CanonLayer`
- `const NUMBERED_NOUNS: readonly string[]`
- `function opensWith(name: string, verbs: readonly string[]): boolean`
- `const OUTPUT_LAYER: CanonLayer`
- `const PARTICIPLE_MIN_LENGTH: 4`
- `const PARTICIPLE_SUFFIX: "ed"`
- `const PASSIVE_ADVERB_SUFFIX: "ly"`
- `const PASSIVE_ADVERBS: ReadonlySet<string>`
- `const PASSIVE_AUXILIARIES: ReadonlySet<string>`
- `const PERCENT_SIGN: "%"`
- `function placementOf(filePath: string): Placement | undefined`
- `const PLAIN_CLOSED_FIELDS: ReadonlyMap<string, string>`
- `const PLATFORM_PATH_PREFIXES: string[]`
- `function platformCapabilities(): readonly PlatformCapability[]`
- `const PLURAL_MARK: "s"`
- `const PRETTIER_EXTENSIONS: ReadonlySet<string>`
- `const PRODUCT_PATH_PREFIXES: string[]`
- `const PROPER_NAMES: readonly string[]`
- `const PROSE_LAYER: CanonLayer`
- `const PUNCTUATION_POLICY: PunctuationPolicy`
- `const QUOTE_CLOSE: "</em>"`
- `const QUOTE_OPEN: "<em>"`
- `const REGISTER_VERBS: readonly string[]`
- `function relativeFromMember(filepath: string): string`
- `const RENAMED_COLLECTIONS: ReadonlyMap<string, string>`
- `const RENAMED_WORDS: ReadonlyMap<string, string>`
- `function resolveImportPath(importerFile: string, importStr: string): string | null`
- `const RESTATEMENT_MIN_WORDS: 4`
- `const RETIRED_SYNONYMS: ReadonlyMap<string, string>`
- `const ROOT_LAYER: CanonLayer`
- `function rootFor(filePath: string): string | undefined`
- `const SEMICOLON: ";"`
- `const SENTENCE_CAP: 54`
- `const SENTENCE_OVERLAP: 0.8`
- `const SENTENCE_RULES: readonly CanonRule[]`
- `const SENTENCE_TERMINALS: ReadonlySet<string>`
- `const SENTENCE_WORD_STOPS: ReadonlySet<string>`
- `const SEPARATOR: string`
- `const SHORT_LAYER: CanonLayer`
- `const SOURCE_RULES: readonly CanonRule[]`
- `function splitterFor(ext: string, root?: string): Splitter | null`
- `const STEM_MIN_LENGTH: 4`
- `const STRING_LAYERS: Map<string, string>`
- `const STRINGS_CHANNEL: CanonLayerId`
- `const STRUCTURE_RULES: readonly CanonRule[]`
- `function suffixAfterVerb(name: string, verb: string): string | null`
- `function synonymsOf(terms: readonly TermRecord[]): readonly string[]`
- `function tagForFolder(folderSegment: string, root?: string): string | undefined`
- `function tagsForFolder(folderSegment: string, root?: string): readonly string[]`
- `function taxonomyRoots(): string[]`
- `function testMarkerOf(basename: string): string | undefined`
- `function testMarkers(): string[]`
- `const TYPE_LAYERS: Map<string, string>`
- `const URL_SHAPED_IDENTIFIERS: ReadonlySet<string>`
- `const VALIDATING_CLASSES: ReadonlyMap<string, string>`
- `function vocabularyFor(root?: string): Vocabulary`
- `const WORD_RULES: readonly CanonRule[]`
- `const WRITE_OWNER_MODULES: ReadonlySet<string>`
- `const WRITER_FUNCTIONS: ReadonlySet<string>`
- `const WRITING_CANON: readonly CanonLayer[]`

<!-- /concern:api -->

<!-- concern:config -->

## Configuration

No config file of its own. Roots resolve through `@ssot/paths`. `shared/resolvers/anchor.resolver.ts` is the single anchor: it names the application member, exports the roots every local rule shares and resolves a file to the container of its own governed root. `types/rule.types.ts` carries the typed ESLint surface: `LocalRule`, `RuleContext` and `RuleListener`. Discovery skips `_`-prefixed and `.generated.ts` files. Codemods read the tsconfig list in `codemods/selectors/program.selector.ts`, which defaults to one program per workspace member and narrows to whatever `--tsconfig <comma list>` names.
<!-- /concern:config -->

<!-- concern:deps -->

## Dependencies

- `@govlab/argv`
- `@govlab/canonical-write`
- `@govlab/constants`
- `@govlab/context`
- `@govlab/docs`
- `@govlab/pipeline`
- `@govlab/quality`
- `@ssot/paths`

<!-- /concern:deps -->

<!-- concern:ai-context -->

## AI context

- Location is registration. The plugin's guard scopes a rule in `rules/eslint/` to the governed roots. A rule declaring `workspaceWide`, or a wrapper exporting `{ tool, plugins }`, bypasses the guard. The declaration chooses the blast radius.
- Codemods verify their own output: `applyEdits` re-parses the rewritten file and refuses to write when the rewrite introduces a syntax error.
- A codemod splits findings into convertible and blocked, and a blocked finding carries a `reason`. `gateOnBlocked` decides whether a blocked finding fails the run.
- A codemod's coverage is its tsconfig list. A member absent from that list is never scanned and the run still reports success. Adding a member means adding its tsconfig here as well as to the workspaces glob.
- Never rely on `node.parent` or `node.getSourceFile()` in an analyzer: parent pointers are populated only once the binder runs, which happens when a checker is requested. Thread `sourceFile` and `parent` through the walk instead.

<!-- /concern:ai-context -->

<!-- concern:domains -->

## Domains

This package serves these software domains, which `_manifest.json` declares in `domains` from the two-tier software-domain vocabulary (`meta → sub`):

- **developer-tooling** — code-generation, linting-quality

<!-- /concern:domains -->

<!-- concern:quality-governance -->

## Quality governance

The canonical quality catalog resolves the quality concepts that govern this package. `_manifest.json` declares them in `governedBy`, and a lint package derives them from the concepts its own rules enforce. Each maps to the custom lint rules that enforce it:

- **duplicate-code** — _complexity_
- **separation-of-concerns** — _complexity_
- **type-safety** — _correctness_

<!-- /concern:quality-governance -->

<!-- concern:disposal -->

## Disposal

- Deleting a rule file and regenerating the index removes the rule from the gate, with no registration list to clean up.
- Deleting a workspace plugin file also requires dropping its entries from `eslint.rules` in the root `.govlab/govlab.config.ts`, which names them explicitly.
- Deleting a codemod also removes its step from the pipeline's auto-fix stage, where the stage planner lists each one.

<!-- /concern:disposal -->

<!-- concern:metrics -->

---

stable · 156 exports · 8 deps · 0 principles · 3 concepts
<!-- /concern:metrics -->
