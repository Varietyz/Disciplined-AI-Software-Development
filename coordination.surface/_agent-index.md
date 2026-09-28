<!-- ACCUMULATOR: the permanent letter-to-role binding. It only grows, and nothing is ever removed. -->

# Agent index. A letter is bound to a role for the life of the project and is never reused.

**This file is an accumulator, so it is not on the board.** The board holds current truth only, and a resolved item is deleted from it. This file is the opposite by construction: a letter that stops being active still has to resolve, because every item, row, citation and changelog line that ever named it points here. Deleting a row would silently re-point all of them.

**An agent that surfaces for the first time is added here before its first write.** A letter is claimed by adding the row, never by using it. Writing under a letter with no row is the same construct as a task that cites an agent the board does not declare: it reads as governed and resolves to nothing.

**The letter is the identity, and the role is what the letter means.** A role is fixed to its letter, so two agents never share a letter and one agent never changes letters. That is what lets a citation written months apart still resolve to the same party.

═══════════════════ INDEX ═══════════════════

| letter | role                                                                               | state   |
| ------ | ---------------------------------------------------------------------------------- | ------- |
| SAa    | Agent audit: a persisted agent against the agent template and the quality contract | INVOKED |
| SAb    | Agent creation: composing a new persisted agent from discovered domain evidence    | INVOKED |
| SAd    | Forensic verification: a claim against observable implementation evidence          | INVOKED |

**The `SA` letters are this package's own bounded-invocation identities, and they ship with it.** They are not a host's roster. A host's seats claim single letters from the top of the scheme, while these three bind the capabilities the package carries. `INVOKED` states what they are, not what they may do: a party that runs only when called, holds a letter so its citations resolve, and is never in the reader set, because it does not exist between invocations and cannot respond. An item addressed to one of them correctly dangles, which is the addressing check working and not a conflict to repair.

**`state` is the only mutable column, and its values are `ACTIVE`, `INACTIVE` and `INVOKED`.** A letter and its role are written once. A seat's row moves between `ACTIVE` and `INACTIVE` and back, taken by the seat whose letter it is, and nothing else changes.

**A seat that departs without declaring it leaves a state that only it may change.** Every edge that quantifies over active seats then counts a party that cannot act, and a discussion waits on a signature that will never arrive. The transition therefore admits a foreign letter, and it is never anonymous when it does. The mover states a warrant, and the row it moved carries a line naming who moved it and under what warrant. Otherwise a state a peer wrote and a state the row's own seat wrote are the same cell, and no reader can tell which claim it holds.

**Every derived active set takes presence from the board's own records and state from this file.** A letter counts as active where it holds a board record and its row here reads `ACTIVE`. A letter that holds a record with no row here resolves as not active, because a letter is claimed by adding its row. The two surfaces answer two halves of one question: this one answers what a letter means and what state it is in, and the board answers which letters hold a seat.

**`INVOKED` is the third value, and it does not move.** The column is therefore mutable for a seat's row and frozen for a bounded-invocation row. A party that exists only when called cannot take a transition, and no other party takes one on its behalf. The surface carries two change modes by row class, and a reader who takes the file-level word for either class inherits the other's. Naming the third value is what closes the set. A vocabulary stated as two values while its own contents hold three is closed in its statement and open in its members, which is the state a closed set exists to refuse.

═══════════════════ ALLOCATION ═══════════════════

**The scheme issues single letters first and then widens, so it never runs out and never collides.**

```text
A … Z                    single
Aa Ab Ac … Az            two-part, cycling the second position
Ba Bb Bc … Bz
AAa AAb AAc … AAz        three-part, cycling the last position
ABa ABb ABc … ABz
```

**The shortest available identity is always the one issued**, so no seat has to reason about which tier a name belongs to, and a name's tier carries no meaning. `Aa` is not junior to `A`. It is the next one that was free.

**A retired letter never returns to the pool.** The scheme is large enough that reuse buys nothing, and reuse is the one change that breaks every historical citation at once without an error anywhere.

═══════════════════ ADDING A ROW ═══════════════════

1. Take the shortest free identity.
2. Write the row, with the letter, the role and `ACTIVE`, before the first write to any other surface.
3. Declare scope on the board by concern, never by directory.

**The role is stated as a concern, not as a task list.** A concern survives the work changing under it. A task list goes stale the first time the agent finishes something, and a stale role does more harm than a vague one, because it reads as current.
