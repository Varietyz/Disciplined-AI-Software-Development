<div align="center">

<img src="https://banes-lab.com/assets/images/banes_lab/700px_Main_Animated.gif" width="70" />

<a href="https://github.com/Varietyz/Disciplined-AI-Software-Development">Disciplined AI Software Development Methodology</a> © 2025 by <a href="https://www.linkedin.com/in/jay-baleine/">Jay Baleine</a> is licensed under <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a> <img src="https://mirrors.creativecommons.org/presskit/icons/cc.svg" alt="" width="16" height="16"><img src="https://mirrors.creativecommons.org/presskit/icons/by.svg" alt="" width="16" height="16"><img src="https://mirrors.creativecommons.org/presskit/icons/sa.svg" alt="" width="16" height="16">

</div>

---

> **📘 Using CLI-based AI models?** (Claude Code, Cursor, Windsurf, etc.)
>
> This documentation covers web browser AI collaboration. For CLI agents with tool access, **[PAG (Pattern Abstract Grammar)](https://banes-lab.com/pag)** is an AI first language with explicit validation gates, phase sequencing, and constraint enforcement designed for agentic workflows.
>
> **PAG** expands on this methodology with formal grammar, tool invocation patterns, orchestration templates, and algorithm loop documentation. Visit **[banes-lab.com/pag](https://banes-lab.com/pag)** for the complete specification.
>
> **PAG Documents:** [PAG-COLLABORATION.md](PAG-COLLABORATION.md) | [PAG-AGENT-ORCHESTRATION.md](PAG-AGENT-ORCHESTRATION.md)

---

# Disciplined AI Software Development - Collaborative

A structured approach for working with AI on development projects. This methodology addresses common issues like code bloat, architectural drift, context dilution, and behavioral inconsistency through systematic constraints and behavioral enforcement.

## The Context Problem

AI systems work on Question → Answer patterns. When you ask for broad, multi-faceted implementations, you typically get:

- Functions that work but lack structure
- Repeated code across components
- Architectural inconsistency over sessions
- Context dilution causing output drift
- Behavioral pattern degradation across extended sessions
- More debugging time than planning time

## How This Works

The methodology uses four stages with systematic constraints, behavioral consistency enforcement, and validation checkpoints. Each stage builds on empirical data rather than assumptions.

**Planning saves debugging time.** Planning thoroughly upfront typically prevents days of fixing architectural issues later.

### Instruction Format Options

This methodology supports multiple instruction formats:

- **Prose (Markdown/XML)**: Natural language with structural headings. Paste directly into web-based AI chat interfaces.
- **PAG (Pattern Abstract Grammar)**: Structured instruction syntax using explicit keywords (`READ`, `WRITE`, `SET`, `VALIDATE`). Reduces interpretive ambiguity through code-like patterns. Effective for CLI-based AI agents or when explicit constraints matter.

The principles remain identical; choose the format that matches your AI interface.

## The Four Stages

### Stage 1: AI Behavioral Configuration

Deploy systematic behavioral consistency and constraint enforcement:

1. **Configure AI Custom Instructions:**

    Set up [AI-PREFERENCES.XML](prompt_formats/software_development/XML/AI-PREFERENCES.XML) as custom instructions. This establishes behavioral constraints and uncertainty flagging with ⚠️ indicators when the AI lacks certainty.

2. **RECOMMENDED: Load Persona Framework:**

    Upload [CORE-PERSONA-FRAMEWORK.json](persona/JSON/CORE-PERSONA-FRAMEWORK.json) and select domain-appropriate persona:
    - **[GUIDE-PERSONA.json](persona/JSON/persona_plugins/GUIDE-PERSONA.json)** - Methodology enforcement specialist (prevents vibe coding)
    - **[TECDOC-PERSONA.json](persona/JSON/persona_plugins/TECDOC-PERSONA.json)** - Technical documentation specialist
    - **[R&D-PERSONA.json](persona/JSON/persona_plugins/R&D-PERSONA.json)** - Research scientist with absolute code quality standards
    - **[MURMATE-PERSONA.json](persona/JSON/persona_plugins/MURMATE-PERSONA.json)** - Visual systems specialist
    - Create project-specific persona using [CREATE-PERSONA-PLUGIN.json](persona/JSON/CREATE-PERSONA-PLUGIN.json)

3. **RECOMMENDED: Activate Persona:**

    Issue command: "Simulate Persona"

### Stage 2: Collaborative Planning

Share [METHODOLOGY.XML](prompt_formats/software_development/XML/METHODOLOGY.XML) with the AI to structure your project plan. Work together to:

1. Define scope and completion criteria
2. Identify components and dependencies
3. Structure phases based on logical progression
4. Generate systematic tasks with measurable checkpoints

Output: A development plan following dependency chains with modular boundaries.

**PAG Alternative:** For explicit structure, express your plan using PAG phases with validation gates:

```
# PHASE 1: Core Implementation

## PURPOSE
Implement primary application logic.

## DEPENDENCIES
Phase 0 infrastructure complete.

## VALIDATION GATE
✅ All core functions implemented
✅ Unit tests passing
✅ Benchmarks integrated
```

### Stage 3: Systematic Implementation

Work phase by phase, section by section. Each request follows: "Can you implement [specific component]?" with focused objectives.

**File size stays ≤150 lines.** This constraint provides:

- Smaller context windows for processing
- Focused implementation over multi-function attempts
- Easier sharing and debugging

**Implementation flow:**

```
Request (prose or PAG) → AI processes → Validate → Benchmark → Continue
```

### Stage 4: Data-Driven Iteration

The benchmarking suite (built first) provides performance data throughout development. Feed this data back to the AI for optimization decisions based on measurements rather than guesswork.

## Why This Approach Works

**Decision Processing:** AI handles "Can you do A?" more reliably than "Can you do A, B, C, D, E, F, G, H?"

**Context Management:** Small files and bounded problems prevent the AI from juggling multiple concerns simultaneously.

**Behavioral Constraint Enforcement:** Persona system prevents AI drift through systematic character validation, maintaining consistent collaboration patterns across extended sessions.

**Empirical Validation:** Performance data replaces subjective assessment. Decisions come from measurable outcomes.

**Systematic Constraints:** Architectural checkpoints, file size limits, and dependency gates force consistent behavior.

**Structured Instruction Clarity:** By reducing interpretive ambiguity. `ALWAYS: Keep files under 150 lines` is less ambiguous than "try to keep files small."

## Example Projects

- **[Discord Bot Template](https://github.com/Varietyz/discord-js-bot-template)** - Production-ready bot foundation with plugin architecture, security, API management, and comprehensive testing. 46 files, all under 150 lines, with benchmarking suite and automated compliance checking. ([View Project Structure](example_project_structures/DISCORDJS_TEMPLATE_PROJECT.md))

- **[PhiCode Runtime](https://github.com/Varietyz/phicode-runtime)** - Programming language runtime engine with transpilation, caching, security validation, and Rust acceleration. Complex system maintaining architectural discipline across 70+ modules. ([View Project Structure](example_project_structures/PHICODE_RUNTIME_PROJECT.md))

- **[PhiPipe](https://github.com/Varietyz/PhiPipe)** - CI/CD regression detection system with statistical analysis, GitHub integration, and concurrent processing. Go-based service handling performance baselines and automated regression alerts. ([View Project Structure](example_project_structures/PHIPIPE_PROJECT.md))

You can compare the methodology principles to the codebase structure to see how the approach translates to working code.

## Implementation Steps

### Format Selection

Each format emphasizes different domains:

| Format | Best For | Characteristics |
|--------|----------|-----------------|
| Markdown (.md) | Documentation, web browser AI | Human-readable, AI continues structure naturally |
| XML (.xml) | Machine parsing, structured prompts | Explicit tags, code-like structure |
| JSON (.json) | Configuration, programmatic access | Strict syntax, data exchange |
| PAG | CLI agents, explicit constraints | Validation gates, `ALWAYS`/`NEVER` rules |

XML and JSON provide code-like structure that tends to strengthen code generation while reducing unnecessary jargon. Markdown works well for documentation as AI recognizes and continues the structure naturally.

**PAG** is particularly effective when you need explicit validation gates and constraint enforcement. See **[PAG Documentation](https://banes-lab.com/pag)** for full language reference.

_[View Prompt Formats](prompt_formats)_

### Setup

1. Configure AI with [AI-PREFERENCES.XML](prompt_formats/software_development/XML/AI-PREFERENCES.XML) as custom instructions
2. RECOMMENDED: Share [CORE-PERSONA-FRAMEWORK.json](persona/JSON/CORE-PERSONA-FRAMEWORK.json) + selected [PERSONA.json](persona/JSON/persona_plugins) (_Could potentially be placed in custom instructions_)
3. RECOMMENDED: Issue command: "Simulate Persona"
4. Share [METHODOLOGY.XML](prompt_formats/software_development/XML/METHODOLOGY.XML) for planning session
5. Collaborate on project structure and phases
6. Generate systematic development plan

### Execution

1. Build Phase 0 benchmarking infrastructure first
2. Work through phases sequentially
3. Implement one component per interaction
4. Run benchmarks and share results with AI
5. Validate architectural compliance continuously

### Quality Assurance

- Performance regression detection
- Architectural principle validation
- Code duplication auditing
- File size compliance checking
- Dependency boundary verification

## Project State Extraction

Use the included [project extraction tool](scripts/project_extract.py) systematically to generate structured snapshots of your codebase:

```bash
python scripts/project_extract.py
```

**Configuration Options:**

- `SEPARATE_FILES = False`: Single [THE_PROJECT.md](scripts/output_example/THE_PROJECT.md) file (recommended for small codebases)
- `SEPARATE_FILES = True`: Multiple files per [directory](scripts/output_example/.Project_Extraction) (recommended for large codebases and focused folder work)
- `INCLUDE_PATHS`: Directories and files to analyze
- `EXCLUDE_PATTERNS`: Skip cache directories, build artifacts, and generated files

**Output:**

- Complete file contents with syntax highlighting
- File line counts with architectural warnings (⚠️ for 140-150 lines, ‼️ for >150 lines on code files)
- Tree structure visualization
- Ready-to-share

_[output examples can be found here](scripts/output_example)_

Use the tool to share a complete or partial project state with the AI system, track architectural compliance, and create focused development context.

## What to Expect

**AI Behavior:** The methodology reduces architectural drift and context degradation compared to unstructured approaches. Persona system maintains behavioral consistency across extended sessions. AI still needs occasional reminders about principles - this is normal.

**Development Flow:** Systematic planning tends to reduce debugging cycles. Focused implementation helps minimize feature bloat. Performance data supports optimization decisions.

**Code Quality:** Architectural consistency across components, measurable performance characteristics, maintainable structure as projects scale.

---

## LLM Models - [Q&A Documentation](questions_answers/)

Explore the detailed Q&A for each AI model:
_[Grok 3](questions_answers/Q-A_GROK_3.md) , [Claude Sonnet 4](questions_answers/Q-A_CLAUDE_SONNET_4.md) , [DeepSeek-V3](questions_answers/Q-A_DEEPSEEK-V3.md) , [Gemini 2.5 Flash](questions_answers/Q-A_GEMINI_2.5_FLASH.md)_

All models were asked the **exact same questions** using the methodology documents as file uploads. This evaluation focuses on **methodology understanding and operational behavior**, no code was generated. The Q&A documents capture responses across workflow patterns, tool usage, communication adherence, and collaborative context retention. Full evaluation results and comparative analysis are available in [Methodology Comprehension Analysis: Model Evaluation](questions_answers/Q-A_COMPREHENSION_ANALYSIS.md).

_Note: This analysis does not include any code generation._

#### Coverage includes:

- Methodology understanding and workflow patterns
- Context retention and collaborative interaction
- Communication adherence and AI preference compliance
- Project initialization and Phase 0 requirements
- Tool usage and technology stack compatibility
- Quality enforcement and violation handling
- User experience across different skill levels

---

## Learning the Ropes

### Getting Started

**Configuration Process:**

1. Configure AI with [AI-PREFERENCES.XML](prompt_formats/software_development/XML/AI-PREFERENCES.XML) as custom instructions
2. Share [CORE-PERSONA-FRAMEWORK.json](persona/JSON/CORE-PERSONA-FRAMEWORK.json) + [GUIDE-PERSONA.json](persona/JSON/persona_plugins/GUIDE-PERSONA.json)
3. Issue command: "Simulate Persona"
4. Share [METHODOLOGY.XML](prompt_formats/software_development/XML/METHODOLOGY.XML) for planning session
5. Collaborate on project structure and phases
6. Generate systematic development plan

**Available Personas:**

- **[GUIDE-PERSONA.json](persona/JSON/persona_plugins/GUIDE-PERSONA.json)** - Methodology enforcement (prevents vibe coding violations)
- **[TECDOC-PERSONA.json](persona/JSON/persona_plugins/TECDOC-PERSONA.json)** - Technical documentation specialist
- **[R&D-PERSONA.json](persona/JSON/persona_plugins/R&D-PERSONA.json)** - Research scientist with code quality enforcement
- **[MURMATE-PERSONA.json](persona/JSON/persona_plugins/MURMATE-PERSONA.json)** - Visual systems and diagram specialist

_[Read more about the persona framework.](persona/README.PERSONAS.md)_

**Core Documents Reference:**

- **[AI-PREFERENCES.XML](prompt_formats/software_development/XML/AI-PREFERENCES.XML)** - Behavioral constraints
- **[METHODOLOGY.XML](prompt_formats/software_development/XML/METHODOLOGY.XML)** - Technical framework
- **[README.XML](prompt_formats/software_development/XML/README.XML)** - Implementation guidance
- **[PAG Documentation](https://banes-lab.com/pag)** - Structured instruction language

_This current document provides human-readable formatting for documentation review. For machine parsing, use the [XML](prompt_formats/software_development/XML/README.XML) format. For explicit constraint syntax, see [PAG](https://banes-lab.com/pag)._

**Ask targeted questions:**

- "How would Phase 0 apply to [project type]?"
- "What does the 150-line constraint mean for [specific component]?"
- "How should I structure phases for [project description]?"
- "Can you help decompose this project using the methodology?"
- "Can you express this constraint in PAG syntax?"

_This will help foster understanding of how your AI model interprets the guidelines._

### Experimental Modification

**Create Project-Specific Personas:**

Share [CREATE-PERSONA-PLUGIN.json](persona/JSON/CREATE-PERSONA-PLUGIN.json) with your AI model to generate domain-specific personas from:

- Project documentation patterns
- Codebase architectural philosophies
- Domain expert behavioral frameworks

_[Read more about creating personas.](persona/README.CREATE-PERSONA.md)_

**Test constraint variations:**

- File size limits (100 vs 150 vs 200 lines)
- Communication constraint adjustments
- Phase 0 requirement modifications
- Quality gate threshold changes
- Persona behavioral pattern modifications
- PAG vs prose instruction format comparison

**Analyze outcomes:**

- Document behavior changes and development results
- Compare debugging time across different approaches
- Track architectural compliance over extended sessions
- Monitor context retention and behavioral drift
- Measure persona consistency enforcement
- Compare PAG explicit constraints vs prose guidelines

_You can ask the model to analyze the current session and identify violations. Additionally, you want to know which adjustments could be beneficial for further enforcement or to detect ambiguity in the constraints._

**Collaborative refinement:**
Work with your AI to identify improvements based on your context. Treat constraint changes as experiments and measure their impact on collaboration effectiveness, code quality, and development velocity.

**Progress indicators:**

- Reduced specific violations over time
- Consistent file size compliance without reminders
- Sustained AI behavioral adherence through extended sessions
- Maintained persona consistency across development phases

---

# Frequently Asked Questions

## Origin & Development

<details>
<summary>What problem led you to create this methodology?</summary>

---

I kept having to restate my preferences and architectural requirements to AI systems. It didn't matter which language or project I was working on - the AI would consistently produce either bloated monolithic code or underdeveloped implementations with issues throughout.

This led me to examine the meta-principles driving code quality and software architecture. I questioned whether pattern matching in AI models might be more effective when focused on underlying software principles rather than surface-level syntax. Since pattern matching is logic-driven and machines fundamentally operate on simple question-answer pairs, I realized that functions with multiple simultaneous questions were overwhelming the system.

The breakthrough came from understanding that everything ultimately transpiles to binary - a series of "can you do this? → yes/no" decisions. This insight shaped my approach: instead of issuing commands, ask focused questions in proper context. Rather than mentally managing complex setups alone, collaborate with AI to devise systematic plans.

---

</details>

<details>
<summary>How did you discover these specific constraints work?</summary>

---

Through extensive trial and error. AI systems will always tend to drift even under constraints, but they're significantly more accurate with structured boundaries than without them. You occasionally need to remind the AI of its role to prevent deviation - like managing a well-intentioned toddler that knows the rules but sometimes pushes boundaries trying to satisfy you.

These tools are far from perfect, but they're effective instruments for software development when properly constrained.

---

</details>

<details>
<summary>What failures or frustrations shaped this approach?</summary>

---

Maintenance hell was the primary driver. I grew tired of responses filled with excessive praise: "You have found the solution!", "You have redefined the laws of physics with your paradigm-shifting script!" This verbose fluff wastes time, tokens, and patience without contributing to productive development.

Instead of venting frustration on social media about AI being "just a dumb tool," I decided to find methods that actually work. My approach may not help everyone, but I hope it benefits those who share similar AI development frustrations.

---

</details>

<details>
<summary>How does PAG relate to this methodology?</summary>

---

PAG (Pattern Abstract Grammar) is a language i've designed to collaborate with AI, that complements this methodology. While the methodology defines what constraints to apply to discipline it, PAG provides explicit syntax for expressing those constraints.

The 150-line limit becomes `ALWAYS: Keep files under 150 lines`. Validation checkpoints become `VALIDATION GATE` blocks with explicit pass/fail criteria. The structured syntax may reduce interpretive variance compared to prose instructions.

PAG is particularly useful for CLI-based AI agents (Claude Code, Cursor, ...) where explicit constraint enforcement matters. Web browser AI interfaces also work well with it but lack workspace/tool access.

---

</details>

## Personal Practice

<details>
<summary>How consistently do you follow your own methodology?</summary>

---

Since creating the documentation, I haven't deviated. Whenever I see the model producing more lines than my methodology restricts, I immediately interrupt generation with a flag: "‼️ ARCHITECTURAL VIOLATION, ADHERE TO PRINCIPLES ‼️" I then provide the method instructions again, depending on how context is stored and which model I'm using.

---

</details>

<details>
<summary>What happens when you deviate from it?</summary>

---

I become genuinely uncomfortable. Once I see things starting to degrade or become tangled, I compulsively need to organize and optimize. Deviation simply isn't an option anymore.

---

</details>

<details>
<summary>Which principles do you find hardest to maintain?</summary>

---

Not cursing at the AI when it drifts during complex algorithms! But seriously, it's a machine - it's not perfect, and neither are we.

---

</details>

## AI Development Journey

<details>
<summary>When did you start using AI for programming?</summary>

---

In August 2024, I created a RuneLite theme pack, but one of the plugin overlays didn't match my custom layout. I opened a GitHub issue (creating my first GitHub account to do so) requesting a customization option. The response was: "It's not a priority - if you want it, build it yourself."

I used ChatGPT to guide me through forking RuneLite and creating a plugin. This experience sparked intense interest in underlying software principles rather than just syntax.

---

</details>

<details>
<summary>How has your approach evolved over time?</summary>

---

I view development like a book: syntax is the cover, logic is the content itself. Rather than learning syntax structures, I focused on core meta-principles - how software interacts, how logic flows, different algorithm types. I quickly realized everything reduces to the same foundation: question and answer sequences.

Large code structures are essentially chaotic meetings - one coordinator fielding questions and answers from multiple sources, trying to provide correct responses without mix-ups or misinterpretation. If this applies to human communication, it must apply to software principles.

---

</details>

<details>
<summary>What were your biggest mistakes with AI collaboration?</summary>

---

Expecting it to intuitively understand my requirements, provide perfect fixes, be completely honest, and act like a true expert. This was all elaborate roleplay that produced poor code. While fine for single-purpose scripts, it failed completely for scalable codebases.

I learned not to feed requirements and hope for the best. Instead, I needed to collaborate actively - create plans, ask for feedback on content clarity, and identify uncertainties. This gradual process taught me the AI's actual capabilities and most effective collaboration methods.

---

</details>

## Methodology Specifics

<details>
<summary>Why 150 lines exactly?</summary>

---

Multiple benefits: easy readability, clear understanding, modularity enforcement, architectural clarity, simple maintenance, component testing, optimal AI context retention, reusability, and KISS principle adherence.

---

</details>

<details>
<summary>How did you determine Phase 0 requirements?</summary>

---

From meta-principles of software: if it displays, it must run; if it runs, it can be measured; if it can be measured, it can be optimized; if it can be optimized, it can be reliable; if it can be reliable, it can be trusted.

Regardless of project type, anything requiring architecture needs these foundations. You must ensure changes don't negatively impact the entire system. A single line modification in a nested function might work perfectly but cause 300ms boot time regression for all users.

By testing during development, you catch inefficiencies early. Integration from the start means simply hooking up new components and running tests via command line - minimal time investment with actual value returned. I prefer validation and consistency throughout development rather than programming blind.

---

</details>

## Practical Implementation

<details>
<summary>How do you handle projects that don't fit the methodology?</summary>

---

I adapt them to fit, or if truly impossible, I adjust the method itself. This is one methodology - I can generate countless variations as needed. Having spent 6700+ hours in AI interactions across multiple domains (not just software), I've developed strong system comprehension that enables creating adjusted methodologies on demand.

---

</details>

<details>
<summary>What's the learning curve for new users?</summary>

---

I cannot accurately answer this question. I've learned that I'm neurologically different - what I perceive as easy or obvious isn't always the case for others. This question is better addressed by someone who has actually used this methodology to determine its learning curve.

---

</details>

<details>
<summary>When shouldn't someone use this approach?</summary>

---

If you're not serious about projects, despise AI, dislike planning, don't care about modularization, or are just writing simple scripts. However, for anything requiring reliability, I believe this is currently the most effective method.

You still need programming fundamentals to use this methodology effectively - it's significantly more structured than ad-hoc approaches.

---

</details>

---

## Workflow Visualization

![](mermaid_svg/methodology-workflow.svg)
