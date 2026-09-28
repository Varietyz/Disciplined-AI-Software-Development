<!-- MODEL SURFACE -->

# Shared invocation: a run declares what it writes and publishes what it read, and a second caller joins rather than duplicating.

# Instantiate per project. Nothing here names a project, a party, a tool or a count.

# Raised from `templates/model.template.md`. The measured half lives in a finding surface and never here.

═══════════════════ LIFETIME (declared, read rather than inferred) ═══════════════════

**The values are drawn from the closed sets the parameter surface declares and are not restated here.**

**The file default:** retention `current-truth`, because a class statement is corrected in place. Mutability
`owner-rewritable`, because any party may write it, announced before the edit lands, since this is an outcome
surface authored jointly rather than a set of per-party claims. Removal authority `author`.

| section                                    | axis       | value    | why                                                                                                 |
| ------------------------------------------ | ---------- | -------- | --------------------------------------------------------------------------------------------------- |
| this LIFETIME block and the CONTRACT block | mutability | `frozen` | written from the template and never edited in a live surface, so a correction lands in the template |

**One writer per record has no operand here.** This surface carries one product, authored jointly, with no
per-party unit for the invariant to range over, so it does not hold weakly: it has **no operand**, which is a
third state distinct from held and violated. Record structure is refused rather than merely unnecessary, because
the collision here is between meanings, and the instrument that reaches it is the announcement plus each author
cutting its own duplicate.

═══════════════════ CONTRACT (permanent) ═══════════════════

**A clause states the shape, and the parameter surface holds the members.** A statement naming a project, a
party, a tool, a file or a count is instance content and belongs in a finding surface.

| element      | states                                                               |
| ------------ | -------------------------------------------------------------------- |
| SCHEMA       | a run's two declarations and what each decides                       |
| LIFETIME     | when each declaration is written and what ends it                    |
| FAILURE MODE | what goes wrong when it is not obeyed, and how that failure presents |
| GATE         | the check that observes it, or `none` as declared debt               |

═══════════════════ MODEL ═══════════════════

## A run makes two declarations, and they answer two different questions

**A run declares a write scope and publishes a read population, and neither is derivable from the other.** The
write scope decides collision: whether two runs may proceed at once. The read population decides validity: whether
a published result answers a later caller's question. **Collapsing them into one declaration makes a mechanism
answer one question with the other's operand**, which is correct exactly while every run reads what it writes and
wrong the moment one reads more than it touches.

| declaration         | decides                           | consumed by               |
| ------------------- | --------------------------------- | ------------------------- |
| the WRITE scope     | collision between concurrent runs | the conflict comparison   |
| the READ population | validity of a published result    | a caller testing coverage |

**The two are orthogonal by construction rather than by assertion**, and the construction is what makes the claim
checkable: a joiner's write set is empty, so it appears in no conflict comparison at all.

## Joining is a read of a published result, never an attachment

**A second caller whose question a live declared scope covers joins by reading that run's published result and
its standing, and writes nothing.** It does not attach to the run, wait on a handle or acquire anything, so the
conflict algebra ranges over starters alone, and a joiner cannot deadlock, cannot be orphaned by the run it joined,
and needs no cleanup path.

**Coverage is the caller's first test and the algebra is the fallback**, in that order. A caller asks whether a
live scope already covers its question. Only where none does is it a starter, and only then does its declared
write set enter a comparison. **Reversing the order makes every caller a starter that then discovers it did not
need to be**, which is the duplication the whole construct exists to remove.

## Comparison is by declaration throughout, so no exclusion clause survives

**Two scopes are compared as declared, never as inferred from what a run turns out to touch.** A declaration is an
operand both parties can read before either acts, while an observation of actual writes exists only afterwards,
which is too late for a comparison whose whole purpose is to decide whether to begin.

**The consequence is that an exclusion clause cannot be honored.** A scope stated as _this subtree except that
part_ is not comparable against another declaration without evaluating the exception over a population, and the
population is exactly what no party has yet built. So the family of scopes is closed under what runs actually
write, with no atom in every scope, and a run that would need an exclusion declares the narrower scope instead.

**And containment is relative rather than a prefix.** A scope of one subtree does not contain a sibling whose name
merely opens with the same text. A prefix test admits it and a relative test refuses it, and the difference
appears only on a member a party names later.

## Containment is a property of the mechanism, never a claim about a run

**The question a mechanism answers is whether this run can write outside its scope rather than whether it did,
and the first is settled at one function.** The second needs a witness no party holds for repairs scattered across
a tree, while the first is a property of the write path, which takes the declared scope and refuses a path outside
it.

**A gate over that property ranges over the writers a run reaches rather than over a directory listing.** A gate
scoped to one registry reports a complete funnel while something writes beside it, and one scoped to the dispatch
directories reports the same while a helper writes beneath either. The reachable set is the import graph from the
entry point, and the sanctioned set is data the check cites, seeded only with verified members.

## Liveness is one-sided, and the asymmetry is the whole of it

**Absence witnesses death, and presence witnesses nothing.** An absent process is dead whatever a clock says. A
present one may be an unrelated occupant of a reused identity, so its presence supports no conclusion at all, and a
mechanism treating the two symmetrically is right in one direction and guessing in the other.

**So liveness is derived once, asking the witness first and falling through to a window only where the witness
cannot decide.** Every consumer reads that one derivation rather than each computing its own, or two consumers of
one question impose different properties and the weaker passes silently.

**The window is set generously, and its direction is declared where the window is.** Too long holds a dead claim and
costs one re-invocation. Too short declares a live run dead and costs a lost write, which is silent and
unrecoverable. The generosity is affordable precisely because of the witness: an absent process reads as dead
whatever the clock says, so a long window hides no failure the machine can observe, and it governs only what the
witness cannot decide.

**A claim recorded on another machine is never interrogated and falls to the window**, because the witness is local
by construction and asking it about a foreign identity answers a different question.

## A published operand is its author's account until something outside the author is compared against it

**Reach and witness are two axes.** That a mechanism publishes a result establishes reach, since a consumer can
receive it. It establishes nothing about whether the result is true, because the publisher is also the only party
that measured it.

**So a published operand is evidence about its author until a second, independent operand is joined against it.**
The join must range over something the author does not control, or it is self-consistency posing as verification.

## A channel name is a total, reversible encoding of the scope it belongs to

**Injective is not sufficient, and the insufficiency is silent.** An injective name separates two scopes' channels
correctly, so nothing collides and no comparison is ever wrong. **Invertible is what lets a retention condition read
the scope back out of the name.** A digest satisfies the first while failing the second with no observable
difference: the files are correctly separated and no party can decide which is stale.

**The encoding is total, which is what makes the guarantee structural rather than checked.** Its alphabet excludes
the separator the name is composed with, so no scope, including one whose text is itself a channel name, can compose
the canonical whole-scope name or collide with another channel. That is a property of the function rather than a
precondition a party remembers.

**A channel has a declared remover rather than inheriting an orphan sweep.** A channel is identified positively, as
a name that decodes to a scope and a body declaring itself non-authoritative, and one whose scope resolves to nothing
is removed by a remover that declares what it removes. A whole-scope aggregate is identified by neither and is never
a member, whatever its name reads.

## Two simultaneous starters are ordered by declare-then-read, with no lock and no wait

**The entry is written before the set is read**, so neither of two simultaneous starters can see an empty other set.
The order is decided by the start stamp, with the party identity breaking an exact tie, and a release fails closed
toward keeping when it cannot name its own run.

**Every member of that family is the same shape: mutual exclusion with no lock, no wait and no new field**, because
both operands are already in the declaration and only the order of writing and reading decides whether they are
visible to each other.

**And the decision is honored at the entry point rather than announced.** A yielding caller exits without writing,
and a non-yield exit that carries a passing run's signal is a run that measured nothing reporting as one that did, so
both branches that do not proceed exit distinguishably from success.

## Gate

- A run proceeding without a declared write scope fails, because the comparison has no operand.
- A caller starting where a live declared scope covers its question fails the coverage test, not the algebra.
- A scope carrying an exclusion clause fails at declaration rather than at comparison.
- A liveness verdict derived anywhere but the one derivation fails, because a second derivation is a second truth
  that disagrees on its first divergence.
- A channel name that is injective and not invertible: `none`. The failure is silent by construction and no check
  here decides it, and the encoding's totality is what holds it instead.
