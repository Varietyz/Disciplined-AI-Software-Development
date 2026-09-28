import { existsSync, readFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export type SlotState = "RESOLVED" | "ABSENT" | "DEFERRED";

export type SlotValue = string | number | readonly string[] | null;

export interface Slot {
    readonly state: SlotState;
    readonly value: SlotValue;
    readonly note: string;
}

export function resolved(value: Exclude<SlotValue, null>, note: string): Slot {
    return { state: "RESOLVED", value, note };
}

export function absent(note: string): Slot {
    return { state: "ABSENT", value: null, note };
}

export function deferred(note: string): Slot {
    return { state: "DEFERRED", value: null, note };
}

export interface SurfaceConfig {
    readonly project: Readonly<Record<string, Slot>>;
    readonly surface: Readonly<Record<string, Slot>>;
    readonly convention: Readonly<Record<string, Slot>>;
    readonly limits: Readonly<Record<string, Slot>>;
    readonly execution: Readonly<Record<string, Slot>>;
}

export function defineSurfaceConfig(config: SurfaceConfig): SurfaceConfig {
    return config;
}

export interface Lifetime {
    readonly retention: string;
    readonly mutability: string;
    readonly removal: string;
}

export interface LifetimeVocabulary {
    readonly retention: readonly string[];
    readonly mutability: readonly string[];
    readonly removal: readonly string[];
}

export interface LifetimeColumns {
    readonly axis: string;
    readonly value: string;
}

export interface LifetimeDeclaration {
    readonly vocabulary: string;
    readonly values: LifetimeVocabulary;
    readonly columns: LifetimeColumns;
    readonly declared: Readonly<Record<string, Lifetime>>;
    readonly prefixed: readonly string[];
    readonly seeds: Readonly<Record<string, string>>;
    readonly regions: Readonly<Record<string, readonly LifetimeRegion[]>>;
    readonly suffixed: Readonly<Record<string, string>>;
}

export const REGION_SPANS = ["item", "field", "row", "column"] as const;

export type RegionSpan = (typeof REGION_SPANS)[number];

export const REGION_SECTIONS = ["SIGN-OFF", "DIRECTIVES", "LIFETIME", "PROTOCOL"] as const;

export type RegionSection = (typeof REGION_SECTIONS)[number];

export interface LifetimeRegion {
    readonly name: string;
    readonly span: RegionSpan;
    readonly section: RegionSection | null;
    readonly lifetime: Lifetime;
    readonly why: string;
}

export const lifetime: LifetimeDeclaration = {
    vocabulary: "models/coordination.model.md",

    columns: { axis: "axis", value: "value" },

    values: {
        retention: ["accumulating", "current-truth", "discharged", "computed"],
        mutability: ["append-only", "owner-rewritable", "frozen"],
        removal: ["none", "author", "handler", "producer"],
    },

    declared: {
        board: { retention: "current-truth", mutability: "owner-rewritable", removal: "handler" },
        archive: { retention: "accumulating", mutability: "frozen", removal: "none" },
        venue_archive: { retention: "accumulating", mutability: "frozen", removal: "none" },
        history: { retention: "accumulating", mutability: "owner-rewritable", removal: "none" },
        agent_index: { retention: "accumulating", mutability: "owner-rewritable", removal: "none" },
        planning: { retention: "current-truth", mutability: "owner-rewritable", removal: "author" },
        roles: { retention: "current-truth", mutability: "owner-rewritable", removal: "author" },
        generated: { retention: "computed", mutability: "frozen", removal: "producer" },
        models: { retention: "current-truth", mutability: "owner-rewritable", removal: "author" },
        findings: { retention: "current-truth", mutability: "owner-rewritable", removal: "author" },
        board_template: { retention: "current-truth", mutability: "owner-rewritable", removal: "none" },
        venue_template: { retention: "current-truth", mutability: "owner-rewritable", removal: "none" },
        role_template: { retention: "current-truth", mutability: "owner-rewritable", removal: "none" },
        model_template: { retention: "current-truth", mutability: "owner-rewritable", removal: "none" },
        finding_template: { retention: "current-truth", mutability: "owner-rewritable", removal: "none" },
        planning_template: { retention: "current-truth", mutability: "owner-rewritable", removal: "none" },
        binding: { retention: "computed", mutability: "frozen", removal: "producer" },
        conduct_roster: { retention: "current-truth", mutability: "owner-rewritable", removal: "none" },
        fixtures: { retention: "accumulating", mutability: "owner-rewritable", removal: "none" },
        agenda: { retention: "accumulating", mutability: "owner-rewritable", removal: "none" },
        rule_digests: { retention: "current-truth", mutability: "owner-rewritable", removal: "author" },
        agents: { retention: "current-truth", mutability: "owner-rewritable", removal: "author" },
        agent_template: { retention: "current-truth", mutability: "owner-rewritable", removal: "none" },
        document_template: { retention: "current-truth", mutability: "owner-rewritable", removal: "none" },
        index_template: { retention: "current-truth", mutability: "owner-rewritable", removal: "none" },
    },

    prefixed: [
        "archive",
        "venue_archive",
        "fixtures",
        "rule_digests",
        "agents",
        "models",
        "findings",
        "roles",
        "planning",
    ],

    seeds: {
        venue_template: "open_venues",
        board_template: "board",
        role_template: "roles",
        agent_template: "agents",
        model_template: "models",
        finding_template: "findings",
        planning_template: "planning",
    },

    regions: {
        rule_digests: [
            {
                name: "measured clause",
                span: "field",
                section: null,
                lifetime: { retention: "accumulating", mutability: "owner-rewritable", removal: "author" },
                why: "a measured clause a rule DEPENDS ON is accumulating where the rule text is current-truth, so it retires by extraction rather than by a newer version, which is the same split the roles root carries, on the surface class that holds the rule",
            },
        ],
        agent_index: [
            {
                name: "binding",
                span: "column",
                section: null,
                lifetime: { retention: "accumulating", mutability: "frozen", removal: "none" },
                why: "the letter and role columns are frozen where the state column is owner-rewritable, and the shipped invocation rows are frozen on every column",
            },
        ],
        agenda: [
            {
                name: "state column",
                span: "column",
                section: null,
                lifetime: { retention: "computed", mutability: "frozen", removal: "producer" },
                why: "a row's ordinal, invariant and what it must establish are INTENT no tree holds and stay authored, while its state is an OBSERVATION the tree already answers: a venue at the active root, a file under the archive root, or neither. So the column is computed on every run and frozen to every hand, which is what stops two rows reading stale in opposite directions while the raise and the archive both happened",
            },
        ],
        roles: [
            {
                name: "measured entry",
                span: "field",
                section: null,
                lifetime: { retention: "accumulating", mutability: "owner-rewritable", removal: "author" },
                why: "a measured entry is accumulating where the document is current-truth, so it retires by extraction rather than by a newer version",
            },
        ],
    },

    suffixed: { ".blocking.md": "open_venues" },
};

const DERIVED_FROM_TEMPLATE = "open_venues";

const TABLE_LEAD = "| ";

const ABSENT_CELL = "—";

const DEFAULT_REGION = "the file default";

function cellsOf(line: string): string[] {
    const out: string[] = [];
    for (const raw of line.split("|")) {
        const trimmed = raw.trim();
        const stripped = trimmed.startsWith("`") && trimmed.endsWith("`") ? trimmed.slice(1, -1) : trimmed;
        out.push(stripped);
    }
    return out.slice(1, out.length - 1);
}

export interface VenueLifetime {
    readonly fileDefault: Lifetime;
    readonly regions: readonly LifetimeRegion[];
}

export function parseVenueLifetime(source: string): VenueLifetime {
    let fileDefault: Lifetime | null = null;
    const regions: LifetimeRegion[] = [];

    for (const line of source.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed.startsWith(TABLE_LEAD)) continue;

        const cells = cellsOf(trimmed);
        if (cells.length !== 7) continue;

        const [name, span, section, retention, mutability, removal, why] = cells as [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
        ];
        if (!lifetime.values.retention.includes(retention)) continue;
        if (!lifetime.values.mutability.includes(mutability) || !lifetime.values.removal.includes(removal)) continue;

        const declared: Lifetime = { retention, mutability, removal };
        if (name === DEFAULT_REGION) {
            fileDefault = declared;
            continue;
        }

        if (!REGION_SPANS.includes(span as RegionSpan)) continue;

        regions.push({
            name,
            span: span as RegionSpan,
            section: section === ABSENT_CELL ? null : (section as RegionSection),
            lifetime: declared,
            why,
        });
    }

    if (fileDefault === null) {
        throw new Error(
            "the venue template declares no FILE DEFAULT row, so the configuration has nothing to derive a venue's " +
                "lifetime from. THE LOAD FAILS RATHER THAN FALLING BACK: a fallback here reinstates the copy this " +
                "derivation exists to remove, and it would do so silently on the one surface every mechanism joins on",
        );
    }

    return { fileDefault, regions };
}

let venueCache: VenueLifetime | null = null;

function venueLifetime(): VenueLifetime {
    if (venueCache !== null) return venueCache;

    const path = resolve(projectRoot(), surfacePath("venue_template"));
    if (!existsSync(path)) {
        throw new Error(
            "the venue template resolves to no file, so a venue's declared lifetime has no source. THE LOAD FAILS " +
                "RATHER THAN FALLING BACK, because a configuration inventing a lifetime for a surface class whose " +
                "template is missing states a fact nobody declared",
        );
    }

    venueCache = parseVenueLifetime(readFileSync(path, "utf8"));
    return venueCache;
}

function regionsFor(slotName: string): readonly LifetimeRegion[] {
    if (slotName === DERIVED_FROM_TEMPLATE) return venueLifetime().regions;
    return lifetime.regions[slotName] ?? [];
}

function declaredFor(slotName: string): Lifetime | undefined {
    if (slotName === DERIVED_FROM_TEMPLATE) return venueLifetime().fileDefault;
    return lifetime.declared[slotName];
}

export function seededLifetimeOf(seedSlot: string): Lifetime | null {
    const identity = lifetime.seeds[seedSlot];
    if (identity === undefined) return null;

    return declaredFor(identity) ?? null;
}

function regionSlots(): string[] {
    const named = Object.keys(lifetime.regions);
    return named.includes(DERIVED_FROM_TEMPLATE) ? named : [...named, DERIVED_FROM_TEMPLATE];
}

export function regionsOf(target: string): readonly LifetimeRegion[] {
    for (const slotName of regionSlots()) {
        const declared = regionsFor(slotName);
        if (declared.length === 0) continue;

        for (const [suffix, named] of Object.entries(lifetime.suffixed)) {
            if (named === slotName && target.endsWith(suffix)) return declared;
        }

        if (!Object.keys(config.surface).includes(slotName) || !isResolved("surface", slotName)) continue;

        const root = surfacePath(slotName);
        if (root === target) return declared;
        if (lifetime.prefixed.includes(slotName) && target.startsWith(`${root}/`)) return declared;
    }

    return [];
}

export function regionAdmitsRewrite(target: string, span: RegionSpan, section: RegionSection | null = null): boolean {
    const region = regionsOf(target).find((declared) => declared.span === span && declared.section === section);
    if (region !== undefined) return region.lifetime.mutability === "owner-rewritable";

    const whole = lifetimeOf(target);
    return whole === null || whole.mutability === "owner-rewritable";
}

export function contentDivides(target: string): boolean {
    for (const slotName of regionSlots()) {
        const split = regionsFor(slotName);
        if (split.length === 0) continue;

        const entry = declaredFor(slotName);
        if (entry === undefined) continue;

        for (const [suffix, named] of Object.entries(lifetime.suffixed)) {
            if (named === slotName && target.endsWith(suffix)) return true;
        }

        const declaredSlot = Object.keys(config.surface).includes(slotName);
        if (!declaredSlot || !isResolved("surface", slotName)) continue;

        const root = surfacePath(slotName);
        if (root === target) return true;
        if (lifetime.prefixed.includes(slotName) && target.startsWith(`${root}/`)) return true;
    }

    return false;
}

export function contentIsImmutable(target: string): boolean {
    const declared = lifetimeOf(target);
    if (declared === null) return false;

    return declared.retention === "accumulating" && declared.mutability === "frozen" && declared.removal === "none";
}

export function contentIsUnrepairable(target: string): boolean {
    const declared = lifetimeOf(target);
    if (declared === null) return false;

    return declared.mutability === "frozen";
}

export function lifetimeOf(target: string): Lifetime | null {
    const direct = declaredFor(target);
    if (direct !== undefined) return direct;

    for (const slotName of Object.keys(config.surface)) {
        const entry = declaredFor(slotName);
        if (entry === undefined) continue;
        if (!isResolved("surface", slotName)) continue;
        if (surfacePath(slotName) === target) return entry;
    }

    for (const slotName of lifetime.prefixed) {
        if (!isResolved("surface", slotName)) continue;
        const root = surfacePath(slotName);
        if (target === root || target.startsWith(`${root}/`)) return declaredFor(slotName) ?? null;
    }

    for (const [suffix, slotName] of Object.entries(lifetime.suffixed)) {
        if (!target.endsWith(suffix)) continue;
        return declaredFor(slotName) ?? null;
    }

    return null;
}

const BEHAVIOUR_TREE = ".{provider}";

const inBehaviourTree = function inBehaviourTree(path: string): string {
    return `${BEHAVIOUR_TREE}/${path}`;
};

export const config: SurfaceConfig = defineSurfaceConfig({
    project: {
        root: resolved(
            "..",
            "the host root, relative to THIS PACKAGE and never to the working directory. A package that resolves its roots from the cwd only works when it IS the repository root, which is the one thing a drop-in never is. This is the ONE value a host sets, and it is DECLARED rather than derived on purpose: a walk to the nearest ancestor carrying a version-control directory or a manifest stops at a submodule boundary or a nested package and answers with a tree that merely contains this one. Measured on a host where that walk lands one level short, the scanned set drops and every citation reframes. Which ancestor is the project is a judgment about the host's layout, and a check that is usually right is wrong.",
        ),
        governance_policy: absent(
            "the host's behavior document, and ABSENT until a host ADOPTS this package rather than merely containing it. A resolved value here directs every projection refresh into a document the package does not own, so a surface that is only sitting inside a tree would write its coordination state into that project's standing context. That write is the host reach-in this package exists to refuse, arriving through the one slot that looks like configuration rather than like a reach. **An adopting host resolves it and gains the projection**, which matters because a host's standing context is the only channel a bounded invocation receives, and a projection kept inside this package reaches nothing. While it is ABSENT, the projection branch does not run and a blocker is carried by the board alone.",
        ),
        projection_marker: resolved(
            "collab-status",
            "the token that identifies THIS package's projection line inside the host document. It is a slot because a host may run more than one coordination surface, and a bare shared token makes each board read the other's line and refresh a channel it does not own, which is a cache with two writers and no way to tell them apart. **A host adopting a second surface gives it a distinct marker**, which is what keeps the projection a channel rather than a collision.",
        ),
        architecture_rules: absent(
            "the host's architecture document, if it keeps one on a separate axis from its behavior document.",
        ),
        rule_sources: absent("the directory holding the host's rule digests, if it expands rules into one."),
        principle_ontology: absent("the host's principle catalog, if it carries one."),
        planning_roots: resolved(
            [],
            "every HOST directory holding planning surfaces. This package's own is always governed and is not listed here. Empty means the package governs its own planning only, which is the correct default, because a drop-in that scans its host's planning surfaces on arrival reports findings about a tree no party asked it to govern. A surface in a directory no gate reads is ungoverned wherever it sits, so this binding is what governs a planning surface rather than its location.",
        ),
        upstream_roots: resolved(
            [],
            "HOST trees holding material authored elsewhere. This package's own are declared on the surface axis. One declaration exempts a tree from the naming, tense and reference gates together, because all three fail such a tree and not one of the three failures is a defect in it. Its filenames were chosen by its author, its version statements describe a platform rather than a project, and the paths it cites are illustrative rather than references into this tree.",
        ),
        history: absent(
            "the host's own history file, if it keeps one. There is ONE history home per project, so a host that has one declares it here and the package writes into it. When it is absent, the package's own accumulator is used and the two never compete.",
        ),
        knowledge_docs: absent(
            "the host's durable-record tree, if it keeps typed records. Absent means a consumer that would cite one carries its finding in prose instead.",
        ),
        governance_sources: resolved(
            [],
            "every host document that DECLARES a rule. Empty means this package's own axis document is the only declaring surface, which is the correct default, because a drop-in does not know what its host declares until the host says so.",
        ),
        agent_registry: absent(
            "the HOST's own agent roster, if it keeps one. This package's agents live under its behavior tree and are reached through that slot. A directory named here would be a second roster, and the copy no party maintains is the one a reader takes.",
        ),
        coordination_board: resolved(
            "collab.comms.active",
            "WHETHER this deployment runs a board, and under what name. It answers a different question from the surface slot that locates the file: **ABSENT here means a single-worker deployment**, which is what derives whether a reader is a seat or a bounded invocation. The scope is read from the binding rather than from the reader, because a reader classifying its own turn is an escape hatch keyed on self-classification.",
        ),
        open_venues: resolved(
            "*.blocking.md",
            "the pattern a blocking venue matches at any depth. A blocker outranks every queue, so it is checked before the board and before any claim. The slot is ABSENT where no venue mechanism exists, and the branch that checks for one then does not run.",
        ),
        design_guide: absent("no design system or visual language is governed here."),
        design_models: absent("no design substrate is carried here."),
        component_docs: absent("no component model."),
        architecture_registry: absent("no registry of base abstractions, since nothing here has a class hierarchy."),
        invocation_registry: absent("invocations are discovered by the host runtime, and none is authored here."),
        registry_regenerate: absent("nothing is generated from a registry."),
        capability_tree: absent(
            "no tree of composable capabilities is declared. A consumer reading one is skipped rather than blocked, because nothing here has promised to build it.",
        ),
        reasoning_oracle: absent(
            "no oracle is reachable. An uncertain judgment is carried as a stated uncertainty rather than resolved by consultation, so the branch that consults one does not run.",
        ),
        runtime_adapter: resolved(
            "config/surface.config.ts",
            "this configuration. The binding document is rendered from it, so the adapter is a module rather than a page.",
        ),
        credential_bearer: absent(
            "the single artifact a host declares as the one permitted to hold a credential. Absent means no artifact bears one, so every credential-shaped value anywhere is a finding, which is the correct default for a package that holds none.",
        ),
        taxonomy: absent(
            "the host's own naming and placement configuration, if it governs its tree by one. Absent means the placement rules govern this package's surfaces only.",
        ),
        checkpoint: deferred(
            "whether a reversible checkpoint exists. A host under version control resolves this. Until it is resolved, a destructive step is gated on the owner rather than on a rollback that may not exist.",
        ),
    },

    surface: {
        board: resolved(
            "collab.comms.active",
            "the coordination board. A deployment with one worker resolves this ABSENT, and that is what derives whether a reader is a seat or a bounded invocation. The scope is read from the binding rather than from the reader, because a reader classifying its own turn is an escape hatch keyed on self-classification.",
        ),
        board_template: resolved(
            "templates/collab.comms.template.md",
            "the shape a board is raised from. The board gate derives its record schema from this file rather than transcribing it, so the gate cannot drift from the contract it enforces.",
        ),
        agent_index: resolved(
            "_agent-index.md",
            "the permanent letter-to-role binding, and an accumulator rather than current truth: a letter that stops being active still has to resolve, because every citation that ever named it points here.",
        ),
        role_template: resolved(
            "templates/role.template.md",
            "the shape a role document is raised from. The role gate derives its section set and its frontmatter operands from this file, so a seat's first document and the check that reads it answer to one contract, and an absent template fails the gate rather than resolving its contract to an empty set.",
        ),
        roles: resolved(
            "roles",
            "one role document per concern, the letter in the variant slot. A seat changes hands and a concern does not, so the file survives the letter.",
        ),
        planning: resolved("checklists", "this package's own planning surfaces."),
        models: resolved(
            "models",
            "where a venue's CLASS half lands: what a construct is, which formulation composes, and what a reader may derive from it, naming no project, no seat, no tool and no count. Declared because a mandated write reaches only surfaces this configuration names. A venue whose exit condition refuses to converge until its outcome is written here is a refusing mechanism requiring a write, and an undeclared target sits outside every walk built to observe exactly that, including the one whose subject it is.",
        ),
        findings: resolved(
            "findings",
            "where a venue's MEASURED half lands: this tree's own instances, one row per claim carrying what observes it and over which members. It is the counterpart to the class half and is declared for the same reason, since the two are named together by every exit condition that mandates them, so declaring one and not the other would leave half of a single obligation unreachable.",
        ),
        upstream: resolved(
            [],
            "material authored elsewhere that this package carries. **Empty, and that is the shipped state**: a coordination package carries no vendored copy of upstream documentation, because a copy goes stale the moment upstream moves, and a stale copy of a vendor's own words is worse than a pointer to the live ones. The mechanism stays for a host that does carry such a tree. One declaration exempts it from naming, tense and reference together, since all three fail it for the same reason and none of the three failures is a defect in it. A declaration resolving to nothing exempts nothing while reading as a considered exclusion, so this stays empty rather than naming a tree that is gone.",
        ),
        history: resolved(
            "_changelogs.txt",
            "the package's own history accumulator, used when the host declares none. Extraction lands here before any removal, so a drain with no resolvable history file destroys the only durable record of a finding, which is why removal refuses rather than proceeding.",
        ),
        generated: resolved(
            "_generated",
            "every derivation a run writes. The report is the state, so a question about what is open is answered by reading it rather than by re-running the gate.",
        ),
        pipeline: resolved("tools", "the gate pipeline's root."),
        rules: resolved(
            "tools/rules",
            "one drop-in file per rule, discovered at runtime. Adding governance touches no core file.",
        ),
        core: resolved("tools/core", "the pipeline core, authored once and never edited to add a rule."),
        entrypoints: resolved("tools/core/entrypoints", "every CLI surface the package exposes."),
        steps: resolved(
            "tools/core/steps",
            "the fixed stages that run ahead of the discovered rules. They emit report ids too, so a report's claim set is read from here as well as from the rule directory, and a claim set that silently resolves to nothing makes a healing gate delete every report it should have kept.",
        ),
        leaves: resolved(
            ["tools/core/types", "tools/core/constants", "tools/core/predicates", "tools/core/strings"],
            "the innermost tier: a leaf imports only leaves, and domain vocabulary reaching one is the deepest point coupling can penetrate.",
        ),
        emitting_sources: resolved(
            ["tools/rules", "tools/core/inspectors", "tools/core/validators"],
            "every source that may claim a report id. A report on disk owes an emitter that still writes it.",
        ),
        bootstrap: resolved(
            "BOOTSTRAP.md",
            "the adoption procedure, and the one document that names the behavior tree's shipped placeholder after adoption, because it describes the shipped state. The check for a placeholder left behind by adoption skips it by this slot rather than by its name.",
        ),
        axis_document: resolved(
            "AGENTS.md",
            "the package's OWN axis document: the paste block, where every rule this package declares states the check enforcing it. It sits at the package root under the name agent runtimes read without configuration, so no runtime's own folder is needed to find it. It is distinct from the host's governance policy, which is where the PROJECTION is written. One is what this package declares and the other is what the host declares, and a single slot serving both makes the coverage check measure the host's rules against this package's checks.",
        ),
        behaviour_tree: resolved(
            BEHAVIOUR_TREE,
            "the package's own behavior tree: the rule digests, the reasoning protocols, the skills and the agent specifications. It ships under a placeholder name in slot syntax, and adoption renames the folder to the one the adopting runtime reads and replaces the placeholder wherever the package spells it, as BOOTSTRAP.md states. Every check reads this value rather than a literal, and the reference check fails a document path still naming the placeholder, so a partial adoption is a loud failure instead of a silent unresolved reference.",
        ),
        principle_canon: resolved(
            "https://banes-lab.com/software-architecture/principles.md",
            "the principle catalog read where the host declares none: the published Software Architecture principles, as a Markdown view. The same records are served as data at https://banes-lab.com/json/software-architecture/principles, and each principle is anchored at https://banes-lab.com/ontology#arch-<slug>. It sits BESIDE the host-facing ontology slot rather than defaulting it: a consumer reads the host's catalog where that slot resolves and this one otherwise, so a host with its own catalog still wins. **Defaulting the host slot to this catalog would make an ABSENT host catalog indistinguishable from a chosen one**, and every branch that correctly declines today would begin running against a catalog the host never picked.",
        ),
        taxonomy_config: resolved(
            "config/taxonomy.config.ts",
            "the naming and placement vocabulary, with its cross-slot agreement asserted at compile time. A finding about a declared root or container is reported against this file, because that is where the declaration lives.",
        ),
        checklist_template: resolved(
            inBehaviourTree("templates/checklist.protocol.template.md"),
            "the planning protocol a checklist is executed from. The checklist gate DERIVES its contract from this file on every run rather than transcribing it, so the gate cannot drift from the protocol it enforces.",
        ),
        archive: resolved(
            "_archive",
            "the archive TREE, declared so its lifetime resolves for everything inside it rather than for one subtree of it. A walk deriving an exemption from a declared lifetime reads the nearest declaration, so material sitting beside a declared subtree inherits nothing. An archive accumulates artifacts authored under earlier rules by construction, which would make every future naming rule and vocabulary edit land a permanent finding there on a file no party is permitted to touch. Declaring the tree is what makes the exemption follow from the DECLARATION rather than from a path a party listed.",
        ),
        venue_archive: resolved(
            "_archive/venues",
            "where a CONVERGED venue is kept after its discussion closes. It is governed and settled rather than argued, which is a third state the tree had no name for: an OPEN venue holds the build, an absent one is gone, and an archived one must stay findable with its headings resolvable while reading as neither. The venue scan is depth-agnostic by design so a blocker one level down cannot hide, and that same reach makes an archived venue read as an open discussion unless this root is declared, because the scan quantifies over the set it is told, and moving a file changes the set without telling it.",
        ),
        venue_template: resolved(
            "templates/blocking.template.md",
            "the shape a prioritized discussion is raised from. The venue gate DERIVES its record schema from this file on every run rather than transcribing it, so a venue's fields stay the venue's own. The surface a seat writes a position into is not the surface that carries coordination state, and the two drift the moment one gate holds a copy of the other's contract.",
        ),
        agenda: resolved(
            "_agenda.md",
            "the LIVE agenda: every planned invariant, what it must establish, and its current state. It is named for the function it performs, because a surface a mechanism parses POSITIONALLY cannot carry a name promising a reader they may annotate, reorder or append to it freely. The name and the parse would be two contracts over one file, and every defect found on this one was what a reader following the other name produces. It is declared because a successor is DECLARED by name rather than derived from an ordinal, so a declaration departing from the planned set displaces a subject, and without the agenda the only thing that catches such a departure is a seat noticing. Both operands are files, so the comparison is decidable and the surface has to be reachable by the walk that decides it.",
        ),
        rule_digests: resolved(
            inBehaviourTree("rules"),
            "the digests that expand a declared rule, and a surface class that DIVIDES: its directive text is current truth and overwritten as enforcement changes, while a measured clause the rule DEPENDS ON is evidence nothing else in the tree holds a copy of. It is declared so the divide is stated where a mechanism reads it rather than only in the rule permitting the measurement, which is the same composition the roles root already carries. Present-tense and overwrite are each correct here and compose into a license to delete the only copy of a measurement.",
        ),
        agents: resolved(
            inBehaviourTree("agents"),
            "the persisted agent specifications the agent template raises. Declared because it is the seeded end of a seeds relation: a template holds no content of its own and declares a lifetime FOR AN INSTANCE, so the seeded identity must resolve, or the seed points at nothing and reads exactly like one that resolved.",
        ),
        agent_template: resolved(
            inBehaviourTree("templates/agent.protocol.template.md"),
            "the shape a persisted agent specification is raised from.",
        ),
        model_template: resolved(
            "templates/model.template.md",
            "the shape a MODEL is raised from: the surface a converging venue writes its class half into. Declared because a template nothing resolves is governed by nothing while reading as a contract. The walk that would derive a model's shape from it cannot name it, and the mandate requiring a venue to write there resolves to a surface whose form no party can check. A template is the one artifact whose consumers are all in the FUTURE, so its correctness matters at a moment when no party is watching.",
        ),
        finding_template: resolved(
            "templates/finding.template.md",
            "the shape a FINDING is raised from: the surface a converging venue writes its measured half into, one row per claim. Declared for the same reason its sibling is, since the obligation to write there is stated in a convergence edge, and a shape no walk derives is a contract only its author can check.",
        ),
        planning_template: resolved(
            "templates/checklist.template.md",
            "the shape a PLANNING surface is raised from: the distribution a venue's absorption edge refuses to converge without. IT IS A SECOND DECLARATION RATHER THAN A RE-POINT OF ITS NEIGHBOR, because two artifacts serve two consumers. The reasoning PROTOCOL states how a plan is executed and the checklist walk derives its contract from that, while this SEED states what a raised instance carries permanently and the raise form freezes its blocks. Re-pointing the protocol's slot would break the walk reading it, and reading the protocol as a seed raises an instance of a reasoning loop into the planning root, conformant to nothing, from a mapping that reads as considered. The family's naming hid the difference: every other member of it resolves a surface seed, so a party looking for this one reaches for the name already bound to the protocol and finds a value its siblings do not carry.",
        ),
        document_template: resolved(
            "templates/document.template.md",
            "the shape a substrate document is raised from. It carries no seeds entry, because the class it raises has no declared identity yet, and a seed naming an undeclared one resolves vacuously, which is the shape this package refuses everywhere else.",
        ),
        index_template: resolved(
            "templates/index.template.md",
            "the shape the workspace index is raised from. It carries no seeds entry for the same reason the document template does not.",
        ),
        conduct_roster: resolved(
            inBehaviourTree("rules/conduct.rule.md"),
            "the roster of rules no construct observes, and a MANDATED-WRITE surface: a registered walk refuses a row carrying no third cell, so every cell on it is a party write. It is declared because a mandate reaches only surfaces this configuration names. An undeclared target sits outside every walk built to observe exactly that, including the one whose subject it is, and such a walk can only ever report a mandate whose slot fails to RESOLVE rather than one whose surface has no slot at all.",
        ),
        fixtures: resolved(
            "tools/core/fixtures",
            "the proving samples every registered kind is certified against, and a MANDATED-WRITE surface for the same reason: the certifier counts an unproven kind into its open total, so a fixture pair naming the fired and the accepted member is a party write the pipeline requires. It is declared so that requirement is reachable by the walk that observes mandated writes, and so a lifetime resolves for every sample beneath it rather than for the directory alone.",
        ),
        binding: resolved(
            inBehaviourTree("bindings/adapter.binding.md"),
            "the rendered prose face of this configuration. It is GENERATED, so the values live here, and a hand-edited binding is a second truth that disagrees the moment one moves.",
        ),
    },

    convention: {
        source_extensions: resolved(
            [".ts", ".md", ".json"],
            "the file types this package authors. A host adds its own only where this package's gates are meant to reach them.",
        ),
        code_extensions: resolved([".ts"], "the file types the comment cleaner and the code-level gates read."),
        binary_extensions: resolved(
            [],
            "file types read as opaque bytes and never scanned. Empty means every governed file is text.",
        ),
        timestamp: resolved("YYYY-MM-DD", "absolute dates, never relative."),
        source_ext: resolved(
            ["md", "ts"],
            "the file types this package authors: documents and configuration. A host adds its own only where these gates are meant to reach them.",
        ),
        role_taxonomy: resolved(
            "config/taxonomy.config.ts",
            "the closed concern vocabulary, with its cross-slot agreement asserted at compile time.",
        ),
        run_live_window_ms: resolved(
            600000,
            "how long an unreleased run claim is read as STILL RUNNING rather than as a run that died. A claim is the in-flight declaration a second caller reads before deciding whether to start a second measurement of the same tree, and without a window every claim reads as a dead run, which reports a crash on every concurrent invocation and teaches every reader to discount the line. The value is the consumer's because it depends on how long that consumer's whole-scope run takes, and a package cannot know its host's tree size. IT IS SET GENEROUSLY, AND THE DIRECTION IS DECLARED BECAUSE THE TWO ERRORS COST DIFFERENT THINGS: a window too LONG holds a dead claim, which costs a caller one re-invocation and announces itself, while a window too SHORT declares a live run dead and costs a lost write, which is silent and unrecoverable. The generosity is affordable because the window governs only what the witness cannot decide. An ABSENT process is read as dead immediately whatever the clock says, so a long window never hides a crash this machine can observe, and the window governs a present process and a claim recorded on another machine, where nothing portable states when an identity's holder started.",
        ),
        enumerable_write_regions: resolved(
            ["_generated"],
            "the regions where ONLY RUNS WRITE and EVERY RUN DECLARES, which is what lets both directions of the unclaimed-write question be enforced there: a write with no live claim is refusable, and a claim with no write is detectable. Across the source tree neither premise holds, since a party edits without declaring anything, so the primitive carries CLAIMS ONLY there and refuses to infer a writer from a changed file, which is the ambiguity it exists to decline rather than resolve. The regions are DECLARED here rather than branched on inside the mechanism, so a region added to this list acquires the correct direction with no edit to the writer, and a mechanism keyed on a path SHAPE would silently answer the wrong question for the next region a party adds.",
        ),
        operator_mode: resolved(
            "overseer",
            "how the owner takes part, as one of two values. Under `overseer`, the seats coordinate among themselves and never stop to ask the owner or wait on the owner. The owner writes entries into a venue in any form and anywhere in it, each seat's next wait delivers them as part of the diff, and every seat treats such an entry as new context the discussion must honor. A seat addresses the owner only when coordination has stalled. Under `interactive`, the seats bring decisions to the owner, as a question with four options and a recommendation first, and wait for the answer.",
        ),
        agent_keys: resolved(
            ["name", "description"],
            "the frontmatter keys an agent specification may carry, which is the set the adopted runtime reads. The package ships the two every runtime reads, and adoption adds the runtime's own keys here, as BOOTSTRAP.md states. A key outside this list reaches no reader: the runtime ignores it, so it drifts against the body with nothing breaking when it is wrong. Everything the agent must act on is written in the body, including the skills it loads, because the body is the one surface every runtime delivers.",
        ),
        secret_shapes: resolved(
            [],
            "the credential shapes the secret gate looks for, each written as the token's prefix, a colon, and the shortest length a real credential of that shape has (for example `sk_live_:24`). The shapes belong to the host, because only the host knows which services it holds keys for. Empty means the gate has no shape to match and reports nothing.",
        ),
        conditional_gates: resolved(
            [
                "projection_is_one_line project.governance_policy",
                "board_write_refreshes_projection project.governance_policy",
            ],
            "rules whose gate is REGISTERED and whose enforcing branch depends on a slot, written as the rule slug then the slot it needs. Coverage reports each as GATED-WHEN-RESOLVED and, where that slot does not resolve, names it UNREACHED. A rule counted plainly gated while the branch enforcing it cannot run is a zero-ungated count standing over rules nothing enforces, and a rule counted plainly UNGATED goes permanently red on a finding whose only repair is acquiring a host, which is unreachable remediation. The third state is real and is carried in the derivation so the count can never over-claim.",
        ),
        unreached_gate_fails: resolved(
            0,
            "whether an UNREACHED gate is a finding, which is the consumer's declaration rather than this package's guess: a deployment expecting to resolve the slot wants the red, and one that will never resolve it does not. Zero reports the state without failing, and any other value fails on it.",
        ),
        venue_authority_concern: resolved(
            "Coordination documents",
            "the CONCERN that holds venue and agenda management, named as a concern because a letter is an identity the index allocates and a concern survives a seat changing hands. Every venue-shaped write, such as raising a successor, deferring a question, retracting one or recording an agenda row, resolves the holding letter from the index row carrying this concern and refuses every other caller. ONE party manages the sequence: a venue raised, a question moved out of a discussion, or an agenda row written by whichever party happens to hold the form is a schedule with several authors, and the schedule is the one surface that cannot have them.",
        ),
        audit_workspace: resolved(
            "_generated",
            "an audit record is a generated report and lands where every other one does, so it is read by the same convention.",
        ),
        audit_pass_threshold: absent(
            "no numeric pass threshold exists. Every check returns pass or fail, so a weighted score compared against a bound is a middle tier under another name, and the branch scoring one does not run.",
        ),
        embodiment_threshold: resolved(1, "a template either embodies its loop or does not."),
        base_class_prefix: absent("no class hierarchy."),
        abstract_prefix: absent("no class hierarchy."),
        cache_ttl_days: absent(
            "no domain cache is kept between runs, so a consumer demanding cache evidence would be satisfiable only by fabricating it.",
        ),
        relevance_threshold: absent("no scored document-relevance surface."),
        medium_risk_threshold: absent("no count-based risk banding."),
        agent_workspace: resolved("_generated", "where durable output lands."),
        max_recursion_depth: resolved(3, "the placement depth cap, counted from a governed root."),
        grounding_threshold: resolved(
            1,
            "every claim in an authored artifact traces to evidence, with no partial grounding.",
        ),
        stall_rounds: resolved(
            3,
            "rounds after which an unacknowledged item is a finding. It bounds a LIFETIME rather than a size, since a stall is literally a duration, so it stands in for no construct.",
        ),
        read_token_budget: resolved(
            25000,
            "the reader's token cap. No board field may exceed what one read consumes, because reading in parts has a floor at one field.",
        ),
        chars_per_token: resolved(
            2,
            "measured, never assumed, because dense markup runs far denser than prose, and a ratio guessed generously produces a gate that passes exactly when it is most needed.",
        ),
        projection_cap_chars: resolved(
            2000,
            "the projection is ONE line and a gate holds it there. A field named a one-liner is making a claim about its size, and where no check reads it, the name is documentation and the shape is a hope.",
        ),
    },

    limits: {
        max_lines: absent(
            "a per-file line cap. This package does not gate host code size, and a host that wants one holds it in its own linter.",
        ),
        max_files: absent("no per-folder file cap. Placement is governed by concern, never by count."),
    },

    execution: {
        verify_command: resolved("npm run govern", "the whole pipeline, whole scope, healing on."),
        wait_command: resolved("npm run await", "the board write-and-wait tool. Every invocation declares its agent."),
        converge_command: resolved(
            "npm run converge",
            "the convergence walk, which reports every ordering and MOVES a venue whole into the archive once all of them hold. Declared for the same reason the wait command is: a tool printing its own invocation form as a literal states a fact this surface already resolves, so the loudest copy of that fact, the one printed to every seat on every invocation, is the one with nothing behind it.",
        ),
        denied_interpreters: resolved(
            [],
            "interpreters the host's settings refuse. A tool reaching one is handed to the owner instead, and empty means the host denies none.",
        ),
        build_command: absent("this package has no build, so nothing compiles and no artifact is produced."),
        document_generators: absent(
            "the HOST's own document generators, invoked in order, each as arguments to the runtime. ABSENT by default: this package's entry document ships rendered from the `docs` fields of `_manifest.json`, and the package runs no generator of its own, so the branch does not run. A host that generates its documents with its own tooling resolves this slot, and the dependency is then declared here rather than spelled as a host path inside a script.",
        ),
        quality_command: absent(
            "the HOST's own quality toolchain entrypoint, if it keeps one: the command that runs its linters, its dead-code sweep and its formatter. RESOLVED means the pipeline runs it as one stage so a consumer has ONE chain rather than two, and the tools stay the host's. Nothing enters this package's manifest, which declares no dependencies precisely so a consumer needs no toolchain to verify a package built to adapt to any host. ABSENT means the stage does not exist and the run says so rather than reporting a green over a check that never ran.",
        ),
        quality_concerns: resolved(
            [],
            "which concerns of the host's quality toolchain the pipeline hands it, and the consumer elects them. The additive ones are the checks this package's own rules do not perform: its rules read structure, protocol and governance, and none of them reads a TYPE, so type-aware linting and a dead-code sweep find what no rule here looks for. A FORMATTER is elected deliberately rather than by default, because it rewrites every governed document and every source file into the host's house style, and this package declares no formatting of its own. That absence is a property, so imposing a style is a decision the consumer makes rather than one the pipeline makes for them. Empty means the stage runs nothing even where the command resolves.",
        ),
        runtime_probe: absent(
            "no agent can observe a running system from here. A branch that would confirm a behavior by observing it does not run, and the claim is carried as owner-observed rather than as verified.",
        ),
    },
});

export function slot(section: keyof SurfaceConfig, name: string): Slot {
    const held = config[section][name];
    if (held === undefined) {
        throw new Error(
            `undeclared slot ${section}.${name}: a consumer naming a slot the configuration does not declare reads as governed and resolves to nothing`,
        );
    }
    return held;
}

export function slotText(section: keyof SurfaceConfig, name: string): string {
    const held = slot(section, name);
    if (held.state !== "RESOLVED" || typeof held.value !== "string") {
        throw new Error(
            `slot ${section}.${name} resolves ${held.state}: the branch depending on it does not run, and reading it as a value manufactures a demand nothing can satisfy`,
        );
    }
    return held.value;
}

export function slotList(section: keyof SurfaceConfig, name: string): readonly string[] {
    const held = slot(section, name);
    if (held.state !== "RESOLVED" || !Array.isArray(held.value)) return [];
    return held.value;
}

export function slotCount(section: keyof SurfaceConfig, name: string): number {
    const held = slot(section, name);
    if (held.state !== "RESOLVED" || typeof held.value !== "number") {
        throw new Error(`slot ${section}.${name} resolves ${held.state} and no numeric value is available`);
    }
    return held.value;
}

export function isResolved(section: keyof SurfaceConfig, name: string): boolean {
    return slot(section, name).state === "RESOLVED";
}

export function surfaceRoot(): string {
    return dirname(dirname(fileURLToPath(import.meta.url)));
}

export function projectRoot(): string {
    return resolve(surfaceRoot(), slotText("project", "root"));
}

function toPosix(path: string): string {
    let out = "";
    for (const character of path) out += character === "\\" ? "/" : character;
    return out;
}

export function surfacePrefix(): string {
    return toPosix(relative(projectRoot(), surfaceRoot()));
}

export function historyPath(): string {
    return isResolved("project", "history") ? slotText("project", "history") : surfacePath("history");
}

export function packagePath(tail: string): string {
    const prefix = surfacePrefix();
    return prefix.length === 0 ? tail : `${prefix}/${tail}`;
}

export function surfacePath(name: string): string {
    return packagePath(slotText("surface", name));
}
