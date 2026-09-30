---
name: placement
summary: The concern-taxonomy standard, covering the container-subject-concern folder chain, the subject.variant.concern.ext filename, the depth cap, jurisdiction and the disambiguation law.
type: taxonomy
concern: governance
status: current
---

# Placement and naming standard

This is the authoritative, machine-resolvable standard for how every governed file is **named** and
**placed**, so the tree is queryable by glob and enforceable by a gate. The SSOT, the gate and the
classifier all derive from this one source.

Vocabulary: `vocabulary.project.taxonomy.md`. Machine truth: `taxonomy.config.ts`. Slot resolution:
`.{provider}/bindings/adapter.binding.md`.

## 1. The grammar

```text
folder = <container> | <subject> | <concern>        one word, never a dot
file   = <subject>.<concern>.<ext>
       | <subject>.<variant>.<concern>.<ext>        overflow form
```

A folder carries exactly one word and no separator, and the file carries the dotted form. **The file's
concern equals its parent folder's concern**, and that equality ties the two together.

The equality carries the main guarantee: one pair of globs resolves the whole system, `**/*.<concern>.<ext>`
for every file of a role and `**/<concern>/` for every folder of one. Neither glob is anchored to depth,
so grouping a set behind a subject folder never costs findability.

- **`<subject>`** is the entity or target the file serves. It is always required, so a bare
  `<concern>.<ext>` never occurs. It may equal its subject folder when the file is the canonical one for it.
- **`<concern>`** is the concern tag, matching the parent folder, in the plurality form the registry
  records for it.
- **`<variant>`** is present only when a **collision** would occur on `<subject>.<concern>` in one
  folder, or when a **facet** of the subject needs naming. It is drawn from `variants` ∪ `subjects`.

Resolution is **positional, not lexical**. The only lexical bar is subject ≠ concern.

Names are kebab-case throughout. A hyphen inside a slot is spelling, and the dot is the only separator.
A folder never carries a dot, so a dotted folder name is always wrong.

**The member never restates the set.** Where a subject folder groups a concern, the file subject names
the member within it. Inside a billing subject folder's validators folder the file is `invoice.validator.ts`, never `billing-invoice.validator.ts`.

## 2. Depth: the ordered-role rule

```text
container(1) → subject(2, optional) → concern(3) → file
```

Every governed file resolves within **≤ 3 folders from its governed root**, the container included
and the file excluded, so `container/concern/file` is depth 2.

- **The anchor is the governed root**, and counting starts at the container.
- **Roles are ordered and skippable.** They resolve in the sequence `container < subject < concern`.
  Each depth consumes a role strictly _later_ than the one before it, so a role may be skipped but
  never repeated and never revisited. `caches/` under a container is legal, and `caches/validators/` is not.
- **The file's parent is always a concern folder.** A file sitting anywhere else is the finding.
- **A subject folder exists if and only if** the container holds two or more sets of one concern that
  must not merge. One set gets a bare `<concern>/`.

The "if and only if" is what keeps one legal path per file. If grouping were optional, classification
would have two right answers, and a gate could not check placement at all.

**Overflow relieves sideways, never downward.** A collision takes the filename's variant slot, and
breadth takes a sibling subject folder. The depth cap is _why_ both slots exist: without the cap, both
degenerate into nesting. This coupling is the invariant the rest of the standard rests on.

## 3. Jurisdiction is declared

A key of `containers` is a governed root: **no declaration, no enforcement.** Its array is the closed
set of folders legal directly beneath it. `specialContainers` names which of them are flat buckets. A
bucket holds one collection concern, as files and never folders, and the depth cap does not apply to
it. Its name is that concern's folder label.

Both kinds are declared, never derived from shape. _"A folder with no subfolders is a bucket"_ is
inference, and inference is what an SSOT exists to remove: a container that lost its last folder
would silently reclassify, and its next loose file would pass unnoticed.

`ignored.foldersFiles` is the single escape, global rather than per-root, for things outside the
taxonomy entirely. **It is never an answer to a finding on authored source**, because an entry that
silences real code hides that violation and every future one under the same name.

### A folder at a governed root is not a license to declare a container

1. Does it group two or more concern folders that must not merge? → it is a **subject** folder inside
   an existing container.
2. Does it hold files of one role? → it is a **concern** folder inside a container.
3. Does an existing container already group it? Containers partition by **axis**, not by feature.
4. Is it source at all? If not → an ignore entry, not a container.
5. Only a **new grouping axis** earns a container, by approved SSOT edit.

A container is not a home for files that resist placement, and never a way to shorten a path.

## 4. Governed roots

| root                   | containers         | buckets                                                                                                 |
| ---------------------- | ------------------ | ------------------------------------------------------------------------------------------------------- |
| `.{provider}`          | `intel` · `skills` | `rules` · `templates` · `bindings`                                                                      |
| `tools`                | `core`             | `rules`                                                                                                 |
| `tests`                | `core`             | —                                                                                                       |
| `.` (the package root) | —                  | `checklists` · `findings` · `templates` · `models` · `specifications` · `roles` · `config` · `taxonomy` |

`agents` is **outside jurisdiction and ignored**, under `foreign_grammar_is_never_claimed`. An agent's
filename and its `name:` field are the identifier the host runtime resolves it by, so renaming one to
satisfy this grammar breaks invocation rather than reorganizing anything, which is the same reason any
tree another system names is not claimed. Ignoring it is the declared mechanism for a tree that exists
and is not ours to name.

**A governed root may carry its own entry document and its accumulators at root, and everything else
lives in a concern folder.** Those two are the root's spine rather than content: the entry document is
what a reader opens first, and an accumulator is marked by its `_` prefix and is history by design. The
rule matches those constructs rather than any filename, so it holds for a root added later, and a root
file that is neither still fails as `looseFileAtRoot`, which a planted file shows firing.

A container is declared when it exists, never in advance of it. A folder declared for work not yet
done is a deferral queue in the SSOT: it governs nothing, fails nothing, and reads as coverage. The
`declaration` gate holds this, since every declared root, container and bucket must resolve to a
directory on disk.

### Corpus roots: the second grammar

A key of `corpusRoots` is governed too, by a different grammar:

```text
file = <key>[.<variant>].<facet>.<ext>
```

| root                  | key                                      | facet derived from                     | filed under          |
| --------------------- | ---------------------------------------- | -------------------------------------- | -------------------- |
| _(declared per host)_ | the file's canonical symbol, kebab-cased | a frontmatter field, else its fallback | the declared subtree |

**No corpus root ships declared.** A corpus is a body of material whose keys are set by whoever
authored it, so which tree qualifies is a host's fact, and the array is empty until a host says so.

The concern grammar cannot claim such a tree, and that is a property of the tree rather than a
concession. Its key is an upstream identifier, so the key set is open by construction, while
`subjects` is closed by design. Declaring an upstream symbol set as subjects would empty the closure of
meaning, and relaxing the closure is forbidden outright, so the tree gets its own declared
jurisdiction instead of being bent into one that does not fit.

The facet is **derived, never chosen**, which is what makes this grammar gateable where a naming
convention is not. A convention can only be compared against itself, while a derived facet is compared
against evidence the file itself carries. A file whose upstream facet field changes keeps its old
filename, resolves into the wrong facet set on every glob, and errors nowhere, so only re-deriving on
each run catches it.

A variant carries grouping the facet does not already encode. Where an origin's name would merely
restate its facet, it contributes none.

Everything else is ungoverned, and each for a stated reason.

| outside jurisdiction                                      | why                                                                                                                                                  |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| a tree carrying another system's ownership markers        | its names are identifiers that system resolves at runtime, so renaming to satisfy placement breaks what reads them rather than reorganizing anything |
| a vendored artifact replaced wholesale on update          | an edit there is destroyed on the next update and may break the install                                                                              |
| a tree whose names are cited as invocations               | renaming breaks a documented command at the moment a party needs it                                                                                  |
| a directory of archives or extracted third-party material | not authored here and not ours to rename                                                                                                             |
| the configuration itself                                  | **structurally exempt**, because the gate's own definition cannot be governed by the gate it hosts                                                   |

**Each row is a shape rather than a path**, because the trees a host holds are the host's, and the
reason a tree is exempt transfers while its name does not. A host declares its own by matching a row.

## 5. Disambiguation law

1. **One concern per file.** A file's concern is its primary responsibility. Genuinely two concerns
   means it does too much → split it.
2. **Narrowest concern.** A file is classified to the narrowest accurate tag, `coordinator` over
   `service`. A saturated high-level label is a misclassification whenever a narrower one fits.
3. **Tie-break, irreducible overlap only:** the domain-ward layer wins.

### The determination protocol

A name is a claim about what the code does, and a claim is untrusted until checked.

```text
1. READ the file. what does it actually do?
2. NAME the concern — the narrowest accurate tag, not a saturated one
3. CHECK the vocabulary in order:
     in the ssot        → use it
     in the rejections  → use the meta concern it points to
     none of the above  → UNRESOLVED. a finding, not a blocker —
                           it usually means the file does two things
4. VERIFY the name against the content, never against the old filename
5. one concern per file. two concerns = split, never a compromise tag
```

## 6. Governed and exempt

**Governed:** every authored file of any language under a declared root. The grammar is
filetype-agnostic.

**Exempt, never renamed:**

- **Ecosystem-fixed names** are resolved by exact name by external tooling. Here they are `SKILL.md`,
  `package.json`, `settings.json` and `settings.local.json`, and renaming one breaks resolution outright.
- **Structurally exempt** files carry their own resolution contract or their own gate: the taxonomy
  canon itself, and the gate sources once they exist.
- **Compound markers** are `test`, `spec`, `d` and `generated`. A file whose second-to-last dot segment
  is one of these is **name-exempt but not placement-exempt**.
- **Flat buckets** keep their shape. A reshape renames within one and never scatters it.

Assets and binaries are governed like source, with a concern folder and a grammar name.

**The highest-risk slice is anything referenced by pattern rather than by literal path.** A rename is
safe only when every reference is a literal string a search can find. In this package that slice is
the `see:`, `source:` and `detect:` fields of the typed records, which `npm run govern:segment` counts.
They form a reference graph encoded in text. A rename that misses them fails silently: the reference
resolves to nothing, nothing errors, and the graph is quietly disconnected.

## 7. The reshape

A manual reshape is the usual rule, on the reasoning that an automated renamer rewrites literal path
text while shape-discovered surfaces do not use literal path text.

**A segment matcher defeats that reasoning rather than ignoring it.** A tool that composes and matches
1→X segments as constructs, AST-typed rather than text-typed, sees the reference graph a literal-text
renamer cannot. Where such a tool exists and has been shown to resolve a surface, the conversion for
that surface is automated. Where it has not, the conversion is manual.

The precondition is unchanged and absolute: **every pattern-referenced surface is enumerated before
the first rename**, and after the conversion each is checked to resolve what it resolved before. A
count that silently dropped to zero is the failure this procedure exists to catch.

Per container:

```text
1. ENUMERATE the container's files; assign each a concern + subject
2. RECORD split candidates — files that fit two concerns — split them first
3. CREATE the concern folders; qualify one ONLY where a sibling shares its
   concern; MOVE + RENAME
4. UPDATE every reference — literal and pattern — in the same pass
5. RE-POINT every pattern-discovered surface whose form encoded the old shape
6. VERIFY the discovery still discovers; compare counts against the baseline
```

Step 3 drops subject folders as often as it adds them, so paths are expected to get **shorter**.

## 8. Enforcement chain

1. **SSOT:** `taxonomy.config.ts`, which holds data only: roots, containers, buckets, the ignore list,
   the grammar constants and the three vocabularies. Its type assertions prove that no subject shadows a
   concern, no variant shadows either, and every declared layer is in the spine, so the vocabulary
   cannot become internally inconsistent without failing to typecheck.
2. **Gate: two rules, split on one line.**
   **Placement** walks the filesystem and must land first, because every later check counts depth
   from an anchor only it resolves. Findings: `missingRoot`, `missingContainer`, `undeclaredContainer`,
   `nestedInSpecial`, `looseFileAtRoot`, `badShape`.
   **Naming** runs per file. Findings: `unparsable`, `concernMismatch`.
   Splitting them on that line is what stops a misplaced file being reported twice.
3. **Classify:** each governed file is assigned its concern by reading it, which is judgment rather
   than pattern matching. A file that resists classification is a split candidate, and the finding is
   worth recording rather than forcing the file under an arbitrary tag.
4. **Reshape:** container by container, with the gate green between each.

## 9. Edge-case defaults

- **Small containers still get concern folders.** A three-file leaf becomes three single-file concern
  folders, because uniformity wins over compactness and the glob guarantee then holds everywhere.
- **A file with no obvious subject** takes the container or capability name as its subject, never a
  bare `<concern>.<ext>`.
- **Ordering is not a filename concern.** Numeric prefixes encode load order, which belongs in an
  import list or a registry, not in a name the grammar must parse.
