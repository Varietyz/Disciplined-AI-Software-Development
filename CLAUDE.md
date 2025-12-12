# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

This is a methodology documentation repository for AI-assisted software development. It provides structured constraints, behavioral guidelines, and prompt formats for disciplined AI collaboration. There is no build system, tests, or application code to run.

## Core Methodology Principles

When working with projects that follow this methodology:

### Strict Constraints
- **150-line file limit**: Split files exceeding this into separate modules (web components: 250 lines max)
- **Phase 0 first**: Every project must establish benchmarking, CI/CD, testing, and documentation infrastructure before feature development
- **Single responsibility**: Each module has one well-defined purpose with clear interfaces
- **No comments in code**: Code must be self-explanatory through naming
- **Reuse over creation**: Use existing functions before creating new ones

### Behavioral Guidelines
- Flag uncertainty with ⚠️ emoji and explanation
- Avoid marketing language, enthusiasm, and rhetorical effects
- Use simple punctuation and short sentences
- Never claim "now I know the solution" - wait for confirmation
- Flag with 🔬 any instruction that cannot be empirically fulfilled

### Code Architecture
- Synchronous, deterministic operations over async complexity
- Centralized configuration and constants (no hardcoded values)
- Surgical modifications with minimal targeted implementations
- KISS and DRY principles strictly applied

## Repository Structure

- `prompt_formats/` - Methodology documents in various formats (XML, JSON, TOML, PAG, YAML, etc.)
  - `software_development/` - Primary prompt formats for code projects
  - `writing_documents/` - Formats for documentation projects
  - `experimental/` - LISP and TEX experimental formats
- `persona/` - AI persona frameworks for behavioral consistency
  - `JSON/` and `JSON-DOC/` - Persona configuration files
  - `PAG/` - PAG format persona definitions
- `scripts/project_extract.py` - Tool to generate structured project snapshots for AI context sharing
- `questions_answers/` - Model evaluation Q&A documentation
- `example_project_structures/` - Reference project structure examples
- `pag_templates/` - PAG templates for agent workflows

## PAG (Pattern Abstract Grammar)

PAG is a structured instruction language with explicit keywords (`READ`, `WRITE`, `SET`, `VALIDATE`) and validation gates. Used for CLI-based AI agents where explicit constraint enforcement matters. See `prompt_formats/software_development/PAG/` for examples.

## Project Extraction Tool

```bash
python scripts/project_extract.py
```

Generates structured project snapshots. Configure in `scripts/src/config/config.py`:
- `SEPARATE_FILES = False` for single output file
- `SEPARATE_FILES = True` for per-directory files
