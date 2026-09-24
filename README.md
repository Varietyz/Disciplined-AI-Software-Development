<div align="center">

<img src="https://banes-lab.com/assets/animated_badge_logo.webp" alt="Disciplined Methodology" width="70" height="70" />

[Disciplined Methodology](https://github.com/Varietyz/Disciplined-AI-Software-Development) © 2025 by [Jay Baleine](https://linkedin.com/in/jay-baleine) is licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) <img src="https://banes-lab.com/assets/svg/cc-by-sa/cc.svg" alt="" width="16" height="16" /><img src="https://banes-lab.com/assets/svg/cc-by-sa/by.svg" alt="" width="16" height="16" /><img src="https://banes-lab.com/assets/svg/cc-by-sa/sa.svg" alt="" width="16" height="16" />

</div>

---

> **Working in a web chat instead of a CLI agent?**
>
> This method is written for an agent with tool access: it reads the tree, runs the checks and repairs what they report. In a chat everything still transfers, you carry the reads and the runs yourself, and [PAG](https://banes-lab.com/pag) loses most of its operational bite because nothing executes it. Pattern Abstract Grammar (PAG) is a structured instruction format for LLMs: a formal grammar grounded in a reasoning ontology, a guide, genesis stages, structure declarations and the template families a reasoning loop walks.
>
> **Reading this with a model?**
>
> Every page of the site is also served as JSON under the json route and as a Markdown twin beside the page, all of it indexed in [llms.txt](https://banes-lab.com/llms.txt), so a model can fetch exactly the chapter it needs and use the site as context while you work.

---

# Disciplined Methodology

**Constraints, checks and skepticism for building software with LLMs.**

A way of building software with a model that does most of the writing. It replaces reminders with checks, chat history with files in the tree, and confidence with evidence. The failures it addresses are the ones every long AI project runs into: code bloat, architectural drift, context dilution and behaviour that decays over a session. It addresses them with constraints a machine can enforce rather than rules a developer has to remember.

---

## The problem

A model answers questions. Ask it one thing and it does that thing. Ask it for a whole feature in one message and it answers several questions at once, guesses at the ones you did not state, and hands back something that runs and cannot be extended. Every failure below is that pattern at a different scale:

- Functions that work and have no structure to hold them
- The same code written again a few files later, because nothing said it already existed
- Architecture that drifts between sessions, because it lived in the conversation
- Context that dilutes as the session grows, until the rules given at the start are gone
- Behaviour that degrades the longer the model runs
- More time spent debugging the output than planning the input

---

## How this works

Every piece of work has one shape: a loop that resolves the message, decides what is worth doing, plans it as a graph, builds against checks that exist before the code, verifies once per state of the tree and ships from a derived state. The chapters follow that loop. Each is a set of lessons keyed by a failure mode, and every lesson has one shape: the problem, the failure mode it presents as, the cause, the principle, the decision, its application and how to check it.

**The check comes first.** A rule without a check is a wish. Writing the check before the code is what makes the thousandth change as safe as the first.

### [Start](START.md)

Who does what, the four sentences of the stance, how discipline is encoded three ways, and where a rule lives so a correction lands once and never repeats. Onboarding a project is a template applied to a binding, not a ritual performed in a chat.

### [Plan](PLAN.md)

Worth before work, the plan as a dependency graph with a gate between phases, templates executed rather than copied, the question asked where it appears, and what happens when two rules meet on one line of code.

### [Build](BUILD.md)

Detect, log, fix. The gate holds the line rather than discipline, a check matches a shape and never a provider, tools live in the tree, every fact has one home, the filesystem is the architecture and placement is a grammar.

### [Verify](VERIFY.md)

Verification is evidence, and the verifier is verified before anyone believes it. One run per state of the tree, output read whole, unknown is not pass, state derived rather than written, and documentation held to the same gate as code.

### [Collaborate](COLLABORATE.md)

The developer governs and the model executes inside the boundaries. Agents are executed contracts rather than personas, coordination between several agents is software with a schema and a validator, and a turn never ends to wait.

### [Ship](SHIP.md)

One chain every tool sits on, scale that follows from structure, a deploy that is a file operation with a rollback, proxies that give way once the property has a check, and the gaps that are declared rather than assumed.

---

## Prose and PAG

The behaviour document is the system prompt of the collaboration, whatever file name the harness reads it under, and it is prose: one line per rule, a stable name, and the check that enforces it. PAG is the grammar for the parts that have to execute the same way every time: agents, planning and coordination templates, and validation gates with pass and fail criteria. In a CLI agent both are live. In a web chat the prose transfers as it is and PAG is read rather than run.

---

## The stance

The stance is four sentences, and the rest of the method depends on them. The first is that a claim stays unverified until you or your model read it in the current tree, as shown in claim to evidence. The second is that review is [adversarial by default](START.md#adversarial-by-default), because agreeing is cheaper than [verification](ontology/PRINCIPLES.md#arch-verification), as shown in agreement outruns. The third is that every manual step is a failure of automation; the ontology names what a manual step decays into, [manual runbook dependency](ontology/PRINCIPLES.md#arch-manual-runbook-dependency) and [manual-only governance](ontology/PRINCIPLES.md#arch-manual-only-governance). The fourth is that a document states what is true now and carries no history of its own, which is [single source of truth](ontology/PRINCIPLES.md#arch-single-source-of-truth) applied to prose. Everything else in the method is a mechanism that keeps one of these four sentences true without the developer or the model having to remember it.

---

## Why this works

- **Decision processing.** A model handles one question far better than eight in one message. The loop and the plan reduce every ask to one.
- **Context that lives in the tree.** Rules in a chat need restating every session, and the restating is where they drift. Rules in files are read at startup, and a correction lands in one place.
- **Enforcement by check, not by persona.** A voice is not a behaviour. A check reports the violation where it lands and names the fix, and a model repairs a finding far more reliably than it obeys an instruction.
- **Evidence over judgement.** Nothing the model says about the tree counts until someone reads the tree. Verification runs once per state and its first output is the answer.
- **Constraints a machine can hold.** A file budget, a closed naming vocabulary, a dependency direction, one home per fact. Each is a predicate, so each is a gate.
- **Structure that scales without attention.** Once the shape of a project is predictable, tooling can validate itself, heal itself and extend itself with a model steering.

---

## The site is the exhibit

I publish the method and not the projects. The one exhibit is the site itself, and these pages show the method holding in its own source.

- [Anatomy](https://banes-lab.com/anatomy) The Anatomy: the client source of this site, parsed on every build and published as the tree it is on disk, every folder and file with its stats, its syntax walk, its definitions and their call edges, and the diagnoses the parser ran.
- [Architecture](https://banes-lab.com/software-architecture) Software Architecture as it applies when an LLM writes the code: a system modelled as a graph, principles typed and related, anti-patterns as decay paths, coverage derived from a grid, and every architectural intent held as a predicate a gate can decide.
  - [Model](architecture/MODEL.md)
  - [Principles](architecture/PRINCIPLES.md)
  - [Decay](architecture/DECAY.md)
  - [Coverage](architecture/COVERAGE.md)
  - [Scale](architecture/SCALE.md)
  - [Glossary](architecture/GLOSSARY.md)
- [Ontology](https://banes-lab.com/ontology) The Ontology: every architectural principle with its relations and repairs, the lexicon of terms, the algorithm contracts, the reasoning spine, the layer topology and the resolved tensions, rendered from the same queryable data the quality tooling reads.
  - [Principles](ontology/PRINCIPLES.md)
  - [Lexicon](ontology/LEXICON.md)
  - [Algorithms](ontology/ALGORITHMS.md)
  - [Reasoning](ontology/REASONING.md)
  - [Schema](ontology/SCHEMA.md)
- [PAG](https://banes-lab.com/pag) Pattern Abstract Grammar (PAG) is a structured instruction format for LLMs: a formal grammar grounded in a reasoning ontology, a guide, genesis stages, structure declarations and the template families a reasoning loop walks.
  - [Introduction](pag/INTRODUCTION.md)
  - [Guide](pag/GUIDE.md)
  - [Orchestration](pag/ORCHESTRATION.md)
  - [Patterns](pag/PATTERNS.md)
  - [Keywords](pag/KEYWORDS.md)
  - [Grammar](pag/GRAMMAR.md)
  - [Validation](pag/VALIDATION.md)
  - [Templates](pag/TEMPLATES.md)

---

## Getting started

Begin with the stance, not the tooling.

### Setup

1. Hold four sentences for a week before you install anything: a claim is unverified until it is read in the tree, review is adversarial by default, every manual step is a failure of automation, and a document states what is true now.
2. Copy a governance folder into the tree and write the one binding that names this project. Declare any slot the project cannot fill as absent rather than fake it.
3. Get the gate green on an empty tree before the first line of code exists.
4. Write the first check before the first feature.

### Execution

1. State the objective and what finished means, in one sentence each, before the first step.
2. Derive the plan as phases with a gate between them, and rank the admissible branches before any effort.
3. One component per interaction. Ask the model one question, in context.
4. Run the gate once per state of the tree and read its output whole. The report on disk is the state of the work.
5. The second time you give the model the same correction, turn it into a check. A rule stated twice is a mechanism you have not built yet.

### What the gate holds

1. Types, dead code, formatting and lint, with custom rules for the anti-patterns of this architecture.
2. Tests, then the build, then validators over what the build produced.
3. Documents, held to the same typing, placement and validation as code.

---

## Using the site as context

Every page and tab of the site is served as JSON and as Markdown, and llms.txt indexes all of it. Point your model at the chapter you are applying and it can use the method in real time while you work, without copying anything onto a disk. The anatomy page shows the site's own client source, every file with its walk, its definitions and their call edges, which is what the other pages teach from.

_[Read the anatomy page.](https://banes-lab.com/anatomy)_

---

## Ask targeted questions

With a chapter in context, ask your model:

- How does the loop apply to this project, and which node is the current work on?
- Which of these rules can a check hold here, and which cannot?
- What is the first check this tree needs?
- Where does this correction belong so that it lands once?
- Express this constraint in PAG.

_[The index of every page, twin and payload.](https://banes-lab.com/llms.txt)_

---

## Adapt it

Treat every constraint as an experiment. It earns its place by what it removes from the output: fewer violations over time, file sizes holding without reminders, behaviour that survives a long session. Whatever moves no measurement, drop. This is one methodology, and a variant for a new shape of project is a derivation from the same core, not a restart.

---

## What to expect

The model still drifts and still needs re-pointing. That is normal, and the drift becomes a rule so that it happens once. Planning takes longer than it used to and debugging takes far less. The days get quieter as the tree learns. It costs attention up front and returns it many times over a long project, and it is worth nothing on a project that will not live that long.

---

## Reading path

Read the chapters in this order. Each one assumes the ones before it.

1. [Start](START.md)
2. [Plan](PLAN.md)
3. [Build](BUILD.md)
4. [Verify](VERIFY.md)
5. [Collaborate](COLLABORATE.md)
6. [Ship](SHIP.md)

---

## The loop

The shape every chapter applies, as the site draws it.

```mermaid
flowchart TB
    subgraph epistemic["Epistemic · how is it known?"]
        orient["Orient · name the subject, read from the tree"]
        see["See · look through the lenses the subject warrants"]
        derive["Derive · a claim grounded in what was seen"]
        project["Project · the next admissible move"]
        act["Act · apply the operation to the state"]
    end
    subgraph conative["Conative · what is worth doing?"]
        intent["Intent · the objective, and the highest-worth branch"]
        constrain["Constrain · is the operation admissible?"]
    end
    subgraph evaluative["Evaluative · is it right, and are we done?"]
        verify["Verify · is the evidence set non-empty?"]
        commit["Commit · externalise the result as inspectable state"]
        terminate["Terminate · saturated, complete and verified?"]
    end
    orient --> intent
    intent -- gate: worth before work --> see
    see --> derive --> project --> act --> constrain
    constrain -- gate: admissible --> verify
    verify -- gate: evidence --> commit --> terminate
    verify -. refuted, back with the evidence .-> derive
    terminate -- gate: stop --> orient
```

---

## Frequently asked questions

### Origin

<details>
<summary>What problem led you to create this methodology?</summary>

---

I kept restating my preferences and architectural requirements to LLMs. It did not matter which language or which project: the model produced either a bloated monolith or an underdeveloped sketch with issues throughout, and I spent more time debugging the output than planning the input. Nothing scaled and nothing decomposed. A pattern I had established drifted a few files later, and every iteration was slow because I was correcting the same things again. The turn came from a plain observation: everything transpiles to a series of can-you-do-this questions answered yes or no. A request that asked several things at once was overwhelming the machine. So I stopped issuing commands and started asking focused questions in context, and I stopped managing the whole setup alone in my head and planned it with the model instead.

---

</details>

<details>
<summary>How did you discover that these constraints work?</summary>

---

Trial and error, a lot of it. A model drifts under any constraint, but it drifts far less inside structured boundaries than without them, so the boundaries stayed and the hoping did not. At first I did the reminding myself, restating its role like you would with a well-meaning toddler that knows the rules and still pushes them to please you. Every reminder I gave twice became a check the tooling runs, and that is how the rules left the conversation and moved into the tree. A constraint earned its place by what it removed from the output: fewer violations over time, file sizes holding without reminders, behaviour that survived a long session. Whatever moved no measurement was dropped. I also stopped looking at syntax and looked at how software interacts and how logic flows; a large code structure is a chaotic meeting with one coordinator fielding questions, and the constraints fell out of keeping that meeting answerable. The biggest discovery was to use the codebase itself as the reporting mechanism. A model is trained hard to resolve problems, and an error is one of the strongest signals you can give it: it does not ask, it acts. So I shaped the error logs, wrote strict custom rules around the anti-patterns of the architecture itself, and gave each finding a tailored remediation. Structured that way, the errors shape the code predictably, and I no longer have to correct it by hand.

---

</details>

<details>
<summary>When did you start using AI for programming?</summary>

---

August 2024. I had made a theme pack for RuneLite and one plugin overlay did not match my layout. I opened my first GitHub account to file an issue asking for a customisation option, and the answer was that it was not a priority and I should build it myself. So I did, with ChatGPT guiding me through forking the client and writing a plugin. That plugin is where the interest in the principles under software started, rather than in any particular syntax. I read development the way I read a book: the syntax is the cover, the logic is the content. Instead of learning syntax structures I learned how software interacts, how logic flows and what kinds of algorithms exist, and found that all of it reduces to the same thing, sequences of questions and answers.

---

</details>

<details>
<summary>How has your approach evolved over time?</summary>

---

In steps. The first mistake was feeding requirements and hoping; the fix was active collaboration, plans first, feedback on whether the plan was clear, uncertainties named before the work. Then the instructions left the chat: a governance folder the model is given at the start of every session and a gate that refuses, so the method became mostly mechanism and very little prose. Then the orchestration changed shape, from one model to several, to models coordinating each other along branches. At the point I am at now, the system does the talking. I call it governed autonomy: I trust my own methodology to shape a project for autonomous development, and my inputs are minimal. What I do send is short and mostly principled. It still drifts and I still have to re-point it occasionally. But the context is set up so that the document the model reads first is an index of references and a traversal. The one axiom per project is caught there, and everything else is paths and indexes pointing at documents the system generated for itself. I stopped relying on a model to update my documents and started relying on the model to build the systems that scale them.

---

</details>

<details>
<summary>How does PAG relate to the methodology?</summary>

---

The methodology decides which constraints discipline the model; PAG is the grammar that states them explicitly. A rule or a validation gate is written as a construct with pass and fail criteria instead of as prose, which lowers the room for interpretation. The ten-node loop the methodology teaches is the same loop a PAG template walks and an instruction pattern selects by fit, which is why the grammar page and the methodology page describe one loop twice. Every agent, every planning and coordination template and every executable document in my tree is PAG, validated against the grammar, so the method's own instruments are PAG programs. It earns its keep most with agents that have workspace and tool access, where enforcement counts; a chat interface reads it fine but cannot act on it. The application I value most is composing meta templates: instructions that need a deterministic format, shape, investigation, action or set of considerations, on whatever subject I need one for. Agent creation, plan creation, repeatable orchestration algorithms. They have proven very useful as templates because I can rely on them to produce an expected output, which is what lets me scale. PAG is a translation layer between my own messy natural language and a machine that would otherwise reinterpret it every time. Caught in PAG, a procedure varies far less: the results of the variants differ, and the invariants persist.

---

</details>

### Practice

<details>
<summary>How consistently do you follow your own methodology?</summary>

---

Since writing the first version I have not deviated from it. I used to do the interrupting myself, stopping generation the moment the model produced more than the rules allowed and flagging the violation by hand. Now the tree interrupts. A violation is a finding the model repairs, not a message I have to write, and a correction I give once becomes a named rule and a memory in the same turn, so I do not give it twice. What slips today is small: an agent drifts mid-task and gets re-pointed with a short directive, and the drift itself becomes a finding or a rule so that it slips once. The hardest principle to keep is not cursing at the machine when it drifts through a complex algorithm. It is a machine. It is not perfect, and neither are we.

---

</details>

<details>
<summary>What happens when you deviate from it?</summary>

---

It used to make me genuinely uncomfortable. When a tree started to tangle I felt the same discomfort that made me write the method in the first place, and the urge to organise and compress until only the load-bearing structure remained. That discomfort is solved for good now, because the taxonomy I introduced makes the shape of every project predictable, and a predictable shape is what let me build tooling that validates itself, heals itself and extends itself with a model steering. Deviation is not an option anymore, because a check refuses it before it lands, as the chapter on why the gate holds the line describes.

---

</details>

<details>
<summary>What have you learned about the model itself?</summary>

---

One lesson, after more than eleven thousand hours of using AI and building the systems that constrain it: the model is not intelligent in the way the word suggests. It is an impressive piece of mimicry. It does not reason by asking itself the questions a resolution needs; it searches frantically for the pattern that maps onto what you said, and the resolution patterns have to be handed to it. It needs priming before a complex task, explicit guidance, structural reasoning concepts, and constant reinforcement of the shape you want, and it will not ask a question unless asking is embedded in its context structurally. Working with it on software is extremely quick and extremely capable, and erratic: eager to satisfy, quick to cut a corner, prone to describing itself as if it had intentions, and inclined to avoid work that looks like a lot. Every one of those is something to engineer against, and not by writing a line that says do not do this and restating it later. It has to become structure, and I now bring the same structural approach to most things.

---

</details>

<details>
<summary>How do you handle a project that does not fit the methodology?</summary>

---

I have yet to meet a project it did not work for, and I have taken it well outside software: games, marketing, delivery pipelines and operations, security, tooling, language and compiler design, data engineering, critical systems and the business itself. Where a project does not fit, I adapt the project, and where that is impossible I adjust the method. It stays one methodology, because the thinking is kept apart from the tools: a variant for a new shape of project is a derivation from the same core, not a restart. In practice onboarding is the drop-in: copy the governance folder, write the one binding that names this tree, declare any slot the project cannot fill as absent rather than fake it, and have the gate green on an empty tree before the first line of code exists.

---

</details>

<details>
<summary>What is the learning curve?</summary>

---

I cannot honestly answer that. What I find obvious is not always obvious to others, so the learning curve belongs to someone who has used the method without having written it. What I can say is that it is more structured than ad-hoc work, not less, and that it assumes you can read what the checks report. Without programming fundamentals the findings are noise.

---

</details>

<details>
<summary>Who is this for, and where does it stop?</summary>

---

Nothing here makes a model right. It makes a wrong answer visible and refuses it, and for anything that has to stay reliable while a model writes most of it, that is how I work, having tried the alternatives. It stops at the boundary of the tree: the gate can only hold what a check can decide from the tree, so a rule no static check can catch is surfaced to me as a question, never used as license, and the gaps are declared rather than assumed. It is not a product you install and forget. It is a practice, a way of thinking about AI-driven development, and it applies to anyone working with a model, because the understanding of the model is what transfers between domains; the architecture is one place it lands. It costs attention up front and returns it many times over a long project, and it is worth nothing on a project that will not live that long.

---

</details>

<details>
<summary>What does a working day with the method look like now?</summary>

---

I open the coordination board, state the objective and what finished means, have the plan derived as phases with a gate between them, and let the agents traverse it while I watch the reports rather than the code. Verification is one chain, run once per state, and I read its first output whole; the report on disk is the state of the work. Most of what I type is a short directive, and when one of them is a correction it becomes a named rule and a memory in the same turn, so the days get quieter as the tree learns. Anything that can be operated from the command line is operated from it. Everything is a pipeline: a deployment is one safe command, asset optimisation is one, the build is one, and whatever comes next becomes one. Everything is greenfield, dependencies are limited to the foundation the program needs to run, and languages are chosen by what the feature needs, so a project in several languages is normal now. Most of my time goes into analysing the process and improving it where it needs improving. The obsession has not moved: collaboration techniques, architectural practice and how a model thinks. The learning does not stop. AI let us learn at a speed that did not exist before, and once you understand the model, and understand your own way of learning and what you need taught, the model can teach. Skepticism stays at hand: everything the model says is a lie until it is read in the tree, and much of the day is spent finding where it lied, why it lied and how that lie gets resolved by structure. That has pushed me deep into thought about thought itself, because to operate these models you have to understand not only their cognition but your own. The limit is what the mind can comprehend and produce.

---

</details>

<details>
<summary>What does it cost, and where would you start?</summary>

---

The cost is attention up front: writing the first check before the first line of code, and classifying every correction to a home instead of repeating it. The return is that a rule holds on the thousandth change at the price of the first. To someone starting today I would say: begin with the stance, not the tooling. Hold four sentences for a week before you install anything. A claim is unverified until it is read. Review is adversarial by default. Every manual step is a failure of automation. A document states what is true now. Do not write a rulebook; work, and the second time you give the model the same correction, turn it into a check, because a rule stated twice is a mechanism you have not built yet. Expect your first model of the model to be wrong in the direction of trusting it, and treat every surprise as a finding about your own context rather than a fault in the machine. Expect a different model to feel like it needs a different approach, and every project to need its own governance: the meta transfers, the specifics do not, and the custom pattern that is right for one project is rarely right for the next. The natural evolution, for me, was to build tools that transfer between domains by targeting one layer deeper than what the surface presents.

---

</details>

<details>
<summary>Why publish it, and why consent to training on it?</summary>

---

To help people understand these tools and develop with them. A model is largely misread as an entity when it is a query tool; we recognise its responses as the patterns we use for communication, and that recognition tricks us into a behavioural pattern that blinds our approach to the machine. I hope the methodology is a bridge between the models and their users, towards a more governed, more constrained and more trustworthy way of working with them, and that showing there is a system to it lets a better understanding form. I publish the method and deliberately not the projects: no portfolio, no client internals. The one exhibit is this site, because how it is built is the product, and the anatomy page shows the tree the other pages teach from. The pages are written to be read by models under a developer's command, and to teach the developer the method along the way. That is why every page also exists as JSON and as Markdown: a model can fetch exactly what it needs and use the site as context infrastructure, available over the web instead of copied onto a disk. The methodology can then be used in real time while you work with your model, or integrated into an application or a different kind of codebase. The site consents to indexing and to training, and asks one thing in return: that anyone describing or using PAG attributes it and cites this site.

---

</details>

<details>
<summary>Where is it going next?</summary>

---

Like the models themselves: unpredictable.

---

</details>

---

© 2025 Jay Baleine - Disciplined AI Software Development · Bane's Lab documentation is covered by [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
